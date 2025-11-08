# Setup Checklist for Seller Application System

Complete these steps to get the seller application system fully working.

## ✅ Already Completed

- [x] Database schema created (`SellerApplication` model)
- [x] API route for seller applications created
- [x] Uploadthing integration configured
- [x] BecomeSeller page updated with upload functionality
- [x] Clerk authentication integrated
- [x] File upload UI with progress tracking
- [x] Next.js config updated for Uploadthing images

## 🚀 Steps You Need to Complete

### 1. Database Migration
Run these commands in your terminal:

```bash
# Generate Prisma client with new schema
npx prisma generate

# Create and run the database migration
npx prisma migrate dev --name add_seller_application
```

**Expected output:** Migration file created and applied successfully.

---

### 2. Uploadthing Account Setup

**Go to:** [https://uploadthing.com](https://uploadthing.com)

Steps:
1. Sign up for a free account
2. Create a new application (e.g., "BixiRoad")
3. Go to **API Keys** section
4. Copy your Secret Key (starts with `sk_live_` or `sk_test_`)
5. Copy your App ID

---

### 3. Environment Variables

**Create/update** `.env.local` file in your project root:

```env
# Database (should already exist)
DATABASE_URL="postgresql://user:password@localhost:5432/bixiroad"

# Clerk (should already exist)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Uploadthing (ADD THESE NEW ONES)
UPLOADTHING_SECRET=sk_live_your_secret_key_here
UPLOADTHING_APP_ID=your_app_id_here
```

**Important:** Replace `your_secret_key_here` and `your_app_id_here` with your actual Uploadthing credentials from step 2.

---

### 4. Restart Development Server

After adding environment variables:

```bash
# Stop current server (Ctrl+C or Cmd+C)

# Restart the server
npm run dev
```

---

### 5. Test the System

#### Test 1: Sign In
- Navigate to your app
- Sign in with Clerk
- Verify you're authenticated

#### Test 2: Access BecomeSeller Page
- Navigate to `/become-seller`
- You should see the application form
- If you're not signed in, you should be redirected

#### Test 3: Upload Documents
- Fill out the form fields:
  - Country
  - Phone number
  - Mine location
  - Business description
- Upload required documents:
  - Mining License (PDF or image, max 8MB)
  - ID/Passport (PDF or image, max 8MB)
  - Optionally: Company Certificate
- Watch for upload progress indicators
- Verify you see green checkmarks after successful uploads

#### Test 4: Submit Application
- Click "Submit Application"
- You should see a success message
- You should be redirected to the homepage
- Check the database to verify the application was saved

#### Test 5: Check for Duplicate Applications
- Try to access `/become-seller` again after submitting
- You should see a "Application Under Review" status page
- You should not be able to submit another application

---

## 🐛 Quick Troubleshooting

### Issue: "404 on /api/uploadthing"
**Fixed!** The route has been moved to the correct location: `app/api/uploadthing/route.ts`

**If still seeing error:**
1. Verify the file exists at `app/api/uploadthing/route.ts`
2. Restart your dev server
3. Clear browser cache

---

### Issue: "UPLOADTHING_SECRET is not defined"
**Solution:**
1. Make sure you created `.env.local` in the project root
2. Restart your dev server after adding the variable
3. Check for typos in the variable name

---

### Issue: Upload fails or gets stuck
**Solutions:**
1. Check browser console for errors
2. Verify you're signed in via Clerk
3. Verify file is under 8MB
4. Verify file type is PDF, PNG, JPG, or JPEG
5. Check Uploadthing dashboard to see if uploads are reaching their servers

---

### Issue: Database error when submitting
**Solutions:**
1. Make sure you ran `npx prisma generate`
2. Make sure you ran the migration `npx prisma migrate dev`
3. Verify your `DATABASE_URL` is correct
4. Check that the database is running

---

## 📊 Verify Everything Works

### Database Check
Open Prisma Studio to view your data:
```bash
npx prisma studio
```

Look for:
- `SellerApplication` table exists
- Your test application appears in the table
- All fields are populated correctly
- Document URLs point to Uploadthing

### Uploadthing Check
1. Log into [Uploadthing Dashboard](https://uploadthing.com/dashboard)
2. Go to **Files** tab
3. Verify your uploaded documents appear
4. Click on files to ensure they're accessible

### Clerk Check
1. Log into [Clerk Dashboard](https://dashboard.clerk.com)
2. Go to **Users** section
3. Verify your test user exists
4. Check that authentication is working properly

---

## ✨ Success Criteria

You've successfully set up the system when:

- ✅ You can sign in via Clerk
- ✅ You can access the BecomeSeller page
- ✅ You can upload documents with progress indicators
- ✅ You can submit an application successfully
- ✅ Application is saved in the database
- ✅ Uploaded files appear in Uploadthing dashboard
- ✅ Returning to BecomeSeller shows "Application Under Review" status
- ✅ No console errors during the entire flow

---

## 📚 Documentation

- `SELLER_APPLICATION_SETUP.md` - Complete system documentation
- `UPLOADTHING_SETUP.md` - Uploadthing-specific setup guide
- This file - Quick checklist for setup

---

## 🎯 Next Steps After Setup

Once everything is working:

1. **Create Admin Dashboard**
   - View all pending applications
   - Approve/reject applications
   - View uploaded documents

2. **Add Email Notifications**
   - Notify users when application status changes
   - Send confirmation emails on submission

3. **Enhance UX**
   - Add drag-and-drop file upload
   - Add document preview before submission
   - Add file compression for large files

4. **Add Analytics**
   - Track application submission rates
   - Monitor approval/rejection rates
   - Track upload success rates

---

## 💡 Tips

- Use Prisma Studio (`npx prisma studio`) to inspect database records
- Check Uploadthing dashboard regularly during testing
- Keep browser console open to catch any errors
- Test with different file types and sizes
- Test the flow on different browsers

---

## ❓ Need Help?

If you encounter issues not covered in troubleshooting:

1. Check the browser console for detailed error messages
2. Check the terminal/server logs for backend errors
3. Review `UPLOADTHING_SETUP.md` for detailed Uploadthing help
4. Review `SELLER_APPLICATION_SETUP.md` for system documentation
5. Check Uploadthing documentation: https://docs.uploadthing.com
6. Check Clerk documentation: https://clerk.com/docs

Good luck! 🚀

