import React from "react";
const isSet = (property: any) => ![undefined, null, 0].includes(property);
const smallButton = (button = {}) =>
  isSet((button as any).width) || isSet((button as any).height)
    ? {transform: "scale(0.5)"}
    : {};
const buttonStyle = (member: any) => ({
  background: member.cosmetics.background,
  backgroundColor: member.cosmetics.color,
  ...(member.cosmetics.image ? {backgroundImage: `url(${member.cosmetics.image})`} : {}),
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "50% 50%",
  flexGrow: 1,
  ...smallButton(member.cosmetics.button),
});
const Member = ({member, onClick, style = {}}: any) => (
  <button
    key={member.id}
    className="tile button"
    onClick={() => onClick(member)}
    style={buttonStyle(member)}
  >
    &nbsp;
    {member.cosmetics.nickname ? member.cosmetics.nickname : member.fullname}
    &nbsp;
  </button>
);
export default Member;
