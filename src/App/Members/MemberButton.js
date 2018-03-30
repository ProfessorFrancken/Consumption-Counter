import React from 'react';

const isSet = property => ![undefined, null, 0].includes(property);
const smallButton = (button = {}) =>
  isSet(button.width) || isSet(button.height)
    ? { transform: 'scale(0.5)' }
    : {};
const buttonStyle = member => ({
  backgroundColor: member.cosmetics.color,
  backgroundImage: member.cosmetics.image
    ? `url(${member.cosmetics.image})`
    : undefined,
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
    {member.cosmetics.nickname
      ? member.cosmetics.nickname
      : member.firstName + ' ' + member.surname}
  </button>
);

export default Member;
