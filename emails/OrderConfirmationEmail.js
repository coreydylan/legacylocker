const React = require('react');
const { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr, Link } = require('@react-email/components');

function OrderConfirmationEmail({
  purchaserName = 'Valued Customer',
  recipientName = 'Recipient',
  editionName = 'Signature Edition',
  shippingAddress = 'N/A',
  firstShipDate = 'TBD',
  editionType = 'signature',
  firstMonth = 'January',
}) {
  // Styles
  const main = { backgroundColor: '#f9f7f4', fontFamily: "'Source Sans Pro', 'Georgia', serif", color: '#333', lineHeight: '1.6' };
  const container = { maxWidth: '600px', margin: '0 auto', padding: '32px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' };
  const header = { textAlign: 'center', padding: '20px 0', borderBottom: '1px solid #e0ddd7', marginBottom: '30px' };
  const h1 = { fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: '28px', marginBottom: '8px', color: '#2C5530', fontWeight: 700 };
  const h2 = { fontFamily: "'Playfair Display', 'Georgia', serif", color: '#2C5530', fontSize: '20px', marginBottom: '8px', fontWeight: 700 };
  const p = { marginBottom: '20px', fontSize: '16px', lineHeight: '1.6' };
  const highlight = { fontWeight: 600, color: '#2C5530' };
  const hr = { border: 'none', height: '1px', backgroundColor: '#e0ddd7', margin: '24px 0' };
  const ul = { padding: 0, fontSize: '16px', margin: 0 };
  const li = { marginBottom: '8px', lineHeight: '1.4', padding: 0, margin: 0 };
  const link = { color: '#2C5530', textDecoration: 'none', borderBottom: '1px solid #2C5530' };
  const footer = { textAlign: 'center', marginTop: '40px', fontSize: '14px', color: '#999' };

  return (
    React.createElement(Html, null,
      React.createElement(Head, null),
      React.createElement(Preview, null, `Legacy Locker Order Confirmation for ${recipientName}`),
      React.createElement(Body, { style: main },
        React.createElement(Container, { style: container },
          React.createElement(Section, { style: header },
            // Could add logo here
            null
          ),
          React.createElement(Heading, { style: h1 }, "You're all set."),
          React.createElement(Text, { style: p },
            'Thanks for your order, ',
            React.createElement('strong', { style: highlight }, purchaserName),
            '.'
          ),
          React.createElement(Text, { style: p },
            "You've just gifted ",
            React.createElement('strong', { style: highlight }, recipientName),
            ' a year of stories through our ',
            React.createElement('strong', { style: highlight }, editionName),
            ' edition. Whether it\'s about cherished memories, cultural heritage, or something totally custom—we\'ll take it from here.'
          ),
          React.createElement(Hr, { style: hr }),
          React.createElement(Heading, { style: h2 }, '📦 Order Summary'),
          React.createElement(Section, { style: ul },
            React.createElement(Text, { style: li }, React.createElement('strong', null, 'Edition:'), ' ', editionName),
            React.createElement(Text, { style: li }, React.createElement('strong', null, 'Recipient:'), ' ', recipientName),
            React.createElement(Text, { style: li }, React.createElement('strong', null, 'Ship-to:'), ' ', shippingAddress),
            React.createElement(Text, { style: li }, React.createElement('strong', null, 'Cards will begin shipping:'), ' ', firstShipDate)
          ),
          React.createElement(Hr, { style: hr }),
          React.createElement(Heading, { style: h2 }, '📝 What happens next?'),
          React.createElement(Text, { style: p },
            editionType === 'signature'
              ? `We'll begin preparing your recipient's cards for printing, starting with ${firstMonth}. You'll receive an update when the first one ships.`
              : 'One of our team members will reach out in the next 48 business hours with a draft of your custom edition for review and approval.'
          ),
          React.createElement(Text, { style: p },
            'If you have any questions in the meantime, just reply to this email or reach us at ',
            React.createElement(Link, { href: 'mailto:corey@legacylocker.com', style: link }, 'corey@legacylocker.com'),
            '.'
          ),
          React.createElement(Text, { style: { ...p, marginTop: '32px' } }, 'With appreciation,', React.createElement('br', null), 'The Legacy Locker Team'),
          React.createElement(Section, { style: footer },
            React.createElement(Text, { style: { margin: 0 } }, 'Legacy Locker • A year of stories, one card at a time.')
          )
        )
      )
    )
  );
}

module.exports = OrderConfirmationEmail; 