from fastapi import FastAPI
from .database import engine, Base
from .database import engine, Base, SessionLocal
from .routers import configuration, auth, devices, routeros, monitoring, prometheus_metrics
from .routers.routeros import resources
from .services.prometheus_sync import sync_prometheus_targets
import logging

logger = logging.getLogger(__name__)

# Create tables (In production, use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="NetworkWeaver API")

@app.on_event("startup")
def startup_event():
    """Sync Prometheus targets on startup"""
    try:
        db = SessionLocal()
        try:
            result = sync_prometheus_targets(db)
            if result["success"]:
                logger.info(f"Startup: Synced {result['targets_count']} Prometheus targets")
            else:
                logger.error(f"Startup: Failed to sync Prometheus targets: {result.get('error')}")
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Startup sync error: {e}")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"http://(192\.168\.\d{1,3}\.\d{1,3}|172\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3})(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(configuration.router)
app.include_router(auth.router)
app.include_router(devices.router)
app.include_router(routeros.router)
app.include_router(resources.router)
app.include_router(monitoring.router)
app.include_router(prometheus_metrics.router)
from .routers import logs
app.include_router(logs.router)

# Explicitly import and include scripts router 
from .routers.routeros import scripts
app.include_router(scripts.router, prefix="/routeros/scripts")

@app.get("/")
def read_root():
    return {"message": "Welcome to NetworkWeaver API"}

@app.get("/health")
def health_check():
    try:
        from sqlalchemy import text
        # Check DB connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}
