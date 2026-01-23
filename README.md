# NetworkWeaver

NetworkWeaver is a network configuration management tool designed for MikroTik routers. It uses a microservices architecture to ensure modularity and scalability.

## Architecture

- **Frontend**: React.js (Vite) with Nginx in production
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Monitoring**: Prometheus, Grafana, SNMP Exporter
- **Connectivity**: WireGuard VPN

## Quick Start (Development Mode)

1.  Ensure Docker and Docker Compose are installed.
2.  Clone the repository.
3.  Run:
    ```bash
    docker-compose up --build
    ```
4.  Access the services **locally**:
    - **Frontend**: http://localhost:5173
    - **Backend API**: http://localhost:8000/docs
    - **Grafana**: http://localhost:3000 (default: admin/admin)
    - **Prometheus**: http://localhost:9090

## Monitoring MikroTik Router

NetworkWeaver is configured to monitor a MikroTik router at **10.244.222.81** via SNMP.

**Prerequisites:**
1. Ensure your MikroTik router at 10.244.222.81 has SNMP enabled
2. Configure SNMP community string (default: public)
3. Ensure port 161 (SNMP) is accessible from your machine

**SNMP Configuration on MikroTik:**
```routeros
/snmp
set enabled=yes
/snmp community
set [ find default=yes ] addresses=0.0.0.0/0
```

**Verification:**
1. Check Prometheus targets: http://localhost:9090/targets
2. Look for `mikrotik-router` job with target `10.244.222.81:161`
3. Status should show "UP" if the router is reachable

**View Metrics in Grafana:**
- Access: http://localhost:3000
- Navigate to dashboards to see MikroTik router metrics
- Metrics include: interfaces, bandwidth, CPU, memory

## Production Deployment

For production deployment with optimized builds:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

**Production Features:**
- Optimized React build with code splitting and minification
- Nginx serving static assets with gzip compression
- Proper caching headers for better performance
- Health checks for all services
- Automatic restart policies

## Development

- **Backend**: Located in `./backend`.
- **Frontend**: Located in `./frontend`.
- **Monitoring**: Configs in `./monitoring`.

## Stopping Services

```bash
# Development mode
docker-compose down

# Production mode (preserve data)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Remove all data volumes (WARNING: deletes all data)
docker-compose down -v
```

## Updating

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up --build -d
```

## Troubleshooting

**Cannot reach MikroTik router (10.244.222.81):**
1. Verify network connectivity: `ping 10.244.222.81`
2. Check SNMP is enabled on the router
3. Verify firewall allows SNMP (port 161/udp)
4. Test SNMP manually: `snmpwalk -v2c -c public 10.244.222.81`

**Prometheus shows target as DOWN:**
- Check SNMP exporter logs: `docker logs networkweaver-snmp-exporter`
- Verify router's SNMP community string matches configuration
- Ensure no firewall blocking between your PC and the router
