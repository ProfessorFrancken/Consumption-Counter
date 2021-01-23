import {TYPES} from "actions";
import {sortBy, groupBy} from "lodash";

const product_images = [];

export function products(state = [], action) {
  switch (action.type) {
    case TYPES.FETCH_PRODUCTS_SUCCESS:
      // Refrehs images
      product_images.splice(0, product_images);
      action.products.forEach((product) => {
        let img = new Image();
        img.src = product.image;
        product_images.push(img);
      });

      return groupBy(
        sortBy(action.products, (product) => product.position),
        (product) => product.category
      );
    default:
      return state;
  }
}
