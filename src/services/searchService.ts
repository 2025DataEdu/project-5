
import { logSearch } from "./analyticsService";
import { SearchResult } from "@/types/searchTypes";
import { removeDuplicates } from "@/utils/searchUtils";
import { searchDocuments } from "./documentSearchService";
import { searchPdfDocuments } from "./pdfSearchService";
import { searchEmployees } from "./employeeSearchService";

// 메인 검색 인터페이스 (기존 호환성 유지)
export type { SearchResult } from "@/types/searchTypes";

export const performSearch = async (query: string): Promise<SearchResult[]> => {
  console.log('🚀 Starting combined search for query:', query);
  
  const searchResults: SearchResult[] = [];
  const searchErrors: string[] = [];

  try {
    const documentResults = await searchDocuments(query);
    searchResults.push(...documentResults);
    console.log(`📊 Documents found: ${documentResults.length}`);
  } catch (error) {
    const errorMsg = `결재문서 검색 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
    searchErrors.push(errorMsg);
    console.error('📄 Document search failed:', error);
  }

  try {
    const pdfResults = await searchPdfDocuments(query);
    searchResults.push(...pdfResults);
    console.log(`📊 PDFs found: ${pdfResults.length}`);
  } catch (error) {
    const errorMsg = `PDF문서 검색 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
    searchErrors.push(errorMsg);
    console.error('📁 PDF search failed:', error);
  }

  try {
    const employeeResults = await searchEmployees(query);
    searchResults.push(...employeeResults);
    console.log(`📊 Employees found: ${employeeResults.length}`);
  } catch (error) {
    const errorMsg = `직원정보 검색 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
    searchErrors.push(errorMsg);
    console.error('👥 Employee search failed:', error);
  }

  // 중복 제거 적용
  const uniqueResults = removeDuplicates(searchResults);

  console.log('📊 Search results summary:', {
    totalResults: searchResults.length,
    uniqueResults: uniqueResults.length,
    duplicatesRemoved: searchResults.length - uniqueResults.length,
    errors: searchErrors.length,
    searchErrors,
    resultsByType: {
      documents: uniqueResults.filter(r => r.type === '결재문서').length,
      pdfs: uniqueResults.filter(r => r.type === 'PDF문서').length,
      employees: uniqueResults.filter(r => r.type === '직원정보').length
    }
  });

  // 검색 로그 기록
  await logSearch(query, uniqueResults.length);
  
  if (searchErrors.length > 0 && uniqueResults.length === 0) {
    throw new Error(`검색 실패: ${searchErrors.join(', ')}`);
  }
  
  return uniqueResults;
};

// 기존 개별 검색 함수들을 재활용 (기존 호환성 유지)
export { searchDocuments } from "./documentSearchService";
export { searchPdfDocuments } from "./pdfSearchService";
export { searchEmployees } from "./employeeSearchService";
