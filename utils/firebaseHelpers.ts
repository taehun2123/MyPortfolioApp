/**
 * Firebase에 저장하기 전에 객체에서 빈 필드를 제거하는 함수
 * Firestore는 빈 문자열('')이나 undefined 값이 포함된 필드를 허용하지 않습니다.
 * @param obj 정리할 객체
 * @returns 빈 필드가 제거된 객체
 */
export function cleanObjectForFirestore(obj: any): any {
  // null이면 null 리턴
  if (obj === null) return null;
  
  // primitive 타입이면 바로 리턴
  if (typeof obj !== 'object') {
    return obj === '' ? null : obj; // 빈 문자열은 null로 변환
  }

  // 배열이면 각 항목을 재귀적으로 정리
  if (Array.isArray(obj)) {
    const cleanedArray = obj
      .map(item => cleanObjectForFirestore(item))
      .filter(item => item !== null && item !== undefined); // null/undefined 항목 제거
    
    return cleanedArray.length > 0 ? cleanedArray : [];  // 변경: 빈 배열 유지하도록 수정
  }

  // 객체면 각 필드를 재귀적으로 정리
  const cleanedObj: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const cleanedValue = cleanObjectForFirestore(obj[key]);
      
      // null이 아니면 정리된 객체에 포함
      if (cleanedValue !== null && cleanedValue !== undefined) {
        cleanedObj[key] = cleanedValue;
      }
    }
  }

  return cleanedObj;  // 변경: 모든 경우에 object 리턴 (빈 객체 가능)
}

/**
 * 객체의 중첩 필드 존재 여부 확인 및 기본값 설정
 * @param obj 검사할 객체
 * @param path 점으로 구분된 경로 (예: 'user.profile.name')
 * @param defaultValue 경로가 존재하지 않을 경우 반환할 기본값
 * @returns 해당 경로의 값 또는 기본값
 */
export function getNestedValue(obj: any, path: string, defaultValue: any = undefined): any {
  if (!obj || !path) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || !Object.prototype.hasOwnProperty.call(current, key)) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current !== undefined ? current : defaultValue;
}

/**
 * 객체의 중첩 필드 설정
 * @param obj 수정할 객체
 * @param path 점으로 구분된 경로 (예: 'user.profile.name')
 * @param value 설정할 값
 * @returns 수정된 객체 사본
 */
export function setNestedValue(obj: any, path: string, value: any): any {
  if (!path) return obj;
  
  const result = { ...obj };
  const keys = path.split('.');
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
  
  return result;
}