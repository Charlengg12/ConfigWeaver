from app import models, auth, database
from sqlalchemy.orm import Session

db = database.SessionLocal()

def seed():
    # 1. Reset Admin User
    admin = db.query(models.User).filter(models.User.username == "admin").first()
    if admin:
        print("Deleting existing admin user to reset password hash...")
        db.delete(admin)
        db.commit()
    
    # 2. Recreate Admin
    print("Creating admin user (admin/admin123)...")
    try:
        hashed_pw = auth.get_password_hash("admin123")
        admin_user = models.User(username="admin", password_hash=hashed_pw, role="admin")
        db.add(admin_user)
        db.commit()
        print("Admin user created successfully.")
    except Exception as e:
        print(f"Failed to create admin: {e}")

    # 3. Sample Device
    device = db.query(models.Device).filter(models.Device.ip_address == "10.10.10.18").first()
    if not device:
        print("Creating sample device...")
        sample_device = models.Device(
            name="Lab-Router-1-Main",
            ip_address="10.10.10.18",
            username="admin",
            password="password",
            api_port=8728
        )
        db.add(sample_device)
        db.commit()
        print("Sample device created.")
    else:
        print("Sample device already exists.")

    db.close()

if __name__ == "__main__":
    seed()
