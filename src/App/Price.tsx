import React from "react";

const totalPrice = (products: any) =>
  products
    .map((product: any) => product.price)
    .reduce((sum: any, price: any) => sum + price, 0);

const Price = ({products}: any) => (
  <span>
    {new Intl.NumberFormat("en-EN", {
      style: "currency",
      currency: "EUR",
    }).format(totalPrice(products) / 100)}
  </span>
);

export default Price;
