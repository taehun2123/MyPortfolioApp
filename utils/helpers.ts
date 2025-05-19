/**
 * 문자열의 첫 글자를 대문자로 변환
 * @param str 변환할 문자열
 * @returns 첫 글자가 대문자로 변환된 문자열
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 객체가 비어있는지 확인
 * @param obj 확인할 객체
 * @returns 비어있으면 true, 아니면 false
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * 배열이 비어있는지 확인
 * @param arr 확인할 배열
 * @returns 비어있으면 true, 아니면 false
 */
export function isEmptyArray<T>(arr: T[] | null | undefined): boolean {
  return !arr || !Array.isArray(arr) || arr.length === 0;
}

/**
 * Firebase 타임스탬프를 날짜 형식으로 변환
 * @param timestamp Firebase 타임스탬프
 * @param format 날짜 형식 (기본값: 'YYYY-MM-DD')
 * @returns 형식화된 날짜 문자열
 */
export function formatTimestamp(
  timestamp: { toDate: () => Date } | null | undefined, 
  format: 'YYYY-MM-DD' | 'YYYY.MM.DD' | 'YYYY년 MM월 DD일' = 'YYYY-MM-DD'
): string {
  if (!timestamp || !timestamp.toDate) return '';
  
  const date = timestamp.toDate();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  } else if (format === 'YYYY.MM.DD') {
    return `${year}.${month}.${day}`;
  } else if (format === 'YYYY년 MM월 DD일') {
    return `${year}년 ${month}월 ${day}일`;
  }
  
  return `${year}-${month}-${day}`;
}

/**
 * 중복 항목을 제거한 배열 반환
 * @param arr 원본 배열
 * @returns 중복이 제거된 배열
 */
export function removeDuplicates<T>(arr: T[]): T[] {
  if (!arr || !Array.isArray(arr)) return [];
  return [...new Set(arr)];
}

/**
 * 두 날짜 사이의 개월 수 계산
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜
 * @returns 개월 수
 */
export function monthsBetween(startDate: Date, endDate: Date): number {
  if (!startDate || !endDate) return 0;
  
  const months = 
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
    (endDate.getMonth() - startDate.getMonth());
  
  return months;
}

/**
 * API 메서드에 따른 색상 반환
 * @param method API 메서드
 * @returns 해당 메서드에 대한 스타일 객체
 */
export function getMethodColor(method: string): { backgroundColor: string; color: string } {
  switch (method) {
    case 'GET':
      return { backgroundColor: '#E8F5E9', color: '#2E7D32' }; // 연한 녹색
    case 'POST':
      return { backgroundColor: '#E3F2FD', color: '#1565C0' }; // 연한 파란색
    case 'PUT':
      return { backgroundColor: '#FFF8E1', color: '#F57F17' }; // 연한 노란색
    case 'DELETE':
      return { backgroundColor: '#FFEBEE', color: '#C62828' }; // 연한 빨간색
    default:
      return { backgroundColor: '#F5F5F5', color: '#616161' }; // 연한 회색
  }
}

/**
 * 주어진 URL이 이미지 URL인지 확인
 * @param url 확인할 URL
 * @returns 이미지 URL이면 true, 아니면 false
 */
export function isImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // 이미지 확장자 패턴 확인
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
  return imageExtensions.test(url);
}

/**
 * 특정 길이가 넘어가는 문자열 자르기
 * @param text 원본 문자열
 * @param maxLength 최대 길이
 * @param suffix 생략 기호 (기본값: '...')
 * @returns 잘린 문자열
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
}