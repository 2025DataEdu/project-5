
import { supabase } from "@/integrations/supabase/client";
import { logSearch } from "./analyticsService";

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
    console.log('🔍 Searching documents with query:', query);
    
    // Search in 결재문서목록 table
    const { data: documents, error: docsError } = await supabase
      .from('결재문서목록')
      .select('*')
      .or(`제목.ilike.%${query}%,전체부서명.ilike.%${query}%`)
      .eq('공개여부', '공개')
      .order('생성일자', { ascending: false })
      .limit(10);

    console.log('📄 Documents query result:', { documents, error: docsError });

    if (docsError) {
      console.error('❌ Error searching documents:', docsError);
      return [];
    }

    if (!documents || documents.length === 0) {
      console.log('📄 No documents found for query:', query);
      return [];
    }

    // Transform documents to SearchResult format
    const documentResults: SearchResult[] = documents.map(doc => {
      console.log('🔄 Transforming document:', doc);
      return {
        id: Number(doc.id) || 0,
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
    return [];
  }
};

export const searchPdfDocuments = async (query: string): Promise<SearchResult[]> => {
  try {
    console.log('🔍 Searching PDF documents with query:', query);
    
    // Search in pdf_documents table
    const { data: pdfDocs, error: pdfError } = await supabase
      .from('pdf_documents')
      .select('*')
      .or(`title.ilike.%${query}%,content_text.ilike.%${query}%,department.ilike.%${query}%,file_name.ilike.%${query}%`)
      .eq('status', 'active')
      .order('upload_date', { ascending: false })
      .limit(10);

    console.log('📁 PDF documents query result:', { pdfDocs, error: pdfError });

    if (pdfError) {
      console.error('❌ Error searching PDF documents:', pdfError);
      return [];
    }

    if (!pdfDocs || pdfDocs.length === 0) {
      console.log('📁 No PDF documents found for query:', query);
      return [];
    }

    // Transform PDF documents to SearchResult format
    const pdfResults: SearchResult[] = pdfDocs.map(pdf => {
      console.log('🔄 Transforming PDF document:', pdf);
      return {
        id: Math.floor(Math.random() * 1000000), // Generate random ID for PDFs
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
    return [];
  }
};

export const searchEmployees = async (query: string): Promise<SearchResult[]> => {
  try {
    console.log('🔍 Searching employees with query:', query);
    
    // Search in 직원정보 table
    const { data: employees, error: empError } = await supabase
      .from('직원정보')
      .select('*')
      .or(`담당업무.ilike.%${query}%,부서명.ilike.%${query}%,직책.ilike.%${query}%`)
      .limit(5);

    console.log('👥 Employees query result:', { employees, error: empError });

    if (empError) {
      console.error('❌ Error searching employees:', empError);
      return [];
    }

    if (!employees || employees.length === 0) {
      console.log('👥 No employees found for query:', query);
      return [];
    }

    // Transform employees to SearchResult format
    const employeeResults: SearchResult[] = employees.map(emp => {
      console.log('🔄 Transforming employee:', emp);
      return {
        id: Number(emp.id) || 0,
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
    return [];
  }
};

export const performSearch = async (query: string): Promise<SearchResult[]> => {
  try {
    console.log('🚀 Starting combined search for query:', query);
    
    // Perform all searches in parallel
    const [documentResults, pdfResults, employeeResults] = await Promise.all([
      searchDocuments(query),
      searchPdfDocuments(query),
      searchEmployees(query)
    ]);

    console.log('📊 Search results summary:', {
      documents: documentResults.length,
      pdfs: pdfResults.length,
      employees: employeeResults.length
    });

    // Combine and return results
    const allResults = [...documentResults, ...pdfResults, ...employeeResults];
    console.log('🎯 Total search results found:', allResults.length);
    console.log('📋 Combined results:', allResults);
    
    // 검색 로그 기록
    await logSearch(query, allResults.length);
    
    return allResults;
  } catch (error) {
    console.error('💥 Combined search error:', error);
    return [];
  }
};
