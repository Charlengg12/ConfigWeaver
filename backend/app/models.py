from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="admin")

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    ip_address = Column(String)
    vpn_ip = Column(String, nullable=True) # IP within the WireGuard tunnel
    api_port = Column(Integer, default=8728)
    snmp_community = Column(String, default="public")
    username = Column(String)
    password = Column(String) # In prod, should be encrypted

    logs = relationship("ConfigurationLog", back_populates="device")

class ConfigurationLog(Base):
    __tablename__ = "configuration_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    action_type = Column(String)
    status = Column(String)
    details = Column(Text)

    device = relationship("Device", back_populates="logs")
