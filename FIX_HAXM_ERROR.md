# Fix: HAXM Acceleration Error

## Problem
You are seeing the error: **"HAXM acceleration support is not installed on this host"**

This means GNS3 is telling QEMU to use Intel's Hardware Acceleration (HAXM), but it's not installed or not working on your PC.

## Solution: Disable Acceleration Requirement (Fastest Fix)

Since MikroTik routers are very lightweight, they **don't strictly need** hardware acceleration. We can simply turn off this requirement.

### Step 1: Open QEMU Preferences
1. In GNS3, go to **Edit → Preferences**
2. In the left (sidebar), click on **QEMU** (not Qemu VMs yet)

### Step 2: Uncheck the Requirement
1. You will see a checkbox: **"Require hardware acceleration (KVM/HAXM)"**
2. **UNCHECK** this box. ☐
3. Also **UNCHECK** "Enable hardware acceleration (KVM/HAXM)" just to be safe for now.
4. Click **Apply**

### Step 3: Update the MikroTik VM Settings
1. Now click on **Qemu VMs** in the left sidebar.
2. Select your **MikroTik-CHR** VM.
3. Click **Edit**.
4. Go to the **Advanced** tab.
5. Setup the **Accelerator**:
   - Change it to **"None"** or **"TCG"** (if available)
   - Or just ensure "Require hardware acceleration" is NOT checked here either.
6. Click **OK**.
7. Click **OK** again to close preferences.

### Step 4: Try Again
1. Right-click your MikroTik router in the topology.
2. Click **Stop** (if it thinks it's running).
3. Click **Start**.

It should now boot up! (It might be slightly slower, but for MikroTik it's negligible).

---

## Alternative: Install HAXM (If you really want acceleration)

If you have an Intel CPU and want better performance:

1. **Download HAXM**: https://github.com/intel/haxm/releases
2. Install it on Windows.
3. **Restart Computer**.
4. Re-enable the checkboxes in GNS3.

**Note**: HAXM often conflicts with Hyper-V or Docker. Since you are using Docker for NetworkWeaver, **Disabling Acceleration (Solution above)** is much safer and less likely to cause other issues.
