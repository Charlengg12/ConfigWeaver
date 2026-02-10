from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ... import models, schemas
from ...database import get_db
from .connection import get_routeros_connection
from ...services.prometheus_sync import sync_prometheus_targets

router = APIRouter(
    prefix="/devices",
    tags=["RouterOS Devices"]
)

@router.post("/{device_id}/test_connection")
def test_connection(device_id: int, db: Session = Depends(get_db)):
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    connection, api = get_routeros_connection(device)
    try:
        # Try to fetch identity to verify connection
        identity = api.get_resource('/system/identity').get()
        return {"status": "success", "message": "Connection successful", "identity": identity}
    except Exception as e:
        return {"status": "error", "message": f"Connection failed: {str(e)}"}
    finally:
        connection.disconnect()

@router.post("/{device_id}/sync_identity")
def sync_device_identity(device_id: int, db: Session = Depends(get_db)):
    """
    Fetch system identity from RouterOS and update the device name in database.
    """
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    connection = None
    try:
        connection, api = get_routeros_connection(device)
        
        # Fetch identity
        identity_data = api.get_resource('/system/identity').get()
        if not identity_data:
            raise HTTPException(status_code=500, detail="Could not retrieve identity from router")
            
        new_name = identity_data[0].get('name')
        if not new_name:
             raise HTTPException(status_code=500, detail="Identity name returned empty")

        # Update Database
        old_name = device.name
        device.name = new_name
        db.commit()
        db.refresh(device)
        
        # Sync Prometheus targets (outside try/catch to avoid rollback on sync failure, 
        # but inside finally or after return would require restructuring. 
        # Let's do it before return but catch exception to not fail the request)
        try:
             # We need to re-query devices or use the session if it's still valid. 
             # The session 'db' is still open here.
             sync_prometheus_targets(db)
        except Exception as ex:
             # Log but don't fail the user request
             pass
        
        return {
            "status": "success", 
            "message": f"Device renamed from '{old_name}' to '{new_name}'", 
            "new_name": new_name
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")
    finally:
        if connection:
            connection.disconnect()
