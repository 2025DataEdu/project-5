
import { supabase } from "@/integrations/supabase/client";
import { logSearch } from "./analyticsService";

export interface SearchResult {
  id: string; // bigint를 문자열로 처리
  title: string;
  content: string;
  source: string;
  department: string;
  lastModified: string;
  fileName: string;
  type: string;
  url: string;
}

export const searchDocuments = async (query: string): Promise<SearchResult[]> => {
  try {
    console.log('🔍 Searching documents with query:', query);
    
    // Search in 결재문서목록 table with improved conditions
    const { data: documents, error: docsError } = await supabase
      .from('결재문서목록')
      .select('*')
      .or(`제목.ilike.%${query}%,전체부서명.ilike.%${query}%`)
      .filter('공개여부', 'ilike', '%공개%') // 공백, 대소문자 무시하고 '공개' 검색
      .order('생성일자', { ascending: false })
      .limit(10);

    console.log('📄 Documents query result:', { documents, error: docsError, queryUsed: query });

    if (docsError) {
      console.error('❌ Error searching documents:', docsError);
      throw new Error(`결재문서 검색 중 오류: ${docsError.message}`);
    }

    if (!documents || documents.length === 0) {
      console.log('📄 No documents found for query:', query);
      return [];
    }

    // Transform documents to SearchResult format
    const documentResults: SearchResult[] = documents.map(doc => {
      console.log('🔄 Transforming document:', doc);
      return {
        id: doc.id?.toString() || '0', // bigint를 문자열로 변환
        title: doc.제목 || '제목 없음',
        content: `${doc.제목 || ''} - ${doc.전체부서명 || ''}에서 작성된 결재문서입니다.`,
        source: "내부문서",
        department: doc.전체부서명 || '미분류',
        lastModified: doc.생성일자 || new Date().toISOString().split('T')[0],
        fileName: `${doc.제목 || 'document'}.pdf`,
        type: "결재문서",
        url: '#'
      };
    });

    console.log('✅ Document results transformed:', documentResults);
    return documentResults;
  } catch (error) {
    console.error('💥 Search documents error:', error);
    throw error;
  }
};

export const searchPdfDocuments = async (query: string): Promise<SearchResult[]> => {
  try {
    console.log('🔍 Searching PDF documents with query:', query);
    
    // Search in pdf_documents table with fuzzy matching
    const { data: pdfDocs, error: pdfError } = await supabase
      .from('pdf_documents')
      .select('*')
      .or(`title.ilike.%${query}%,content_text.ilike.%${query}%,department.ilike.%${query}%,file_name.ilike.%${query}%`)
      .eq('status', 'active')
      .order('upload_date', { ascending: false })
      .limit(10);

    console.log('📁 PDF documents query result:', { pdfDocs, error: pdfError, queryUsed: query });

    if (pdfError) {
      console.error('❌ Error searching PDF documents:', pdfError);
      throw new Error(`PDF문서 검색 중 오류: ${pdfError.message}`);
    }

    if (!pdfDocs || pdfDocs.length === 0) {
      console.log('📁 No PDF documents found for query:', query);
      return [];
    }

    // Transform PDF documents to SearchResult format
    const pdfResults: SearchResult[] = pdfDocs.map(pdf => {
      console.log('🔄 Transforming PDF document:', pdf);
      return {
        id: pdf.id || Math.floor(Math.random() * 1000000).toString(),
        title: pdf.title || pdf.file_name || '제목 없음',
        content: pdf.content_text || `${pdf.title || pdf.file_name}에 대한 PDF 문서입니다.`,
        source: "PDF문서",
        department: pdf.department || '미분류',
        lastModified: pdf.upload_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        fileName: pdf.file_name,
        type: "PDF문서",
        url: pdf.file_url || '#'
      };
    });

    console.log('✅ PDF results transformed:', pdfResults);
    return pdfResults;
  } catch (error) {
    console.error('💥 PDF search error:', error);
    throw error;
  }
};

export const searchEmployees = async (query: string): Promise<SearchResult[]> => {
  try {
    console.log('🔍 Searching employees with query:', query);
    
    // Search in 직원정보 table with fuzzy matching
    const { data: employees, error: empError } = await supabase
      .from('직원정보')
      .select('*')
      .or(`담당업무.ilike.%${query}%,부서명.ilike.%${query}%,직책.ilike.%${query}%`)
      .limit(5);

    console.log('👥 Employees query result:', { employees, error: empError, queryUsed: query });

    if (empError) {
      console.error('❌ Error searching employees:', empError);
      throw new Error(`직원정보 검색 중 오류: ${empError.message}`);
    }

    if (!employees || employees.length === 0) {
      console.log('👥 No employees found for query:', query);
      return [];
    }

    // Transform employees to SearchResult format
    const employeeResults: SearchResult[] = employees.map(emp => {
      console.log('🔄 Transforming employee:', emp);
      return {
        id: emp.id?.toString() || '0', // bigint를 문자열로 변환
        title: `${emp.직책 || '직책미상'} - ${emp.담당업무 || '업무미상'}`,
        content: `${emp.부서명 || ''}에서 ${emp.담당업무 || ''}를 담당하고 있습니다. 연락처: ${emp.전화번호 || '미등록'}`,
        source: "내부문서",
        department: emp.부서명 || '미분류',
        lastModified: new Date().toISOString().split('T')[0],
        fileName: `직원정보_${emp.직책 || 'staff'}.pdf`,
        type: "직원정보",
        url: '#'
      };
    });

    console.log('✅ Employee results transformed:', employeeResults);
    return employeeResults;
  } catch (error) {
    console.error('💥 Employee search error:', error);
    throw error;
  }
};

export const performSearch = async (query: string): Promise<SearchResult[]> => {
  const searchErrors: string[] = [];
  const searchResults: SearchResult[] = [];

  try {
    console.log('🚀 Starting combined search for query:', query);
    
    // 각 검색을 개별적으로 수행하여 부분 실패를 허용
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

    console.log('📊 Search results summary:', {
      totalResults: searchResults.length,
      errors: searchErrors.length,
      searchErrors
    });

    // 검색 로그 기록
    await logSearch(query, searchResults.length);
    
    // 에러가 있었다면 throw하여 상위에서 처리할 수 있도록 함
    if (searchErrors.length > 0 && searchResults.length === 0) {
      throw new Error(`모든 검색 소스에서 실패: ${searchErrors.join(', ')}`);
    } else if (searchErrors.length > 0) {
      console.warn('⚠️ 일부 검색 소스에서 실패:', searchErrors);
    }
    
    return searchResults;
  } catch (error) {
    console.error('💥 Combined search error:', error);
    throw error;
  }
};
