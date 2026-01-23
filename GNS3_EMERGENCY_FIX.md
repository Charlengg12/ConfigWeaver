# EMERGENCY FIX - GNS3 Server Errors

## 🔴 CRITICAL: Follow These Steps RIGHT NOW

![Current Errors](C:/Users/Ronald/.gemini/antigravity/brain/6012d7aa-91fb-481e-a914-b85987ee6267/uploaded_image_1769155767256.png)

You're seeing "There is no connection to the server" because GNS3 VM is enabled but not working.

---

## ⚡ IMMEDIATE STEPS (Do This Now!)

### Step 1: Close All GNS3 Error Dialogs

- Click the **X** on all red error boxes
- Close any popup windows

### Step 2: Disable GNS3 VM IMMEDIATELY

1. In GNS3 menu: **Edit → Preferences**
2. In left sidebar, click **"GNS3 VM"**
3. You'll see: ☑ "Enable the GNS3 VM" - **UNCHECK THIS BOX!**
4. Click **"OK"**
5. GNS3 will ask to restart - Click **"Yes"**

**This is the MOST IMPORTANT step!**

### Step 3: After GNS3 Restarts

1. Check the **bottom-right corner** of GNS3
2. You should now see: **Green circle** + `Local server (127.0.0.1:3080)`
3. If you see RED or "Disconnected", continue to Step 4

### Step 4: Enable and Start Local Server

1. **Edit → Preferences**
2. Click **"Server"** in left sidebar
3. Under "Local server settings":
   - ☑ Check "Enable the local server"
   - Host binding: `127.0.0.1`
   - Port: `3080` (default)
4. Click **"OK"**
5. If server doesn't start, click **"Restart local server"**

### Step 5: Fix QEMU Binary Issue

1. **Edit → Preferences**
2. Click **"QEMU"** in left sidebar
3. Click on **"Qemu binaries"** tab
4. Look for executable files like:
   - `qemu-system-x86_64.exe`
   - `qemu-system-i386.exe`

**If the list is EMPTY:**

#### Option A: Reinstall GNS3 with QEMU

1. **Close GNS3 completely**
2. Windows Start → Settings → Apps
3. Find **GNS3** → Click → **Modify** (or Uninstall)
4. If modifying, ensure **QEMU** is checked ✅
5. If reinstalling:
   - Download latest GNS3: https://www.gns3.com/software/download
   - During installation, ensure these are checked:
     - ✅ **GNS3 (required)**
     - ✅ **QEMU** ← CRITICAL!
     - ✅ **Wireshark** (optional)
     - ✅ **Npcap** (for packet capture)
     - ❌ **GNS3 VM** ← LEAVE UNCHECKED!
6. **Restart computer** after installation

#### Option B: Manual QEMU Path (If QEMU is Already Installed)

1. In **Edit → Preferences → QEMU → Qemu binaries**
2. Click **"New"**
3. Browse to QEMU installation folder:
   - Default: `C:\Program Files\GNS3\qemu\`
   - Or: `C:\Program Files (x86)\GNS3\qemu\`
4. Select `qemu-system-x86_64.exe`
5. Click **"Open"**, then **"OK"**

---

## ✅ Verification Checklist

Before trying to add any devices, verify ALL of these:

### Server Status:
- [ ] Bottom-right corner shows **green circle**
- [ ] Text shows: `Local server (127.0.0.1:3080)`
- [ ] Console shows "Running" (not red errors)

### Preferences - GNS3 VM:
- [ ] Edit → Preferences → GNS3 VM
- [ ] "Enable the GNS3 VM" is **UNCHECKED** ☐

### Preferences - Server:
- [ ] Edit → Preferences → Server
- [ ] "Enable the local server" is **CHECKED** ☑
- [ ] Port shows: 3080

### Preferences - QEMU:
- [ ] Edit → Preferences → QEMU
- [ ] "Qemu binaries" tab shows at least 1 executable
- [ ] Example: `qemu-system-x86_64.exe` visible in list

### Console Messages:
- [ ] No red error messages in bottom console
- [ ] Console shows: "Connected to GNS3 server" or similar

---

## 🔄 After All Steps Complete

### Test the Setup:

1. **File → New blank project**
2. Name it: `Test-Project`
3. From left panel, drag **VPCS** (Virtual PC Simulator) to workspace
4. Right-click VPCS → **Start**
5. If it starts successfully: ✅ **Setup is working!**
6. If errors appear: ❌ **QEMU still not configured**

---

## 🆘 Still Getting "No Compatible Qemu Binary"?

### Nuclear Option: Complete GNS3 Reinstall

1. **Uninstall GNS3**:
   - Windows Settings → Apps → GNS3 → Uninstall
   - Also uninstall "WinPCAP" or "Npcap" if present

2. **Delete GNS3 folders** (to ensure clean install):
   ```powershell
   # Delete these if they exist:
   C:\Program Files\GNS3
   C:\Users\Ronald\AppData\Local\GNS3
   C:\Users\Ronald\AppData\Roaming\GNS3
   ```

3. **Download GNS3** installer:
   - Go to: https://www.gns3.com/software/download
   - Download latest version (2.2.x)
   - **Also download**: GNS3 VM (you don't need to use it, but having it available is good)

4. **Install with these options**:
   ```
   ✅ GNS3
   ✅ QEMU       ← CRITICAL! Don't skip!
   ✅ VPCS
   ✅ Dynamips
   ✅ Wireshark
   ✅ Npcap
   ❌ GNS3 VM   ← Don't install/configure this!
   ```

5. **During first launch**:
   - Choose: "Run appliances on my local computer"
   - Server: Local server
   - Don't configure GNS3 VM

6. **Restart computer**

---

## 📋 Post-Restart Verification

After computer restarts and you open GNS3:

1. **Check bottom-right**: Should show green + "Local server"
2. **No red errors** in console
3. **Edit → Preferences → QEMU → Qemu binaries**: Should have executables listed
4. **Try adding VPCS** device to test

---

## 🎯 What Should Work After This

Once properly configured:

- ✅ GNS3 opens without errors
- ✅ Green server status in bottom-right
- ✅ Can add devices (VPCS, routers) from left panel
- ✅ Devices start successfully
- ✅ Can right-click → Console to access devices
- ✅ Ready to install MikroTik appliance

---

## 🔍 Understanding the Errors

### "GNS3VM: VMware VM GNS3 VM (2) not found"
**Meaning**: GNS3 is looking for a VMware virtual machine that doesn't exist  
**Fix**: Disable GNS3 VM in preferences

### "No compatible Qemu binary selected"
**Meaning**: QEMU executables aren't available or registered  
**Fix**: Reinstall GNS3 with QEMU, or manually add QEMU path

### "There is no connection to the server"
**Meaning**: GNS3 can't connect to compute server (GNS3 VM or Local)  
**Fix**: Enable Local Server and disable GNS3 VM

### "Error while executing VMware command: vmrun"
**Meaning**: GNS3 is trying to control VMware but fails  
**Fix**: Disable GNS3 VM (stop trying to use VMware)

---

## 📞 Next Steps After Fix

Once you have:
- ✅ Green server status
- ✅ No errors in console
- ✅ QEMU binaries listed

Then proceed to install MikroTik:
1. Follow: [`GNS3_SIMULATION_GUIDE.md`](file:///c:/Users/Ronald/Desktop/NetworkWeaver/ConfigWeaver/GNS3_SIMULATION_GUIDE.md)
2. Part 3: Create MikroTik Router VM → Option B (Using GNS3 QEMU)
3. Or use manual method from [`GNS3_QUICK_FIX.md`](file:///c:/Users/Ronald/Desktop/NetworkWeaver/ConfigWeaver/GNS3_QUICK_FIX.md)

---

**Remember**: You DON'T need GNS3 VM for this lab. Local Server is perfect! 🚀
