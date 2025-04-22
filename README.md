# Theyunseul 크롤러 웹

이 프로젝트는 SSG 카테고리와 고시값을 관리하는 웹 애플리케이션입니다.

## 주요 기능

- 카테고리 관리 (CRUD)
  - 1~4단계 카테고리명 관리
  - 4단계 카테고리 코드 관리
  - SSG 카테고리 매핑
  - 고시값 관리
- 검색 기능
  - 카테고리명, 코드, SSG 카테고리 검색
- 페이지네이션

## 기술 스택

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui 컴포넌트

## 프로젝트 구조

```
├── app/              # Next.js 앱 라우터
├── components/       # React 컴포넌트
├── lib/             # 유틸리티 함수 및 라이브러리
├── utils/           # 공통 유틸리티
└── public/          # 정적 파일
```

## 설치 및 실행

1. 의존성 설치
```bash
npm install
```

2. 개발 서버 실행
```bash
npm run dev
```

3. 프로덕션 빌드
```bash
npm run build
```

## 환경 변수

`.env.local` 파일에 다음 환경 변수를 설정해야 합니다:

```
DATABASE_URL=your-database-url
```

## API 엔드포인트

- GET `/api/categories` - 카테고리 목록 조회
- POST `/api/categories` - 새 카테고리 추가
- PUT `/api/categories` - 카테고리 수정
- DELETE `/api/categories` - 카테고리 삭제

## 라이선스

MIT
