import React from 'react';
import PropTypes from 'prop-types';
// import './Products.css';

const AmountBeingOrdered = ({ product }) =>
  product.ordered > 0 ? (
    <span
      className=""
      style={{ top: 0, zIndex: 2, backgroundColor: 'rgba(198, 198, 198, 0.7)' }}
    >
      {product.ordered}
      <br />
    </span>
  ) : (
    ''
  );

const ProductName = ({ product }) => <span>{product.name}</span>;

const Product = ({ product, onClick }) => (
  <button
    onClick={() => onClick(product)}
    className="button tile"
    style={{
      backgroundImage: `url(${product.image})`,
      backgroundSize: 'cover',
      backgroundPosition: '50% 50%'
    }}
  >
    <AmountBeingOrdered product={product} />
    <ProductName product={product} />
  </button>
);

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
