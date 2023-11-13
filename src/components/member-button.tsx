import {MemberType} from "../queries/members";

const smallButton = (button?: {width: number | null; height: number | null}) => {
  if (button === undefined) {
    return {};
  }

  return button.width && button.height ? {transform: "scale(0.5)"} : {};
};

const buttonStyle = (member: MemberType) => ({
  backgroundColor: member.cosmetics?.color ?? "",
  ...(member.cosmetics?.image ? {backgroundImage: `url(${member.cosmetics.image})`} : {}),
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "50% 50%",
  flexGrow: 1,
  ...smallButton(member.cosmetics?.button),
});

const Member = ({
  member,
  onClick,
}: {
  member: MemberType;
  onClick: (member: MemberType) => void;
}) => {
  return (
    <button
      key={member.id}
      className="tile button"
      onClick={() => {
        onClick(member);
      }}
      style={buttonStyle(member)}
      aria-label={member.fullname}
    >
      &nbsp;
      {member.cosmetics?.nickname ? member.cosmetics.nickname : member.fullname}
      &nbsp;
    </button>
  );
};
export default Member;
