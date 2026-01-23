# Quick Fix Guide - GNS3 Errors

## 🚨 Current Problem

You're seeing multiple errors because GNS3 is trying to use features that aren't set up:
- ❌ GNS3 VM (not installed)
- ❌ VirtualBox (not installed or not in PATH)  
- ❌ QEMU binaries (might not be installed)

## ✅ Simple 5-Step Fix

### Step 1️⃣: Cancel Current Installation

In your current GNS3 window:
1. Click **"Cancel"** button (bottom right)
2. Close any error popups with "X"

### Step 2️⃣: Disable GNS3 VM

1. In GNS3: **Edit → Preferences**
2. Left panel: Click **"GNS3 VM"**
3. **UNCHECK** ☐ "Enable the GNS3 VM"
4. Click **OK**

### Step 3️⃣: Enable Local Server

1. **Edit → Preferences** (again)
2. Left panel: Click **"Server"**
3. Under "Local server settings":
   - **CHECK** ☑ "Enable the local server"
4. Click **OK**

### Step 4️⃣: Check QEMU is Installed

1. **Edit → Preferences**
2. Left panel: Click **"QEMU"**
3. Click **"Qemu binaries"** tab
4. You should see a list of QEMU executables:
   - `qemu-system-x86_64.exe`
   - `qemu-system-i386.exe`
   - etc.

**If the list is EMPTY:**
- You need to reinstall GNS3 with QEMU
- See detailed instructions in [`GNS3_TROUBLESHOOTING.md`](file:///c:/Users/Ronald/Desktop/NetworkWeaver/ConfigWeaver/GNS3_TROUBLESHOOTING.md)

### Step 5️⃣: Verify Server Status

Look at **bottom-right corner** of GNS3 window:

✅ **Good**: Green circle + `Local server (127.0.0.1:3080)`  
❌ **Bad**: Red circle or "Disconnected"

If red:
- **Edit → Preferences → Server**
- Click **"Restart local server"**

---

## 🔄 Now Retry MikroTik Installation

1. **File → New template**
2. Select **"Install an appliance from the GNS3 server"**
3. Search: **"MikroTik"**
4. Select **"MikroTik Cloud Hosted Router"**
5. Click **"Install"**
6. **Server selection**: Make sure it says **"local"**
7. Continue and import your `.img` file

---

## 🆘 Still Getting Errors?

### Error: "No compatible Qemu binary selected"

**Fix**: Reinstall GNS3 with QEMU included

1. Close GNS3
2. Windows Settings → Apps → GNS3
3. Click **"Modify"** or uninstall and reinstall
4. During installation, ensure **QEMU is checked** ✅
5. Restart computer after installation

### Error: QEMU binary dropdown is empty

**Fix**: Manually specify QEMU path

1. **Edit → Preferences → QEMU → Qemu binaries**
2. Click **"New"**
3. Browse to: `C:\Program Files\GNS3\qemu\qemu-system-x86_64.exe`
4. Or wherever QEMU is installed
5. Click **OK**

### Error: Still trying to use VirtualBox

**Fix**: Create a new blank project

1. **File → New blank project**
2. Name it something different
3. Try adding MikroTik from the left panel
4. If MikroTik isn't in the list, you need to complete the template installation first

---

## 📋 Checklist

Before installing MikroTik, verify:

- [ ] GNS3 VM is **DISABLED** (Edit → Preferences → GNS3 VM)
- [ ] Local server is **ENABLED** (Edit → Preferences → Server)
- [ ] Green circle in bottom-right showing "Local server"
- [ ] QEMU binaries exist (Edit → Preferences → QEMU → Qemu binaries)
- [ ] At least one `qemu-system-*.exe` is listed

Once all checked, proceed with MikroTik installation!

---

## 💡 Alternative: Skip Template Installation

If template installation keeps failing, you can manually create a MikroTik VM:

### Manual Method:

1. **Edit → Preferences → QEMU VMs**
2. Click **"New"**
3. Name: `MikroTik-CHR`
4. RAM: `256 MB`
5. Console: `telnet`
6. On the **Disk** tab:
   - Click "New Image"
   - Browse to your MikroTik `.img` file
   - Click "Create"
7. On the **Network** tab:
   - Adapters: `4`
   - Type: `e1000`
8. Click **"Finish"**

Now MikroTik will appear in your **Routers** section!

---

## 📚 Full Details

For complete troubleshooting: [`GNS3_TROUBLESHOOTING.md`](file:///c:/Users/Ronald/Desktop/NetworkWeaver/ConfigWeaver/GNS3_TROUBLESHOOTING.md)

For the main guide: [`GNS3_SIMULATION_GUIDE.md`](file:///c:/Users/Ronald/Desktop/NetworkWeaver/ConfigWeaver/GNS3_SIMULATION_GUIDE.md)

---

**TIP**: Don't worry about the GNS3 VM! For your monitoring lab with 1-2 routers, Local Server is perfect. 🎯
