// app/page.tsx (수정)
'use client';

import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Animated } from 'react-native';
import ProfileSection from '../../components/profile/ProfileSection';
import PortfolioSection from '../../components/portfolio/PortfolioSection';
import LoginModal from '../../components/admin/LoginModal';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 메인 앱 컴포넌트
 */
const MainApp: React.FC = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const { isAdmin, login, logout, error } = useAuth();
  const { width } = Dimensions.get('window');

  // 로그인 핸들러
  const handleLogin = async () => {
    const success = await login(loginEmail, loginPassword);
    if (success) {
      setShowLogin(false);
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    const confirmed = confirm('정말 로그아웃 하시겠습니까?');
    if (confirmed) {
      await logout();
    }
  };

  // 다음 슬라이드로 이동하는 함수
  const goToNextSlide = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: width, animated: true });
      setCurrentPage(1);
    }
  };

  // 이전 슬라이드로 이동하는 함수
  const goToPrevSlide = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
      setCurrentPage(0);
    }
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  // 스크롤 종료 이벤트 핸들러
  const handleScrollEnd = (e: any) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const pageNum = Math.floor(contentOffset.x / layoutMeasurement.width + 0.5);
    setCurrentPage(pageNum);
  };

  return (
    <View style={styles.container}>
      {/* 스크롤 가능한 전체 화면 컨테이너 */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        style={styles.scrollView}
      >
        {/* 프로필 섹션 */}
        <View style={[styles.slide, { width }]}>
          <ProfileSection 
            onNext={goToNextSlide} 
            isAdmin={isAdmin}
            onLoginPress={() => setShowLogin(true)}
            onLogoutPress={handleLogout}
          />
        </View>
        
        {/* 포트폴리오 섹션 */}
        <View style={[styles.slide, { width }]}>
          <PortfolioSection 
            isAdmin={isAdmin} 
            onBackToProfile={goToPrevSlide}
          />
        </View>
      </ScrollView>

      {/* 로그인 모달 */}
      <LoginModal 
        visible={showLogin}
        email={loginEmail}
        setEmail={setLoginEmail}
        password={loginPassword}
        setPassword={setLoginPassword}
        error={error}
        onSubmit={handleLogin}
        onClose={() => setShowLogin(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    height: '100%',
  },
});

export default MainApp;