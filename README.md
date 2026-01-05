# ConfigWeaver

ConfigWeaver is a network configuration management tool designed for MikroTik routers. It uses a microservices architecture to ensure modularity and scalability.

## Architecture

- **Frontend**: React.js (Vite)
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Monitoring**: Prometheus, Grafana, SNMP Exporter
- **Connectivity**: WireGuard (External / Host)

## Quick Start

1.  Ensure Docker and Docker Compose are installed.
2.  Clone the repository.
3.  Run:
    ```bash
    docker-compose up --build
    ```
4.  Access the services:
    - **Frontend**: http://localhost:5173
    - **Backend API**: http://localhost:8000/docs
    - **Grafana**: http://localhost:3000 (default: admin/admin)
    - **Prometheus**: http://localhost:9090

## Development

- **Backend**: Located in `./backend`.
- **Frontend**: Located in `./frontend`.
- **Monitoring**: Configs in `./monitoring`.
