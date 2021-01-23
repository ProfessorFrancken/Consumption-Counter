import React from "react";

type Props = {
  price: number;
};

const Price = ({price}: Props) => (
  <span>
    {new Intl.NumberFormat("en-EN", {
      style: "currency",
      currency: "EUR",
    }).format(price / 100)}
  </span>
);

export default Price;
