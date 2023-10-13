import {useQuery} from "@tanstack/react-query";
import api from "./../api";

const Sponsors = () => {
  const sponsors = useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      const response = await api.get<{sponsors: {image: string; name: string}[]}>(
        "/sponsors"
      );

      return response.sponsors;
    },
  });

  return (
    <ul
      className="company-logos list-unstyled my-0 flex-grow-0 d-flex overflow-hidden"
      aria-label="Partners sponsoring the consumption counter"
    >
      {sponsors.data?.map(({name, image}, idx) => {
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
    </ul>
  );
};

export default Sponsors;
