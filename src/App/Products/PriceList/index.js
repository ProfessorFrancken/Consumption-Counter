import { connect } from 'react-redux';
import PriceList from './PriceList';

const mapStateToProps = state => ({
  products: state.products
});

export default connect(mapStateToProps)(PriceList);
