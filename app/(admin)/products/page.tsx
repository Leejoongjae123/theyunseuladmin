import ProductTable from "@/components/product-table";

export default function ProductsPage() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">상품 리스트</h1>
      <div className="bg-white rounded-lg">
        <ProductTable />
      </div>
    </div>
  );
} 