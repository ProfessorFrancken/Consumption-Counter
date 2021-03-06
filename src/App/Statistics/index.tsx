import React from "react";
import {groupBy, map} from "lodash";
import Price from "./../Price";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import HeatMap from "./HeatMap";
import PurchasesOfWeek from "./PurchasesOfWeek";
import {OrderedOrder} from "App/QueuedOrdersContext";
import {Product} from "App/Products/OrdersContext";
import {Activity, useActivities} from "App/Activities/ActivitiesContext";
import {useTransactions} from "App/Transactions/TransactionsContext";
import {Statistic, useStatistics} from "./StatisticsContext";

// Show all products that were bought and the amount of times they were bought
const listOfProducts = (products: Product[]) =>
  map(
    groupBy(products, (product: any) => product.id),
    (product: any) =>
      product.length === 1
        ? `${product[0].name}`
        : `${product[0].name} (${product.length}x)`
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
        {listOfProducts(order.products)} for{" "}
        <Price
          products={order.products}
          price={order.products
            .map((product: any) => product.price)
            .reduce((sum: any, price: any) => sum + price, 0)}
        />
      </strong>{" "}
      <small>bought by {order.member.fullname}</small>
    </div>
    <span className="text-muted text-right">{moment(order.ordered_at).calendar()}</span>
  </div>
);

const Transactions = ({transactions}: {transactions: OrderedOrder[]}) => {
  return (
    <ul
      className="list-unstyled recent-orders"
      style={{columnCount: 2, paddingLeft: 0, fontSize: "0.95em"}}
    >
      {transactions.map((transaction: OrderedOrder, idx: any) => (
        <li key={idx} className="py-2">
          <Transaction order={transaction} />
        </li>
      ))}
    </ul>
  );
};

const Statistics = ({
  statistics = [],
  activities = [],
  transactions,
}: {
  statistics: Statistic[];
  activities: Activity[];
  transactions: OrderedOrder[];
}) => {
  const today = moment();
  const todayFormat = today.format("YYYY-MM-DD");
  const purchasesToday = statistics.find(
    (statistic) => moment(statistic.date).format("YYYY-MM-DD") === todayFormat
  ) || {total: 0, beer: 0, soda: 0, food: 0};

  const getFirstMondayOfWeek = function (week: any, year: any) {
    return moment().seconds(0).minutes(0).hours(0).day("Monday").year(year).week(week);
  };

  const thisWeek = () => {
    const monday = getFirstMondayOfWeek(moment().week(), moment().year());
    return [0, 1, 2, 3, 4, 5, 6].map((add) => monday.clone().add(add, "day"));
  };

  const purchases = thisWeek().map((day) => ({
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

  return (
    <div className="d-flex flex-column justify-content-between h-100">
      <div className="row">
        <div className="col">
          <div className="row">
            {/* TODO: make these graphics instead of solid backgrounds */}
            <div className="col">
              <PurchasesOfWeek
                purchases={purchases}
                today={purchasesToday}
                type="total"
                icon="shopping-cart"
              />
            </div>
            <div className="col">
              <PurchasesOfWeek
                purchases={purchases}
                today={purchasesToday}
                type="beer"
                icon="beer"
              />
            </div>
            <div className="col">
              <PurchasesOfWeek
                purchases={purchases}
                today={purchasesToday}
                type="soda"
                icon={["fab", "gulp"]}
              />
            </div>
            <div className="col">
              <PurchasesOfWeek
                purchases={purchases}
                today={purchasesToday}
                type="food"
                icon="utensils"
              />
            </div>
          </div>
          <div className="border-top pt-2 mt-4">
            <Transactions transactions={transactions} />
          </div>
        </div>
      </div>
      <HeatMap statistics={statistics} activities={activities} />
    </div>
  );
};

const StatisticsSreen = () => {
  const {activities} = useActivities();
  const {statistics} = useStatistics();
  const {transactions} = useTransactions();

  return (
    <Statistics
      statistics={statistics}
      activities={activities}
      transactions={transactions}
    />
  );
};

export default StatisticsSreen;
