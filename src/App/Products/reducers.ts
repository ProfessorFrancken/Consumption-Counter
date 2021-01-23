import {TYPES} from "actions";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import {sortBy, groupBy} from "lodash";

const product_images: any = [];

export function products(state = [], action: any) {
  switch (action.type) {
    case TYPES.FETCH_PRODUCTS_SUCCESS:
      // Refrehs images
      product_images.splice(0, product_images);
      action.products.forEach((product: any) => {
        let img = new Image();
        img.src = product.image;
        product_images.push(img);
      });

      return groupBy(
        sortBy(action.products, (product: any) => product.position),
        (product: any) => product.category
      );
    default:
      return state;
  }
}
