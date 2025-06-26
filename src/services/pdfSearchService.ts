
import { supabase } from "@/integrations/supabase/client";
import { SearchResult } from "@/types/searchTypes";
import { generateDocumentId, normalizeTitle } from "@/utils/searchUtils";

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
