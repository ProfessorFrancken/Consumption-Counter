import React from 'react'
import PropTypes from 'prop-types'
import './Products.css'

const ProductName = ({ product }) => (
    <span className="btn-product-overlay">
      {product.name}
    </span>
)

const Product = ({ product, onClick }) => (
  <button
    onClick={onClick}
    className="SelectionItem btn btn-outline-light d-flex flex-column justify-content-center btn-product"
    to="/products"
    style={{ backgroundImage: `url(https:/old.professorfrancken.nl/database/streep/afbeeldingen/${product.image})` }}
  >
    <ProductName product={product} />
  </button>
)

const Category = ({ category }) => (
  <nav className="SelectionGrid products-grid">
    {category.map((product) => <Product product={product} />)}
  </nav>
)

const Products = ({ products }) => {
  const beer = products['Bier'];
  const drinks = products['Fris'];
  const food = products['Eten'];

  return (
    <div className="h-100 d-flex flex-row">
      <Category category={beer} />
      <Category category={drinks} />
      <Category category={food} />
    </div>
  )
}

const ProductPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
});

Products.propTypes = {
  products: PropTypes.shape({
    'Bier': PropTypes.arrayOf(ProductPropType).isRequired,
    'Fris': PropTypes.arrayOf(ProductPropType).isRequired,
    'Eten': PropTypes.arrayOf(ProductPropType).isRequired,
  }).isRequired
}

export default Products
