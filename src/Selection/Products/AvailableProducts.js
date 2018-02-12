import { connect } from 'react-redux'
import { mapValues } from 'lodash'
import { addProductToOrder } from '../../actions'
import Products from './Products'

const getAvailableProducts = (products, member) =>
  mapValues(
    products,
    (products) => products.filter(
      (product) => (product.age_restriction <= member.age)
    )
  )

const mapStateToProps = state => {
  return {
    products: getAvailableProducts(state.products, state.selectedMember),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addProductToOrder: product => {
      dispatch(addProductToOrder(product))
    }
  }
}

const AvailableProducts = connect(
  mapStateToProps,
  mapDispatchToProps
)(Products)

export default AvailableProducts
