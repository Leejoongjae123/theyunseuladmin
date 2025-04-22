"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Brand {
  id: string;
  category: string;
  brand_name: string;
  brand_code: string;
}

export default function BrandTable() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    category: "",
    brand_name: "",
    brand_code: "",
  });

  useEffect(() => {
    fetchBrands();
  }, [currentPage, searchQuery]);

  const fetchBrands = async () => {
    const response = await fetch(`/api/brands?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`);
    const { data, count } = await response.json();
    setBrands(data);
    setTotalCount(count || 0);
  };

  const handleAdd = async () => {
    const response = await fetch("/api/brands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setIsAddModalOpen(false);
      fetchBrands();
      setFormData({ category: "", brand_name: "", brand_code: "" });
    }
  };

  const handleEdit = async () => {
    if (!selectedBrand) return;

    const response = await fetch("/api/brands", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedBrand.id,
        ...formData,
      }),
    });

    if (response.ok) {
      setIsEditModalOpen(false);
      fetchBrands();
      setFormData({ category: "", brand_name: "", brand_code: "" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const response = await fetch(`/api/brands?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBrands();
      }
    }
  };

  const openEditModal = (brand: Brand) => {
    setSelectedBrand(brand);
    setFormData({
      category: brand.category,
      brand_name: brand.brand_name,
      brand_code: brand.brand_code,
    });
    setIsEditModalOpen(true);
  };

  // 페이지네이션 관련 계산
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="w-1/3 p-2">
              <Input
                placeholder="카테고리, 브랜드명, 브랜드코드 검색"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>브랜드 추가</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>브랜드 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">카테고리</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand_name">브랜드명</Label>
                    <Input
                      id="brand_name"
                      value={formData.brand_name}
                      onChange={(e) =>
                        setFormData({ ...formData, brand_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand_code">브랜드 코드</Label>
                    <Input
                      id="brand_code"
                      value={formData.brand_code}
                      onChange={(e) =>
                        setFormData({ ...formData, brand_code: e.target.value })
                      }
                    />
                  </div>
                  <Button onClick={handleAdd}>추가</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="md:w-full w-[100vw] overflow-x-auto">
            <Table className="min-w-[700px] w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>카테고리</TableHead>
                  <TableHead>브랜드명</TableHead>
                  <TableHead>브랜드 코드</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>{brand.category}</TableCell>
                    <TableCell>{brand.brand_name}</TableCell>
                    <TableCell>{brand.brand_code}</TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Dialog
                          open={isEditModalOpen}
                          onOpenChange={setIsEditModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => openEditModal(brand)}
                            >
                              수정
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>브랜드 수정</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-category">카테고리</Label>
                                <Input
                                  id="edit-category"
                                  value={formData.category}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      category: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-brand_name">브랜드명</Label>
                                <Input
                                  id="edit-brand_name"
                                  value={formData.brand_name}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      brand_name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-brand_code">
                                  브랜드 코드
                                </Label>
                                <Input
                                  id="edit-brand_code"
                                  value={formData.brand_code}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      brand_code: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <Button onClick={handleEdit}>수정</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(brand.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="flex-none flex justify-center items-center space-x-2 mt-4 mb-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          이전
        </Button>
        <span className="text-sm">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
