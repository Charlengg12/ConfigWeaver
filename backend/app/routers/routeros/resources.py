from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ... import models
from ...database import get_db
from .connection import get_routeros_connection
import logging

router = APIRouter(
    prefix="/resources",
    tags=["RouterOS Resources"]
)

logger = logging.getLogger(__name__)

@router.get("/{device_id}/interfaces")
def get_interfaces(device_id: int, db: Session = Depends(get_db)):
    """Fetch all interfaces from the device."""
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    try:
        connection, api = get_routeros_connection(device)
        # Get all interfaces
        interfaces = api.get_resource('/interface').get()
        connection.disconnect()
        
        # Simplify response
        return [
            {
                "id": i.get('id'),
                "name": i.get('name'),
                "type": i.get('type'),
                "running": i.get('running') == 'true',
                "disabled": i.get('disabled') == 'true'
            }
            for i in interfaces
        ]
    except Exception as e:
        logger.error(f"Failed to fetch interfaces: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{device_id}/bridges")
def get_bridges(device_id: int, db: Session = Depends(get_db)):
    """Fetch all bridge interfaces."""
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    try:
        connection, api = get_routeros_connection(device)
        bridges = api.get_resource('/interface/bridge').get()
        connection.disconnect()
        
        return [{"name": b.get('name')} for b in bridges]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{device_id}/vlans")
def get_vlans(device_id: int, db: Session = Depends(get_db)):
    """Fetch defined VLANs."""
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    try:
        connection, api = get_routeros_connection(device)
        vlans= api.get_resource('/interface/vlan').get()
        connection.disconnect()
        
        return [
            {
                "name": v.get('name'),
                "vlan_id": v.get('vlan-id'),
                "interface": v.get('interface')
            } 
            for v in vlans
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{device_id}/ips")
def get_ip_addresses(device_id: int, db: Session = Depends(get_db)):
    """Fetch assigned IP addresses."""
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    try:
        connection, api = get_routeros_connection(device)
        ips = api.get_resource('/ip/address').get()
        connection.disconnect()
        
        return [
            {
                "address": ip.get('address'),
                "network": ip.get('network'),
                "interface": ip.get('interface')
            } 
            for ip in ips
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{device_id}/pools")
def get_ip_pools(device_id: int, db: Session = Depends(get_db)):
    """Fetch IP pools."""
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    try:
        connection, api = get_routeros_connection(device)
        pools = api.get_resource('/ip/pool').get()
        connection.disconnect()
        
        return [{"name": p.get('name'), "ranges": p.get('ranges')} for p in pools]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
