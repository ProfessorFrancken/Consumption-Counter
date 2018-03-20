import React, { Component } from 'react';

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

class Product extends Component {
  state = {
    longPressed: false
  };

  onMouseDown = () => {
    this.longPressTimeOut = setTimeout(this.onLongPress, 500);
  };

  onMouseUp = () => {
    const { onClick, product, buyMore } = this.props;

    if (this.state.longPressed) {
      this.setState({
        longPressed: false
      });
      return;
    }

    onClick(product);
    clearTimeout(this.longPressTimeOut);
  };

  onLongPress = () => {
    const { toggle, onClick, product, buyMore } = this.props;

    this.setState({
      longPressed: true
    });

    toggle(product);

    clearTimeout(this.longPressTimeOut);
  };

  render() {
    const { product } = this.props;

    return (
      <button
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
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
    );
  }
}

export default Product;
