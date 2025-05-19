// utils/firebaseHelpers.ts 생성
/**
 * Firebase에 저장하기 전에 객체에서 빈 필드를 제거하는 함수
 * Firestore는 빈 문자열('')이나 undefined 값이 포함된 필드를 허용하지 않습니다.
 * @param obj 정리할 객체
 * @returns 빈 필드가 제거된 객체
 */
export function cleanObjectForFirestore(obj: any): any {
  // null이거나 primitive 타입이면 바로 리턴
  if (obj === null || typeof obj !== 'object') {
    return obj === '' ? null : obj; // 빈 문자열은 null로 변환
  }

  // 배열이면 각 항목을 재귀적으로 정리
  if (Array.isArray(obj)) {
    const cleanedArray = obj
      .map(item => cleanObjectForFirestore(item))
      .filter(item => item !== null); // null 항목 제거
    
    return cleanedArray.length > 0 ? cleanedArray : null;
  }

  // 객체면 각 필드를 재귀적으로 정리
  const cleanedObj: any = {};
  let hasValidField = false;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const cleanedValue = cleanObjectForFirestore(obj[key]);
      
      if (cleanedValue !== null) {
        cleanedObj[key] = cleanedValue;
        hasValidField = true;
      }
    }
  }

  return hasValidField ? cleanedObj : null;
}