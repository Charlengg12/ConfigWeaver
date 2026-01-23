# GNS3 Setup Error Solutions

## Common Errors During MikroTik Installation

### Error 1: "Cannot use a node on the GNS3 VM server with the GNS3 VM not configured"

![GNS3 VM Error](C:/Users/Ronald/.gemini/antigravity/brain/6012d7aa-91fb-481e-a914-b85987ee6267/uploaded_image_1769154464007.png)

This error occurs when GNS3 tries to use the GNS3 VM but it's not properly set up.

### Error 2: "No compatible Qemu binary selected" + "Could not find VBoxManage"

![Multiple GNS3 Errors](C:/Users/Ronald/.gemini/antigravity/brain/6012d7aa-91fb-481e-a914-b85987ee6267/uploaded_image_1769155029428.png)

These errors mean:
- **VBoxManage error**: GNS3 is trying to use VirtualBox but it's not installed or not in PATH
- **No compatible Qemu binary**: No QEMU installation found for running appliances locally
- **Waiting for localhost:3080**: GNS3 is trying to connect to the GNS3 VM server

> [!IMPORTANT]
> **STOP! Don't struggle with GNS3 VM setup.** The easiest fix is to use **Local Server** instead. See Solution 1 below.

---

## Solution 1: Use Local Server (Recommended for Windows)

This is the **easiest solution** - run appliances directly on your Windows machine.

### IMMEDIATE FIX - Cancel Current Installation:

1. **Click "Cancel"** button in the installation dialog (bottom right)
2. Close any error popups
3. We'll start fresh with proper settings

### Steps to Fix:

#### Step 1: Configure GNS3 to Use Local Server

1. In GNS3, go to **Edit → Preferences**
2. Click on **Server** in the left panel
3. Under **Local server settings**:
   - ✅ Check **"Enable the local server"**
   - Note the port (usually 3080)
   - Leave other settings as default
4. Click **OK**

#### Step 2: Ensure QEMU is Installed

GNS3 needs QEMU to run routers. If it wasn't installed:

1. **Close GNS3 completely**
2. Go to Windows **Add/Remove Programs**
3. Find **GNS3**
4. Click **Modify** or **Repair**
5. In the installer, ensure these are checked:
   - ✅ **QEMU** (CRITICAL!)
   - ✅ Dynamips
   - ✅ VPCS
6. Complete the installation
7. **Restart your computer**

**Alternative - Manual QEMU Installation:**
```powershell
# Download QEMU from: https://qemu.weilnetz.de/w64/
# Install it, then add to GNS3:
# Edit → Preferences → QEMU → Qemu binaries
```

#### Step 3: Disable GNS3 VM (Since You Don't Have It)

1. **Edit → Preferences**
2. Click **GNS3 VM** in left panel
3. ✅ **UNCHECK** "Enable the GNS3 VM"
4. Click **OK**

This tells GNS3 to stop looking for the GNS3 VM!

#### Step 4: Verify Local Server is Running

1. In GNS3, look at the bottom right corner
2. You should see a **green circle** with text like:
   ```
   Local server (127.0.0.1:3080)
   ```
3. If it's **red**, GNS3 server isn't running:
   - **Edit → Preferences → Server → Local server**
   - Click **"Restart local server"**

#### Step 5: Retry MikroTik Installation

Now retry installing MikroTik:

1. **File → New template**
2. Select **"Install an appliance from the GNS3 server"**
3. Search for **"MikroTik"**
4. Select **"MikroTik Cloud Hosted Router"**
5. **IMPORTANT**: When you see server selection:
   - Ensure it says **"local"** or **"Local server"**
   - If not, there's a dropdown - select **"local"**
6. Continue with installation
7. When asked for QEMU binary:
   - Select the latest version (e.g., `qemu-system-x86_64.exe`)
8. Import your MikroTik `.img` file
9. **Finish**

### Requirements for Local Server:
- ✅ QEMU installed (comes with GNS3)
- ✅ Virtualization enabled in BIOS
- ✅ 8GB+ RAM recommended
- ✅ Modern CPU

---

## Solution 2: Configure GNS3 VM (Advanced)

If you prefer using the GNS3 VM for better performance:

### Step 1: Download GNS3 VM

1. Go to: https://www.gns3.com/software/download
2. Download **GNS3 VM** for VMware Workstation
3. File: `GNS3.VM.VMware.Workstation.X.X.X.zip`

### Step 2: Import GNS3 VM to VMware

1. Extract the downloaded ZIP file
2. Open VMware Workstation
3. **File → Open** 
4. Browse to extracted folder
5. Select the `.ovf` or `.vmx` file
6. Import with default settings
7. **Power on** the GNS3 VM

### Step 3: Configure GNS3 to Use the VM

1. In GNS3 desktop application:
   - **Edit → Preferences**
   - Go to **GNS3 VM** section
   
2. **Enable the GNS3 VM**:
   - Check ☑ **"Enable the GNS3 VM"**
   - Virtualization engine: **VMware Workstation**
   - VM name: Select your imported GNS3 VM
   
3. **Allocate Resources**:
   - RAM: **2048 MB** or more
   - vCPUs: **2** or more
   
4. Click **OK**

5. **Restart GNS3**

### Step 4: Verify Connection

1. Restart GNS3 application
2. The GNS3 VM should start automatically
3. Check status bar - should show "Connected to GNS3 VM"
4. Now retry installing MikroTik CHR

---

## Solution 3: Quick Fix - Change Server During Import

If you're in the middle of importing:

1. **Don't click OK on the error yet**
2. Click **OK** to close error dialog
3. Click **< Back** button
4. Look for **"Run this Qemu VM on"** or **"Server"** option
5. Change to **Local server**
6. Click **Next >** to continue

---

## Which Solution Should You Use?

### Use **Local Server** if:
- ✅ You have a powerful Windows PC (8GB+ RAM)
- ✅ You want simple setup
- ✅ You're just testing/learning
- ✅ Running only 2-3 routers

### Use **GNS3 VM** if:
- ✅ Running many devices (5+ routers)
- ✅ Need better performance
- ✅ Want to isolate GNS3 from Windows
- ✅ Have VMware Workstation Pro

---

## Recommended: Local Server for NetworkWeaver Lab

For your MikroTik monitoring setup, I recommend **Local Server** because:

1. **Simpler setup** - No need to download GNS3 VM
2. **Direct network access** - Easier to connect to your Windows host
3. **Fewer VMs** - You're only running 1-2 MikroTik routers
4. **Less overhead** - No need for an extra VM running

---

## Step-by-Step: Installing MikroTik on Local Server

### 1. Enable Local Server

```
Edit → Preferences → Server → Local server
☑ Enable local server
```

### 2. Download MikroTik QEMU Image

- Go to: https://mikrotik.com/download
- Product: **Cloud Hosted Router**
- Download: **Raw disk image** (.img file)
- Example: `chr-7.13.img`

### 3. Import to GNS3

1. **File → New template**
2. Select **"Install an appliance from the GNS3 server"**
3. Click **Next**
4. Search for **"MikroTik"**
5. Select **"MikroTik Cloud Hosted Router"**
6. Click **Install**

7. **Important**: When asked "Run this Qemu VM on":
   - Select **"Run on my local computer"**
   - Click **Next**

8. **Install required files**:
   - Click **"Import"** next to the version you want
   - Browse to your downloaded `.img` file
   - Click **Next**

9. **Finish installation**

### 4. Use in Project

1. Create new project or open existing
2. From left panel: **Routers** section
3. Drag **MikroTik CHR** to workspace
4. Right-click → **Start**
5. Right-click → **Console**

---

## Verification

After fixing, you should be able to:

- ✅ Start MikroTik router in GNS3
- ✅ Open console (right-click → Console)
- ✅ See MikroTik login prompt
- ✅ Login with `admin` (no password)

---

## Still Having Issues?

### Error: "QEMU binary not found"

**Solution**:
1. Reinstall GNS3
2. During installation, ensure **"QEMU"** is selected
3. Or manually install QEMU from: https://www.qemu.org/download/#windows

### Error: "VT-x/AMD-V not enabled"

**Solution**:
1. Restart PC
2. Enter BIOS/UEFI (usually F2, Del, or F12)
3. Find **Virtualization Technology** or **VT-x**
4. Enable it
5. Save and exit

### Error: "Permission denied"

**Solution**:
1. Run GNS3 as Administrator
2. Right-click GNS3 icon → **Run as administrator**

---

## Alternative: Use VirtualBox Instead of GNS3 VM

If VMware GNS3 VM doesn't work:

1. Download **GNS3 VM for VirtualBox**
2. Import to VirtualBox
3. In GNS3 Preferences:
   - Virtualization engine: **VirtualBox**
   - Select imported VM

---

## Next Steps

Once you've resolved the error:

1. ✅ Import MikroTik CHR successfully
2. ✅ Create your network topology
3. ✅ Configure routers with IPs
4. ✅ Enable SNMP
5. ✅ Connect to NetworkWeaver

Return to the main guide: [`GNS3_SIMULATION_GUIDE.md`](file:///c:/Users/Ronald/Desktop/NetworkWeaver/ConfigWeaver/GNS3_SIMULATION_GUIDE.md)

---

## Quick Reference

| Problem | Solution |
|---------|----------|
| GNS3 VM not configured | Use Local Server instead |
| Want better performance | Install and configure GNS3 VM |
| Simple lab (1-3 routers) | Use Local Server |
| Complex lab (5+ devices) | Use GNS3 VM |
| QEMU not found | Reinstall GNS3 with QEMU |
| VT-x error | Enable virtualization in BIOS |

---

**TIP**: For the NetworkWeaver monitoring lab, **Local Server is perfectly fine** and much easier to set up! 🚀
