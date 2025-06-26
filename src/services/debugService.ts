
import { supabase } from "@/integrations/supabase/client";

export const debugDatabaseContent = async () => {
  try {
    console.log('🔍 Debugging database content...');
    
    // 결재문서목록 테이블의 모든 데이터 조회 (최대 10개)
    const { data: documents, error: docsError } = await supabase
      .from('결재문서목록')
      .select('*')
      .limit(10);
    
    console.log('📊 결재문서목록 sample data:', {
      count: documents?.length || 0,
      error: docsError,
      sampleData: documents?.slice(0, 3)
    });
    
    // PDF 문서 테이블 조회
    const { data: pdfDocs, error: pdfError } = await supabase
      .from('pdf_documents')
      .select('*')
      .limit(5);
    
    console.log('📊 PDF documents sample data:', {
      count: pdfDocs?.length || 0,
      error: pdfError,
      sampleData: pdfDocs?.slice(0, 2)
    });
    
    // 직원정보 테이블 조회
    const { data: employees, error: empError } = await supabase
      .from('직원정보')
      .select('*')
      .limit(5);
    
    console.log('📊 직원정보 sample data:', {
      count: employees?.length || 0,
      error: empError,
      sampleData: employees?.slice(0, 2)
    });
    
    return {
      documents: documents?.length || 0,
      pdfDocs: pdfDocs?.length || 0,
      employees: employees?.length || 0
    };
  } catch (error) {
    console.error('💥 Debug error:', error);
    return null;
  }
};
