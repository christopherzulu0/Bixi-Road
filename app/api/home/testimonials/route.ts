import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  country: string;
  flag: string;
  content: string;
  rating: number;
  created_date: string;
};

type TestimonialsResponse = {
  data: Testimonial[];
};

export async function GET() {
  try {
    // Fetch approved testimonials (or all for testing - remove isApproved filter temporarily)
    const testimonials = await prisma.testimonial.findMany({
      where: {
        // isApproved: true, // Temporarily removed to show all testimonials for testing
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        role: true,
        country: true,
        flag: true,
        content: true,
        rating: true,
        createdAt: true,
      },
    });

    console.log("[HOME_TESTIMONIALS_GET] Found testimonials:", testimonials.length);

    const formatted: Testimonial[] = testimonials.map((testimonial) => ({
      id: testimonial.id,
      name: testimonial.name,
      role: testimonial.role,
      country: testimonial.country,
      flag: testimonial.flag,
      content: testimonial.content,
      rating: testimonial.rating,
      created_date: testimonial.createdAt.toISOString(),
    }));

    const response: TestimonialsResponse = {
      data: formatted,
    };

    console.log("[HOME_TESTIMONIALS_GET] Returning response:", JSON.stringify(response).substring(0, 200));

    return NextResponse.json(response);
  } catch (error) {
    console.error("[HOME_TESTIMONIALS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

type TestimonialRequest = {
  name: string;
  role: string;
  country: string;
  flag: string;
  content: string;
  rating: number;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body: TestimonialRequest = await req.json();

    // Validate required fields
    if (!body.name || !body.role || !body.country || !body.flag || !body.content || !body.rating) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Get user from database if logged in
    let dbUser = null;
    if (userId) {
      dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true },
      });
    }

    // Create testimonial (pending approval by default)
    const testimonial = await prisma.testimonial.create({
      data: {
        name: body.name,
        role: body.role,
        country: body.country,
        flag: body.flag,
        content: body.content,
        rating: body.rating,
        isApproved: false, // Requires admin approval
        userId: dbUser?.id || null,
      },
    });

    return NextResponse.json(
      {
        data: {
          id: testimonial.id,
          name: testimonial.name,
          role: testimonial.role,
          country: testimonial.country,
          flag: testimonial.flag,
          content: testimonial.content,
          rating: testimonial.rating,
          created_date: testimonial.createdAt.toISOString(),
        },
        message: "Testimonial submitted successfully! It will be reviewed before being published.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[HOME_TESTIMONIALS_POST]", error);
    return NextResponse.json(
      { error: "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}

