import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInquiryNotificationEmail({
  sellerEmail,
  sellerName,
  buyerName,
  productTitle,
  message,
  productId,
}: {
  sellerEmail: string;
  sellerName: string;
  buyerName: string;
  productTitle: string;
  message: string;
  productId: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set, skipping email send");
      return;
    }

    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/MinerDashboard`;
    
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "BixiRoad <noreply@bixiroad.com>",
      to: sellerEmail,
      subject: `New Inquiry: ${buyerName} asked about "${productTitle}"`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Inquiry on BixiRoad</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1A1A1A 0%, #3E2723 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">BixiRoad</h1>
              <p style="color: #FFFFF0; margin: 10px 0 0 0;">Africa's Verified Minerals Marketplace</p>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 2px solid #D4AF37; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1A1A1A; margin-top: 0;">New Product Inquiry</h2>
              
              <p style="font-size: 16px; color: #333;">
                Hello <strong>${sellerName}</strong>,
              </p>
              
              <p style="font-size: 16px; color: #333;">
                You have received a new inquiry about your product listing:
              </p>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
                <h3 style="color: #1A1A1A; margin-top: 0; font-size: 20px;">${productTitle}</h3>
              </div>
              
              <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: bold;">From: ${buyerName}</p>
                <p style="margin: 0; color: #333; font-size: 16px; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="${dashboardUrl}" 
                   style="display: inline-block; background: #D4AF37; color: #1A1A1A; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Respond to Inquiry
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
                You can view and respond to this inquiry in your <a href="${dashboardUrl}" style="color: #D4AF37;">Seller Dashboard</a>.
              </p>
              
              <p style="font-size: 12px; color: #999; margin-top: 20px;">
                This is an automated notification from BixiRoad. Please do not reply to this email.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Inquiry notification email sent to:", sellerEmail);
  } catch (error) {
    console.error("Failed to send inquiry notification email:", error);
    // Don't throw - email failure shouldn't break the inquiry creation
  }
}

export async function sendContactFormEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set, skipping email send");
      return;
    }

    const supportEmail = process.env.CONTACT_SUPPORT_EMAIL || "support@bixiroad.com";
    const subjectLabels: Record<string, string> = {
      general: "General Inquiry",
      seller_verification: "Seller Verification",
      buyer_support: "Buyer Support",
      technical: "Technical Issue",
      partnership: "Partnership Opportunity",
      complaint: "Report an Issue",
    };

    const subjectLabel = subjectLabels[subject] || "General Inquiry";

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "BixiRoad <noreply@bixiroad.com>",
      to: supportEmail,
      replyTo: email,
      subject: `Contact Form: ${subjectLabel} - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission - BixiRoad</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1A1A1A 0%, #3E2723 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">BixiRoad</h1>
              <p style="color: #FFFFF0; margin: 10px 0 0 0;">Africa's Verified Minerals Marketplace</p>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 2px solid #D4AF37; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1A1A1A; margin-top: 0;">New Contact Form Submission</h2>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #666; width: 120px;">Name:</td>
                    <td style="padding: 8px 0; color: #333;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
                    <td style="padding: 8px 0; color: #333;">
                      <a href="mailto:${email}" style="color: #D4AF37; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #666;">Subject:</td>
                    <td style="padding: 8px 0; color: #333;">${subjectLabel}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1A1A1A; margin-top: 0; margin-bottom: 10px; font-size: 16px;">Message:</h3>
                <p style="margin: 0; color: #333; font-size: 16px; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="font-size: 14px; color: #666; margin: 0;">
                  <strong>Reply to:</strong> <a href="mailto:${email}" style="color: #D4AF37;">${email}</a>
                </p>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">
                  This email was sent from the BixiRoad contact form. You can reply directly to this email to respond to ${name}.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Send confirmation email to the user
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "BixiRoad <noreply@bixiroad.com>",
      to: email,
      subject: "Thank you for contacting BixiRoad",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank you for contacting BixiRoad</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1A1A1A 0%, #3E2723 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">BixiRoad</h1>
              <p style="color: #FFFFF0; margin: 10px 0 0 0;">Africa's Verified Minerals Marketplace</p>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 2px solid #D4AF37; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1A1A1A; margin-top: 0;">Thank you for contacting us!</h2>
              
              <p style="font-size: 16px; color: #333;">
                Hello <strong>${name}</strong>,
              </p>
              
              <p style="font-size: 16px; color: #333;">
                We've received your message regarding <strong>${subjectLabel}</strong> and our team will get back to you within 24 hours.
              </p>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
                <p style="margin: 0; color: #666; font-size: 14px; font-weight: bold;">Your Message:</p>
                <p style="margin: 10px 0 0 0; color: #333; font-size: 16px; white-space: pre-wrap;">${message}</p>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
                If you have any urgent questions, please don't hesitate to reach out to us at 
                <a href="mailto:${supportEmail}" style="color: #D4AF37;">${supportEmail}</a>.
              </p>
              
              <p style="font-size: 12px; color: #999; margin-top: 20px;">
                This is an automated confirmation email from BixiRoad. Please do not reply to this email.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Contact form email sent to support and confirmation sent to:", email);
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    throw error; // Throw for contact form since we want to know if it fails
  }
}

