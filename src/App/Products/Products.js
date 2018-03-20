import React from 'react';
import PropTypes from 'prop-types';
import Product from './ProductContainer';

const Category = ({ category, onClick, name }) => (
  <nav className="categoryRow">
    {category.map(product => (
      <Product product={product} onClick={onClick} key={product.id} />
    ))}
  </nav>
);

const Products = ({ products, addProductToOrder }) => {
  const beer = products['Bier'] || [];
  const drinks = products['Fris'] || [];
  const food = products['Eten'] || [];

  return (
    <div className="productsGrid">
      {drinks.length > 0 && (
        <Category onClick={addProductToOrder} category={drinks} />
      )}
      {food.length > 0 && (
        <Category onClick={addProductToOrder} category={food} />
      )}
      {beer.length > 0 && (
        <Category onClick={addProductToOrder} category={beer} />
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
