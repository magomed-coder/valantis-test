import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import PaginationPoducts from "./Pagination";
import { PRODS_PRO_PAGE } from "@/constants/const";

export type Product = {
  brand: string | null;
  id: string;
  price: number;
  product: string;
};

type ListProps = {
  loading: boolean;
  products: Product[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  allProdsCount: number;
};

const ProdsList: React.FC<ListProps> = ({
  loading,
  products,
  setCurrentPage,
  currentPage,
  allProdsCount,
}) => {
  const totalCount = allProdsCount;
  const prodsPerPage = PRODS_PRO_PAGE;

  return (
    <>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {loading
          ? Array.from({ length: 20 }, (_, index) => (
              <Skeleton key={index} className="h-[230px] border-black" />
            ))
          : products.map((product) => (
              <Card key={product.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>
                    {product.brand ? product.brand : "Неопределенно"}
                  </CardTitle>
                  <CardDescription>{product.product}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    {product.id}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {product.price} &#8381;
                </CardFooter>
              </Card>
            ))}
      </div>

      <div className="py-6">
        {!loading && (
          <PaginationPoducts
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={prodsPerPage}
            onPageChange={(page: React.SetStateAction<number>) =>
              setCurrentPage(page)
            }
          />
        )}
      </div>
    </>
  );
};

export default ProdsList;
