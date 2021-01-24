import {connect} from "react-redux";
import PriceList from "./PriceList";

const mapStateToProps = (state: any) => ({
  products: state.products,
});

export default connect(mapStateToProps)(PriceList);
