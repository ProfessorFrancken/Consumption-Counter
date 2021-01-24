import {connect} from "react-redux";
import {addProductToOrder, buyMore} from "actions";
import {productsWithOrderCountSelector} from "./selectors";
import Products from "./Products";

const mapStateToProps = (state: any) => ({
  products: productsWithOrderCountSelector(state, {
    hour: new Date().getHours(),
  }),
});

const mapDispatchToProps = (dispatch: any) => ({
  addProductToOrder: (product: any) => dispatch(addProductToOrder(product)),
  toggle: (product: any) => dispatch(buyMore(product)),
});

// @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ products, addProductToOrder, ... Remove this comment to see the full error message
export default connect(mapStateToProps, mapDispatchToProps)(Products);
