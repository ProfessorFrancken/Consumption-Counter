import React from "react";
import {QueryObserverResult, useQuery} from "react-query";
import api from "api";
import {MemberType} from "App/Members/Members";
import {chunk, orderBy} from "lodash";

const useFetchMembers = (members?: MemberType[]) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [images, setImages] = React.useState<HTMLImageElement[]>([]);

  const preLoadImages = (members: MemberType[]) => {
    const images = members
      .filter((member) => member.cosmetics && member.cosmetics.image)
      .map((member) => {
        if (member.cosmetics && member.cosmetics.image) {
          let img = new Image();
          img.src = member?.cosmetics?.image;
          return img;
        }
        return null;
      })
      .filter((image): image is HTMLImageElement => image !== null);

    setImages(images);
  };

  const calculateAge = (lid: any) => {
    const birthdayString = lid.geboortedatum;
    if (birthdayString === null) {
      return 0;
    }
    const birthday = new Date(Date.parse(birthdayString));

    const date = new Date();
    const ageDifMs = date.getTime() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return useQuery<MemberType[]>({
    queryKey: ["members"],
    queryFn: async () => {
      const mapMembers = (lid: any) => ({
        id: parseInt(lid.id, 10),
        firstName: lid.voornaam,
        surname: lid.achternaam,

        fullname: [lid.voornaam, lid.tussenvoegsel, lid.achternaam]
          .filter((name) => ![undefined, ""].includes(name))
          .join(" "),

        age: calculateAge(lid),
        prominent: lid.prominent,

        latest_purchase_at: lid.latest_purchase_at
          ? new Date(lid.latest_purchase_at)
          : null,

        cosmetics: {
          color: lid.kleur,
          image: lid.afbeelding,
          nickname: lid.bijnaam,
          button: {
            width: lid.button_width,
            height: lid.button_height,
          },
        },
      });

      const response = await api.get("/members");
      const members = response.members.map(mapMembers);
      return orderBy(members, (member: any) => member.surname);
    },
    enabled: members === undefined,
    initialData: members,
    onSuccess: preLoadImages,
  });
};

type State = {
  membersQuery: QueryObserverResult<MemberType[]>;
  members: MemberType[];
};
const MembersContext = React.createContext<State | undefined>(undefined);
export const MembersProvider: React.FC<{members?: MemberType[]}> = ({
  members: defaultMembers,
  children,
  ...props
}) => {
  const membersQuery = useFetchMembers(defaultMembers);

  return (
    <MembersContext.Provider
      value={{
        membersQuery,
        members: defaultMembers ?? membersQuery.data ?? [],
        ...props,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = () => {
  const context = React.useContext(MembersContext);

  if (!context) {
    throw new Error(`useMembers must be used within a MembersContext`);
  }

  return context;
};

const MEMBERS_PER_RANGE = 6 * 5;
export const useGroupedSurnames = () => {
  const {members} = useMembers();

  return React.useMemo(() => {
    return chunk(members, MEMBERS_PER_RANGE).map((members, idx) => ({
      idx,
      members,
      surname_start: members[0].surname,
      surname_end: members[members.length - 1].surname,
    }));
  }, [members]);
};
