import {useOrderableProducts} from "../../../components/orders-context";
import Price from "../../../components/price";
import {Product as ProductType} from "./../../../queries/products";

const Product = ({product}: any) => (
  <button
    className="button tile"
    style={{
      backgroundImage: `url(${product.image})`,
      backgroundSize: "cover",
      backgroundPosition: "50% 50%",
    }}
  >
    <div className="productAmountOverlay">
      <div className="productAmount">
        <Price price={product.price} />
      </div>
    </div>
  </button>
);

const Category = ({category}: any) =>
  category.products.length > 0 ? (
    <nav className="categoryRow">
      {category.products.map((product: any) => (
        <Product product={product} key={product.id} />
      ))}
    </nav>
  ) : null;

type PriceListProps = {
  products: {
    Bier: ProductType[];
    Fris: ProductType[];
    Eten: ProductType[];
  };
};

const PriceList = ({products}: PriceListProps) => {
  const beer = products["Bier"] ?? [];
  const drinks = products["Fris"] ?? [];
  const food = products["Eten"] ?? [];

  return (
    <div className="productsGrid">
      <Category category={{name: "Beer", products: beer}} />
      <Category category={{name: "Drinks", products: drinks}} />
      <Category category={{name: "Food", products: food}} />
    </div>
  );
};

const PriceListScreen = () => {
  const products = useOrderableProducts();

  return <PriceList products={products} />;
};

export default PriceListScreen;
