import sys
import os
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Device
from app.routers.routeros.connection import sync_identity
from app.services.prometheus_sync import generate_prometheus_targets

def sync_all_devices():
    db = SessionLocal()
    try:
        devices = db.query(Device).all()
        print(f"Found {len(devices)} devices. Starting identity sync...")
        
        updated_count = 0
        for device in devices:
            print(f"Checking {device.ip_address} ({device.name})...")
            new_name = sync_identity(device, db)
            if new_name:
                print(f"  -> Synced identity: '{new_name}'")
                updated_count += 1
            else:
                print(f"  -> Failed or no change.")
        
        if updated_count > 0:
            print("Identities updated. Regenerating Prometheus targets...")
            generate_prometheus_targets(db)
            print("Prometheus targets updated.")
        else:
            print("No identity changes detected.")
            
    except Exception as e:
        print(f"Error during sync: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    sync_all_devices()
