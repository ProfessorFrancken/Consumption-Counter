// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {connect} from "react-redux";
import PriceList from "./PriceList";

const mapStateToProps = (state: any) => ({
  products: state.products,
});

export default connect(mapStateToProps)(PriceList);
