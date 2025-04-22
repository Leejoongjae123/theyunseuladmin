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

interface Category {
  id: string;
  c1_name: string;
  c2_name: string;
  c3_name: string;
  c4_name: string;
  c4_code: string;
  ssg_category: string;
  gosiValue: string;
}

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    c1_name: "",
    c2_name: "",
    c3_name: "",
    c4_name: "",
    c4_code: "",
    ssg_category: "",
    gosiValue: "",
  });

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchQuery]);

  const fetchCategories = async () => {
    const response = await fetch(`/api/categories?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`);
    const { data, count } = await response.json();
    setCategories(data);
    setTotalCount(count || 0);
  };

  const handleAdd = async () => {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setIsAddModalOpen(false);
      fetchCategories();
      setFormData({ 
        c1_name: "",
        c2_name: "",
        c3_name: "",
        c4_name: "",
        c4_code: "", 
        ssg_category: "",
        gosiValue: "",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedCategory) return;

    const response = await fetch("/api/categories", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedCategory.id,
        ...formData,
      }),
    });

    if (response.ok) {
      setIsEditModalOpen(false);
      fetchCategories();
      setFormData({ 
        c1_name: "",
        c2_name: "",
        c3_name: "",
        c4_name: "",
        c4_code: "", 
        ssg_category: "",
        gosiValue: "",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCategories();
      }
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      c1_name: category.c1_name,
      c2_name: category.c2_name,
      c3_name: category.c3_name,
      c4_name: category.c4_name,
      c4_code: category.c4_code,
      ssg_category: category.ssg_category,
      gosiValue: category.gosiValue,
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
            <div className="w-full p-2">
              <Input
                placeholder="1~4단계 카테고리명, 4단계 카테고리 코드, SSG 카테고리 검색"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>카테고리 추가</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>카테고리 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="c1_name">1단계 카테고리명</Label>
                    <Input
                      id="c1_name"
                      value={formData.c1_name}
                      onChange={(e) =>
                        setFormData({ ...formData, c1_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c2_name">2단계 카테고리명</Label>
                    <Input
                      id="c2_name"
                      value={formData.c2_name}
                      onChange={(e) =>
                        setFormData({ ...formData, c2_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c3_name">3단계 카테고리명</Label>
                    <Input
                      id="c3_name"
                      value={formData.c3_name}
                      onChange={(e) =>
                        setFormData({ ...formData, c3_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c4_name">4단계 카테고리명</Label>
                    <Input
                      id="c4_name"
                      value={formData.c4_name}
                      onChange={(e) =>
                        setFormData({ ...formData, c4_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c4_code">4단계 카테고리 코드</Label>
                    <Input
                      id="c4_code"
                      value={formData.c4_code}
                      onChange={(e) =>
                        setFormData({ ...formData, c4_code: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ssg_category">SSG 카테고리</Label>
                    <Input
                      id="ssg_category"
                      value={formData.ssg_category}
                      onChange={(e) =>
                        setFormData({ ...formData, ssg_category: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gosiValue">고시값</Label>
                    <Input
                      id="gosiValue"
                      value={formData.gosiValue}
                      onChange={(e) =>
                        setFormData({ ...formData, gosiValue: e.target.value })
                      }
                    />
                  </div>
                  <Button onClick={handleAdd}>추가</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="md:w-full w-[100vw] overflow-x-auto">
            <Table className="min-w-[1200px] w-full">
              <TableHeader>
                <TableRow>
                <TableHead>1단계 카테고리명</TableHead>
                <TableHead>2단계 카테고리명</TableHead>
                <TableHead>3단계 카테고리명</TableHead>
                <TableHead>4단계 카테고리명</TableHead>
                  <TableHead>4단계 카테고리 코드</TableHead>
                  <TableHead>SSG 카테고리 코드</TableHead>
                  <TableHead>고시값</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.c1_name}</TableCell>
                    <TableCell>{category.c2_name}</TableCell>
                    <TableCell>{category.c3_name}</TableCell>
                    <TableCell>{category.c4_name}</TableCell>
                    <TableCell>{category.c4_code}</TableCell>
                    <TableCell>{category.ssg_category}</TableCell>
                    <TableCell>{category.gosiValue}</TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Dialog
                          open={isEditModalOpen}
                          onOpenChange={setIsEditModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => openEditModal(category)}
                            >
                              수정
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>카테고리 수정</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-c1_name">1단계 카테고리명</Label>
                                <Input
                                  id="edit-c1_name"
                                  value={formData.c1_name}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      c1_name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-c2_name">2단계 카테고리명</Label>
                                <Input
                                  id="edit-c2_name"
                                  value={formData.c2_name}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      c2_name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-c3_name">3단계 카테고리명</Label>
                                <Input
                                  id="edit-c3_name"
                                  value={formData.c3_name}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      c3_name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-c4_name">4단계 카테고리명</Label>
                                <Input
                                  id="edit-c4_name"
                                  value={formData.c4_name}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      c4_name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-c4_code">4단계 카테고리 코드</Label>
                                <Input
                                  id="edit-c4_code"
                                  value={formData.c4_code}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      c4_code: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-ssg_category">SSG 카테고리</Label>
                                <Input
                                  id="edit-ssg_category"
                                  value={formData.ssg_category}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      ssg_category: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-gosiValue">고시값</Label>
                                <Input
                                  id="edit-gosiValue"
                                  value={formData.gosiValue}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      gosiValue: e.target.value,
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
                          onClick={() => handleDelete(category.id)}
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