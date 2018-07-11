import React from 'react';
import { connect } from 'react-redux';
import { groupBy, map } from 'lodash';
import Price from './../Transactions/Price';
import moment from 'moment';
import Icon from './../Icon';
import { sortBy } from 'lodash';
import HeatMap from './HeatMap';
import PurchasesOfWeek from './PurchasesOfWeek';

// Show all products that were bought and the amount of times they were bought
const listOfProducts = products =>
  map(
    groupBy(products, product => product.id),
    product =>
      product.length === 1
        ? `${product[0].name}`
        : `${product[0].name} (${product.length}x)`
  ).join(', ');

const ProductIcon = ({ products }) => {
  if (products.length > 1) {
    return <Icon name="shopping-cart fa-fw mr-2 text-muted" />;
  }

  const category = products[0].category;

  switch (category) {
    case 'Bier':
      return <Icon name="beer fa-fw mr-2 text-muted" />;
    case 'Fris':
      return <Icon name="coffee fa-fw mr-2 text-muted" />;
    case 'Eten':
      return <Icon name=" fab fa-apple fa-fw mr-2 text-muted" />;
    default:
      return <Icon name="shopping-cart fa-fw mr-2 text-muted" />;
  }
};

const Transaction = ({ order }) => (
  <div className="py-2">
    <div className="d-flex justify-content-between">
      <div>
        <strong>
          <ProductIcon products={order.products} />
          {listOfProducts(order.products)} for{' '}
          <Price
            products={order.products}
            price={order.products
              .map(product => product.price)
              .reduce((sum, price) => sum + price, 0)}
          />
        </strong>{' '}
        <small>bought by {order.member.fullname}</small>
      </div>
      <span className="text-muted text-right">
        {moment(order.ordered_at).calendar()}
      </span>
    </div>
  </div>
);

const Transactions = ({ transactions }) => {
  return (
    <ul
      className="list-unstyled"
      style={{ columnCount: 2, paddingLeft: 0, fontSize: '0.95em' }}
    >
      {transactions.map((transaction, idx) => (
        <li key={idx}>
          <Transaction {...transaction} />
        </li>
      ))}
    </ul>
  );
};

const Statistics = ({ statistics, transactions }) => {
  // console.log(statistics);
  const today = moment();
  const todayFormat = today.format('YYYY-MM-DD');
  const purchasesToday = statistics.find(
    statistic => moment(statistic.date).format('YYYY-MM-DD') === todayFormat
  ) || { total: 0, beer: 0, soda: 0, food: 0 };

  const getFirstMondayOfWeek = function(week, year) {
    return moment()
      .seconds(0)
      .minutes(0)
      .hours(0)
      .day('Monday')
      .year(year)
      .week(week);
  };

  const thisWeek = () => {
    const monday = getFirstMondayOfWeek(moment().week(), moment().year());
    return [0, 1, 2, 3, 4, 5, 6].map(add => monday.clone().add(add, 'day'));
  };

  const purchases = thisWeek().map(day => ({
    total: 0,
    beer: 0,
    soda: 0,
    food: 0,
    ...statistics.find(
      statistic =>
        moment(statistic.date).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
    ),
    date: day.toDate()
  }));
  console.log(
    thisWeek().map(day => day.format('ddd')),
    purchases.map(p => moment(p.date).format('ddd'))
  );

  console.log(purchases);
  // console.log(purchasesThisWeek);

  // const purchases = statistics.filter(
  //   statistic => moment(statistic.date).week() === today.week()
  // );
  return (
    <div>
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
                icon="coffee"
              />
            </div>
            <div className="col">
              <PurchasesOfWeek
                purchases={purchases}
                today={purchasesToday}
                type="food"
                icon="apple fab"
              />
            </div>
          </div>
          <div className="border-top pt-2 mt-4">
            <Transactions transactions={transactions} />
          </div>
        </div>

        <div className="col-2 d-none">
          <HeatMap statistics={statistics} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  statistics: state.statistics,
  transactions: state.transactions
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
