import {useEffect, useMemo, useState} from "react";
import {queryOptions, useQuery, useSuspenseQuery} from "@tanstack/react-query";
import {chunk, orderBy} from "lodash";
import {MemberType} from "./Members";
import api from "./../../api";

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
      //await new Promise((resolve) => setTimeout(resolve, 6000));

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

      const members = response.members.map((lid) => ({
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
      }));

      return orderBy(members, (member: any) => member.surname);
    },
    staleTime: Infinity,
  });
};

const useMembersQuery = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [images, setImages] = useState<HTMLImageElement[]>([]);

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

  //const query = useSuspenseQuery(membersQueryOptions());
  const query = useQuery(membersQueryOptions());
  useEffect(() => {
    if (query.data) {
      preLoadImages(query.data);
    }
  }, [query.data]);
  return query;
};

export const useMembers = () => {
  const membersQuery = useMembersQuery();

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
