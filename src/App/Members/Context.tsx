import React from "react";
import {QueryObserverResult, useQuery} from "react-query";
import api from "api";
import {MemberType} from "App/Members/Members";
import {useDispatch, useSelector} from "react-redux";
import {orderBy} from "lodash";
import {TYPES} from "actions";

const useFetchMembers = (members?: MemberType[]) => {
  const dispatch = useDispatch();
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
      dispatch({type: TYPES.FETCH_MEMBERS_REQUEST});

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
      return response.members.map(mapMembers);
    },
    enabled: members === undefined,
    onSuccess: (mmembers: MemberType[]) => {
      const orderedMembers = orderBy(mmembers, (member: any) => member.surname);
      dispatch({
        type: TYPES.FETCH_MEMBERS_SUCCESS,
        members: orderedMembers,
      });
    },
    onError: () => {
      dispatch({type: TYPES.FETCH_MEMBERS_FAILURE});
    },
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
