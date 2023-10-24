import {queryOptions, useQuery} from "@tanstack/react-query";
import {chunk, orderBy} from "lodash";
import {useEffect, useMemo, useState} from "react";
import api from "./../api";

export type MemberType = {
  id: number;
  firstName: string;
  surname: string;
  fullname: string;
  latest_purchase_at: null | Date;
  age: number;

  prominent: null | number;
  cosmetics:
    | undefined
    | {
        color: string | null;
        image: string | null;
        nickname: string | null;
        button: {
          width: number | null;
          height: number | null;
        };
      };
};

const calculateAge = (lid: {geboortedatum: string}) => {
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

export const membersQueryOptions = () => {
  return queryOptions({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await api.get<{
        members: Array<{
          id: number;
          voornaam: string;
          initialen: string;
          tussenvoegsel: string;
          achternaam: string;
          geboortedatum: string; // yyyy-mm-dd
          prominent: number | null;
          kleur: string | null;
          afbeelding: string | null;
          bijnaam: string | null;
          button_width: number | null;
          button_height: number | null;
          latest_purchase_at: number | null;
        }>;
      }>("/members");

      const members = response.members.map(
        (lid): MemberType => ({
          id: parseInt(lid.id as unknown as string, 10),
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
        })
      );

      return orderBy(members, (member: any) => member.surname);
    },
    staleTime: Infinity,
  });
};

export const useMembers = () => {
  const membersQuery = useQuery(membersQueryOptions());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  useEffect(() => {
    if (!membersQuery.data) {
      return;
    }

    const members = membersQuery.data;
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
  }, [membersQuery.data]);

  return {membersQuery, members: membersQuery.data ?? []};
};

const MEMBERS_PER_RANGE = 6 * 5;
export const useGroupedSurnames = () => {
  const {members} = useMembers();

  return useMemo(() => {
    return chunk(members, MEMBERS_PER_RANGE).map((members, idx) => ({
      idx,
      members,
      surname_start: members[0].surname,
      surname_end: members[members.length - 1].surname,
    }));
  }, [members]);
};
