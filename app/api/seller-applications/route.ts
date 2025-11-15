import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found in database", { status: 404 });
    }

    // Check if user already has a pending or approved application
    const existingApplication = await prisma.sellerApplication.findFirst({
      where: {
        userId: user.id,
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
    });

    if (existingApplication) {
      return new NextResponse(
        JSON.stringify({
          error: "You already have an active application",
          status: existingApplication.status,
        }),
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      country,
      phone,
      bio,
      mineLocation,
      miningLicenseUrl,
      idDocumentUrl,
      companyCertUrl,
    } = body;

    // Validate required fields
    if (!country || !phone || !bio || !mineLocation || !miningLicenseUrl || !idDocumentUrl) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing required fields",
        }),
        { status: 400 }
      );
    }

    // Create seller application
    const application = await prisma.sellerApplication.create({
      data: {
        userId: user.id,
        country,
        phone,
        bio,
        mineLocation,
        miningLicenseUrl,
        idDocumentUrl,
        companyCertUrl: companyCertUrl || null,
        status: "PENDING",
      },
    });

    // Update Clerk user's publicMetadata with country
    try {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: {
          country: country,
        },
      });
      console.log(`[SELLER_APPLICATION_POST] Updated Clerk metadata with country: ${country}`);
    } catch (clerkError) {
      // Log error but don't fail the application submission
      console.error("[SELLER_APPLICATION_POST] Failed to update Clerk metadata:", clerkError);
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("[SELLER_APPLICATION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        sellerApplications: {
          orderBy: {
            submittedAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found in database", { status: 404 });
    }

    return NextResponse.json(user.sellerApplications);
  } catch (error) {
    console.error("[SELLER_APPLICATION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

