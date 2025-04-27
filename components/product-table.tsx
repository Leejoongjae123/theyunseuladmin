"use client";

import { useState, useEffect, useRef } from "react";
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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Progress } from "./ui/progress";

interface Product {
  id: string;
  vendorGoodsCode: string;
  goodsCode: string;
  title?: string;
  price?: number;
  brand?: string;
  category?: string;
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    vendorGoodsCode: "",
    goodsCode: "",
    title: "",
    price: "",
    brand: "",
    category: "",
  });
  
  // 삭제 관련 상태
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleteResults, setDeleteResults] = useState<{
    total: number;
    success: number;
    failed: number;
    failedItems: string[];
  }>({
    total: 0,
    success: 0,
    failed: 0,
    failedItems: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]);

  const fetchProducts = async () => {
    const response = await fetch(`/api/products?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`);
    const { data, count } = await response.json();
    setProducts(data);
    setTotalCount(count || 0);
  };

  const handleAdd = async () => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setIsAddModalOpen(false);
      fetchProducts();
      setFormData({ 
        vendorGoodsCode: "",
        goodsCode: "",
        title: "",
        price: "",
        brand: "",
        category: "",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedProduct) return;

    const response = await fetch("/api/products", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedProduct.id,
        ...formData,
      }),
    });

    if (response.ok) {
      setIsEditModalOpen(false);
      fetchProducts();
      setFormData({ 
        vendorGoodsCode: "",
        goodsCode: "",
        title: "",
        price: "",
        brand: "",
        category: "",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts();
      }
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      vendorGoodsCode: product.vendorGoodsCode || "",
      goodsCode: product.goodsCode || "",
      title: product.title || "",
      price: product.price?.toString() || "",
      brand: product.brand || "",
      category: product.category || "",
    });
    setIsEditModalOpen(true);
  };

  // 페이지네이션 관련 계산
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // 엑셀 템플릿 다운로드 함수
  const downloadExcelTemplate = () => {
    // 헤더 행 생성
    const header = ["vendorGoodsCode"];
    
    // 샘플 데이터 행 생성 (예시로 비워둠)
    const sampleData = [
      ["샘플_판매자상품코드1"],
      ["샘플_판매자상품코드2"],
    ];
    
    // 워크시트 생성
    const ws = XLSX.utils.aoa_to_sheet([header, ...sampleData]);
    
    // 워크북 생성 및 워크시트 추가
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "삭제할상품목록");
    
    // 엑셀 파일 생성 및 다운로드
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, "상품삭제_양식.xlsx");
  };

  // 파일 업로드 처리 함수
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // 엑셀 파일 읽기 함수
  const readExcelFile = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as { vendorGoodsCode: string }[];
          
          // vendorGoodsCode 컬럼 값만 추출
          const vendorGoodsCodes = jsonData.map(row => row.vendorGoodsCode).filter(Boolean);
          resolve(vendorGoodsCodes);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // 대량 삭제 처리
  const handleBulkDelete = async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setProgress(0);
      setDeleteResults({
        total: 0,
        success: 0,
        failed: 0,
        failedItems: []
      });
      
      // 엑셀 파일에서 데이터 읽기
      const vendorGoodsCodes = await readExcelFile(file);
      
      const total = vendorGoodsCodes.length;
      setDeleteResults(prev => ({ ...prev, total }));
      
      // 각 코드별로 삭제 요청 보내기
      for (let i = 0; i < vendorGoodsCodes.length; i++) {
        const code = vendorGoodsCodes[i];
        try {
          const response = await fetch(`/api/products/bulk-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ vendorGoodsCode: code }),
          });
          
          if (response.ok) {
            setDeleteResults(prev => ({ ...prev, success: prev.success + 1 }));
          } else {
            setDeleteResults(prev => ({ 
              ...prev, 
              failed: prev.failed + 1,
              failedItems: [...prev.failedItems, code]
            }));
          }
        } catch (error) {
          setDeleteResults(prev => ({ 
            ...prev, 
            failed: prev.failed + 1,
            failedItems: [...prev.failedItems, code]
          }));
        }
        
        // 진행률 업데이트
        setProgress(Math.round(((i + 1) / total) * 100));
      }
      
      // 완료 후 상품 목록 새로고침
      fetchProducts();
      
    } catch (error) {
      console.error("대량 삭제 중 오류 발생:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // 파일 업로드 폼 초기화
  const resetFileUpload = () => {
    setFile(null);
    setProgress(0);
    setDeleteResults({
      total: 0,
      success: 0,
      failed: 0,
      failedItems: []
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="w-full p-2">
              <Input
                placeholder="판매자 상품코드, 상품코드, 상품명 검색"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              {/* <DialogTrigger asChild>
                <Button>상품 추가</Button>
              </DialogTrigger> */}
              
              <Button 
                className="ml-2" 
                variant="outline" 
                onClick={() => setIsBulkDeleteModalOpen(true)}
              >
                상품 대량 삭제
              </Button>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>상품 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorGoodsCode">판매자 상품코드</Label>
                    <Input
                      id="vendorGoodsCode"
                      value={formData.vendorGoodsCode}
                      onChange={(e) =>
                        setFormData({ ...formData, vendorGoodsCode: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goodsCode">상품코드</Label>
                    <Input
                      id="goodsCode"
                      value={formData.goodsCode}
                      onChange={(e) =>
                        setFormData({ ...formData, goodsCode: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">상품명</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">가격</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">브랜드</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                    />
                  </div>
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
                  <Button onClick={handleAdd}>추가</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 대량 삭제 모달 */}
          <Dialog 
            open={isBulkDeleteModalOpen} 
            onOpenChange={(open) => {
              setIsBulkDeleteModalOpen(open);
              if (!open) {
                resetFileUpload();
              }
            }}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>상품 대량 삭제</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <Button
                      variant="outline" 
                      onClick={downloadExcelTemplate}
                      className="mb-4"
                    >
                      삭제 양식 다운로드
                    </Button>
                  </div>
                  
                  <Label htmlFor="excel-file">엑셀 파일 업로드</Label>
                  <Input
                    id="excel-file"
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  <p className="text-sm text-gray-500">
                    삭제할 상품의 판매자 상품코드(vendorGoodsCode)가 포함된 엑셀 파일을 업로드하세요.
                  </p>
                </div>
                
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>진행률</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
                
                {deleteResults.total > 0 && !isUploading && (
                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium">삭제 결과</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-sm text-gray-500">전체</p>
                        <p className="font-bold">{deleteResults.total}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-500">성공</p>
                        <p className="font-bold text-green-600">{deleteResults.success}</p>
                      </div>
                      <div>
                        <p className="text-sm text-red-500">실패</p>
                        <p className="font-bold text-red-600">{deleteResults.failed}</p>
                      </div>
                    </div>
                    
                    {deleteResults.failedItems.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-red-500">실패한 항목:</p>
                        <div className="max-h-24 overflow-y-auto text-xs">
                          {deleteResults.failedItems.map((item, index) => (
                            <p key={index}>{item}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={resetFileUpload} disabled={isUploading}>
                    초기화
                  </Button>
                  <Button onClick={handleBulkDelete} disabled={!file || isUploading}>
                    {isUploading ? "삭제 중..." : "삭제 실행"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="md:w-full w-[100vw] overflow-x-auto">
            <Table className="min-w-[1200px] w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>판매자 상품코드</TableHead>
                  <TableHead>상품코드</TableHead>

                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.vendorGoodsCode}</TableCell>
                    <TableCell>{product.goodsCode}</TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Dialog
                          open={isEditModalOpen}
                          onOpenChange={setIsEditModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => openEditModal(product)}
                            >
                              수정
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>상품 수정</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-vendorGoodsCode">판매자 상품코드</Label>
                                <Input
                                  id="edit-vendorGoodsCode"
                                  value={formData.vendorGoodsCode}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      vendorGoodsCode: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-goodsCode">상품코드</Label>
                                <Input
                                  id="edit-goodsCode"
                                  value={formData.goodsCode}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      goodsCode: e.target.value,
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
                          onClick={() => handleDelete(product.id)}
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