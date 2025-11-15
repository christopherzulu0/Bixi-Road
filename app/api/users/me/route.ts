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

    const [dbUser, verifiedMinerRaw] = await Promise.all([
      prisma.user.findUnique({
        where: { clerkId: userId },
        select: {
          id: true,
          role: true,
          status: true,
          userpic: true,
          country: true,
        },
      }),
      prisma.$queryRaw<{ is_verified_miner: boolean }[]>`
        SELECT "is_verified_miner"
        FROM "users"
        WHERE "clerkId" = ${userId}
        LIMIT 1
      `,
    ]);

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

    const role = dbUser.role ?? "buyer";
    const normalizedRole = role.toLowerCase();
    const isRoleVerifiedMiner =
      normalizedRole === "miner" || normalizedRole === "seller";
    const isVerifiedMiner =
      (verifiedMinerRaw?.[0]?.is_verified_miner ?? false) || isRoleVerifiedMiner;

    return NextResponse.json(
      {
        id: dbUser.id,
        role: normalizedRole,
        isVerifiedMiner,
        verificationStatus: dbUser.status ?? null,
        userpic: dbUser.userpic,
        country: dbUser.country,
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

