"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma  from "../prisma";
import { Role } from "@/src/generated/prisma/client/enums";


export async function syncUser() {
  try {
    const user = await currentUser();
    if (!user) return;

    const email = user.emailAddresses[0]?.emailAddress ?? user.primaryEmailAddress?.emailAddress;
    if (!email) {
      console.warn("syncUser: Clerk user missing email address");
      return;
    }

    // Normalize role from Clerk metadata (only if explicitly set)
    const metadataRole = typeof user.publicMetadata?.role === "string"
      ? user.publicMetadata.role.toLowerCase()
      : undefined;
    
    // Map to Prisma Role enum (only if metadata has a role)
    let normalizedRole: Role | undefined = undefined;
    if (metadataRole === "admin") {
      normalizedRole = Role.admin;
    } else if (metadataRole === "seller") {
      normalizedRole = Role.seller;
    } else if (metadataRole === "miner") {
      normalizedRole = Role.seller; // Map miner to seller
    }

    // Check for existing user first to preserve role if not in Clerk metadata
    const existingByClerk = await prisma.user.findUnique({ 
      where: { clerkId: user.id },
      select: { userpic: true, country: true },
    });
    const existingByEmail = await prisma.user.findUnique({ 
      where: { email },
      select: { userpic: true, country: true },
    });
    const existingUser = existingByClerk || existingByEmail;

    // Extract country from Clerk metadata if available
    const metadataCountry = typeof user.publicMetadata?.country === "string"
      ? user.publicMetadata.country
      : undefined;

    // Build base data - only include role if Clerk metadata has it, otherwise preserve existing
    // Preserve existing userpic and country if Clerk doesn't provide them
    const baseData: {
      firstName: string;
      lastName: string | null;
      email: string;
      phone: string | null;
      role?: Role;
      userpic: string | null;
      country?: string | null;
    } = {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? null,
      email,
      phone: user.phoneNumbers[0]?.phoneNumber ?? null,
      userpic: user.imageUrl || existingUser?.userpic || null, // Use Clerk image, or preserve existing, or null
      country: metadataCountry || existingUser?.country || null, // Use Clerk metadata country, or preserve existing, or null
    };

    // Only update role if Clerk metadata explicitly has one
    // This preserves manually set roles in the database
    if (normalizedRole !== undefined) {
      baseData.role = normalizedRole;
    } else if (!existingUser) {
      // Only default to buyer for new users
      baseData.role = Role.buyer;
    }
    // If existingUser exists and no Clerk role, don't include role in update (preserves existing)

    if (existingByClerk) {
      const updated = await prisma.user.update({
        where: { clerkId: user.id },
        data: baseData,
      });
      return updated;
    }

    if (existingByEmail) {
      const updated = await prisma.user.update({
        where: { email },
        data: {
          ...baseData,
          clerkId: user.id,
        },
      });
      return updated;
    }

    const created = await prisma.user.create({
      data: {
        ...baseData,
        clerkId: user.id,
      },
    });

    return created;
  } catch (error) {
    console.log("Error in syncUser server action", error);
  }
}
