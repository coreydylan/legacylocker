import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  // Img, // Using inline SVG for now
  Link,
  Preview,
  Section,
  Text,
  // Using Section/Text instead of Column/Row for simplicity here
} from '@react-email/components';
import * as React from 'react';

// Define the props interface based on the template variables
interface OrderConfirmationEmailProps {
  purchaserName: string;
  recipientName: string;
  editionName: string;
  shippingAddress: string;
  firstShipDate: string;
  editionType: 'signature' | 'custom'; // Based on the conditional logic
  firstMonth: string; // Only used if editionType is 'signature'
}

// Define inline styles based on the CSS provided
// Using object literals for styles
const main = {
  backgroundColor: '#f9f7f4',
  fontFamily: "'Source Sans Pro', 'Georgia', serif", // Note: Custom fonts might not render in all clients
  color: '#333',
  lineHeight: '1.6',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
};

const header = {
  textAlign: 'center' as const, // Use 'as const' for string literal types
  padding: '20px 0',
  borderBottom: '1px solid #e0ddd7',
  marginBottom: '30px',
};

const logo = {
  maxWidth: '180px',
  height: 'auto',
  margin: '0 auto',
};

const h1 = {
  fontFamily: "'Playfair Display', 'Georgia', serif",
  fontSize: '28px',
  marginBottom: '8px',
  color: '#2C5530',
  fontWeight: 700, // Added based on Playfair Display usage
};

const h2 = {
  fontFamily: "'Playfair Display', 'Georgia', serif",
  color: '#2C5530',
  fontSize: '20px',
  marginBottom: '8px',
  fontWeight: 700, // Added based on Playfair Display usage
};

const p = {
  marginBottom: '20px',
  fontSize: '16px',
  lineHeight: '1.6',
};

const highlight = {
  fontWeight: 600,
  color: '#2C5530',
};

const hr = {
  border: 'none',
  height: '1px',
  backgroundColor: '#e0ddd7',
  margin: '24px 0',
};

const ul = {
  // listStyle: 'none', // Default for <Section> and <Text>
  padding: 0,
  fontSize: '16px',
  margin: 0, // Resetting default margins
};

const li = {
  marginBottom: '8px',
  lineHeight: '1.4', // Adjust line height for list items
  padding: 0, // Resetting default padding
  margin: 0, // Resetting default margins
};

const link = {
  color: '#2C5530',
  textDecoration: 'none',
  borderBottom: '1px solid #2C5530',
};

// Note: Hover styles are not reliably supported in email clients and are omitted.

const footer = {
  textAlign: 'center' as const,
  marginTop: '40px',
  fontSize: '14px',
  color: '#999',
};


export const OrderConfirmationEmail = ({
  purchaserName = 'Valued Customer', // Add defaults for preview/testing
  recipientName = 'Recipient Name',
  editionName = 'Signature Edition',
  shippingAddress = '123 Main St, Anytown USA',
  firstShipDate = 'Next Month',
  editionType = 'signature',
  firstMonth = 'January',
}: OrderConfirmationEmailProps) => {
  const previewText = `Legacy Locker Order Confirmation for ${recipientName}`;

  // Generated Plain Text Fallback (React Email can auto-generate this too)
  const plainText = `
Legacy Locker Order Confirmation

You're all set.

Thanks for your order, ${purchaserName}.
You've just gifted ${recipientName} a year of stories through our ${editionName} edition. Whether it's about cherished memories, cultural heritage, or something totally custom—we'll take it from here.

Order Summary:
* Edition: ${editionName}
* Recipient: ${recipientName}
* Ship-to: ${shippingAddress}
* Cards will begin shipping: ${firstShipDate}

What happens next?
${
  editionType === 'signature'
    ? `We'll begin preparing your recipient's cards for printing, starting with ${firstMonth}. You'll receive an update when the first one ships.`
    : `One of our team members will reach out in the next 48 business hours with a draft of your custom edition for review and approval.`
}

If you have any questions in the meantime, just reply to this email or reach us at corey@legacylocker.com.

With appreciation,
The Legacy Locker Team

Legacy Locker • A year of stories, one card at a time.
`;

  return (
    <Html>
      <Head>
         {/* Google Fonts link - Client support varies. Font stacks are safer. */}
         {/* <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@300;400;600&display=swap');`}</style> */}
         {/* Commenting out @import as it's poorly supported. Inline styles handle the font-family. */}
      </Head>
      <Preview>{previewText}</Preview>
      {/* You can uncomment this if you prefer explicit PlainText over auto-generation */}
      {/* <PlainText>{plainText}</PlainText> */}
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            {/* Inline SVG Logo */}
             <svg style={logo} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1000" width="180" height="94">
              <path fill="#2C5530" d="M330.86,438.53v-136.47h-48.62v205.1l4.77,3.81,62.91-27.64v-6.67c-11.92-5.24-19.06-10.01-19.06-38.13Z"/>
              <path fill="#2C5530" d="M282.25,162.29v151.08h48.62V93.66l-4.77-3.81-62.91,27.64v6.67c11.92,5.24,19.06,10.01,19.06,38.13Z"/>
              <path fill="#2C5530" d="M380.9,365.33c0-81.03,63.39-131.55,125.35-131.55s98.66,44.33,98.66,85.79h-180.64l-.95,15.25c0,62.44,38.13,106.76,98.66,106.76,35.27,0,62.44-15.25,82.46-37.65l4.29,4.77c-21.92,33.36-59.58,71.49-114.87,71.49s-112.96-37.65-112.96-114.87ZM556.78,312.9c-6.2-39.08-32.41-70.06-65.3-70.54-40.51-.48-61.01,33.36-66.73,70.54h132.03Z"/>
              <path fill="#2C5530" d="M613.97,549.79c0-25.74,21.45-50.52,58.62-72.92-20.02-5.72-31.93-16.68-31.93-36.7,0-17.64,12.39-30.5,38.13-45.76-24.78-11.91-44.33-33.36-44.33-69.59,0-50.04,45.28-91.03,97.23-91.03,11.92,0,23.83,1.43,34.79,4.29,6.67-10.01,15.25-19.07,25.26-25.74,15.25-10.96,31.46-17.16,51.48-17.16,14.78,0,27.64,3.81,27.64,12.87,0,8.58-10.01,29.07-30.03,29.07-11.44,0-25.74-4.29-52.91-13.35-4.77,3.81-9.53,9.53-14.3,16.68,30.5,10.01,54.34,33.36,54.34,74.35,0,53.38-57.2,90.56-96.28,90.56-14.78,0-31.46-2.38-46.23-8.1-8.1,5.24-13.82,10.01-13.82,18.11,0,9.06,6.67,18.59,50.52,20.97l63.87,3.81c49.09,2.86,72.92,11.92,72.92,45.76,0,51.95-81.98,121.54-169.68,121.54-29.07,0-75.31-12.87-75.31-57.67ZM723.12,578.86c66.73,0,112.96-33.36,112.96-66.73,0-15.25-10.01-24.31-47.66-26.21l-76.74-3.81c-11.44-.48-21.92-1.91-30.98-3.34-21.45,15.25-27.64,31.93-27.64,47.66,0,38.13,32.89,52.43,70.06,52.43ZM784.13,341.98c0-42.42-25.26-105.33-68.16-101.04-28.6,3.34-37.18,29.07-37.18,57.67,0,39.08,19.07,98.66,62.91,98.66,32.41,0,42.42-27.17,42.42-55.29Z"/>
              <path fill="#2C5530" d="M1113.95,365.33c0-80.07,61.96-131.55,128.69-131.55,51,0,85.79,13.82,85.79,27.17,0,14.77-18.11,30.98-32.41,30.98-13.35,0-34.79-14.78-71.49-50.05-41.47,6.2-68.16,47.19-68.16,92.94,0,62.44,38.13,106.76,98.66,106.76,35.27,0,62.44-15.25,82.46-37.65l4.29,4.77c-21.92,33.36-59.58,71.49-114.87,71.49-58.62,0-112.96-40.99-112.96-114.87Z"/>
              <path fill="#2C5530" d="M1333.2,552.17c0-9.06,12.87-30.03,35.27-30.03,13.82,0,40.04,4.29,64.82,8.58,11.44-12.39,22.88-30.98,33.36-52.91l-80.07-184.93c-13.35-31.93-26.21-43.85-37.18-49.09v-6.67h84.36v6.67c-15.73,5.24-8.58,17.16,5.24,48.62l54.34,123.92,53.38-123.45c13.35-31.93,10.96-45.28-5.24-49.09v-6.67h54.33v6.67c-14.3,5.24-27.64,17.16-41.47,48.62l-72.92,168.73c-36.22,83.41-69.59,105.33-113.44,106.29-19.54.48-34.79-5.72-34.79-15.25Z"/>
              <path fill="#2C5530" d="M329.55,875.1c15.73-5.24,19.06-19.54,19.06-53.86v-252.61c0-28.12-7.15-32.89-19.06-38.13v-6.67l62.91-27.64,4.77,3.81v321.25c0,34.32,3.34,48.62,19.06,53.86v6.67h-86.75v-6.67Z"/>
              <path fill="#2C5530" d="M447.27,768.81c0-77.21,61.96-128.69,127.26-128.69,59.1,0,126.78,34.79,126.78,118.68s-70.54,127.73-126.78,127.73c-61.96,0-127.26-36.7-127.26-117.73ZM653.17,795.03c0-60.53-41.47-151.57-102.95-145.37-41.47,4.29-55.29,42.42-55.29,83.41,0,56.24,33.36,142.99,96.28,142.99,46.71,0,61.96-40.51,61.96-81.03Z"/>
              <path fill="#2C5530" d="M730.87,771.68c0-80.07,61.96-131.55,128.69-131.55,51,0,85.79,13.82,85.79,27.17,0,14.77-18.11,30.98-32.41,30.98-13.35,0-34.79-14.77-71.49-50.05-41.47,6.2-68.16,47.19-68.16,92.94,0,62.44,38.13,106.76,98.66,106.76,35.27,0,62.44-15.25,82.46-37.65l4.29,4.77c-21.92,33.36-59.58,71.49-114.87,71.49-58.62,0-112.96-40.99-112.96-114.87Z"/>
              <path fill="#2C5530" d="M972.52,875.1c15.73-5.24,19.06-19.54,19.06-53.86v-252.61c0-28.12-7.15-32.89-19.06-38.13v-6.67l62.91-27.64,4.77,3.81v274.06l74.83-74.35c30.5-30.5,30.03-48.62,20.49-51.95v-4.29h60.53v6.67c-15.25,4.77-33.84,11.92-58.15,36.22l-30.5,30.5,56.72,102.48c18.59,33.36,33.36,55.76,56.24,55.76v6.67h-38.13c-23.35,0-45.28-14.3-68.16-57.19l-39.56-75.31-34.32,34.32v37.65c0,34.32,3.34,48.62,19.06,53.86v6.67h-86.75v-6.67Z"/>
              <path fill="#2C5530" d="M1211.31,771.68c0-81.03,63.39-131.55,125.35-131.55s98.66,44.33,98.66,85.79h-180.64l-.95,15.25c0,62.44,38.13,106.76,98.66,106.76,35.27,0,62.44-15.25,82.46-37.65l4.29,4.77c-21.92,33.36-59.58,71.49-114.87,71.49s-112.96-37.65-112.96-114.87ZM1387.18,719.25c-6.2-39.08-32.41-70.06-65.3-70.54-40.51-.48-61.01,33.36-66.73,70.54h132.03Z"/>
              <path fill="#2C5530" d="M1464.4,875.1c15.73-5.24,19.07-19.54,19.07-53.86v-109.62c0-28.12-7.15-32.89-19.07-38.13v-6.67l62.91-27.65,4.77,3.81v57.67c7.15-16.68,19.54-31.46,34.79-41.94,17.64-12.39,35.75-18.59,58.62-18.59,16.21,0,30.5,4.29,30.5,14.3s-10.49,30.98-32.41,30.98c-13.35,0-31.46-4.77-61.96-14.3-11.92,10.01-28.12,31.46-29.55,55.29v94.85c0,34.32,3.34,48.62,19.07,53.86v6.67h-86.75v-6.67Z"/>
              <path fill="#2C5530" d="M1103.8,445.84c-2.38.63-6.97-.71-13.53-2.72-8.2-2.51-12.6-8.3-13.93-10.2-1.41-2.51-2.99-5.92-4.1-10.14-.82-3.13-1.19-5.97-1.33-8.32v-91.99c0-58.15-27.17-89.13-84.84-89.13-43.37,0-80.07,21.92-106.76,54.81l4.77,4.29c24.31-29.07,50.52-40.51,77.21-40.51,35.27,0,61.01,18.11,61.96,65.3l-52.91,15.25c-59.1,16.68-109.15,35.75-109.15,84.84,0,40.04,29.55,62.44,64.82,62.44,49.57,0,83.89-47.19,97.23-102.47v78.64c0,6.24,1.7,11.03,4.96,14.24,1.74,1.68,4.43,3.78,8.14,5.14,10.07,3.7,19.32-1.1,21.15-2.09l51.15-22.53-4.85-4.85ZM1023.25,336.28c-.48,42.9-26.69,108.67-73.4,108.67-21.92,0-44.33-12.87-44.33-44.33,0-39.56,44.33-55.77,66.73-61.96l51-14.78v12.39Z"/>
            </svg>
          </Section>

          <Heading style={h1}>You're all set.</Heading>
          <Text style={p}>
            Thanks for your order, <strong style={highlight}>{purchaserName}</strong>.
          </Text>
          <Text style={p}>
            You've just gifted <strong style={highlight}>{recipientName}</strong> a year of stories through our <strong style={highlight}>{editionName}</strong> edition.
            Whether it's about cherished memories, cultural heritage, or something totally custom—we'll take it from here.
          </Text>

          <Hr style={hr} />

          <Heading style={h2}>📦 Order Summary</Heading>
          {/* Using a Section with Text elements instead of ul/li for better client compatibility */}
          <Section style={ul}>
             <Text style={li}><strong>Edition:</strong> {editionName}</Text>
             <Text style={li}><strong>Recipient:</strong> {recipientName}</Text>
             <Text style={li}><strong>Ship-to:</strong> {shippingAddress}</Text>
             <Text style={li}><strong>Cards will begin shipping:</strong> {firstShipDate}</Text>
          </Section>

          <Hr style={hr} />

          <Heading style={h2}>📝 What happens next?</Heading>
          <Text style={p}>
            {editionType === 'signature' ? (
              <>
                We'll begin preparing your recipient's cards for printing, starting with {firstMonth}. You'll receive an update when the first one ships.
              </>
            ) : (
              <>
                One of our team members will reach out in the next 48 business hours with a draft of your custom edition for review and approval.
              </>
            )}
          </Text>
          <Text style={p}>
            If you have any questions in the meantime, just reply to this email or reach us at{' '}
            <Link href="mailto:corey@legacylocker.com" style={link}>
              corey@legacylocker.com
            </Link>
            .
          </Text>

          <Text style={{ ...p, marginTop: '32px' }}>
            With appreciation,<br/>The Legacy Locker Team
          </Text>

          <Section style={footer}>
            <Text style={{ margin: 0 }}>Legacy Locker • A year of stories, one card at a time.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Default export for easy import
export default OrderConfirmationEmail;

// Add a simple example export for previewing (optional but helpful)
export const PreviewProps: OrderConfirmationEmailProps = {
  purchaserName: 'Corey Dylan',
  recipientName: 'Jane Doe',
  editionName: 'Custom Heritage Edition',
  shippingAddress: '456 Memory Lane, Storyville, TX 75001',
  firstShipDate: 'August 1st, 2024',
  editionType: 'custom',
  firstMonth: 'August', // Not used for custom, but provided for interface completeness
}; 