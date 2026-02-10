from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from app.models import Device
from app.routers import configuration
import logging

router = APIRouter(prefix="/routeros", tags=["RouterOS Quick Setup"])
logger = logging.getLogger(__name__)


class QuickSetupRequest(BaseModel):
    device_id: int
    enable_snmp: bool = True
    snmp_community: str = "public"
    secure_services: bool = True
    setup_ntp: bool = True
    ntp_primary: str = "time.google.com"
    ntp_secondary: str = "time.cloudflare.com"
    basic_firewall: bool = False  # Optional for now


class QuickSetupResponse(BaseModel):
    success: bool
    message: str
    steps_completed: List[str]
    errors: List[str] = []


@router.post("/quick-setup", response_model=QuickSetupResponse)
async def quick_setup(request: QuickSetupRequest, db: Session = Depends(get_db)):
    """
    One-click setup for GNS3 MikroTik devices.
    Bundles: SNMP, Security (disable telnet/enable SSH), NTP, optional firewall.
    """
    device = db.query(Device).filter_by(id=request.device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    completed_steps = []
    errors = []

    try:
        # 1. Enable SNMP
        if request.enable_snmp:
            try:
                config_result = configuration.execute_template(
                    device_id=request.device_id,
                    template_name="enable_snmp",
                    params={"community": request.snmp_community},
                    db=db
                )
                completed_steps.append("✅ SNMP enabled")
            except Exception as e:
                errors.append(f"SNMP setup failed: {str(e)}")
                logger.error(f"SNMP setup failed for device {device.id}: {e}")

        # 2. Secure Services (Disable Telnet, Enable SSH)
        if request.secure_services:
            try:
                # Disable telnet
                configuration.execute_template(
                    device_id=request.device_id,
                    template_name="service_toggle",
                    params={
                        "Service Name": "telnet",
                        "State (enable/disable)": "disable",
                        "Port": 23
                    },
                    db=db
                )
                
                # Enable SSH
                configuration.execute_template(
                    device_id=request.device_id,
                    template_name="service_toggle",
                    params={
                        "Service Name": "ssh",
                        "State (enable/disable)": "enable",
                        "Port": 22
                    },
                    db=db
                )
                completed_steps.append("✅ Services secured (telnet disabled, SSH enabled)")
            except Exception as e:
                errors.append(f"Service security failed: {str(e)}")
                logger.error(f"Service security failed for device {device.id}: {e}")

        # 3. Setup NTP
        if request.setup_ntp:
            try:
                configuration.execute_template(
                    device_id=request.device_id,
                    template_name="system_ntp_client",
                    params={
                        "Primary NTP Server": request.ntp_primary,
                        "Secondary NTP Server": request.ntp_secondary,
                        "Enabled": "yes"
                    },
                    db=db
                )
                completed_steps.append(f"✅ NTP configured ({request.ntp_primary})")
            except Exception as e:
                errors.append(f"NTP setup failed: {str(e)}")
                logger.error(f"NTP setup failed for device {device.id}: {e}")

        # 4. Basic Firewall (Optional)
        if request.basic_firewall:
            try:
                # Accept established connections
                configuration.execute_template(
                    device_id=request.device_id,
                    template_name="firewall_filter_add",
                    params={
                        "Chain": "input",
                        "Protocol": "tcp",
                        "Dst Port": "",
                        "Action": "accept",
                        "Src Address": "",
                        "Comment": "Accept established"
                    },
                    db=db
                )
                completed_steps.append("✅ Basic firewall rules added")
            except Exception as e:
                errors.append(f"Firewall setup failed: {str(e)}")
                logger.error(f"Firewall setup failed for device {device.id}: {e}")

        success = len(completed_steps) > 0
        message = f"Quick setup completed: {len(completed_steps)}/{sum([request.enable_snmp, request.secure_services, request.setup_ntp, request.basic_firewall])} steps"

        return QuickSetupResponse(
            success=success,
            message=message,
            steps_completed=completed_steps,
            errors=errors
        )

    except Exception as e:
        logger.error(f"Quick setup failed for device {device.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Quick setup failed: {str(e)}")


# Helper function to use in configuration.py
def execute_template(device_id: int, template_name: str, params: dict, db: Session):
    """Execute a configuration template - placeholder until we integrate properly"""
    from app.routers.configuration import ConfigDeployRequest, deploy_config
    
    request = ConfigDeployRequest(
        device_id=device_id,
        template_name=template_name,
        params=params
    )
    
    return deploy_config(request, db)
