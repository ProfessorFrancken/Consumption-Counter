import {connect} from "react-redux";
import {addProductToOrder, buyMore} from "actions";
import {productsWithOrderCountSelector} from "./selectors";
import Products from "./Products";

const mapStateToProps = (state) => ({
  products: productsWithOrderCountSelector(state, {
    hour: new Date().getHours(),
  }),
});

const mapDispatchToProps = (dispatch) => ({
  addProductToOrder: (product) => dispatch(addProductToOrder(product)),
  toggle: (product) => dispatch(buyMore(product)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);
