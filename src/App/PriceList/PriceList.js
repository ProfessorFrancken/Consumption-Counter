import React from 'react';
import PropTypes from 'prop-types';
import Price from './Price';

const Product = ({ product }) => (
  <button
    className="button tile"
    style={{
      backgroundImage: `url(${product.image})`,
      backgroundSize: 'cover',
      backgroundPosition: '50% 50%'
    }}
  >
    <div className="productAmountOverlay">
      <div className="productAmount">
        <Price price={product.price} />
      </div>
    </div>
  </button>
);

const Category = ({ category, onClick, toggle, name }) => (
  <nav className="categoryRow">
    {category.products.map(product => (
      <Product product={product} key={product.id} />
    ))}
  </nav>
);

const PriceList = ({ products }) => {
  const beer = products['Bier'];
  const drinks = products['Fris'];
  const food = products['Eten'];

  return (
    <div className="productsGrid">
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
