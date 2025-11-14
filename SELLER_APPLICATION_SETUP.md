# Seller Application Setup Guide

This document explains the complete seller application submission system with Uploadthing integration.

## Overview

The seller application system allows users to apply to become verified sellers by submitting their information and required documents. Documents are uploaded using Uploadthing, and applications are stored in the database using Prisma.

## Components

### 1. Database Schema (`prisma/schema.prisma`)

Added the `SellerApplication` model:

```prisma
model SellerApplication {
  id               String                  @id @default(cuid())
  userId           String
  country          String
  phone            String
  bio              String
  mineLocation     String                  @map("mine_location")
  miningLicenseUrl String                  @map("mining_license_url")
  idDocumentUrl    String                  @map("id_document_url")
  companyCertUrl   String?                 @map("company_cert_url")
  status           SellerApplicationStatus @default(PENDING)
  submittedAt      DateTime                @default(now()) @map("submitted_at")
  updatedAt        DateTime                @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("seller_applications")
}

enum SellerApplicationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

**Migration Required:**
```bash
npx prisma generate
npx prisma migrate dev --name add_seller_application
```

### 2. Uploadthing Configuration (`lib/uploadthing.ts`)

Added a new `sellerDocumentUploader` endpoint:

- **Accepted File Types:** PDF, PNG, JPG, JPEG
- **Max File Size:** 8MB per file
- **Authentication:** Uses Clerk's `auth()` to verify user is signed in
- **Returns:** File URL after successful upload

### 3. API Route (`app/api/seller-applications/route.ts`)

**POST `/api/seller-applications`**
- Creates a new seller application
- Validates required fields
- Checks for existing applications (prevents duplicates)
- Returns the created application

**GET `/api/seller-applications`**
- Fetches all applications for the current user
- Ordered by submission date (newest first)

### 4. Frontend Page (`app/BecomeSeller/page.tsx`)

#### Features:
- **Authentication Check:** Redirects unauthenticated users to home
- **Application Status Display:** Shows different UI based on application status (PENDING, APPROVED, REJECTED)
- **File Upload with Progress:** Real-time upload progress for each document
- **Form Validation:** Ensures all required fields and documents are provided
- **Error Handling:** User-friendly error messages

#### Form Fields:
- **Country** (required)
- **Phone Number** (required)
- **Mine Location** (required)
- **Business Description** (required)
- **Mining License/Permit** (required, file upload)
- **ID/Passport** (required, file upload)
- **Company Registration Certificate** (optional, file upload)

## Usage Flow

### For Users:

1. **Navigate to Become Seller Page**
   - User must be signed in (redirects if not)

2. **Check Existing Application**
   - System automatically checks if user has an existing application
   - If PENDING: Shows "Under Review" status
   - If APPROVED: Shows success message with links to create listings
   - If REJECTED: Shows rejection message with support contact info

3. **Fill Out Application Form**
   - Enter all required information
   - Upload required documents (Mining License, ID)
   - Optionally upload Company Certificate

4. **Submit Application**
   - System validates all fields
   - Uploads documents to Uploadthing
   - Saves application to database with PENDING status
   - Shows success message and redirects to home

### For Administrators:

To approve/reject applications, you'll need to create an admin interface that:
1. Fetches all applications with PENDING status
2. Displays application details and document links
3. Allows updating application status to APPROVED or REJECTED
4. Optionally updates the User's `role` and `isVerifiedMiner` fields

Example update query:
```typescript
// Approve application
await prisma.sellerApplication.update({
  where: { id: applicationId },
  data: { status: "APPROVED" }
});

// Update user status
await prisma.user.update({
  where: { id: userId },
  data: { 
    role: "MINER",
    isVerifiedMiner: true,
    verificationStatus: "approved"
  }
});
```

## Environment Variables Required

Make sure you have these in your `.env` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL="postgresql://..."

# Uploadthing
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=your_app_id
```

## Security Features

1. **Authentication Required:** All uploads and submissions require user to be signed in via Clerk
2. **Duplicate Prevention:** System checks for existing applications before accepting new ones
3. **File Type Validation:** Only PDF and image files accepted
4. **File Size Limits:** 8MB maximum per file
5. **Server-side Validation:** All data validated on API route before database insertion

## Next Steps

1. **Run Migrations:** 
   ```bash
   npx prisma generate
   npma prisma migrate dev --name add_seller_application
   ```

2. **Configure Uploadthing:**
   - Sign up at https://uploadthing.com
   - Get your API keys
   - Add to `.env` file

3. **Test the Flow:**
   - Sign in as a user
   - Navigate to `/become-seller`
   - Submit an application
   - Verify it's saved in the database

4. **Create Admin Interface:**
   - Build a page to view and manage applications
   - Add approve/reject functionality
   - Update user roles when approved

## Troubleshooting

### Upload Fails
- Check Uploadthing configuration and API keys
- Verify file size is under 8MB
- Ensure file type is PDF, PNG, JPG, or JPEG

### Application Not Saving
- Check database connection
- Verify Prisma client is generated
- Check browser console for errors
- Verify all required fields are filled

### User Not Redirected After Submission
- Check for JavaScript errors in console
- Verify Next.js router is working properly
- Ensure success response is returned from API

## API Response Examples

### Successful Submission (201):
```json
{
  "id": "clxyz123...",
  "userId": "user_abc123",
  "country": "Ghana",
  "phone": "+233123456789",
  "bio": "Mining company with 10 years experience...",
  "mineLocation": "Ashanti Region, Ghana",
  "miningLicenseUrl": "https://utfs.io/f/...",
  "idDocumentUrl": "https://utfs.io/f/...",
  "companyCertUrl": "https://utfs.io/f/...",
  "status": "PENDING",
  "submittedAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Error - Missing Fields (400):
```json
{
  "error": "Missing required fields"
}
```

### Error - Duplicate Application (400):
```json
{
  "error": "You already have an active application",
  "status": "PENDING"
}
```

### Error - Unauthorized (401):
```json
"Unauthorized"
```

