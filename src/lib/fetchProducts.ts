import { Product } from "@/components/ProductsList";
import makeApiRequest from "./api";
import ActionTypes from "@/types/ActionTypes";

const MAX_RETRIES = 10;

const fetchProducts = async (
  action: string,
  params: Record<string, unknown>,
  retryCount = 0
): Promise<Product[]> => {
  try {
    const response = await makeApiRequest({ action, params });

    const uniqueProductIds = Array.from(new Set(response.data.result));

    const productDetails = await makeApiRequest({
      action: ActionTypes.GET_ITEMS,
      params: { ids: uniqueProductIds },
    });

    const products: Product[] = productDetails.data.result;
    const seenIds: Record<string, boolean> = {};
    const uniqueProducts: Product[] = [];

    for (const product of products) {
      if (!seenIds[product.id]) {
        seenIds[product.id] = true;
        uniqueProducts.push(product);
      }
    }

    return uniqueProducts;
  } catch (error) {
    console.error("[API ERROR]:", error);

    if (retryCount < MAX_RETRIES) {
      return await fetchProducts(action, params, retryCount + 1);
    } else {
      console.error("Maximum retry count reached. Stopping retries.");
      const message = (error as Error).message;
      throw new Error(message);
    }
  }
};

export default fetchProducts;
