import React from 'react';
import PropTypes from 'prop-types';
import './Products.css';

const AmountBeingOrdered = ({ product }) =>
  product.ordered > 0 ? (
    <span
      className="btn-product-overlay text-white"
      style={{ top: 0, zIndex: 2, backgroundColor: 'rgba(198, 198, 198, 0.7)' }}
    >
      {product.ordered}
      <br />
    </span>
  ) : (
    ''
  );

const ProductName = ({ product }) => (
  <span className="btn-product-overlay">{product.name}</span>
);

const Product = ({ product, onClick }) => (
  <button
    onClick={() => onClick(product)}
    className="SelectionItem btn btn-outline-light d-flex flex-column justify-content-center btn-product"
    style={{
      backgroundImage: `url(${product.image})`
    }}
  >
    <AmountBeingOrdered product={product} />
    <ProductName product={product} />
  </button>
);

const Category = ({ category, onClick }) => (
  <nav className="SelectionGrid products-grid">
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
    <div className="h-100 d-flex flex-row">
      <Category onClick={addProductToOrder} category={beer} />
      <Category onClick={addProductToOrder} category={drinks} />
      <Category onClick={addProductToOrder} category={food} />
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
