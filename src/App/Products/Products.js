import React from 'react';
import PropTypes from 'prop-types';
import Product from './Product';

const Category = ({ category, onClick, toggle, name, locked }) => (
  <nav className={'categoryRow ' + (locked ? 'locked' : '')}>
    {category.map(product => (
      <Product
        product={product}
        onClick={onClick}
        toggle={toggle}
        key={product.id}
      />
    ))}
  </nav>
);

const Products = ({ products, hour, addProductToOrder, toggle }) => {
  const beer = products['Bier'] || [];
  const drinks = products['Fris'] || [];
  const food = products['Eten'] || [];

  const bierUur = ![4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(hour);

  return (
    <div className="productsGrid">
      {beer.length > 0 && (
        <Category
          onClick={addProductToOrder}
          toggle={toggle}
          category={beer}
          locked={!bierUur}
        />
      )}
      {drinks.length > 0 && (
        <Category
          onClick={addProductToOrder}
          toggle={toggle}
          category={drinks}
        />
      )}
      {food.length > 0 && (
        <Category onClick={addProductToOrder} toggle={toggle} category={food} />
      )}
    </div>
  );
};

const ProductPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired
});

Products.propTypes = {
  products: PropTypes.shape({
    Bier: PropTypes.arrayOf(ProductPropType).isRequired,
    Fris: PropTypes.arrayOf(ProductPropType).isRequired,
    Eten: PropTypes.arrayOf(ProductPropType).isRequired
  }).isRequired,
  addProductToOrder: PropTypes.func.isRequired
};

export default Products;
