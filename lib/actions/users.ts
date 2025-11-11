"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma  from "../prisma";
import { Role } from "@/src/generated/prisma/client";

export async function syncUser() {
  try {
    const user = await currentUser();
    if (!user) return;

    const email = user.emailAddresses[0]?.emailAddress ?? user.primaryEmailAddress?.emailAddress;
    if (!email) {
      console.warn("syncUser: Clerk user missing email address");
      return;
    }

    // Normalize role from Clerk metadata (defaults to buyer)
    const metadataRole = typeof user.publicMetadata?.role === "string"
      ? user.publicMetadata.role.toLowerCase()
      : undefined;
    
    // Map to Prisma Role enum
    let normalizedRole: Role = Role.buyer;
    if (metadataRole === "admin") {
      normalizedRole = Role.admin;
    } else if (metadataRole === "seller") {
      normalizedRole = Role.seller;
    } else if (metadataRole === "miner") {
      normalizedRole = Role.seller; // Map miner to seller
    }

    const baseData = {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? null,
      email,
      phone: user.phoneNumbers[0]?.phoneNumber ?? null,
      role: normalizedRole,
    };

    const existingByClerk = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (existingByClerk) {
      const updated = await prisma.user.update({
        where: { clerkId: user.id },
        data: baseData,
      });
      return updated;
    }

    const existingByEmail = await prisma.user.findUnique({ where: { email } });
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
