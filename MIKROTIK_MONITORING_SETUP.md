# MikroTik Router Monitoring Setup Guide

This guide helps you configure your MikroTik router at **10.244.222.81** for monitoring with NetworkWeaver.

## Step 1: Enable SNMP on MikroTik Router

Connect to your MikroTik router (via WinBox, SSH, or WebFig) and run these commands:

```routeros
# Enable SNMP service
/snmp
set enabled=yes contact="admin" location="network"

# Configure SNMP community (default: public)
/snmp community
set [ find default=yes ] addresses=0.0.0.0/0 name=public

# Optional: Create a specific community for better security
add name=networkweaver addresses=<YOUR_PC_IP>/32
```

## Step 2: Configure Firewall (if enabled)

If you have firewall rules on your MikroTik, allow SNMP from your PC:

```routeros
/ip firewall filter
add chain=input protocol=udp dst-port=161 src-address=<YOUR_PC_IP> action=accept comment="Allow SNMP from monitoring server" place-before=0
```

## Step 3: Test SNMP Connectivity

From your Windows PC, test SNMP connectivity:

### Using PowerShell (if snmpwalk is installed):
```powershell
snmpwalk -v2c -c public 10.244.222.81
```

### Using Docker (built-in):
```powershell
docker run --rm --network=host alpine/snmpwalk -v2c -c public 10.244.222.81 system
```

**Expected Output:**
You should see SNMP data like:
```
SNMPv2-MIB::sysDescr.0 = STRING: RouterOS ...
SNMPv2-MIB::sysObjectID.0 = OID: ...
SNMPv2-MIB::sysUpTime.0 = Timeticks: ...
```

## Step 4: Verify Prometheus Monitoring

1. Start NetworkWeaver:
   ```bash
   docker-compose up -d
   ```

2. Check Prometheus targets:
   - Open: http://localhost:9090/targets
   - Look for `mikrotik-router` job
   - Target should be `10.244.222.81:161`
   - **State should show "UP"** (green)

3. If status is "DOWN", check:
   - Network connectivity: `ping 10.244.222.81`
   - SNMP is enabled on router
   - Firewall allows UDP port 161
   - SNMP exporter logs: `docker logs networkweaver-snmp-exporter`

## Step 5: View Metrics in Grafana

1. Open Grafana: http://localhost:3000
2. Login with admin/admin (change password on first login)
3. Navigate to Dashboards
4. Look for MikroTik or SNMP dashboards
5. You should see:
   - Interface statistics (traffic, errors, packets)
   - System metrics (CPU, memory, uptime)
   - Network interfaces and their status

## Available Metrics

Once SNMP is working, you'll see metrics like:

- **Interface Metrics**:
  - `ifInOctets`: Bytes received
  - `ifOutOctets`: Bytes transmitted
  - `ifInErrors`: Input errors
  - `ifOperStatus`: Interface status

- **System Metrics**:
  - `sysUpTime`: Router uptime
  - `sysDescr`: System description
  - `sysName`: Router name

## Troubleshooting

### Problem: Prometheus shows "Context deadline exceeded"
**Solution**: Router is not reachable or SNMP is not responding
- Check `ping 10.244.222.81`
- Verify SNMP is enabled: `/snmp print`
- Check firewall rules

### Problem: "No Such Object available"
**Solution**: SNMP OIDs not available or wrong module
- Verify community string is correct
- Check MIB module in `prometheus.yml` (currently using `if_mib`)

### Problem: "Authentication failed"
**Solution**: Wrong community string
- Verify community string matches between router and Prometheus config
- Default is "public"

### Problem: Cannot access from NetworkWeaver container
**Solution**: Network connectivity issue
- From container: `docker exec -it networkweaver-snmp-exporter ping 10.244.222.81`
- Ensure Docker can reach your network

## Security Best Practices

1. **Use a specific community string** (not "public"):
   ```routeros
   /snmp community
   add name=my-secret-community addresses=<YOUR_PC_IP>/32
   ```
   
   Then update `prometheus.yml`:
   ```yaml
   params:
     module: [if_mib]
     auth: [my-secret-community]
   ```

2. **Restrict SNMP access by IP**:
   Only allow your monitoring server's IP to access SNMP

3. **Use SNMPv3** (if supported by your setup):
   - Provides authentication and encryption
   - More secure than SNMPv2c

## Next Steps

Once monitoring is working:
1. Create custom Grafana dashboards
2. Set up alerts for interface down or high traffic
3. Add more MikroTik routers to monitoring
4. Configure backend to dynamically add/remove devices

For more information, see:
- [MikroTik SNMP Documentation](https://wiki.mikrotik.com/wiki/Manual:SNMP)
- [Prometheus SNMP Exporter](https://github.com/prometheus/snmp_exporter)
