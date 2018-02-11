import React from 'react'
import faker from 'faker'
import LinkButton from './../App/LinkButton'
import { sortBy, groupBy } from 'lodash'
import producten from './../assets/products.json'
import '../App/MainScreen/MainScreen.css'
import './Products.css'

const products = groupBy(
  sortBy(producten.map(product => {
  return {
    id: product.id,
    name: product.naam,
    price: product.prijs,
    position: product.positie,
    category: product.categorie,
    image: product.afbeelding
  }
  }), (product) => product.positie)
  , (product) => product.category);

console.log(products['Fris']);

const members = [];

const Products = () => {

  return (
    <div className="h-100 d-flex flex-row">
    <nav className="SelectionGrid SelectionGrid-products">
    {products["Bier"].map((product, idx) => (
      <button
        key={product.id}
        className="SelectionItem btn btn-outline-light d-flex flex-column justify-content-center"
        to="/products"
        >
        {product.name}
      </button>
    ))}
    </nav>
    <nav className="SelectionGrid SelectionGrid-products">
    {products["Fris"].map((product, idx) => (
      <button
        key={product.id}
        className="SelectionItem btn btn-outline-light d-flex flex-column justify-content-center"
        to="/products"
        >
        {product.name}
      </button>
    ))}
    </nav>
    <nav className="SelectionGrid SelectionGrid-products">
    {products["Eten"].map((product, idx) => (
      <button
        key={product.id}
        className="SelectionItem btn btn-outline-light d-flex flex-column justify-content-center"
        to="/products"
        >
        {product.name}
      </button>
    ))}
    </nav>
    </div>
  )

  return (
  <div className="d-flex flex-row">
  <div className="products">
    {products["Bier"].map((product, idx) => (
      <button
        key={product.id}
        className="btn btn-outline-light d-flex flex-column justify-content-center p-0"
        to="/products"
        >
        <img
          src={`https:/old.professorfrancken.nl/database/streep/afbeeldingen/${product.image}`}
          alt={`${product.name}`}
          className="img-fluid"
          style={{ backgroundColor: 'white', objectFit: 'cover' }}
        />
        {/* {product.name} */}
      </button>
    ))}
  </div>

  <div className="products mx-2">
    {products["Fris"].map((product, idx) => (
      <button
        key={product.id}
        className="btn btn-outline-light d-flex flex-column justify-content-center p-0"
        to="/products"
        >
        <img
          src={`https:/old.professorfrancken.nl/database/streep/afbeeldingen/${product.image}`}
          alt={`${product.name}`}
          className="img-fluid"
        />
        {/* {product.name} */}
      </button>
    ))}
  </div>
<div className="products">
    {products["Eten"].map((product, idx) => (
      <button
        key={product.id}
        className="btn btn-outline-light d-flex flex-column justify-content-center p-0"
        to="/products"
        >
        <img
          src={`https:/old.professorfrancken.nl/database/streep/afbeeldingen/${product.image}`}
          alt={`${product.name}`}
          className="img-fluid"
        />
        {/* {product.name} */}
      </button>
    ))}
  </div>
  </div>
)
}

export default Products
