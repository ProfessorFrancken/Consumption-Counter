import React from 'react';
import PropTypes from 'prop-types';
import Price from './Price';

const Product = ({ product }) => (
  <span className="d-flex justify-content-between">
    <strong>{product.name}</strong> <Price price={product.price} />
  </span>
);

const Category = ({ category }) => (
  <div className="list-unstyled text-left w-100 mx-3">
    <h3 className="text-center">{category.name}</h3>
    <ul>
      {category.products.map(product => (
        <li key={product.id}>
          <Product product={product} />
        </li>
      ))}
    </ul>
  </div>
);

const PriceList = ({ products }) => {
  const beer = products['Bier'];
  const drinks = products['Fris'];
  const food = products['Eten'];

  return (
    <div className="h-100 d-flex flex-row justify-content-between">
      <Category category={{ name: 'Beer', products: beer }} />
      <Category category={{ name: 'Drinks', products: drinks }} />
      <Category category={{ name: 'Food', products: food }} />
    </div>
  );
};

const ProductPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired
});

PriceList.propTypes = {
  products: PropTypes.shape({
    Bier: PropTypes.arrayOf(ProductPropType).isRequired,
    Fris: PropTypes.arrayOf(ProductPropType).isRequired,
    Eten: PropTypes.arrayOf(ProductPropType).isRequired
  }).isRequired
};

export default PriceList;
