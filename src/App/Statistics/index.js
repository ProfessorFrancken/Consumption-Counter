import React from 'react';
import { connect } from 'react-redux';
import { groupBy, map } from 'lodash';
import Price from './../Transactions/Price';
import moment from 'moment';
import Icon from './../Icon';
import { sortBy } from 'lodash';
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis } from 'victory';
import HeatMap from './HeatMap';

const myDataset = [
  [
    { x: 'a', y: 1 },
    { x: 'b', y: 2 },
    { x: 'c', y: 3 },
    { x: 'd', y: 2 },
    { x: 'e', y: 1 }
  ],
  [
    { x: 'a', y: 2 },
    { x: 'b', y: 3 },
    { x: 'c', y: 4 },
    { x: 'd', y: 5 },
    { x: 'e', y: 5 }
  ],
  [
    { x: 'a', y: 1 },
    { x: 'b', y: 2 },
    { x: 'c', y: 3 },
    { x: 'd', y: 4 },
    { x: 'e', y: 4 }
  ]
];

class Bars extends React.Component {
  // This is an example of a function you might use to transform your data to make 100% data
  transformData(dataset) {
    const totals = dataset[0].map((data, i) => {
      return dataset.reduce((memo, curr) => {
        return memo + curr[i].y;
      }, 0);
    });
    return dataset.map(data => {
      return data.map((datum, i) => {
        return { x: datum.x, y: datum.y / totals[i] * 100 };
      });
    });
  }

  render() {
    const dataset = this.transformData(myDataset);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <VictoryChart
          height={200}
          width={600}
          domainPadding={{ x: 30, y: 20 }}
          style={{ parent: { maxWidth: '90%' } }}
        >
          <VictoryStack colorScale={['black', 'blue', 'tomato']}>
            {dataset.map((data, i) => {
              return <VictoryBar data={data} key={i} />;
            })}
          </VictoryStack>
          <VictoryAxis dependentAxis tickFormat={tick => `${tick}%`} />
          <VictoryAxis
            tickFormat={[
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday'
            ]}
          />
        </VictoryChart>
      </div>
    );
  }
}

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
  <div className="my-3">
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
      style={{ columnCount: 1, paddingLeft: 0, fontSize: '0.95em' }}
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
  const today = moment().subtract(3, 'months');
  const thisWeek = today.week();
  const todayFormat = today.format('YYYY-MM-DD');
  const purchasesToday = statistics.find(
    statistic => moment(statistic.date).format('YYYY-MM-DD') === todayFormat
  ) || { total: 0, beer: 0, soda: 0, food: 0 };

  const purchasesThisWeek = statistics
    .filter(statistic => moment(statistic.date).week() === thisWeek)
    .reduce(
      (total, statistic) => ({
        total: total.total + statistic.total,
        beer: total.beer + statistic.beer,
        soda: total.soda + statistic.soda,
        food: total.food + statistic.food
      }),
      { total: 0, beer: 0, soda: 0, food: 0 }
    );

  return (
    <div>
      <div className="row">
        <div className="col">
          <div className="row">
            {/* TODO: make these graphics instead of solid backgrounds */}
            <div className="col">
              <div className="p-3 bg-dark text-white">
                <h4>
                  <Icon name="shopping-cart text-muted mr-3" />
                  {purchasesThisWeek.total}
                </h4>
                <small className="text-uppercase">
                  {purchasesToday.total} today
                </small>
              </div>
            </div>
            <div className="col">
              <div className="p-3 text-white bg-dark">
                <h4>
                  <Icon name="beer text-muted mr-3" />
                  {purchasesThisWeek.beer}
                </h4>
                <small className="text-uppercase">
                  {purchasesToday.beer} today
                </small>
              </div>
            </div>
            <div className="col">
              <div className="p-3 text-white bg-dark">
                <h4>
                  <Icon name="coffee text-muted mr-3" />
                  {purchasesThisWeek.soda}
                </h4>
                <small className="text-uppercase">
                  {purchasesToday.soda} today
                </small>
              </div>
            </div>
            <div className="col">
              <div className="p-3 text-white bg-dark">
                <h4>
                  <Icon name=" fab fa-apple text-muted mr-3" />
                  {purchasesThisWeek.food}
                </h4>
                <small className="text-uppercase">
                  {purchasesToday.food} today
                </small>
              </div>
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
