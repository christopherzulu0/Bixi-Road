# Uploadthing Connection Timeout Fix

## The Issue

You're experiencing a "Connect Timeout Error" when Uploadthing tries to register metadata after file upload:

```
Failed to register metadata
Connect Timeout Error (attempted addresses: 44.227.30.116:443, 52.10.71.176:443, timeout: 10000ms)
```

**What's happening:**
1. ✅ File uploads to S3 successfully (presigned URL works)
2. ❌ Metadata registration to Uploadthing server times out (10 seconds)
3. ❌ `onClientUploadComplete` never fires
4. ❌ UI stays in "uploading" state

## Root Causes

### 1. Network/Firewall Issues (Most Common)
- Corporate firewall blocking Uploadthing's metadata server
- VPN interfering with connections
- Antivirus blocking outbound connections
- ISP throttling or blocking specific IP ranges
- Geographic restrictions

### 2. Uploadthing Service Issues
- Server overload
- Regional routing problems
- DNS resolution issues

### 3. Local Network Configuration
- Proxy settings
- IPv6 vs IPv4 routing
- DNS cache issues

---

## 🔧 Solutions

### Solution 1: Check Network/Firewall

**Test connectivity:**
```bash
# Check if you can reach Uploadthing's metadata server
curl -v https://sea1.ingest.uploadthing.com/route-metadata

# Check DNS resolution
nslookup sea1.ingest.uploadthing.com
```

**Try:**
1. Disable VPN temporarily
2. Disable antivirus temporarily
3. Try from mobile hotspot (different network)
4. Check firewall rules for outbound HTTPS

---

### Solution 2: Increase Timeout

The default timeout is 10 seconds. For slow networks, increase it:

**Update `uploadthing.config.ts`:** (if you don't have this file, create it)

```typescript
// uploadthing.config.ts
import type { UploadThingConfig } from "uploadthing/server";

export const config: UploadThingConfig = {
  uploadTimeout: 30000, // 30 seconds instead of 10
};
```

---

### Solution 3: Alternative Upload Strategy

Since the file upload works but metadata fails, we can handle this differently:

**Option A: Use Uploadthing's `skipPolling` option**

Update your upload hook to not wait for server confirmation:

```typescript
const { startUpload } = useUploadThing("articleImageUploader", {
  skipPolling: true, // Don't wait for server confirmation
  onClientUploadComplete: (res) => {
    // This will fire immediately after S3 upload
    console.log("✅ Upload completed:", res);
  },
});
```

**Option B: Fall back to local handling**

Detect timeout and handle gracefully:

```typescript
const handleUpload = async (files: File[]) => {
  try {
    const uploadPromise = startUpload(files);
    
    // Add timeout wrapper
    const result = await Promise.race([
      uploadPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout')), 15000)
      )
    ]);
    
    return result;
  } catch (error) {
    if (error.message === 'Upload timeout') {
      // File was uploaded but metadata failed
      // Handle manually or retry
      console.warn('Metadata timeout - file may have uploaded');
    }
    throw error;
  }
};
```

---

### Solution 4: Environment-Specific Configuration

Check if this is a development-only issue:

**In `.env.local`:**
```env
# Try different Uploadthing region
UPLOADTHING_REGION=us-west-2

# Enable debug logging
UPLOADTHING_LOG_LEVEL=debug
```

---

### Solution 5: Use Callback URL

Ensure your callback URL is accessible:

**In your Uploadthing middleware:**
```typescript
.middleware(async ({ req }) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  // Ensure callback URL is set correctly
  return { 
    userId,
    callbackUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  };
})
```

---

## 🚀 Immediate Workaround

For now, to make your uploads work, add a timeout handler:

<function_calls>
<invoke name="search_replace">
<parameter name="file_path">bixi-road/app/CreateArticle/page.tsx
