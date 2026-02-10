import json
import os
from pathlib import Path
from typing import List, Dict
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Device
import logging

logger = logging.getLogger(__name__)

# Path to Prometheus targets file
# Path to Prometheus targets file
# Check for Docker mount path first, otherwise use relative path for local dev
# Check for Docker mount path first, otherwise use relative path for local dev
DOCKER_TARGETS_DIR = Path("/prometheus_targets")
# Use parents[2] (backend/app root) .parent (project root) to avoid IndexError in Docker
LOCAL_TARGETS_DIR = Path(__file__).resolve().parents[2].parent / "monitoring" / "prometheus" / "targets"

TARGETS_DIR = DOCKER_TARGETS_DIR if DOCKER_TARGETS_DIR.exists() else LOCAL_TARGETS_DIR
TARGETS_FILE = TARGETS_DIR / "mikrotik_devices.json"


def generate_prometheus_targets(db: Session) -> List[Dict]:
    """
    Generate Prometheus targets from database devices.
    
    Returns list of target configurations in Prometheus file_sd format.
    """
    devices = db.query(Device).all()
    
    targets = []
    for device in devices:
        target = {
            "targets": [device.ip_address],
            "labels": {
                "hostname": device.name,
                "device_id": str(device.id),
                "device_type": "mikrotik",
                "job": "snmp"
            }
        }
        targets.append(target)
    
    logger.info(f"Generated {len(targets)} Prometheus targets from database")
    return targets


def write_targets_file(targets: List[Dict]) -> bool:
    """
    Write targets to Prometheus service discovery file.
    
    Args:
        targets: List of target configurations
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Ensure directory exists
        TARGETS_DIR.mkdir(parents=True, exist_ok=True)
        
        # Write to temporary file first (atomic write)
        temp_file = TARGETS_FILE.with_suffix('.tmp')
        with open(temp_file, 'w') as f:
            json.dump(targets, f, indent=2)
        
        # Atomic rename
        temp_file.replace(TARGETS_FILE)
        
        logger.info(f"Successfully wrote {len(targets)} targets to {TARGETS_FILE}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to write targets file: {e}")
        return False


def sync_prometheus_targets(db: Session) -> Dict:
    """
    Sync devices from database to Prometheus targets file.
    
    Args:
        db: Database session
        
    Returns:
        Dict with sync status and details
    """
    try:
        targets = generate_prometheus_targets(db)
        success = write_targets_file(targets)
        
        return {
            "success": success,
            "targets_count": len(targets),
            "file_path": str(TARGETS_FILE),
            "message": f"Synced {len(targets)} devices to Prometheus targets"
        }
        
    except Exception as e:
        logger.error(f"Error syncing Prometheus targets: {e}")
        return {
            "success": False,
            "targets_count": 0,
            "error": str(e),
            "message": "Failed to sync targets"
        }


def get_current_targets() -> List[Dict]:
    """
    Read current Prometheus targets from file.
    
    Returns:
        List of current targets
    """
    try:
        if TARGETS_FILE.exists():
            with open(TARGETS_FILE, 'r') as f:
                return json.load(f)
        return []
    except Exception as e:
        logger.error(f"Error reading targets file: {e}")
        return []
