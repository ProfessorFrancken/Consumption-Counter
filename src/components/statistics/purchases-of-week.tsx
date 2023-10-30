import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Statistic} from "queries/statistics";
import {WeeklyPurchasesAsBarGraph} from "./bar-example";

type Purchases = Omit<Statistic, "date"> & {
  date: Date;
  beer: number;
  soda: number;
  food: number;
  total: number;
};

const PurchasesOfWeek = ({
  purchases,
  today,
  icon,
  type,
}: {
  purchases: Purchases[];
  today: Purchases;
  icon: IconProp;
  type: "beer" | "soda" | "food" | "total";
}) => {
  return (
    <div className="p-0 bg-dark text-white position-relative" style={{height: "150px"}}>
      <div
        className="position-absolute text-right"
        style={{
          top: "1.0em",
          right: "1.0em",
          zIndex: 100,
        }}
      >
        <h4 className="mb-1" style={{color: "#a4afb9"}}>
          {purchases.reduce(
            (total: number, purchases: Purchases) => total + purchases[type],
            0
          )}
          &nbsp;
          <FontAwesomeIcon icon={icon} size="1x" className="text-muted ms-1" />
        </h4>
        <small className="text-uppercase" style={{color: "#a4afb9"}}>
          {today[type]} today
        </small>
      </div>
      <div className="p-2 pt-3 h-100 w-100">
        <WeeklyPurchasesAsBarGraph purchases={purchases} type={type} />
      </div>
    </div>
  );
};

export default PurchasesOfWeek;
