
import { supabase } from "@/integrations/supabase/client";

export interface SearchResult {
  id: number;
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
    console.log('Searching documents with query:', query);
    
    // Search in 결재문서목록 table
    const { data: documents, error: docsError } = await supabase
      .from('결재문서목록')
      .select('*')
      .or(`제목.ilike.%${query}%,전체부서명.ilike.%${query}%`)
      .eq('공개여부', '공개')
      .order('생성일자', { ascending: false })
      .limit(10);

    if (docsError) {
      console.error('Error searching documents:', docsError);
      return [];
    }

    // Transform documents to SearchResult format
    const documentResults: SearchResult[] = documents?.map(doc => ({
      id: doc.id,
      title: doc.제목 || '제목 없음',
      content: `${doc.제목 || ''} - ${doc.전체부서명 || ''}에서 작성된 결재문서입니다.`,
      source: "내부문서",
      department: doc.전체부서명 || '미분류',
      lastModified: doc.생성일자 || new Date().toISOString().split('T')[0],
      fileName: `${doc.제목 || 'document'}.pdf`,
      type: "결재문서",
      url: '#'
    })) || [];

    return documentResults;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const searchEmployees = async (query: string): Promise<SearchResult[]> => {
  try {
    console.log('Searching employees with query:', query);
    
    // Search in 직원정보 table
    const { data: employees, error: empError } = await supabase
      .from('직원정보')
      .select('*')
      .or(`담당업무.ilike.%${query}%,부서명.ilike.%${query}%,직책.ilike.%${query}%`)
      .limit(5);

    if (empError) {
      console.error('Error searching employees:', empError);
      return [];
    }

    // Transform employees to SearchResult format
    const employeeResults: SearchResult[] = employees?.map(emp => ({
      id: emp.id,
      title: `${emp.직책 || '직책미상'} - ${emp.담당업무 || '업무미상'}`,
      content: `${emp.부서명 || ''}에서 ${emp.담당업무 || ''}를 담당하고 있습니다. 연락처: ${emp.전화번호 || '미등록'}`,
      source: "내부문서",
      department: emp.부서명 || '미분류',
      lastModified: new Date().toISOString().split('T')[0],
      fileName: `직원정보_${emp.직책 || 'staff'}.pdf`,
      type: "직원정보",
      url: '#'
    })) || [];

    return employeeResults;
  } catch (error) {
    console.error('Employee search error:', error);
    return [];
  }
};

export const performSearch = async (query: string): Promise<SearchResult[]> => {
  try {
    // Perform both searches in parallel
    const [documentResults, employeeResults] = await Promise.all([
      searchDocuments(query),
      searchEmployees(query)
    ]);

    // Combine and return results
    const allResults = [...documentResults, ...employeeResults];
    console.log('Search completed, found', allResults.length, 'results');
    
    return allResults;
  } catch (error) {
    console.error('Combined search error:', error);
    return [];
  }
};
