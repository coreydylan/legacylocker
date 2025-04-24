// File: api/send-resume-email.js
const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, sessionId, recipientFirstName, purchaserName, editionTitle, editionType } = req.body

  if (!email || !sessionId) {
    return res.status(400).json({ error: 'Missing email or sessionId' })
  }

  const resumeLink = `https://legacylockerco.com/?session_id=${sessionId}`

  // Format the edition name based on type
  const formattedEditionName = editionType 
    ? `${editionType.charAt(0).toUpperCase() + editionType.slice(1)} Edition`
    : 'Legacy Locker';

  try {
    const { error } = await resend.emails.send({
      from: 'Legacy Locker <corey@legacylockerco.com>',
      to: email,
      subject: 'Return to Your Legacy Locker Session',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legacy Locker</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@300;400;600&display=swap');
        
        body, html {
            margin: 0;
            padding: 0;
            font-family: 'Source Sans Pro', sans-serif;
            color: #333;
            line-height: 1.6;
            background-color: #f9f7f4;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #e0ddd7;
            margin-bottom: 30px;
        }
        
        .logo {
            max-width: 180px;
            height: auto;
            margin: 0 auto;
        }
        
        .content {
            padding: 0 30px;
        }
        
        h2 {
            font-family: 'Playfair Display', serif;
            color: #2C5530;
            font-size: 22px;
            margin-top: 0;
        }
        
        p {
            margin-bottom: 20px;
            font-size: 16px;
        }
        
        .highlight {
            font-weight: 600;
            color: #2C5530;
        }
        
        .btn {
            display: block;
            width: 100%;
            max-width: 280px;
            margin: 30px auto;
            padding: 14px 20px;
            background-color: #2C5530;
            color: white;
            text-align: center;
            text-decoration: none;
            font-weight: 600;
            border-radius: 6px;
            transition: background-color 0.3s;
            font-size: 16px;
        }
        
        .btn:hover {
            background-color: #203f25;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0ddd7;
            text-align: center;
            font-size: 14px;
            color: #8a8070;
        }
        
        .footer p {
            margin: 5px 0;
        }
        
        .icon {
            width: 60px;
            height: auto;
            margin-bottom: 15px;
        }
        
        @media only screen and (max-width: 480px) {
            .container {
                padding: 15px;
            }
            
            .content {
                padding: 0 15px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            h2 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1000" width="180" height="94">
  <path fill="#000" d="M330.86,438.53v-136.47h-48.62v205.1l4.77,3.81,62.91-27.64v-6.67c-11.92-5.24-19.06-10.01-19.06-38.13Z"/>
  <path fill="#000" d="M282.25,162.29v151.08h48.62V93.66l-4.77-3.81-62.91,27.64v6.67c11.92,5.24,19.06,10.01,19.06,38.13Z"/>
  <path fill="#000" d="M380.9,365.33c0-81.03,63.39-131.55,125.35-131.55s98.66,44.33,98.66,85.79h-180.64l-.95,15.25c0,62.44,38.13,106.76,98.66,106.76,35.27,0,62.44-15.25,82.46-37.65l4.29,4.77c-21.92,33.36-59.58,71.49-114.87,71.49s-112.96-37.65-112.96-114.87ZM556.78,312.9c-6.2-39.08-32.41-70.06-65.3-70.54-40.51-.48-61.01,33.36-66.73,70.54h132.03Z"/>
  <path fill="#000" d="M613.97,549.79c0-25.74,21.45-50.52,58.62-72.92-20.02-5.72-31.93-16.68-31.93-36.7,0-17.64,12.39-30.5,38.13-45.76-24.78-11.91-44.33-33.36-44.33-69.59,0-50.04,45.28-91.03,97.23-91.03,11.92,0,23.83,1.43,34.79,4.29,6.67-10.01,15.25-19.07,25.26-25.74,15.25-10.96,31.46-17.16,51.48-17.16,14.78,0,27.64,3.81,27.64,12.87,0,8.58-10.01,29.07-30.03,29.07-11.44,0-25.74-4.29-52.91-13.35-4.77,3.81-9.53,9.53-14.3,16.68,30.5,10.01,54.34,33.36,54.34,74.35,0,53.38-57.2,90.56-96.28,90.56-14.78,0-31.46-2.38-46.23-8.1-8.1,5.24-13.82,10.01-13.82,18.11,0,9.06,6.67,18.59,50.52,20.97l63.87,3.81c49.09,2.86,72.92,11.92,72.92,45.76,0,51.95-81.98,121.54-169.68,121.54-29.07,0-75.31-12.87-75.31-57.67ZM723.12,578.86c66.73,0,112.96-33.36,112.96-66.73,0-15.25-10.01-24.31-47.66-26.21l-76.74-3.81c-11.44-.48-21.92-1.91-30.98-3.34-21.45,15.25-27.64,31.93-27.64,47.66,0,38.13,32.89,52.43,70.06,52.43ZM784.13,341.98c0-42.42-25.26-105.33-68.16-101.04-28.6,3.34-37.18,29.07-37.18,57.67,0,39.08,19.07,98.66,62.91,98.66,32.41,0,42.42-27.17,42.42-55.29Z"/>
  <path fill="#000" d="M1113.95,365.33c0-80.07,61.96-131.55,128.69-131.55,51,0,85.79,13.82,85.79,27.17,0,14.77-18.11,30.98-32.41,30.98-13.35,0-34.79-14.78-71.49-50.05-41.47,6.2-68.16,47.19-68.16,92.94,0,62.44,38.13,106.76,98.66,106.76,35.27,0,62.44-15.25,82.46-37.65l4.29,4.77c-21.92,33.36-59.58,71.49-114.87,71.49-58.62,0-112.96-40.99-112.96-114.87Z"/>
  <path fill="#000" d="M1333.2,552.17c0-9.06,12.87-30.03,35.27-30.03,13.82,0,40.04,4.29,64.82,8.58,11.44-12.39,22.88-30.98,33.36-52.91l-80.07-184.93c-13.35-31.93-26.21-43.85-37.18-49.09v-6.67h84.36v6.67c-15.73,5.24-8.58,17.16,5.24,48.62l54.34,123.92,53.38-123.45c13.35-31.93,10.96-45.28-5.24-49.09v-6.67h54.33v6.67c-14.3,5.24-27.64,17.16-41.47,48.62l-72.92,168.73c-36.22,83.41-69.59,105.33-113.44,106.29-19.54.48-34.79-5.72-34.79-15.25Z"/>
  <path fill="#000" d="M329.55,875.1c15.73-5.24,19.06-19.54,19.06-53.86v-252.61c0-28.12-7.15-32.89-19.06-38.13v-6.67l62.91-27.64,4.77,3.81v321.25c0,34.32,3.34,48.62,19.06,53.86v6.67h-86.75v-6.67Z"/>
  <path fill="#000" d="M447.27,768.81c0-77.21,61.96-128.69,127.26-128.69,59.1,0,126.78,34.79,126.78,118.68s-70.54,127.73-126.78,127.73c-61.96,0-127.26-36.7-127.26-117.73ZM653.17,795.03c0-60.53-41.47-151.57-102.95-145.37-41.47,4.29-55.29,42.42-55.29,83.41,0,56.24,33.36,142.99,96.28,142.99,46.71,0,61.96-40.51,61.96-81.03Z"/>
  <path fill="#000" d="M730.87,771.68c0-80.07,61.96-131.55,128.69-131.55,51,0,85.79,13.82,85.79,27.17,0,14.77-18.11,30.98-32.41,30.98-13.35,0-34.79-14.77-71.49-50.05-41.47,6.2-68.16,47.19-68.16,92.94,0,62.44,38.13,106.76,98.66,106.76,35.27,0,62.44-15.25,82.46-37.65l4.29,4.77c-21.92,33.36-59.58,71.49-114.87,71.49-58.62,0-112.96-40.99-112.96-114.87Z"/>
  <path fill="#000" d="M972.52,875.1c15.73-5.24,19.06-19.54,19.06-53.86v-252.61c0-28.12-7.15-32.89-19.06-38.13v-6.67l62.91-27.64,4.77,3.81v274.06l74.83-74.35c30.5-30.5,30.03-48.62,20.49-51.95v-4.29h60.53v6.67c-15.25,4.77-33.84,11.92-58.15,36.22l-30.5,30.5,56.72,102.48c18.59,33.36,33.36,55.76,56.24,55.76v6.67h-38.13c-23.35,0-45.28-14.3-68.16-57.19l-39.56-75.31-34.32,34.32v37.65c0,34.32,3.34,48.62,19.06,53.86v6.67h-86.75v-6.67Z"/>
  <path fill="#000" d="M1211.31,771.68c0-81.03,63.39-131.55,125.35-131.55s98.66,44.33,98.66,85.79h-180.64l-.95,15.25c0,62.44,38.13,106.76,98.66,106.76,35.27,0,62.44-15.25,82.46-37.65l4.29,4.77c-21.92,33.36-59.58,71.49-114.87,71.49s-112.96-37.65-112.96-114.87ZM1387.18,719.25c-6.2-39.08-32.41-70.06-65.3-70.54-40.51-.48-61.01,33.36-66.73,70.54h132.03Z"/>
  <path fill="#000" d="M1464.4,875.1c15.73-5.24,19.07-19.54,19.07-53.86v-109.62c0-28.12-7.15-32.89-19.07-38.13v-6.67l62.91-27.65,4.77,3.81v57.67c7.15-16.68,19.54-31.46,34.79-41.94,17.64-12.39,35.75-18.59,58.62-18.59,16.21,0,30.5,4.29,30.5,14.3s-10.49,30.98-32.41,30.98c-13.35,0-31.46-4.77-61.96-14.3-11.92,10.01-28.12,31.46-29.55,55.29v94.85c0,34.32,3.34,48.62,19.07,53.86v6.67h-86.75v-6.67Z"/>
  <path fill="#000" d="M1103.8,445.84c-2.38.63-6.97-.71-13.53-2.72-8.2-2.51-12.6-8.3-13.93-10.2-1.41-2.51-2.99-5.92-4.1-10.14-.82-3.13-1.19-5.97-1.33-8.32v-91.99c0-58.15-27.17-89.13-84.84-89.13-43.37,0-80.07,21.92-106.76,54.81l4.77,4.29c24.31-29.07,50.52-40.51,77.21-40.51,35.27,0,61.01,18.11,61.96,65.3l-52.91,15.25c-59.1,16.68-109.15,35.75-109.15,84.84,0,40.04,29.55,62.44,64.82,62.44,49.57,0,83.89-47.19,97.23-102.47v78.64c0,6.24,1.7,11.03,4.96,14.24,1.74,1.68,4.43,3.78,8.14,5.14,10.07,3.7,19.32-1.1,21.15-2.09l51.15-22.53-4.85-4.85ZM1023.25,336.28c-.48,42.9-26.69,108.67-73.4,108.67-21.92,0-44.33-12.87-44.33-44.33,0-39.56,44.33-55.77,66.73-61.96l51-14.78v12.39Z"/>
            </svg>
        </div>
        
        <div class="content">
            <h2>Continue crafting your gift</h2>
            
            <p>Hi <span class="highlight">${purchaserName ? purchaserName : 'there'}</span>,</p>
            
            <p>You recently began setting up a Legacy Locker gift ${recipientFirstName ? `for ${recipientFirstName}` : ''} — a one-year subscription to the <span class="highlight">${formattedEditionName}</span> series.</p>
            
            <p>This edition is a tribute to the stories that shape us — delivered one card at a time. You've already made a meaningful start.</p>
            
            <p>When you're ready, just click below to pick up where you left off:</p>
            
            <a href="${resumeLink}" class="btn">Resume My Gift Setup</a>
            
            <p>If you didn't start this setup, you can safely ignore this message. Your link will expire in 30 days.</p>
        </div>
        
        <div class="footer">
            <p>Legacy Locker · A story in your mailbox every month</p>
        </div>
    </div>
</body>
</html>`,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Unexpected error:', err)
    return res.status(500).json({ error: 'Unexpected error' })
  }
}