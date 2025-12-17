export const CONTACT_MESSAGE_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <title>New Contact Message</title>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Open Sans', sans-serif; background:#f8fafc; margin:0; padding:0; }
    .container { max-width:500px; background:#fff; margin:40px auto; border-radius:12px; 
                 box-shadow:0 4px 6px rgba(0,0,0,0.05); overflow:hidden; }
    .header { background:linear-gradient(135deg,#4f46e5,#7c3aed); padding:25px; text-align:center; }
    .header h2 { color:#fff; margin:0; }
    .content { padding:30px; color:#1f2937; }
    .footer { padding:20px; text-align:center; background:#f1f5f9; color:#6b7280; font-size:12px; }
  </style>
</head>
<body>
  <div class="container">

    <div class="header">
      <h2>New Contact Form Message</h2>
    </div>

    <div class="content">
      <p><strong>Name:</strong> {{name}}</p>
      <p><strong>Email:</strong> {{email}}</p>
      <p><strong>Message:</strong><br/> {{message}}</p>

      <p style="margin-top:25px;">
        This message was sent from your portfolio contact form.
      </p>
    </div>

    <div class="footer">
      © 2025 Your Portfolio | All Rights Reserved
    </div>

  </div>
</body>
</html>
`;
