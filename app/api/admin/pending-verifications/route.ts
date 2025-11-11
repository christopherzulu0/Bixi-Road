import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const applications = await prisma.sellerApplication.findMany({
      where: { status: "PENDING" },
      orderBy: { submittedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const data = applications.map((a) => ({
      id: a.id,
      email: a.user.email,
      full_name: [a.user.firstName, a.user.lastName].filter(Boolean).join(" "),
      country: a.country,
      phone: a.phone,
      mine_location: a.mineLocation,
      bio: a.bio,
      mining_license_url: a.miningLicenseUrl,
      id_document_url: a.idDocumentUrl,
      company_cert_url: a.companyCertUrl,
      submitted_at: a.submittedAt,
      user_id: a.userId,
      verification_status: "pending",
      is_verified_miner: false,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/pending-verifications error", error);
    return NextResponse.json({ error: "Failed to fetch pending verifications" }, { status: 500 });
  }
}