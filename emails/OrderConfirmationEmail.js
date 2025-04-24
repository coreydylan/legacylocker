const React = require('react');
const { Html, Head, Preview, Body, Text } = require('@react-email/components');

function OrderConfirmationEmail({
  purchaserName = 'Valued Customer',
  recipientName = 'Recipient',
  editionName = 'Signature Edition',
  shippingAddress = 'N/A',
  firstShipDate = 'TBD',
  editionType = 'signature',
  firstMonth = 'January',
}) {
  // Create a plain text version of the email
  const plainText = `
Legacy Locker Order Confirmation

You're all set!

Thanks for your order, ${purchaserName}.

You've just gifted ${recipientName} a year of stories through our ${editionName} edition. Whether it's about cherished memories, cultural heritage, or something totally custom—we'll take it from here.

ORDER SUMMARY:
Edition: ${editionName}
Recipient: ${recipientName}
Ship-to: ${shippingAddress}
Cards will begin shipping: ${firstShipDate}

WHAT HAPPENS NEXT?
${editionType === 'signature' 
  ? `We'll begin preparing your recipient's cards for printing, starting with ${firstMonth}. You'll receive an update when the first one ships.`
  : 'One of our team members will reach out in the next 48 business hours with a draft of your custom edition for review and approval.'}

If you have any questions in the meantime, just reply to this email or reach us at corey@legacylocker.com.

With appreciation,
The Legacy Locker Team

Legacy Locker • A year of stories, one card at a time.
`;

  return (
    React.createElement(Html, null,
      React.createElement(Head, null),
      React.createElement(Preview, null, `Legacy Locker Order Confirmation for ${recipientName}`),
      React.createElement(Body, null,
        React.createElement(Text, null, plainText)
      )
    )
  );
}

module.exports = OrderConfirmationEmail; 