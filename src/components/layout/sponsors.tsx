import {queryOptions, useSuspenseQuery} from "@tanstack/react-query";
import {Suspense} from "react";
import sibrenImage from "./../../sibren-wobben.png";
import api from "./../../api";
import {useSelectMember} from "../orders-context";
import {useMembers} from "../../queries/members";

const sponsorsQueryOptions = queryOptions({
  queryKey: ["sponsors"],
  queryFn: async () => {
    const response = await api.get<{sponsors: {image: string; name: string}[]}>(
      "/sponsors"
    );

    return response.sponsors;
  },
});

const SponsorsList = () => {
  const sponsors = useSuspenseQuery(sponsorsQueryOptions);
  const selectMember = useSelectMember();
  const {members} = useMembers();
  const sibren = members.find((member) => {
    return member.id === 1911;
  });

  return (
    <>
      {sibren && (
        <li className="d-flex align-items-center mx-3">
          <img
            src={sibrenImage}
            alt={"Sibren Wobben sponsor"}
            className="h-100 py-3 img-fluid"
            style={{maxWidth: "200px"}}
            onClick={() => {
              selectMember(sibren);
            }}
          />
        </li>
      )}
      {sponsors.data.map(({name, image}, idx) => {
        return (
          <li className="d-flex align-items-center mx-3" key={idx}>
            <img
              src={image}
              alt={name}
              className="h-100 py-3 img-fluid"
              style={{maxWidth: "200px"}}
            />
          </li>
        );
      })}
    </>
  );
};

const Sponsors = () => {
  return (
    <ul
      className="company-logos list-unstyled my-0 flex-grow-0 d-flex overflow-hidden"
      aria-label="Partners sponsoring the consumption counter"
    >
      <Suspense>
        <SponsorsList />
      </Suspense>
    </ul>
  );
};

export default Sponsors;
