import React from 'react';
import OnLongPress from './OnLongPress';

const AmountBeingOrdered = ({ product }) =>
  product.ordered > 0 ? (
    <div className="productAmountOverlay">
      <div className="productAmount">
        <span>{product.ordered}</span>
      </div>
    </div>
  ) : (
    ''
  );

const ProductName = ({ product }) => <span>{product.name}</span>;

const Product = ({ product, toggle, onClick }) => (
  <OnLongPress
    onClick={() => onClick(product)}
    onLongPress={() => toggle(product)}
  >
    <button
      className="button tile"
      style={{
        backgroundImage: `url(${product.image})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%'
      }}
    >
      <AmountBeingOrdered product={product} />
      {product.ordered === 0 && <ProductName product={product} />}
    </button>
  </OnLongPress>
);

export default Product;
