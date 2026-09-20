// src/components/pos/ProductRow.tsx
import { memo } from "react";
import { Text, View } from "react-native";
import { lineTotalOf } from "../../lib/bill";
import { formatINR } from "../../lib/format";
import type { Product } from "../../mocks/products";
import { QuantityStepper } from "./QuantityStepper";

type Props = {
  product: Product;
  qty: number;
  unitPrice: number; // this customer's price
  onChange: (productId: string, qty: number) => void;
};

function ProductRowBase({ product, qty, unitPrice, onChange }: Props) {
  const selected = qty > 0;
  const isSpecial = unitPrice !== product.price;
  const overStock = qty > product.stock;
  const lowStock = product.stock <= 5;

  return (
    // border-2 always (white when unselected), so selecting never shifts the layout
    <View
      className={`rounded-2xl border-2 bg-white p-3.5 ${
        selected ? "border-brand-600" : "border-white"
      }`}
    >
      <View className="flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <Text
            className="text-base font-semibold text-slate-900"
            numberOfLines={1}
          >
            {product.name}
          </Text>
          <View className="mt-1 flex-row flex-wrap items-center gap-x-2">
            <Text className="text-base font-bold text-brand-700">
              {formatINR(unitPrice)}
              <Text className="text-sm font-normal text-slate-500">
                {" "}
                / {product.unit}
              </Text>
            </Text>
            {isSpecial && (
              <>
                <Text className="text-sm text-slate-400 line-through">
                  {formatINR(product.price)}
                </Text>
                <View className="rounded-full bg-emerald-100 px-2 py-0.5">
                  <Text className="text-xs font-semibold text-emerald-700">
                    Special rate
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Line total appears once the item is on the bill */}
        {selected && (
          <Text className="text-lg font-bold text-slate-900">
            {formatINR(lineTotalOf(unitPrice, qty))}
          </Text>
        )}
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <Text
          className={`text-sm ${
            overStock
              ? "font-semibold text-amber-600"
              : lowStock
                ? "text-amber-600"
                : "text-slate-400"
          }`}
        >
          {overStock
            ? `Only ${product.stock} in stock`
            : `${product.stock} in stock`}
        </Text>
        <QuantityStepper
          value={qty}
          label={product.name}
          onChange={(next) => onChange(product.id, next)}
        />
      </View>
    </View>
  );
}

// memo: typing in one row must not re-render the other rows
export const ProductRow = memo(ProductRowBase);
