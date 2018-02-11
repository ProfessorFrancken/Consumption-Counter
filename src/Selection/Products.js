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

const Product = ({ product, onClick }) => (
  <button
    key={product.id}
    onClick={onClick}
    className="SelectionItem btn btn-outline-light d-flex flex-column justify-content-center"
    to="/products"
    style={{
      color: "#333",
      backgroundColor: "white",
      backgroundImage: `url(https:/old.professorfrancken.nl/database/streep/afbeeldingen/${product.image})`,
      backgroundSize: "cover",
      backgroundPosition: "50% 50%",
      position: "relative"
    }}
  >
    <span
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "rgba(255, 255, 255, 0.9)",
        padding: ".5em",
        position: "absolute",
        fontWeight: "bold",
        bottom: 0,
        left: 0,
        right: 0
      }}
    >
      {product.name}
    </span>
  </button>
)

const Products = () => {

  // Do an assert that we have three categories

  return (
    <div className="h-100 d-flex flex-row">
      <nav className="SelectionGrid SelectionGrid-products">
        {products["Bier"].map((product, idx) => (
          <Product product={product} />
        ))}
      </nav>
      <nav className="SelectionGrid SelectionGrid-products" style={{margin: "0 1%"}}>
        {products["Fris"].map((product, idx) => (
          <Product product={product} />
        ))}
      </nav>
      <nav className="SelectionGrid SelectionGrid-products">
        {products["Eten"].map((product, idx) => (
          <Product product={product} />
        ))}
      </nav>
    </div>
  )
}

export default Products
