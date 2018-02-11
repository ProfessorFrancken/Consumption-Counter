import React from 'react'
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

const Products = ({ products = {} }) => {

  // Do an assert that we have three categories

  return (
    <div className="h-100 d-flex flex-row">
      <nav className="SelectionGrid products-grid">
        {products["Bier"].map((product, idx) => (
          <Product product={product} />
        ))}
      </nav>
      <nav className="SelectionGrid products-grid">
        {products["Fris"].map((product, idx) => (
          <Product product={product} />
        ))}
      </nav>
      <nav className="SelectionGrid products-grid">
        {products["Eten"].map((product, idx) => (
          <Product product={product} />
        ))}
      </nav>
    </div>
  )
}

export default Products
