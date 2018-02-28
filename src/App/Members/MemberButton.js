import React from 'react';
import './Members.css';

const cosmetics = cosmetics => {
  const isPositive = number => Number.isInteger(number) && number > 0;

  const cosmeticSize =
    isPositive(cosmetics.button.width) && isPositive(cosmetics.button.height)
      ? {
          width: cosmetics.button.width,
          height: cosmetics.button.height,
          alignSelf: 'center',
          justifySelf: 'center'
        }
      : {};

  return {
    backgroundColor: cosmetics.color,
    backgroundImage: cosmetics.image ? `url(${cosmetics.image})` : undefined,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 50%',
    flexGrow: 1,
    margin: '.25em 0',
    ...cosmeticSize
  };
};

const MemberName = ({ member }) =>
  !member.cosmetics.nickname ? (
    <span>
      {member.firstName}
      <br /> {member.surname}
    </span>
  ) : (
    <span>{member.cosmetics.nickname}</span>
  );

const Member = ({ member, onClick, style = {} }) => (
  <button
    key={member.id}
    className="btn btn-outline-light"
    to="/products"
    style={{ ...cosmetics(member.cosmetics), ...style }}
    onClick={() => onClick(member)}
  >
    <MemberName member={member} />
  </button>
);

export default Member;
