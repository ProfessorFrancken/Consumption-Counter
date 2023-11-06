import {groupBy, map, take} from "lodash";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {OrderedOrder} from "../../components/orders/queued-orders-context";
import {Product} from "../../components/orders-context";
import {Activity, useActivities} from "../../queries/activities";
import {useTransactions} from "../../queries/orders";
import {Statistic, useStatisticsQuery} from "./../../queries/statistics";
import {styled} from "styled-components";
import ProductsPrice from "../../components/products-price";
import {useMemo} from "react";
import {NavLink} from "react-router-dom";
import {Committees} from "components/statistics/committees";

// Show all products that were bought and the amount of times they were bought
const listOfProducts = (products: Product[]) =>
  map(
    groupBy(products, (product: Product) => product.id),
    (products: Product[]) =>
      products.length === 1
        ? `${products[0].name}`
        : `${products[0].name} (${products.length}x)`
  ).join(", ");

const ProductIcon = ({products}: {products: Product[]}) => {
  if (products.length > 1) {
    return (
      <FontAwesomeIcon icon="shopping-cart" fixedWidth className="mr-2 text-muted" />
    );
  }

  const category = products[0].category;

  switch (category) {
    case "Bier":
      return <FontAwesomeIcon icon="beer" fixedWidth className="mr-2 text-muted" />;
    case "Fris":
      return (
        <FontAwesomeIcon
          icon={["fab", "gulp"]}
          fixedWidth
          className="-fw mr-2 text-muted"
        />
      );
    case "Eten":
      return <FontAwesomeIcon icon="utensils" fixedWidth className="mr-2 text-muted" />;
    default:
      return (
        <FontAwesomeIcon icon="shopping-cart" fixedWidth className="mr-2 text-muted" />
      );
  }
};

const Transaction = ({order}: {order: OrderedOrder}) => (
  <div className="recent-order d-flex justify-content-between">
    <div>
      <strong>
        <ProductIcon products={order.products} />
        {listOfProducts(order.products)} for <ProductsPrice products={order.products} />
      </strong>{" "}
      <small>bought by {order.member.fullname}</small>
    </div>
    <span className="text-muted text-right">{moment(order.ordered_at).calendar()}</span>
  </div>
);

const Transactions = ({transactions}: {transactions: OrderedOrder[]}) => {
  return (
    <ul
      aria-label="Recent transactions"
      className="list-unstyled recent-orders"
      style={{columnCount: 2, paddingLeft: 0, fontSize: "0.95em"}}
    >
      {transactions.map((transaction: OrderedOrder, idx) => (
        <li key={idx} className="py-2">
          <Transaction order={transaction} />
        </li>
      ))}
    </ul>
  );
};

const StatisticsGrid = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const Statistics = ({
  statistics = [],
  activities = [],
  transactions,
}: {
  statistics: Statistic[];
  activities: Activity[];
  transactions: OrderedOrder[];
}) => {
  const purchases = useMemo(() => {
    const getFirstMondayOfWeek = function (week: number, year: number) {
      return moment().seconds(0).minutes(0).hours(0).day("Monday").year(year).week(week);
    };

    const monday = getFirstMondayOfWeek(moment().week(), moment().year());
    const thisWeek = [0, 1, 2, 3, 4, 5, 6].map((add) => monday.clone().add(add, "day"));

    return thisWeek.map((day) => ({
      total: 0,
      beer: 0,
      soda: 0,
      food: 0,
      ...statistics.find(
        (statistic) =>
          moment(statistic.date).format("YYYY-MM-DD") === day.format("YYYY-MM-DD")
      ),
      date: day.toDate(),
    }));
  }, [statistics]);

  const purchasesToday = useMemo(() => {
    const today = moment();
    const todayFormat = today.format("YYYY-MM-DD");

    const statistic = statistics.find(
      (statistic) => moment(statistic.date).format("YYYY-MM-DD") === todayFormat
    );

    return {
      total: 0,
      beer: 0,
      soda: 0,
      food: 0,
      ...statistic,
      date: moment(todayFormat).toDate(),
    };
  }, [statistics]);

  return (
    <StatisticsGrid>
      <div className="d-flex justify-content-between py-2">
        <NavLink to="/">
          <FontAwesomeIcon icon={"chevron-circle-left"} size="lg" />
        </NavLink>
        <NavLink to="/">
          <FontAwesomeIcon icon={"chevron-circle-right"} size="lg" />
        </NavLink>
      </div>
      <div className="h-100 w-100 flex-grow-1">
        <Committees />
      </div>
    </StatisticsGrid>
  );
};

export const CommitteesStatistics = () => {
  const {activities} = useActivities();
  const statisticsQuery = useStatisticsQuery();
  const transactions = take(useTransactions(), 30);

  return (
    <Statistics
      statistics={statisticsQuery.data ?? []}
      activities={activities}
      transactions={transactions}
    />
  );
};
