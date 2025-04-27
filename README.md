# SSG 크롤링 관리 시스템

이 시스템은 SSG 카테고리, 브랜드, 제품 정보를 관리하는 웹 애플리케이션입니다. 크롤링 작업에 필요한 정보를 효율적으로 관리하고 업데이트할 수 있습니다.

## 주요 기능

### 카테고리 관리
- 1~4단계 카테고리 구조의 완전한 CRUD 기능
- 카테고리 계층 관리: 1단계 → 2단계 → 3단계 → 4단계
- 4단계 카테고리 코드 관리
- SSG 카테고리 매핑 관리
- 고시값 관리 (상품 정보 제공 고시)

### 브랜드 관리
- 브랜드 정보 CRUD 기능
- SSG 브랜드 코드 매핑

### 제품 관리
- 제품 정보 CRUD 기능
- 카테고리, 브랜드 연결 관리
- 제품 상세 정보 관리

### 공통 기능
- 사용자 인증 (Supabase Auth)
- 다크/라이트 테마 지원
- 검색 기능 (카테고리명, 코드, SSG 코드 등)
- 페이지네이션

## 기술 스택

### 프론트엔드
- [Next.js](https://nextjs.org/) - React 프레임워크
- [TypeScript](https://www.typescriptlang.org/) - 정적 타입 언어
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 기반 CSS 프레임워크
- [shadcn/ui](https://ui.shadcn.com/) - 재사용 가능한 UI 컴포넌트

### 백엔드
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - 서버리스 API
- [Supabase](https://supabase.io/) - PostgreSQL 데이터베이스 및 인증

## 데이터베이스 구조

### 주요 테이블
- `category_ai` - 카테고리 정보 저장
   - 1~4단계 카테고리명
   - 4단계 카테고리 코드
   - SSG 카테고리 매핑
   - 고시값
- `brands` - 브랜드 정보 저장
- `products` - 제품 정보 저장

## 프로젝트 구조

```
├── app/                  # Next.js 앱 라우터
│   ├── (admin)/          # 관리자 페이지 (카테고리, 브랜드, 제품)
│   ├── api/              # API 엔드포인트
│   ├── auth/             # 인증 관련 페이지
│   └── protected/        # 인증 필요 페이지
├── components/           # React 컴포넌트
│   ├── ui/               # UI 기본 컴포넌트 (shadcn/ui)
│   └── ...               # 커스텀 컴포넌트
├── lib/                  # 유틸리티 함수 및 라이브러리
├── utils/                # 공통 유틸리티 (Supabase 클라이언트 등)
└── public/               # 정적 파일
```

## 설치 및 실행

1. 의존성 설치
```bash
npm install
```

2. 환경 설정
`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 프로덕션 빌드
```bash
npm run build
```

5. 프로덕션 서버 실행
```bash
npm run start
```

## API 엔드포인트

### 카테고리 API
- `GET /api/categories` - 카테고리 목록 조회 (검색, 페이지네이션 지원)
- `POST /api/categories` - 새 카테고리 추가
- `PUT /api/categories` - 카테고리 수정
- `DELETE /api/categories` - 카테고리 삭제

### 브랜드 API
- `GET /api/brands` - 브랜드 목록 조회
- `POST /api/brands` - 새 브랜드 추가
- `PUT /api/brands` - 브랜드 수정
- `DELETE /api/brands` - 브랜드 삭제

### 제품 API
- `GET /api/products` - 제품 목록 조회
- `POST /api/products` - 새 제품 추가
- `PUT /api/products` - 제품 수정
- `DELETE /api/products` - 제품 삭제

## 사용자 인터페이스

- 반응형 디자인으로 모바일, 태블릿, 데스크톱에 최적화
- 관리자 사이드바를 통한 쉬운 기능 접근
- 다크/라이트 테마 지원으로 사용자 편의성 향상
- 사용자 친화적인 테이블 및 폼 인터페이스

## 라이선스

MIT
