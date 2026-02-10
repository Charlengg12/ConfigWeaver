from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ... import models
from ...database import get_db
from .connection import get_routeros_connection
import traceback

router = APIRouter(
    prefix="/routeros/device",
    tags=["RouterOS Device Info"]
)

@router.get("/{device_id}/info")
def get_device_info(device_id: int, db: Session = Depends(get_db)):
    """
    Fetch device-specific configuration options for populating dropdowns.
    Returns interfaces, bridges, IP pools, services, VLANs, etc.
    """
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    try:
        connection, api = get_routeros_connection(device)
        
        # Fetch various device resources
        interfaces_raw = api.get_resource('/interface').get()
        bridges_raw = api.get_resource('/interface/bridge').get()
        vlans_raw = api.get_resource('/interface/vlan').get()
        services_raw = api.get_resource('/ip/service').get()
        pools_raw = api.get_resource('/ip/pool').get()
        
        connection.disconnect()
        
        # Format data for frontend dropdowns
        interfaces = [{'value': i.get('name', ''), 'label': i.get('name', '')} for i in interfaces_raw]
        bridges = [{'value': b.get('name', ''), 'label': b.get('name', '')} for b in bridges_raw]
        vlans = [{'value': v.get('vlan-id', ''), 'label': f"VLAN {v.get('vlan-id', '')} ({v.get('name', '')})"} for v in vlans_raw]
        services = [{'value': s.get('name', ''), 'label': s.get('name', '').upper()} for s in services_raw]
        pools = [{'value': p.get('name', ''), 'label': p.get('name', '')} for p in pools_raw]
        
        # Common protocols and actions for firewall/NAT
        protocols = [
            {'value': 'tcp', 'label': 'TCP'},
            {'value': 'udp', 'label': 'UDP'},
            {'value': 'icmp', 'label': 'ICMP'},
            {'value': 'any', 'label': 'Any'}
        ]
        
        firewall_actions = [
            {'value': 'accept', 'label': 'Accept'},
            {'value': 'drop', 'label': 'Drop'},
            {'value': 'reject', 'label': 'Reject'}
        ]
        
        firewall_chains = [
            {'value': 'input', 'label': 'Input'},
            {'value': 'forward', 'label': 'Forward'},
            {'value': 'output', 'label': 'Output'}
        ]
        
        enable_disable = [
            {'value': 'enable', 'label': 'Enable'},
            {'value': 'disable', 'label': 'Disable'}
        ]
        
        yes_no = [
            {'value': 'yes', 'label': 'Yes'},
            {'value': 'no', 'label': 'No'}
        ]
        
        user_groups = [
            {'value': 'full', 'label': 'Full'},
            {'value': 'read', 'label': 'Read'},
            {'value': 'write', 'label': 'Write'}
        ]
        
        return {
            "status": "success",
            "data": {
                "interfaces": interfaces,
                "bridges": bridges,
                "vlans": vlans,
                "services": services,
                "pools": pools,
                "protocols": protocols,
                "firewall_actions": firewall_actions,
                "firewall_chains": firewall_chains,
                "enable_disable": enable_disable,
                "yes_no": yes_no,
                "user_groups": user_groups
            }
        }
        
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to fetch device info: {str(e)}")
