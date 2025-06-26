
import { SearchResult } from "@/types/searchTypes";

// 문서의 고유 식별자를 생성하는 함수
export const generateDocumentId = (doc: any, type: string): string => {
  if (doc.id) {
    return `${type}-${doc.id}`;
  }
  // 제목과 부서명을 조합하여 일관된 ID 생성
  const titleHash = doc.제목 || doc.title || doc.담당업무 || 'untitled';
  const deptHash = doc.전체부서명 || doc.department || doc.부서명 || 'unknown';
  const normalized = `${titleHash}-${deptHash}`.replace(/\s+/g, '-').toLowerCase();
  return `${type}-${normalized}`;
};

// 문서 제목을 정규화하는 함수
export const normalizeTitle = (title: string): string => {
  return title?.trim().replace(/\s+/g, ' ') || '';
};

// 강화된 중복 제거 함수
export const removeDuplicates = (results: SearchResult[]): SearchResult[] => {
  const seen = new Set<string>();
  const uniqueResults: SearchResult[] = [];
  
  console.log('🔍 Starting duplicate removal for', results.length, 'results');
  
  for (const result of results) {
    // 여러 기준으로 중복 검사
    const titleKey = normalizeTitle(result.title);
    const deptKey = result.department || '';
    const typeKey = result.type || '';
    
    // 복합 키 생성: 제목 + 부서 + 타입
    const compositeKey = `${titleKey}|${deptKey}|${typeKey}`.toLowerCase();
    
    if (!seen.has(compositeKey)) {
      seen.add(compositeKey);
      uniqueResults.push(result);
      console.log('✅ Added unique result:', { title: titleKey, department: deptKey, type: typeKey });
    } else {
      console.log('🔄 Skipped duplicate:', { title: titleKey, department: deptKey, type: typeKey });
    }
  }
  
  console.log(`🎯 Duplicate removal completed: ${results.length} -> ${uniqueResults.length}`);
  return uniqueResults;
};
