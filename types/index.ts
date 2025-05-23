// types/index.ts 수정
// 프로필 타입
export interface Profile {
  name: string;
  title: string;
  bio: string;
  profileImage?: string; // 선택적 필드로 변경
  skills: string[];
  links: {
    github: string;
    blog: string;
    email: string;
  };
}

// API 항목 타입
export interface ApiItem {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
}

// 스크린샷 타입
export interface Screenshot {
  image: string;
  description: string;
}

// 프로젝트 타입
export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: {
    fieldSkill: string[];
    server: string[];
    os: string[];
    collaboration: string[];
    tools: string[];
    db: string[];
  };
  contribution: {
    intro: string;
    period: string;
    members: string;
    keyFeatures: string[];
    teamAchievement: string;
    role: {
      summary: string;
      details: string[];
    };
  };
  apiDesign: {
    auth: ApiItem[];
    data: ApiItem[];
  };
  screenshots: Screenshot[];
  order?: number;
  architecture?: {
    image: string;
    description: string;
  };
}

// 로그인 폼 타입
export interface LoginForm {
  email: string;
  password: string;
}

// 프로젝트 CRUD 응답 타입
export interface ProjectResponse {
  success: boolean;
  project?: Project;
  error?: string;
}

// 프로필 CRUD 응답 타입
export interface ProfileResponse {
  success: boolean;
  profile?: Profile;
  error?: string;
}

// Auth 컨텍스트 타입
export interface AuthContextType {
  currentUser: any;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  error: string;
}

// 이미지 관련 타입
export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// 기본 프로필
export const DEFAULT_PROFILE: Profile = {
  name: '홍길동',
  title: '프론트엔드 개발자',
  bio: '개발 경험이 풍부한 프론트엔드 개발자입니다.',
  skills: ['React', 'Flutter', 'JavaScript'],
  links: {
    github: '#',
    blog: '#',
    email: 'email@example.com'
  }
};

// 기본 프로젝트 템플릿
export const EMPTY_PROJECT: Omit<Project, 'id'> = {
  title: '',
  description: '',
  techStack: {
    fieldSkill: [],
    server: [],
    os: [],
    collaboration: [],
    tools: [],
    db: []
  },
  contribution: {
    intro: '',
    period: '',
    members: '',
    keyFeatures: [],
    teamAchievement: '',
    role: {
      summary: '',
      details: []
    }
  },
  apiDesign: {
    auth: [],
    data: []
  },
  screenshots: [],
  architecture: {
    image: '',
    description: ''
  }
};