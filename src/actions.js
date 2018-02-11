export const actions = {
  addProductToOrder
}

export const CONSTANTS = {
  ADD_PRODUCT_TO_ORDER: 'ADD_PRODUCT_TO_ORDER'
}

/**
 * TODO: currently we only have an option for adding products to
 * an order, however it should be possible to either add and buy, or
 * add multiple products and buy manually
 */
export function addProductToOrder(product) {
  return (dispatch, getState) => {
    const { selected_member } = getState();

    dispatch({
      type: CONSTANTS.ADD_PRODUCT_TO_ORDER,
      product,
      member: selected_member
    })
  }
}

export default actions;
