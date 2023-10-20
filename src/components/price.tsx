const Price = ({price}: {price: number}) => (
  <span>
    {new Intl.NumberFormat("en-EN", {
      style: "currency",
      currency: "EUR",
    }).format(price / 100)}
  </span>
);

export default Price;
