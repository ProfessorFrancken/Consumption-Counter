import React from 'react';

const Member = ({ member, onClick, style = {} }) => (
  <div
    key={member.id}
    className="tile button"
    onClick={() => onClick(member)}
    style={{
      backgroundColor: member.cosmetics.color,
      backgroundImage: member.cosmetics.image
        ? `url(${member.cosmetics.image})`
        : undefined,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 50%',
      flexGrow: 1
    }}
  >
    {member.nickname
      ? member.nickname
      : member.firstName + ' ' + member.surname}
  </div>
);

export default Member;
