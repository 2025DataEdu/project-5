
import { supabase } from "@/integrations/supabase/client";
import { SearchResult } from "./searchService";

export interface SmartSearchOptions {
  threshold?: number; // 유사도 임계값 (0~1)
  limit?: number; // 결과 개수 제한
  useVectorSearch?: boolean; // 벡터 검색 사용 여부
}

export const generateEmbeddings = async () => {
  console.log('🔄 Starting embedding generation...');
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-embeddings');
    
    if (error) {
      console.error('❌ Embedding generation error:', error);
      throw error;
    }
    
    console.log('✅ Embedding generation completed:', data);
    return data;
  } catch (error) {
    console.error('💥 Generate embeddings failed:', error);
    throw error;
  }
};

export const generatePdfEmbeddings = async () => {
  console.log('🔄 Starting PDF embedding generation...');
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-pdf-embeddings');
    
    if (error) {
      console.error('❌ PDF embedding generation error:', error);
      throw error;
    }
    
    console.log('✅ PDF embedding generation completed:', data);
    return data;
  } catch (error) {
    console.error('💥 Generate PDF embeddings failed:', error);
    throw error;
  }
};

export const performSmartSearch = async (
  query: string, 
  options: SmartSearchOptions = {}
): Promise<SearchResult[]> => {
  const { threshold = 0.8, limit = 10, useVectorSearch = true } = options; // 기본 임계값을 0.8로 상향
  
  console.log('🎯 Starting smart search:', { query, threshold, limit, useVectorSearch });
  
  if (!useVectorSearch) {
    console.log('⚠️ Vector search disabled, falling back to regular search');
    return [];
  }
  
  try {
    console.log('🔍 Calling smart-search edge function...');
    const { data, error } = await supabase.functions.invoke('smart-search', {
      body: { 
        query,
        threshold,
        limit
      }
    });
    
    if (error) {
      console.error('❌ Smart search error:', error);
      throw error;
    }
    
    if (!data?.success) {
      console.error('❌ Smart search failed:', data?.error);
      throw new Error(data?.error || 'Smart search failed');
    }
    
    console.log(`✅ Smart search completed: ${data.results?.length || 0} results`);
    return data.results || [];
    
  } catch (error) {
    console.error('💥 Smart search failed:', error);
    throw error;
  }
};

export const getEmbeddingStats = async () => {
  try {
    console.log('📊 Fetching embedding statistics...');
    
    // 전체 임베딩 데이터 조회 (결재문서 + PDF문서 모두 포함)
    const { data, error } = await supabase
      .from('document_embeddings')
      .select('document_type, department', { count: 'exact' });
    
    if (error) {
      console.error('❌ Error fetching embeddings:', error);
      throw error;
    }
    
    console.log(`📊 Total embeddings found: ${data?.length || 0}`);
    
    const stats = {
      total: data?.length || 0,
      byType: {} as Record<string, number>,
      byDepartment: {} as Record<string, number>
    };
    
    data?.forEach(item => {
      // 문서 타입별 통계
      const docType = item.document_type || '미분류';
      stats.byType[docType] = (stats.byType[docType] || 0) + 1;
      
      // 부서별 통계
      if (item.department) {
        stats.byDepartment[item.department] = (stats.byDepartment[item.department] || 0) + 1;
      }
    });
    
    console.log('📊 Embedding stats calculated:', {
      total: stats.total,
      byType: stats.byType,
      topDepartments: Object.keys(stats.byDepartment).slice(0, 3)
    });
    
    return stats;
  } catch (error) {
    console.error('💥 Error getting embedding stats:', error);
    return { total: 0, byType: {}, byDepartment: {} };
  }
};
