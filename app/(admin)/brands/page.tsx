import BrandTable from "@/components/brand-table";

export default function BrandsPage() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">브랜드 리스트</h1>
      <div className="bg-white rounded-lg">
        <BrandTable />
      </div>
    </div>
  );
} 