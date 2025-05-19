// src/utils/sampleData.ts
import { Project } from '../types';

// 샘플 프로젝트 데이터
export const sampleProjects: Project[] = [
  {
    id: 'sample-1',
    title: "쇼핑몰 웹 서비스",
    description: "React와 Spring Boot를 활용한 풀스택 쇼핑몰 웹 서비스입니다. 상품 검색, 장바구니, 결제 기능을 구현했습니다.",
    techStack: {
      fieldSkill: ["React", "TypeScript", "Redux", "Styled-components"],
      server: ["AWS EC2", "AWS S3", "Docker", "Jenkins"],
      os: ["Windows", "Linux"],
      collaboration: ["Git", "GitHub", "Slack", "Notion"],
      tools: ["VSCode", "IntelliJ", "Postman"],
      db: ["MySQL", "Redis"],
    },
    contribution: {
      intro: "이 프로젝트는 온라인 쇼핑몰 서비스로, 사용자가 다양한 상품을 검색하고 구매할 수 있는 웹 애플리케이션입니다.",
      period: "2024.01 ~ 2024.03 (3개월)",
      members: "프론트엔드 2명, 백엔드 3명",
      keyFeatures: [
        "상품 검색 및 필터링 기능",
        "장바구니 및 주문 관리",
        "실시간 재고 확인",
        "결제 시스템 연동",
        "사용자 리뷰 및 평점 시스템",
      ],
      teamAchievement: "출시 2개월 만에 월 거래액 1억원 달성, 사용자 만족도 조사 결과 4.8/5.0 획득",
      role: {
        summary: "프론트엔드 개발을 담당하여 사용자 인터페이스와 상호작용 구현",
        details: [
          "React와 TypeScript를 활용한 프론트엔드 아키텍처 설계",
          "Redux를 통한 상태 관리 시스템 구축",
          "반응형 디자인 및 애니메이션 효과 적용",
          "결제 시스템 연동 및 장바구니 기능 구현",
          "성능 최적화 및 코드 리팩토링",
        ],
      },
    },
    apiDesign: {
      auth: [
        { method: "POST", endpoint: "/api/auth/login", description: "사용자 로그인" },
        { method: "POST", endpoint: "/api/auth/register", description: "사용자 회원가입" },
        { method: "GET", endpoint: "/api/auth/verify", description: "토큰 검증" }
      ],
      data: [
        { method: "GET", endpoint: "/api/products", description: "상품 목록 조회" },
        { method: "GET", endpoint: "/api/products/:id", description: "상품 상세 조회" },
        { method: "POST", endpoint: "/api/cart", description: "장바구니 상품 추가" },
        { method: "PUT", endpoint: "/api/cart/:id", description: "장바구니 상품 수정" },
        { method: "DELETE", endpoint: "/api/cart/:id", description: "장바구니 상품 삭제" },
      ]
    },
    screenshots: [
      { image: "", description: "메인 페이지" },
      { image: "", description: "상품 상세 페이지" },
      { image: "", description: "장바구니 페이지" },
      { image: "", description: "결제 페이지" }
    ],
    architecture: {
      image: "",
      description: "쇼핑몰 웹 서비스 아키텍처"
    }
  },
  {
    id: 'sample-2',
    title: "헬스케어 모바일 앱",
    description: "Flutter를 활용한 헬스케어 모바일 애플리케이션으로, 운동 기록과 건강 관리를 도와주는 서비스입니다.",
    techStack: {
      fieldSkill: ["Flutter", "Dart", "Provider", "Firebase"],
      server: ["Firebase Cloud Functions", "Google Cloud Platform"],
      os: ["Android", "iOS"],
      collaboration: ["Git", "Jira", "Confluence"],
      tools: ["Android Studio", "XCode", "Firebase Console"],
      db: ["Firebase Firestore", "SQLite"],
    },
    contribution: {
      intro: "사용자의 건강 정보를 관리하고 운동 계획을 수립할 수 있는 모바일 애플리케이션입니다.",
      period: "2023.09 ~ 2024.01 (5개월)",
      members: "Flutter 개발자 2명, 백엔드 1명, 디자이너 1명",
      keyFeatures: [
        "건강 데이터 수집 및 분석",
        "운동 계획 자동 생성",
        "식단 관리 및 칼로리 계산",
        "수면 패턴 분석",
        "건강 상태 리포트 생성",
      ],
      teamAchievement: "구글 플레이스토어 다운로드 5만 건 달성, 건강관리 앱 카테고리 상위 10위 진입",
      role: {
        summary: "Flutter 개발자로서 모바일 앱 전반적인 UI/UX 개발",
        details: [
          "Flutter와 Dart를 활용한 크로스 플랫폼 애플리케이션 개발",
          "Provider 상태관리 패턴 적용 및 구현",
          "Firebase 연동을 통한 사용자 인증 및 데이터 처리",
          "건강 데이터 시각화 기능 개발",
          "네이티브 센서(걸음 수 측정, GPS 등) 통합",
        ],
      },
    },
    apiDesign: {
      auth: [
        { method: "POST", endpoint: "/api/auth/login", description: "사용자 로그인" },
        { method: "POST", endpoint: "/api/auth/social", description: "소셜 로그인" },
        { method: "GET", endpoint: "/api/auth/profile", description: "사용자 프로필 조회" }
      ],
      data: [
        { method: "GET", endpoint: "/api/health/summary", description: "건강 데이터 요약 조회" },
        { method: "POST", endpoint: "/api/health/record", description: "건강 데이터 기록" },
        { method: "GET", endpoint: "/api/workout/plans", description: "운동 계획 조회" },
        { method: "POST", endpoint: "/api/workout/complete", description: "운동 완료 처리" }
      ]
    },
    screenshots: [
      { image: "", description: "메인 대시보드" },
      { image: "", description: "건강 데이터 그래프" },
      { image: "", description: "운동 계획 화면" },
      { image: "", description: "식단 관리 화면" }
    ],
    architecture: {
      image: "",
      description: "헬스케어 모바일 앱 아키텍처"
    }
  }
];