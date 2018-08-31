import React from 'react';
import Price from './../Price';

const isSet = property => ![undefined, null, 0].includes(property);
const smallButton = (button = {}) =>
  isSet(button.width) || isSet(button.height)
    ? { transform: 'scale(0.5)' }
    : {};
const buttonStyle = member => ({
  background: member.cosmetics.background,
  backgroundColor: member.cosmetics.color,
  ...(member.cosmetics.image
    ? { backgroundImage: `url(${member.cosmetics.image})` }
    : {}),
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '50% 50%',
  flexGrow: 1,
  ...smallButton(member.cosmetics.button)
});

const Member = ({ member, onClick, style = {} }) => (
  <button
    key={member.id}
    className="tile button"
    onClick={() => onClick(member)}
    style={buttonStyle(member)}
  >
    &nbsp;{member.cosmetics.nickname
      ? member.cosmetics.nickname
      : member.fullname}&nbsp;<br />
    {member.total_spent ? (
      <span style={{ margin: '1em 0' }}>
        {new Intl.NumberFormat('en-EN', {
          style: 'currency',
          currency: 'EUR'
        }).format(member.total_spent)}
      </span>
    ) : (
      ''
    )}
  </button>
);

export default Member;
