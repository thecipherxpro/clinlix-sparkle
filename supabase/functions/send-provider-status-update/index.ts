import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusUpdateRequest {
  customerEmail: string;
  customerName: string;
  bookingId: string;
  providerName: string;
  status: string;
  serviceDate: string;
  serviceTime: string;
  address: string;
  estimatedArrival?: string;
}

const getStatusContent = (status: string) => {
  switch (status) {
    case "on_the_way":
      return {
        badge: "ON THE WAY",
        badgeColor: "#14B8A6",
        title: "Your Provider is On The Way",
        message: "Good news! Your provider is now heading to your location."
      };
    case "arrived":
      return {
        badge: "ARRIVED",
        badgeColor: "#0D9488",
        title: "Your Provider Has Arrived",
        message: "Your provider has arrived at your location and will begin the service shortly."
      };
    case "started":
      return {
        badge: "IN PROGRESS",
        badgeColor: "#14B8A6",
        title: "Service Has Started",
        message: "Your cleaning service is now in progress. Your provider is working hard to make your space spotless!"
      };
    case "completed":
      return {
        badge: "COMPLETED",
        badgeColor: "#0D9488",
        title: "Service Completed Successfully",
        message: "Great news! Your cleaning service has been completed. We hope you're satisfied with the results!"
      };
    default:
      return {
        badge: "UPDATE",
        badgeColor: "#14B8A6",
        title: "Status Update",
        message: "Your booking status has been updated."
      };
  }
};

const getEmailTemplate = (data: StatusUpdateRequest) => {
  const statusContent = getStatusContent(data.status);
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Status Update - Clinlix</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); padding: 30px 20px; text-align: left; }
        .logo { max-width: 120px; height: auto; }
        .content { padding: 40px 20px; text-align: left; }
        .title { margin: 0 0 20px; font-size: 24px; font-weight: 700; color: #1a1a1a; text-align: left; }
        .text { margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4a5568; text-align: left; }
        .status-badge { color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 16px; }
        .status-card { background-color: #f7fafc; padding: 20px; margin: 24px 0; border-radius: 8px; text-align: center; border-left: 4px solid ${statusContent.badgeColor}; }
        .status-icon { font-size: 48px; margin-bottom: 12px; }
        .booking-details { background-color: #f7fafc; padding: 20px; margin: 24px 0; border-left: 4px solid #14B8A6; }
        .detail-row { margin: 12px 0; text-align: left; }
        .detail-label { font-weight: 600; color: #2d3748; font-size: 14px; }
        .detail-value { color: #4a5568; font-size: 14px; margin-top: 4px; }
        .provider-info { background-color: #f0fdfa; padding: 16px 20px; margin: 24px 0; border-radius: 8px; border-left: 4px solid #14B8A6; }
        .button { display: inline-block; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(20, 184, 166, 0.4); margin: 20px 0; }
        .footer { background-color: #f7fafc; padding: 30px 20px; border-top: 1px solid #e2e8f0; text-align: left; }
        .footer-text { margin: 0 0 8px; font-size: 13px; color: #718096; text-align: left; }
        .info-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin: 20px 0; text-align: left; }
        @media only screen and (max-width: 600px) {
          .content { padding: 30px 16px; }
          .header { padding: 24px 16px; }
          .title { font-size: 20px; }
          .button { padding: 12px 24px; font-size: 15px; }
        }
      </style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
          <td align="center">
            <div class="container">
              <div class="header">
                <img src="https://clinlix.com/images/clinlix-logo.png" alt="Clinlix" class="logo" />
              </div>
              
              <div class="content">
                <span class="status-badge" style="background-color: ${statusContent.badgeColor};">${statusContent.badge}</span>
                <h1 class="title">${statusContent.title}</h1>
                <p class="text">Hi ${data.customerName},</p>
                <p class="text">${statusContent.message}</p>
                
                <div class="status-card">
                  <p class="text" style="margin: 0; font-size: 18px; font-weight: 700; color: #0D9488;">
                    Status: ${data.status.replace("_", " ").toUpperCase()}
                  </p>
                </div>
                
                <div class="provider-info">
                  <p class="text" style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #2d3748;">Your Provider</p>
                  <p class="text" style="margin: 0; font-size: 14px; color: #2d3748;">
                    ${data.providerName}
                  </p>
                </div>
                
                <div class="booking-details">
                  <div class="detail-row">
                    <div class="detail-label">Booking ID</div>
                    <div class="detail-value">#${data.bookingId.substring(0, 8).toUpperCase()}</div>
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">Scheduled Time</div>
                    <div class="detail-value">${data.serviceDate} at ${data.serviceTime}</div>
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">Service Address</div>
                    <div class="detail-value">${data.address}</div>
                  </div>
                  ${data.estimatedArrival ? `
                  <div class="detail-row">
                    <div class="detail-label">Estimated Arrival</div>
                    <div class="detail-value" style="font-weight: 600; color: #3b82f6;">${data.estimatedArrival}</div>
                  </div>
                  ` : ''}
                </div>
                
                ${data.status === "completed" ? `
                <div class="info-box">
                  <p class="text" style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #0D9488;">Rate Your Experience</p>
                  <p class="text" style="margin: 0; font-size: 13px; color: #115e59;">
                    We'd love to hear about your experience! Please take a moment to rate your service and help us improve.
                  </p>
                </div>
                ` : ''}
                
                <div style="text-align: center;">
                  <a href="https://clinlix.com/auth" class="button">View Booking Details</a>
                </div>
                
                <p class="text" style="font-size: 13px; color: #718096;">
                  You'll receive updates as your service progresses. Questions? Contact us anytime.
                </p>
              </div>
              
              <div class="footer">
                <p class="footer-text">
                  © 2025 Clinlix. Professional Cleaning Services.
                </p>
                <p class="footer-text" style="font-size: 12px; color: #a0aec0;">
                  Questions? Contact us at support@clinlix.com
                </p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return html;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: StatusUpdateRequest = await req.json();
    
    console.log(`Sending status update (${data.status}) notification to ${data.customerEmail}`);

    const html = getEmailTemplate(data);
    const statusContent = getStatusContent(data.status);

    const { error } = await resend.emails.send({
      from: 'Clinlix <support@clinlix.com>',
      to: [data.customerEmail],
      subject: `${statusContent.badge} - Booking #${data.bookingId.substring(0, 8).toUpperCase()}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log(`Status update notification sent successfully to ${data.customerEmail}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-provider-status-update function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
