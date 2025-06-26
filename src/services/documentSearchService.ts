
import { supabase } from "@/integrations/supabase/client";
import { SearchResult } from "@/types/searchTypes";
import { generateDocumentId, normalizeTitle } from "@/utils/searchUtils";

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
