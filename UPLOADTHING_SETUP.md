# Uploadthing Setup Guide

This guide will help you set up Uploadthing for document uploads in the BixiRoad application.

## ✅ What's Already Done

1. ✅ Uploadthing packages installed (`uploadthing` and `@uploadthing/react`)
2. ✅ File router configured in `lib/uploadthing.ts`
3. ✅ API route created at `app/api/uploadthing/route.ts`
4. ✅ React hooks configured in `lib/uploadthing-react.ts`
5. ✅ Next.js config updated for image domains
6. ✅ Integration in BecomeSeller page

## 🚀 Setup Steps

### 1. Create an Uploadthing Account

1. Go to [https://uploadthing.com](https://uploadthing.com)
2. Sign up for a free account
3. Create a new application

### 2. Get Your API Keys

1. In your Uploadthing dashboard, navigate to **API Keys**
2. Copy your **Secret Key** (starts with `sk_live_` or `sk_test_`)
3. Copy your **App ID**

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project (if it doesn't exist) and add:

```env
# Uploadthing Configuration
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
UPLOADTHING_APP_ID=your_app_id_here

# These should already exist in your .env.local
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Important:** Never commit `.env.local` to version control!

### 4. Restart Your Development Server

After adding the environment variables, restart your Next.js dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 🧪 Testing the Upload

1. Make sure you're signed in to your application
2. Navigate to `/become-seller`
3. Try uploading a document (PDF or image)
4. You should see:
   - Upload progress indicator
   - Success message when complete
   - Green checkmark confirming upload

## 📁 File Upload Configuration

Current configuration (in `lib/uploadthing.ts`):

### Seller Document Uploader
- **Endpoint:** `sellerDocumentUploader`
- **Accepted formats:** PDF, PNG, JPG, JPEG
- **Max file size:** 8MB
- **Authentication:** Required (via Clerk)

## 🔧 Troubleshooting

### Error: "Failed to upload. You must be signed in"
**Solution:** Make sure you're signed in via Clerk before uploading files.

### Error: "Missing UPLOADTHING_SECRET"
**Solution:** 
1. Verify your `.env.local` file has the `UPLOADTHING_SECRET` variable
2. Restart your dev server after adding it
3. Check for typos in the variable name

### Error: "File too large"
**Solution:** The maximum file size is 8MB. Compress or resize your file before uploading.

### Error: "Invalid file type"
**Solution:** Only PDF, PNG, JPG, and JPEG files are accepted. Make sure your file has the correct extension.

### Upload gets stuck at 0%
**Possible causes:**
1. Network issue - check your internet connection
2. CORS issue - make sure your Uploadthing app is configured correctly
3. Clerk authentication issue - make sure you're properly signed in

**Solution:**
1. Check browser console for specific errors
2. Verify Uploadthing dashboard shows your app is active
3. Ensure Clerk is properly configured

### 404 Error on /api/uploadthing
This has been fixed! The route was moved from `api/uploadthing/route.ts` to `app/api/uploadthing/route.ts`.

If you still see this error:
1. Verify the file exists at `app/api/uploadthing/route.ts`
2. Restart your dev server
3. Clear your browser cache

## 📊 Monitoring Uploads

You can monitor your uploads in the Uploadthing dashboard:

1. Go to [https://uploadthing.com/dashboard](https://uploadthing.com/dashboard)
2. Select your application
3. View the **Files** tab to see all uploaded files
4. Check **Analytics** for upload statistics

## 🔐 Security

The Uploadthing configuration includes:

1. **Authentication:** All uploads require Clerk authentication
2. **File validation:** Server-side file type and size validation
3. **Rate limiting:** Uploadthing provides automatic rate limiting
4. **Virus scanning:** Uploadthing scans all uploads for malware (paid plans)

## 💰 Pricing

Uploadthing offers:
- **Free tier:** 2GB storage, 1GB bandwidth/month
- **Pro tier:** More storage and bandwidth
- **Enterprise:** Custom solutions

Check [https://uploadthing.com/pricing](https://uploadthing.com/pricing) for current pricing.

## 📝 File Structure

```
bixi-road/
├── app/
│   └── api/
│       └── uploadthing/
│           ├── route.ts         ← API route handler
│           └── core.ts          ← Re-export of file router
├── lib/
│   ├── uploadthing.ts           ← File router configuration
│   └── uploadthing-react.ts    ← React hooks
└── app/
    └── BecomeSeller/
        └── page.tsx             ← Implementation example
```

## 🔗 Useful Links

- [Uploadthing Documentation](https://docs.uploadthing.com)
- [Next.js App Router Guide](https://docs.uploadthing.com/getting-started/appdir)
- [Uploadthing Dashboard](https://uploadthing.com/dashboard)
- [Uploadthing Discord](https://discord.gg/uploadthing)

## 🎯 Next Steps After Setup

Once Uploadthing is working:

1. ✅ Test document uploads in BecomeSeller page
2. Create an admin interface to view uploaded documents
3. Consider adding image preview functionality
4. Set up webhook handlers for upload events (optional)
5. Configure file retention policies in Uploadthing dashboard

## 📧 Support

If you encounter issues:
1. Check the Uploadthing [documentation](https://docs.uploadthing.com)
2. Join their [Discord community](https://discord.gg/uploadthing)
3. Check their [GitHub repository](https://github.com/pingdotgg/uploadthing) for known issues

