# Fix: Add QEMU to GNS3

## Problem
QEMU binaries are missing from your GNS3 installation. Without QEMU, you can't run routers locally.

## Solution: Modify GNS3 Installation (5-10 minutes)

### Step 1: Close GNS3
1. Click **Cancel** in Preferences window
2. Close GNS3 completely
3. Make sure no GNS3 processes are running

### Step 2: Modify GNS3 Installation

1. Press **Windows key**
2. Type: `Apps & Features` or `Add or Remove Programs`
3. Press Enter
4. Search for **"GNS3"**
5. Click on **GNS3** → **Modify** (or **Change**)

   > If you don't see "Modify", click **Uninstall** and we'll do a fresh install with QEMU

### Step 3: In GNS3 Installer

When the installer opens, you'll see component selections:

**ENSURE THESE ARE CHECKED:**
- ✅ **GNS3** (required)
- ✅ **QEMU** ← **CRITICAL! Check this!**
- ✅ **Dynamips** (for Cisco routers)
- ✅ **VPCS** (for virtual PCs)
- ✅ **Wireshark** (optional, for packet capture)
- ✅ **Npcap** or **WinPcap** (for packet capture)

**MAKE SURE THESE ARE UNCHECKED:**
- ❌ **GNS3 VM** (you don't need this for local setup)

Click **Next** and complete installation.

### Step 4: Restart Computer

**IMPORTANT**: After installation completes, **restart your computer**. This ensures:
- QEMU binaries are properly registered
- PATH variables are updated
- Services start correctly

### Step 5: Verify QEMU is Installed

After restart, open GNS3:

1. **Edit → Preferences**
2. Click **QEMU** in left sidebar
3. Click **"Qemu binaries"** tab
4. You should now see files like:
   - `qemu-system-x86_64w.exe`
   - `qemu-system-i386w.exe`
   - Path: `C:\Program Files\GNS3\qemu\...`

✅ **If you see files** → Success! QEMU is installed!

### Step 6: Check Server Status

Look at **bottom-right corner** of GNS3:
- ✅ **Green circle** + `Local server (127.0.0.1:3080)` → Ready!
- ❌ **Red circle** → See troubleshooting below

---

## Alternative: Fresh Install (If Modify Doesn't Work)

If "Modify" option isn't available or doesn't work:

### Complete Uninstall

1. **Uninstall GNS3**:
   - Windows Settings → Apps → GNS3 → Uninstall

2. **Delete leftover folders** (optional but recommended):
   ```
   C:\Program Files\GNS3
   C:\Users\Ronald\AppData\Local\GNS3
   C:\Users\Ronald\AppData\Roaming\GNS3
   ```

### Fresh Install

1. **Download GNS3**:
   - Go to: https://www.gns3.com/software/download
   - Download latest version (Windows)

2. **Run Installer**:
   - Select **"Install as local server"** or **"Run appliances on my computer"**
   - When component selection appears:
     - ✅ GNS3
     - ✅ **QEMU** ← Make sure this is checked!
     - ✅ Dynamips
     - ✅ VPCS
     - ✅ Wireshark (optional)
     - ✅ Npcap
     - ❌ GNS3 VM (uncheck this)

3. **Complete installation**

4. **Restart computer**

---

## After QEMU is Installed

### Configure GNS3 Settings

1. **Disable GNS3 VM**:
   - Edit → Preferences → GNS3 VM
   - ☐ Uncheck "Enable the GNS3 VM"

2. **Enable Local Server**:
   - Edit → Preferences → Server
   - ☑ Check "Enable the local server"

3. **Verify green server status** in bottom-right

### Next: Create MikroTik Router

Now you can add MikroTik:

1. Download MikroTik CHR image:
   - https://mikrotik.com/download
   - Select **Cloud Hosted Router**
   - Download **Raw disk image** (.img file)

2. Add to GNS3:
   - **Edit → Preferences → QEMU → Qemu VMs**
   - Click **"New"**
   - Name: `MikroTik-CHR`
   - RAM: `256 MB`
   - Console: `telnet`
   - Add disk image: Browse to your .img file
   - Network adapters: `4`
   - Adapter type: `e1000`
   - Finish

3. Use router:
   - Drag **MikroTik-CHR** from left panel to workspace
   - Right-click → Start
   - Right-click → Console
   - Login: `admin` (no password)

---

## Troubleshooting

### Still No QEMU Binaries After Install

**Try manual QEMU installation:**

1. Download QEMU: https://qemu.weilnetz.de/w64/
2. Install to: `C:\Program Files\qemu\`
3. In GNS3: Edit → Preferences → QEMU → Qemu binaries
4. Click **"New"**
5. Browse to: `C:\Program Files\qemu\qemu-system-x86_64w.exe`
6. OK

### Server Status Still Red

1. Edit → Preferences → Server
2. Click **"Restart local server"** button
3. Wait 10 seconds
4. Check bottom-right again

### "VT-x/AMD-V not enabled" Error

1. Restart computer
2. Enter BIOS/UEFI (F2, Del, or F12 during boot)
3. Find "Virtualization Technology" or "VT-x"
4. Enable it
5. Save and exit

---

## Summary

**Quick Path:**
1. Close GNS3
2. Windows: Apps → GNS3 → Modify
3. Check QEMU in installer
4. Restart computer
5. Verify QEMU binaries exist
6. Green server status = Ready!

**Then:**
- Download MikroTik CHR image
- Create QEMU VM in GNS3
- Build your monitoring lab!

---

Return to: [`GNS3_SIMULATION_GUIDE.md`](file:///c:/Users/Ronald/Desktop/NetworkWeaver/ConfigWeaver/GNS3_SIMULATION_GUIDE.md)
