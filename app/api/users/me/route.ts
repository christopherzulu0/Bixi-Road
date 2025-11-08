import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          role: "buyer",
          isVerifiedMiner: false,
          verificationStatus: "unauthenticated",
        },
        { status: 200 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        role: true,
        status: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        {
          role: "buyer",
          isVerifiedMiner: false,
          verificationStatus: "not_registered",
        },
        { status: 200 }
      );
    }

    const role = dbUser.role ?? "USER";
    const normalizedRole = role.toLowerCase();

    return NextResponse.json(
      {
        role: normalizedRole,
        isVerifiedMiner: role === "MINER" || role === "SELLER",
        verificationStatus: dbUser.status ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/users/me] error", error);
    return NextResponse.json(
      {
        role: "buyer",
        isVerifiedMiner: false,
        verificationStatus: null,
      },
      { status: 500 }
    );
  }
}

