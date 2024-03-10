import { useState, useEffect } from "react";

import ActionTypes from "@/types/ActionTypes";
import List, { Product } from "@/components/ProductsList";
import Filter from "@/components/ProductsFilter";
import Container from "@/components/Container";
import fetchProducts from "@/lib/fetchProducts";
import ErrorMessage from "@/components/Error";
import makeApiRequest from "@/lib/api";
import { PRODS_PRO_PAGE } from "@/constants/const";
import { debounce } from "@/lib/DebounceFn";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prodsCount, setProdsCount] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const result = await makeApiRequest({});
      const products = [...new Set(result.data.result)];

      setProdsCount(products.length);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("offset", (currentPage - 1) * PRODS_PRO_PAGE);

        const result = await fetchProducts(ActionTypes.GET_IDS, {
          offset: (currentPage - 1) * PRODS_PRO_PAGE,
          limit: PRODS_PRO_PAGE,
        });
        setProducts(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        const message = (error as Error).message;
        setError(message);
      }
    };

    fetchData();
  }, [currentPage]);

  const debouncedHandleFilterChange = debounce(async (filter) => {
    try {
      console.log("debouncedHandleFilterChange");

      setLoading(true);
      const result = await fetchProducts(ActionTypes.FILTER, {
        ...filter,
      });

      setProdsCount(result.length);
      setProducts(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      const message = (error as Error).message;
      setError(message);
    }
  }, 1000);

  const handleFilterChange = (filter: {
    price?: number;
    brand?: string;
    product?: string;
  }) => {
    const { price, ...restFilter } = filter;

    const numericPrice =
      price !== undefined ? parseFloat(String(price)) : undefined;

    const filterWithNumericPrice = {
      price: numericPrice,
      ...restFilter,
    };

    debouncedHandleFilterChange(filterWithNumericPrice);
  };

  console.log(prodsCount);

  return (
    <Container>
      <h1 className="text-4xl font-semibold">Product List</h1>

      <Filter onFilterChange={handleFilterChange} />
      {!error ? (
        <List
          loading={loading}
          products={products}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          allProdsCount={prodsCount}
        />
      ) : (
        <ErrorMessage message={error} />
      )}
    </Container>
  );
};

export default Home;
