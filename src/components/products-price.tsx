import {Product} from "queries/products";

const totalPrice = (products: Pick<Product, "price">[]) =>
  products.map((product) => product.price).reduce((sum, price) => sum + price, 0);

const ProductsPrice = ({products}: {products: Pick<Product, "price">[]}) => (
  <span>
    {new Intl.NumberFormat("en-EN", {
      style: "currency",
      currency: "EUR",
    }).format(totalPrice(products) / 100)}
  </span>
);

export default ProductsPrice;
