import { connect } from 'react-redux'
import PriceList from './PriceList'

const mapStateToProps = state => {
  return {
    products: state.products
  }
}

export default connect(mapStateToProps)(PriceList)
