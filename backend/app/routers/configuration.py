from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
import routeros_api
import traceback

router = APIRouter(
    prefix="/config",
    tags=["configuration"]
)

@router.post("/deploy", response_model=schemas.ConfigResponse)
def deploy_configuration(request: schemas.ConfigRequest, db: Session = Depends(get_db)):
    # 1. Fetch device details
    device = db.query(models.Device).filter(models.Device.id == request.device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    # 2. Prepare command based on template (Simple mapping for demo)
    command = ""
    action_type = request.template_name
    
    if request.template_name == "block_website":
        target_url = request.params.get("url")
        # MikroTik Layer 7 Protocol + Filter Rule
        # This is a conceptual simplification. Real implementation might need multiple commands.
        # We will assume we are adding a simple L7 regexp.
        command = f"/ip/firewall/layer7-protocol/add name=block_{target_url} regexp={target_url}"
    else:
        raise HTTPException(status_code=400, detail="Unknown template")

    # 3. Connect via RouterOS API & Execute
    status = "Failed"
    details = ""
    
    try:
        # Note: In a real environment, handle connection pools and timeouts carefully
        connection = routeros_api.RouterOsApiPool(
            device.ip_address, 
            username=device.username, 
            password=device.password,
            port=device.api_port,
            plaintext_login=True # Depending on RouterOS version/setup
        )
        api = connection.get_api()
        
        # Execute the command (Using generic 'get_binary_resource' or specific paths if known)
        # routeros_api usually works with paths like api.get_resource('/ip/address')
        # For arbitrary commands, it's trickier. We will simulation the "add" logic for this demo.
        
        if request.template_name == "block_website":
            l7 = api.get_resource('/ip/firewall/layer7-protocol')
            l7.add(name=f"block_{request.params.get('url')}", regexp=f"^{request.params.get('url')}.*$")
            
            # Add filter rule
            filter_rules = api.get_resource('/ip/firewall/filter')
            filter_rules.add(
                chain="forward", 
                action="drop", 
                layer7_protocol=f"block_{request.params.get('url')}",
                comment=f"Blocked by ConfigWeaver: {request.params.get('url')}"
            )

        connection.disconnect()
        status = "Success"
        details = f"Applied {request.template_name} with params {request.params}"

    except Exception as e:
        details = str(e)
        # Log the full traceback in a real app, here just the message
        print(traceback.format_exc())

    # 4. Log the action
    new_log = models.ConfigurationLog(
        device_id=device.id,
        action_type=action_type,
        status=status,
        details=details
    )
    db.add(new_log)
    db.commit()

    if status == "Failed":
        raise HTTPException(status_code=500, detail=f"Configuration failed: {details}")

    return {"status": "Success", "message": details}
