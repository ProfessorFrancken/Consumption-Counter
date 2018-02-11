import { connect } from 'react-redux'
import { addProductToOrder } from '../actions'
import Products from './Products'
import { mapValues } from 'lodash'

const getAvailableProducts = (products, member) =>
  mapValues(
    products,
    (products) => products.filter(
      (product) => (product.age_restriction <= member.age)
    )
  )

const mapStateToProps = state => {
  return {
    products: getAvailableProducts(state.products, state.selected_member),
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
