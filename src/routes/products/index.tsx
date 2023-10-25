import {
  Product as ProductType,
  useOrder,
  useOrderableProducts,
  useSelectedMember,
} from "../../components/orders-context";
import {useOnLongPress} from "./../../utils/use-on-long-press";

const AmountBeingOrdered = ({amount}: {amount: number}) => {
  return (
    <div className="productAmountOverlay">
      <div className="productAmount">
        <span aria-label="amount ordered">{amount}</span>
      </div>
    </div>
  );
};

const ProductName = ({product}: {product: ProductType}) => <span>{product.name}</span>;

const isProductLocked = (product: ProductType, hour: number) => {
  if (product.category === "Bier") {
    if (["Almanak", "Almanac"].includes(product.name)) {
      return false;
    }

    return [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(hour);
  }

  if (product.name === "Goede morgen!") {
    return ![6, 7, 8, 9, 10, 11].includes(hour);
  }

  return false;
};

const Product = ({
  product,
  onLongPress,
  onClick,
}: {
  product: ProductType;
  onClick: () => void;
  onLongPress: () => void;
}) => {
  const handlers = useOnLongPress({onClick, onLongPress});
  const {order} = useOrder();
  const orderAmount = order.products.filter(({id}) => id === product.id).length;

  const hour = new Date().getHours();
  const locked = isProductLocked(product, hour);

  return (
    <button
      aria-label={`Buy ${product.name} ${locked ? "(disabled)" : ""}`}
      className={"button tile " + (locked ? "locked" : "")}
      style={{
        backgroundImage: `url(${product.image})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
      }}
      {...handlers}
    >
      {orderAmount === 0 ? (
        <ProductName product={product} />
      ) : (
        <AmountBeingOrdered amount={orderAmount} />
      )}
    </button>
  );
};

const Category = ({
  products,
  onClick,
  onLongPress,
  name,
}: {
  products: ProductType[];
  onClick: (product: ProductType) => void;
  onLongPress: (product: ProductType) => void;
  name: string;
}) => {
  return (
    <nav className={"categoryRow"} aria-label={`${name} category`}>
      {products.map((product) => {
        return (
          <Product
            key={product.id}
            product={product}
            onClick={() => onClick(product)}
            onLongPress={() => onLongPress(product)}
          />
        );
      })}
    </nav>
  );
};

const Products = () => {
  const {order, makeOrderMutation, addProductToOrder} = useOrder();
  const member = useSelectedMember();
  const products = useOrderableProducts();

  const beer = products["Bier"] || [];
  const soda = products["Fris"] || [];
  const food = products["Eten"] || [];

  const hasPlacedATeporaryOrder = order.products.length > 0;

  const handleClick = (product: ProductType) => {
    if (hasPlacedATeporaryOrder) {
      addProductToOrder(product);
      return;
    }

    if (member) {
      makeOrderMutation.mutate({products: [product], member});
    }
  };

  return (
    <div className="productsGrid">
      {beer.length > 0 && (
        <Category
          name="beer"
          onClick={handleClick}
          onLongPress={addProductToOrder}
          products={beer}
        />
      )}
      {soda.length > 0 && (
        <Category
          name="soda"
          onClick={handleClick}
          onLongPress={addProductToOrder}
          products={soda}
        />
      )}
      {food.length > 0 && (
        <Category
          name="food"
          onClick={handleClick}
          onLongPress={addProductToOrder}
          products={food}
        />
      )}
    </div>
  );
};

export default Products;
