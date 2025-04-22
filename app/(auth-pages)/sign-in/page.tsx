import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  
  // 로그인 성공 시 관리자 페이지로 리다이렉트
  if ("success" in searchParams) {
    redirect("/admin/categories");
  }

  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium text-center">크롤러 관리자 페이지</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">이메일</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">비밀번호</Label>

        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />

        <SubmitButton pendingText="로그인 중중..." formAction={signInAction}>
          로그인
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
