
import { supabase } from "@/integrations/supabase/client";
import { logSearch } from "./analyticsService";

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  department: string;
  lastModified: string;
  fileName: string;
  type: string;
  url: string;
}

// 문서의 고유 식별자를 생성하는 함수
const generateDocumentId = (doc: any, type: string): string => {
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
const normalizeTitle = (title: string): string => {
  return title?.trim().replace(/\s+/g, ' ') || '';
};

export const searchDocuments = async (query: string): Promise<SearchResult[]> => {
  try {
    console.log('🔍 Searching documents with query:', query);
    
    const searchTerms = query.trim().split(/\s+/);
    
    const { data: documents, error: docsError } = await supabase
      .from('결재문서목록')
      .select('*')
      .or(`제목.ilike.%${query}%,전체부서명.ilike.%${query}%,제목.ilike.%${searchTerms[0]}%`)
      .order('생성일자', { ascending: false })
      .limit(30);

    console.log('📄 Documents query result:', { 
      documents, 
      error: docsError, 
      queryUsed: query,
      documentsCount: documents?.length || 0
    });

    if (docsError) {
      console.error('❌ Error searching documents:', docsError);
      throw new Error(`결재문서 검색 오류: ${docsError.message}`);
    }

    if (!documents || documents.length === 0) {
      const { data: broadDocuments, error: broadError } = await supabase
        .from('결재문서목록')
        .select('*')
        .not('제목', 'is', null)
        .order('생성일자', { ascending: false })
        .limit(15);
      
      if (broadError) {
        console.error('❌ Broad search error:', broadError);
      } else {
        console.log('📄 Broad search results:', broadDocuments?.length || 0);
        const filteredDocs = broadDocuments?.filter(doc => 
          doc.제목?.toLowerCase().includes(query.toLowerCase()) ||
          doc.전체부서명?.toLowerCase().includes(query.toLowerCase())
        ) || [];
        
        if (filteredDocs.length > 0) {
          console.log('📄 Client-side filtered results:', filteredDocs.length);
          const documentResults: SearchResult[] = filteredDocs.map(doc => ({
            id: generateDocumentId(doc, '결재문서'),
            title: normalizeTitle(doc.제목 || '제목 없음'),
            content: `${doc.제목 || ''} - ${doc.전체부서명 || ''}에서 작성된 결재문서입니다.`,
            source: "내부문서",
            department: doc.전체부서명 || '미분류',
            lastModified: doc.생성일자 || new Date().toISOString().split('T')[0],
            fileName: `${doc.제목 || 'document'}.pdf`,
            type: "결재문서",
            url: '#'
          }));
          return documentResults;
        }
      }
      
      console.log('📄 No documents found for query:', query);
      return [];
    }

    const documentResults: SearchResult[] = documents.map(doc => {
      console.log('🔄 Transforming document:', doc);
      return {
        id: generateDocumentId(doc, '결재문서'),
        title: normalizeTitle(doc.제목 || '제목 없음'),
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
    
    const { data: pdfDocs, error: pdfError } = await supabase
      .from('pdf_documents')
      .select('*')
      .or(`title.ilike.%${query}%,content_text.ilike.%${query}%,department.ilike.%${query}%,file_name.ilike.%${query}%`)
      .eq('status', 'active')
      .order('upload_date', { ascending: false })
      .limit(30);

    console.log('📁 PDF documents query result:', { 
      pdfDocs, 
      error: pdfError, 
      queryUsed: query,
      pdfDocsCount: pdfDocs?.length || 0 
    });

    if (pdfError) {
      console.error('❌ Error searching PDF documents:', pdfError);
      throw new Error(`PDF문서 검색 오류: ${pdfError.message}`);
    }

    if (!pdfDocs || pdfDocs.length === 0) {
      console.log('📁 No PDF documents found for query:', query);
      return [];
    }

    const pdfResults: SearchResult[] = pdfDocs.map(pdf => {
      console.log('🔄 Transforming PDF document:', pdf);
      return {
        id: generateDocumentId(pdf, 'PDF문서'),
        title: normalizeTitle(pdf.title || pdf.file_name || '제목 없음'),
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
    
    const { data: employees, error: empError } = await supabase
      .from('직원정보')
      .select('*')
      .or(`담당업무.ilike.%${query}%,부서명.ilike.%${query}%,직책.ilike.%${query}%`)
      .limit(15);

    console.log('👥 Employees query result:', { 
      employees, 
      error: empError, 
      queryUsed: query,
      employeesCount: employees?.length || 0 
    });

    if (empError) {
      console.error('❌ Error searching employees:', empError);
      throw new Error(`직원정보 검색 오류: ${empError.message}`);
    }

    if (!employees || employees.length === 0) {
      console.log('👥 No employees found for query:', query);
      return [];
    }

    const employeeResults: SearchResult[] = employees.map(emp => {
      console.log('🔄 Transforming employee:', emp);
      return {
        id: generateDocumentId(emp, '직원정보'),
        title: normalizeTitle(`${emp.직책 || '직책미상'} - ${emp.담당업무 || '업무미상'}`),
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

// 강화된 중복 제거 함수
const removeDuplicates = (results: SearchResult[]): SearchResult[] => {
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
