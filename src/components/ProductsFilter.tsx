import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import makeApiRequest from "@/lib/api";
import ActionTypes from "@/types/ActionTypes";

const FormSchema = z.object({
  price: z.string().optional(),
  brand: z.string().optional(),
  product: z.string().optional(),
});

type ApiResponse = {
  data: {
    result: string[];
  };
};

type FilterProps = {
  onFilterChange: (filter: {
    price?: number;
    brand?: string;
    product?: string;
  }) => void;
};

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [brandFields, setBrandFields] = useState<string[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      price: undefined,
      brand: "",
      product: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [brandResponse, priceResponse] = await Promise.all([
        //   makeApiRequest({
        //     action: ActionTypes.GET_FIELDS,
        //     params: { field: "brand" },
        //   }),
        //   makeApiRequest({
        //     action: ActionTypes.GET_FIELDS,
        //     params: { field: "price" },
        //   }),
        // ]);
        // const filteredPriceFields = Array.from(
        //   new Set(priceResponse.data.result.filter((value) => value !== null))
        // ).sort();
        // setPriceFields(filteredPriceFields);

        const brandResponse = (await makeApiRequest({
          action: ActionTypes.GET_FIELDS,
          params: { field: "brand" },
        })) as ApiResponse;

        const filteredBrandFields: string[] = Array.from(
          new Set(brandResponse.data.result.filter((value) => value !== null))
        ).sort();

        setBrandFields(filteredBrandFields);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => {
        const trimmedValue = value?.trim();

        return (
          trimmedValue !== null &&
          trimmedValue !== undefined &&
          trimmedValue !== ""
        );
      })
    );

    onFilterChange(filteredData);
  }

  return (
    <div className="my-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-2"
        >
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormItem>
                  <FormControl>
                    <Input placeholder="Price" {...field} />
                  </FormControl>
                </FormItem>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Product" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandFields.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button type="submit">Фильтр</Button>
        </form>
      </Form>
    </div>
  );
};

export default Filter;
