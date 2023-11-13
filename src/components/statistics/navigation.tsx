import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavLink} from "react-router-dom";

type Props = {
  left: string;
  right: string;
  title: string;
};

export const StatisticsNavigation = ({left, right, title}: Props) => {
  return (
    <div className="d-flex justify-content-between py-2 flex-grow mx-auto gap-3">
      <NavLink to={left}>
        <FontAwesomeIcon icon={"chevron-circle-left"} size="lg" />
      </NavLink>
      {title}
      <NavLink to={right}>
        <FontAwesomeIcon icon={"chevron-circle-right"} size="lg" />
      </NavLink>
    </div>
  );
};
