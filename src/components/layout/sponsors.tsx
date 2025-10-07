import {queryOptions, useSuspenseQuery} from "@tanstack/react-query";
import {Suspense} from "react";
import ZoliImage from "./../../zoli.png";
import CommitteeImage from "./../../winner_committee.png";
import {useCommittees} from "queries/committees";
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
  const {committees, selectCommittee} = useCommittees();
  const zoli = members.find((member) => {
    return member.id === 2940;
  });
  const bestCommittee = committees.find((committee) => committee.id === 419);

  return (
    <>
      {zoli && (
        <li className="d-flex align-items-center mx-3">
          <img
            src={ZoliImage}
            alt={"Zoltán Hermann sponsor"}
            className="h-100 py-3 img-fluid"
            style={{maxWidth: "200px"}}
            onClick={() => {
              selectMember(zoli);
            }}
          />
        </li>
      )}
      {bestCommittee && (
        <li className="d-flex align-items-center mx-3">
          <img
            src={CommitteeImage}
            alt={"Winner committee competition"}
            className="h-100 py-3 img-fluid"
            style={{maxWidth: "300px"}}
            onClick={() => {
              selectCommittee(bestCommittee);
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
