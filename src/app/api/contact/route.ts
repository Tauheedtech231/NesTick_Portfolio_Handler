// import nodemailer from "nodemailer";

// export async function POST(req: Request) {
//   try {
//     const { name, email, subject, message } = await req.json();

//     if (!name || !email || !subject || !message) {
//       return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
//     }

//     // Create transporter using your env variables
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // tauheeddeveloper13@gmail.com
//         pass: process.env.EMAIL_PASS, // ramo reiv jlsy ogsg
//       },
//     });

//     // Send email to admin
//     await transporter.sendMail({
//       from: email,
//       to: process.env.EMAIL_USER, // admin receives it
//       subject: `New Contact Form Submission - ${subject}`,
//       html: `
//         <h2>New Contact Message</h2>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Subject:</strong> ${subject}</p>
//         <p><strong>Message:</strong> ${message}</p>
//       `,
//     });

//     return new Response(JSON.stringify({ success: true, message: "Email sent successfully!" }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Email sending error:", error);
//     return new Response(JSON.stringify({ error: "Email sending failed" }), { status: 500 });
//   }
// }
import nodemailer from "nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // sab origin allow
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  // Preflight request
  return new Response(null, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // tauheeddeveloper13@gmail.com
        pass: process.env.EMAIL_PASS, // ramo reiv jlsy ogsg
      },
    });

    // Send email
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission - ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully!" }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(JSON.stringify({ error: "Email sending failed" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
