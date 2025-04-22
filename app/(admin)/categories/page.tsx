import CategoryTable from "@/components/category-table";

export default function CategoriesPage() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">카테고리 리스트</h1>
      <div className="bg-white rounded-lg">
        <CategoryTable />
      </div>
    </div>
  );
} 