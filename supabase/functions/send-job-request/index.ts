import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface JobRequestNotification {
  providerEmail: string;
  providerName: string;
  bookingId: string;
  customerName: string;
  serviceDate: string;
  serviceTime: string;
  packageName: string;
  address: string;
  estimatedEarnings: string;
  currency: string;
  acceptUrl: string;
}

const getEmailTemplate = (data: JobRequestNotification, logoUrl: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>New Job Request - Clinlix</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); padding: 30px 20px; text-align: left; }
        .logo { max-width: 120px; height: auto; }
        .content { padding: 40px 20px; text-align: left; }
        .title { margin: 0 0 20px; font-size: 24px; font-weight: 700; color: #1a1a1a; text-align: left; }
        .text { margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4a5568; text-align: left; }
        .urgent-badge { background-color: #14B8A6; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 16px; }
        .job-details { background-color: #f7fafc; border-left: 4px solid #14B8A6; padding: 20px; margin: 24px 0; }
        .detail-row { margin: 12px 0; text-align: left; }
        .detail-label { font-weight: 600; color: #2d3748; font-size: 14px; }
        .detail-value { color: #4a5568; font-size: 14px; margin-top: 4px; }
        .earnings-section { background-color: #14B8A6; color: white; padding: 16px 20px; margin: 24px 0; border-radius: 8px; text-align: left; }
        .earnings-label { font-size: 14px; opacity: 0.9; }
        .earnings-amount { font-size: 28px; font-weight: 700; margin-top: 4px; }
        .button-container { padding: 20px 0; text-align: left; }
        .button { display: inline-block; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(20, 184, 166, 0.4); }
        .footer { background-color: #f7fafc; padding: 30px 20px; border-top: 1px solid #e2e8f0; text-align: left; }
        .footer-text { margin: 0 0 8px; font-size: 13px; color: #718096; text-align: left; }
        .warning-box { background-color: #f0fdfa; border-left: 4px solid #14B8A6; padding: 16px; border-radius: 6px; margin: 20px 0; text-align: left; }
        @media only screen and (max-width: 600px) {
          .content { padding: 30px 16px; }
          .header { padding: 24px 16px; }
          .title { font-size: 20px; }
          .earnings-amount { font-size: 24px; }
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
                <img src="${logoUrl}" alt="Clinlix" class="logo" />
              </div>
              
              <div class="content">
                <span class="urgent-badge">NEW JOB REQUEST</span>
                <h1 class="title">You Have a New Job Opportunity</h1>
                <p class="text">Hi ${data.providerName},</p>
                <p class="text">A customer has requested your cleaning services. Review the details below and accept the job to get started.</p>
                
                <div class="job-details">
                  <div class="detail-row">
                    <div class="detail-label">Job ID</div>
                    <div class="detail-value">#${data.bookingId.substring(0, 8).toUpperCase()}</div>
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">Customer</div>
                    <div class="detail-value">${data.customerName}</div>
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">Service Package</div>
                    <div class="detail-value">${data.packageName}</div>
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">Scheduled Date & Time</div>
                    <div class="detail-value">${data.serviceDate} at ${data.serviceTime}</div>
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">Service Location</div>
                    <div class="detail-value">${data.address}</div>
                  </div>
                </div>
                
                <div class="earnings-section">
                  <div class="earnings-label">Estimated Earnings</div>
                  <div class="earnings-amount">${data.currency} ${data.estimatedEarnings}</div>
                </div>
                
                <div class="button-container">
                  <a href="${data.acceptUrl}" class="button">View & Accept Job</a>
                </div>
                
                <div class="warning-box">
                  <p class="text" style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #0D9488;">Time Sensitive</p>
                  <p class="text" style="margin: 0; font-size: 13px; color: #115e59;">
                    This job request is available on a first-come, first-served basis. Accept quickly to secure this opportunity!
                  </p>
                </div>
                
                <p class="text" style="font-size: 13px; color: #718096;">
                  Not interested? You can decline this job through your dashboard. Remember, maintaining a high acceptance rate helps you get more job opportunities.
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
    const data: JobRequestNotification = await req.json();
    
    console.log(`Sending job request notification to ${data.providerEmail}`);
    
    const logoUrl = 'https://clinlix.com/images/clinlix-logo.png';

    const html = getEmailTemplate(data, logoUrl);

    const { error } = await resend.emails.send({
      from: 'Clinlix Jobs <support@clinlix.com>',
      to: [data.providerEmail],
      subject: `New Job Request - ${data.serviceDate}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log(`Job request notification sent successfully to ${data.providerEmail}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-job-request function:", error);
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
