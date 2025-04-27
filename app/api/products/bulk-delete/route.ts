import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { vendorGoodsCode } = body;

  if (!vendorGoodsCode) {
    return NextResponse.json(
      { error: "판매자 상품코드(vendorGoodsCode)가 필요합니다" },
      { status: 400 }
    );
  }

  try {
    console.log(`삭제 요청: vendorGoodsCode=${vendorGoodsCode}`);
    
    // 실제 삭제 전에 해당 상품이 존재하는지 확인
    const { data: existingProduct, error: checkError } = await supabase
      .from("ssgproducts")
      .select("id")
      .eq("vendorGoodsCode", vendorGoodsCode)
      .single();
    
    console.log('삭제 전 확인 결과:', { existingProduct, checkError });

    // vendorGoodsCode로 상품 삭제
    const { data, error, count } = await supabase
      .from("ssgproducts")
      .delete()
      .eq("vendorGoodsCode", vendorGoodsCode)
      .select();

    console.log('삭제 작업 결과:', { data, error, count });

    if (error) {
      return NextResponse.json(
        { error: error.message, vendorGoodsCode },
        { status: 500 }
      );
    }

    // 실제로 삭제된 항목이 없는 경우
    if (data && data.length === 0) {
      return NextResponse.json(
        { success: false, message: "일치하는 상품이 없어 삭제되지 않았습니다", vendorGoodsCode },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, vendorGoodsCode, deletedCount: data ? data.length : 0 },
      { status: 200 }
    );
  } catch (error) {
    console.error("대량 삭제 중 오류 발생:", error);
    return NextResponse.json(
      { error: "Internal server error", vendorGoodsCode },
      { status: 500 }
    );
  }
} 