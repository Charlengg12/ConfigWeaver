# NetworkWeaver - Documentation Screenshots Guide

This document provides a comprehensive list of screenshots to capture for complete system documentation.

## 1. Dashboard & Overview

### Screenshot 1: Main Dashboard
**Filename**: `01_dashboard_overview.png`

**What to capture**:
- Full dashboard view showing:
  - Alert Summary component (device UP/DOWN counts)
  - Active Routers card
  - System Status card
  - Network Devices list
  - Quick Links section

**How to capture**:
1. Navigate to `http://localhost:5173`
2. Login
3. Full-page screenshot (F12 → Screenshot or Windows + Shift + S)

---

### Screenshot 2: Alert Notifications (Devices DOWN)
**Filename**: `02_dashboard_alerts_down.png`

**What to capture**:
- Dashboard with DOWN devices showing
- Red alert card with device count
- List of unreachable devices
- Sidebar notification badge (red dot with count)

**How to capture**:
1. Add a device with unreachable IP (e.g., `10.255.255.1`)
2. Wait 30 seconds for alerts to refresh
3. Capture dashboard showing alerts

---

### Screenshot 3: Sidebar Navigation
**Filename**: `03 _sidebar_navigation.png`

**What to capture**:
- Full sidebar with all menu items
- NetworkWeaver logo
- Navigation menu (Overview, Monitoring, Security, Devices, RouterOS)
- User info section
- Sign Out button

---

## 2. Device Management

### Screenshot 4: Devices Page - Empty State
**Filename**: `04_devices_empty.png`

**What to capture**:
- Devices page with no devices
- "Add Device" button
- Empty state message

---

### Screenshot 5: Add Device Modal
**Filename**: `05_add_device_modal.png`

**What to capture**:
- Add Device modal form showing all fields:
  - Device Name
  - IP Address
  - API Port
  - SNMP Community
  - Username
  - Password
  - Skip connectivity validation checkbox

---

### Screenshot 6: Devices List with Multiple Devices
**Filename**: `06_devices_list.png`

**What to capture**:
- Multiple device cards showing:
  - Device names
  - IP addresses
  - Usernames
  - API ports
  - Online status indicators
  - Delete buttons

---

### Screenshot 7: Device Validation Error
**Filename**: `07_device_validation_error.png`

**What to capture**:
- Error dialog when adding unreachable device
- Error message with suggestion to skip validation

---

## 3. Monitoring

### Screenshot 8: Monitoring Page
**Filename**: `08_monitoring_page.png`

**What to capture**:
- Monitoring dashboard
- System metrics
- Device status overview

---

### Screenshot 9: Prometheus Targets
**Filename**: `09_prometheus_targets.png`

**What to capture**:
- Navigate to `http://localhost:9090/targets`
- All scrape jobs:
  - prometheus (self)
  - snmp-devices
  - snmp-dynamic
  - windows-exporter
- Target status (UP/DOWN)
- Labels

---

### Screenshot 10: Grafana Dashboard - Windows Metrics
**Filename**: `10_grafana_windows.png`

**What to capture**:
- Navigate to `http://localhost:3000`
- Windows Exporter dashboard showing:
  - CPU usage
  - Memory usage
  - Disk space
  - Network traffic

---

### Screenshot 11: Grafana Dashboard - MikroTik SNMP
**Filename**: `11_grafana_mikrotik.png`

**What to capture**:
- MikroTik SNMP dashboard (if available)
- Interface traffic
- CPU/Memory metrics
- Uptime

---

## 4. RouterOS Configuration

### Screenshot 12: RouterOS Page - Execute Config Tab
**Filename**: `12_routeros_config_execute.png`

**What to capture**:
- RouterOS Configurations page
- "Execute Config" tab active
- Configuration form showing:
  - Device selector
  - Template selector
  - Parameter inputs
  - Execute button

---

### Screenshot 13: Configuration Execution Success
**Filename**: `13_config_execution_success.png`

**What to capture**:
- Success message after config execution
- Output/response from router

---

### Screenshot 14: Config History Tab
**Filename**: `14_config_history.png`

**What to capture**:
- "Config History" tab showing:
  - List of past configurations
  - Timestamps
  - Device names
  - Action types
  - Status (success/failed)

---

## 5. Security & Authentication

### Screenshot 15: Login Page
**Filename**: `15_login_page.png`

**What to capture**:
- Login form
- NetworkWeaver branding
- Username/password fields
- Sign In button

---

### Screenshot 16: Security Page
**Filename**: `16_security_page.png`

**What to capture**:
- Security dashboard
- WireGuard VPN status
- Security settings

---

## 6. Backend API

### Screenshot 17: Swagger API Documentation
**Filename**: `17_swagger_api_docs.png`

**What to capture**:
- Navigate to `http://localhost:8000/docs`
- Full Swagger UI showing all endpoints:
  - /devices
  - /monitoring
  - /routeros
  - /auth

---

### Screenshot 18: API Endpoint Example
**Filename**: `18_api_endpoint_example.png`

**What to capture**:
- Expand `/monitoring/status` endpoint
- Show request/response schema
- Try it out with sample response

---

## 7. System Architecture

### Screenshot 19: Docker Containers Running
**Filename**: `19_docker_containers.png`

**What to capture**:
- Terminal screenshot of `docker ps`
- All running containers:
  - backend
  - frontend
  - db
  - prometheus
  - grafana
  - snmp-exporter
  - wireguard

---

### Screenshot 20: Container Logs
**Filename**: `20_container_logs.png`

**What to capture**:
- Terminal showing `docker logs networkweaver-backend`
- Backend startup logs
- API initialization messages

---

## 8. Monitoring Metrics

### Screenshot 21: Prometheus Query
**Filename**: `21_prometheus_query.png`

**What to capture**:
- Navigate to `http://localhost:9090`
- Query: `windows_cpu_time_total`
- Graph showing CPU metrics

---

### Screenshot 22: Grafana Explore
**Filename**: `22_grafana_explore.png`

**What to capture**:
- Grafana Explore view
- Prometheus data source selected
- Metric browser or query

---

## 9. Alert System

### Screenshot 23: Alert Summary - All Healthy
**Filename**: `23_alert_healthy.png`

**What to capture**:
- Alert Summary component
- All devices online (green)
- 0 devices down

---

### Screenshot 24: Alert Summary - Devices Down
**Filename**: `24_alert_devices_down.png`

**What to capture**:
- Alert Summary showing:
  - Red "Devices Down" card with count
  - Green "Devices Online" card
  - List of unreachable devices with names and IPs

---

### Screenshot 25: Sidebar Badge Notification
**Filename**: `25_sidebar_badge.png`

**What to capture**:
- Close-up of sidebar
- Red notification badge next to "Overview" with count

---

## 10. Windows Exporter

### Screenshot 26: Windows Exporter Running
**Filename**: `26_windows_exporter_console.png`

**What to capture**:
- Terminal/console showing Windows Exporter logs
- Listening on port 9182
- Enabled collectors

---

## Capture Instructions

### Tools to Use
- **Windows**: Windows + Shift + S (Snipping Tool)
- **Browser DevTools**: F12 → Screenshot icon (full page)
- **Third-party**: Greenshot, ShareX, or Lightshot

### Best Practices
1. **Resolution**: Use 1920x1080 or higher
2. **Format**: PNG for screenshots (lossless quality)
3. **Naming**: Follow the filename convention above
4. **Annotations**: Add arrows/highlights if needed (optional)
5. **Consistency**: Use the same browser zoom level (100%)
6. **Privacy**: Blur/hide sensitive IPs or credentials if needed

### Organizing Screenshots

Create folder structure:
```
docs/
├── screenshots/
│   ├── 01_dashboard/
│   │   ├── 01_dashboard_overview.png
│   │   ├── 02_dashboard_alerts_down.png
│   │   └── 03_sidebar_navigation.png
│   ├── 02_devices/
│   │   ├── 04_devices_empty.png
│   │   ├── 05_add_device_modal.png
│   │   └── ...
│   ├── 03_monitoring/
│   ├── 04_routeros/
│   ├── 05_security/
│   ├── 06_api/
│   └── 07_system/
```

---

## Integration with Documentation

### Markdown Embedding Example
```markdown
## Dashboard Overview
![Dashboard showing device alerts](./screenshots/01_dashboard/01_dashboard_overview.png)

The main dashboard displays real-time device status with alert summaries.
```

### Documentation Files to Update
- `README.md` - Add screenshots of main features
- `REQUIREMENTS_COMPLIANCE.md` - Add screenshots as proof of compliance
- `METHODOLOGY.md` - Add workflow diagrams and screenshots
- User Guide (create new) - Step-by-step screenshots

---

**Total Screenshots**: 26  
**Estimated Time**: 30-45 minutes  
**Priority**: Screenshots 1-10 (Core features)
