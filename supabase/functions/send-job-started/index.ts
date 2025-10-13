import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface JobStartedRequest {
  customerEmail: string;
  customerName: string;
  bookingId: string;
  providerName: string;
  packageName: string;
  address: string;
  startTime: string;
}

const getEmailTemplate = (data: JobStartedRequest) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Service Started - Clinlix</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); padding: 30px 20px; text-align: left; }
        .logo { max-width: 120px; height: auto; }
        .content { padding: 40px 20px; text-align: left; }
        .title { margin: 0 0 20px; font-size: 24px; font-weight: 700; color: #1a1a1a; text-align: left; }
        .text { margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4a5568; text-align: left; }
        .active-badge { background-color: #14B8A6; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 16px; }
        .booking-details { background-color: #f7fafc; border-left: 4px solid #14B8A6; padding: 20px; margin: 24px 0; }
        .detail-row { margin: 12px 0; text-align: left; }
        .detail-label { font-weight: 600; color: #2d3748; font-size: 14px; }
        .detail-value { color: #4a5568; font-size: 14px; margin-top: 4px; }
        .info-box { background-color: #f0fdfa; padding: 16px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #14B8A6; }
        .footer { background-color: #f7fafc; padding: 30px 20px; border-top: 1px solid #e2e8f0; text-align: left; }
        .footer-text { margin: 0 0 8px; font-size: 13px; color: #718096; text-align: left; }
        @media only screen and (max-width: 600px) {
          .content { padding: 30px 16px; }
          .header { padding: 24px 16px; }
          .title { font-size: 20px; }
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
                <span class="active-badge">IN PROGRESS</span>
                <h1 class="title">Your Service Has Started</h1>
                <p class="text">Hi ${data.customerName},</p>
                <p class="text"><strong>${data.providerName}</strong> has arrived and started your cleaning service. Your space will be sparkling clean soon!</p>
                
                <div class="booking-details">
                  <div class="detail-row">
                    <div class="detail-label">Booking ID</div>
                    <div class="detail-value">#${data.bookingId.substring(0, 8).toUpperCase()}</div>
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">Service Package</div>
                    <div class="detail-value">${data.packageName}</div>
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">Started At</div>
                    <div class="detail-value">${data.startTime}</div>
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">Service Location</div>
                    <div class="detail-value">${data.address}</div>
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">Provider</div>
                    <div class="detail-value">${data.providerName}</div>
                  </div>
                </div>
                
                <div class="info-box">
                  <p class="text" style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #0D9488;">While We Work</p>
                  <p class="text" style="margin: 0; font-size: 13px; color: #115e59;">
                    • You'll receive a notification when the service is complete<br/>
                    • Feel free to review the work and provide feedback<br/>
                    • Any concerns? Contact us anytime at support@clinlix.com
                  </p>
                </div>
                
                <p class="text" style="font-size: 13px; color: #718096;">
                  Track your service progress through your Clinlix dashboard.
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
    const data: JobStartedRequest = await req.json();
    
    console.log(`Sending job started notification to ${data.customerEmail}`);

    const html = getEmailTemplate(data);

    const { error } = await resend.emails.send({
      from: 'Clinlix <support@clinlix.com>',
      to: [data.customerEmail],
      subject: `Service Started - ${data.providerName} is Now Cleaning`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log(`Job started notification sent successfully to ${data.customerEmail}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-job-started function:", error);
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
