# Upload Stuck at 0% - Troubleshooting Guide

## The Issue

You're seeing the presigned URL generated successfully (200 status), but the upload progress is stuck at 0%. This means:
- ✅ Your API route is working
- ✅ Clerk authentication is working
- ✅ Uploadthing presigned URL is generated
- ❌ The actual file upload to Uploadthing's S3 bucket is failing

## Common Causes & Solutions

### 1. Missing Environment Variables

**Check your `.env.local` file has:**

```env
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
UPLOADTHING_APP_ID=your_app_id
```

**Solution:**
1. Verify both variables are set
2. Restart your dev server after adding them
3. Check for typos in variable names (they're case-sensitive!)

---

### 2. CORS Issues (Most Common)

The browser might be blocking the upload to Uploadthing's S3 bucket due to CORS.

**Solution:**
1. Check browser console for CORS errors
2. Uploadthing should handle CORS automatically, but verify your account is active
3. Try in an incognito/private window to rule out browser extensions

---

### 3. Network/Firewall Issues

Your network might be blocking the upload to AWS S3.

**Check:**
- Are you behind a corporate firewall?
- Is your antivirus blocking the upload?
- Try disabling VPN if you're using one

**Solution:**
1. Try from a different network (mobile hotspot)
2. Check with your network administrator
3. Temporarily disable antivirus to test

---

### 4. File Size Issues

Even though the max is 8MB, very large files can timeout.

**Current file:** "Section B.pdf" is 1.17 MB ✅ (size is fine)

---

### 5. Uploadthing Account Issues

**Verify:**
1. Go to https://uploadthing.com/dashboard
2. Check your application is active (not suspended)
3. Verify you haven't hit rate limits on free tier
4. Check if you need to verify your email

---

## Debug Steps

### Step 1: Check Browser Console

Open DevTools (F12) and check for:
- CORS errors
- Network errors
- Failed requests to `sea1.ingest.uploadthing.com`

### Step 2: Check Network Tab

1. Open DevTools → Network tab
2. Try uploading again
3. Look for the PUT request to `sea1.ingest.uploadthing.com`
4. Check if it's:
   - Pending (stuck)
   - Failed (error)
   - CORS error

### Step 3: Check Uploadthing Dashboard

1. Login to https://uploadthing.com/dashboard
2. Go to your app
3. Check "Files" - does anything appear?
4. Check "Logs" - any error messages?

### Step 4: Test with Simplified Code

I've added extensive logging. Check your browser console for these emoji indicators:
- 📁 File selected
- 🚀 Starting upload
- 📤 Upload began
- 📊 Upload progress
- ✅ Upload completed
- ❌ Upload error

---

## Enhanced Logging Added

I've updated the code with better logging. You should now see:

```
📁 File selected: Section B.pdf (1.17 MB)
⬆️ Starting upload for field: miningLicenseUrl
🚀 Starting upload for files: ["Section B.pdf"]
📤 Upload began for: Section B.pdf
📊 Upload progress: 15
📊 Upload progress: 45
📊 Upload progress: 78
📊 Upload progress: 100
✅ Upload completed successfully: [result]
📦 Upload result: [object]
✅ File uploaded successfully: https://utfs.io/f/...
```

If you're NOT seeing the progress logs (📊), the issue is between the presigned URL and the actual S3 upload.

---

## Quick Fixes to Try

### Fix 1: Clear Browser Cache
```
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
4. Try upload again
```

### Fix 2: Try Incognito Mode
```
1. Open incognito/private window
2. Sign in
3. Try upload
4. If it works, a browser extension is interfering
```

### Fix 3: Different Browser
```
Try Chrome, Firefox, or Edge
Some browsers have stricter security policies
```

### Fix 4: Check Uploadthing Status
```
Go to: https://status.uploadthing.com
Verify all systems are operational
```

---

## What The Logs Tell Us

From your terminal output:

```json
presignedUrls: [{
  url: 'https://sea1.ingest.uploadthing.com/...',
  key: '2y72JEVJ3u5vpPDW5fj4GfB9Ds2FNOQxkLXy47Kg1dZTwHcE',
  name: 'Section B.pdf',
  customId: null
}]
```

✅ **This is good!** It means:
- Uploadthing API responded
- Presigned URL was generated
- Your credentials are valid

The issue is the **next step** - the actual PUT request to upload the file to that URL.

---

## Advanced Debugging

### Enable Verbose Logging

Add to your `.env.local`:
```env
UPLOADTHING_LOG_LEVEL=debug
```

Restart your dev server and check for more detailed logs.

### Check Network Request

When the upload runs, check DevTools Network tab for:
1. Request to `/api/uploadthing?actionType=upload...` (should be 200 ✅)
2. PUT request to `sea1.ingest.uploadthing.com` (this is what's failing)

Look at the PUT request:
- Status code?
- Response?
- Time (is it timing out)?

---

## Still Not Working?

### Contact Uploadthing Support

1. Go to https://uploadthing.com/dashboard
2. Click "Support" or "Help"
3. Provide them with:
   - Your App ID
   - The presigned URL from logs
   - Browser console errors
   - When it started happening

### Alternative: Direct File Upload Test

Create a simple test page to isolate the issue:

```typescript
// Test upload directly
import { uploadFiles } from "@uploadthing/react";

const testUpload = async (file: File) => {
  const result = await uploadFiles("sellerDocumentUploader", {
    files: [file],
  });
  console.log(result);
};
```

---

## Expected Behavior

When working correctly, you should see:

1. File selected → Shows 0%
2. Upload starts → Shows 1-10%
3. Uploading → Progress increases (15%, 30%, 50%, 75%)
4. Complete → 100%, green checkmark

**Current:** Stuck at 0% means the PUT request to S3 never completes.

---

## Next Steps

1. **Check browser console** for the new emoji logs
2. **Check Network tab** for the PUT request status
3. **Try incognito mode** to rule out extensions
4. **Check Uploadthing dashboard** for any issues
5. **Report back** what you see in the console

The enhanced logging should help us pinpoint exactly where it's failing! 🔍

