'use client';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { AuthContextType } from '../types';

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

// 인증 컨텍스트 프로바이더 컴포넌트
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // 로그인 함수
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err: any) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      console.error('Login error:', err);
      return false;
    }
  };

  // 로그아웃 함수
  const logout = async (): Promise<boolean> => {
    try {
      await signOut(auth);
      return true;
    } catch (err: any) {
      console.error('Logout error:', err);
      return false;
    }
  };

  // 사용자 인증 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  // 컨텍스트 값
  const value: AuthContextType = {
    currentUser,
    isAdmin: !!currentUser,
    login,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 인증 컨텍스트 사용을 위한 커스텀 훅
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}