
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

export const performSmartSearch = async (
  query: string, 
  options: SmartSearchOptions = {}
): Promise<SearchResult[]> => {
  const { threshold = 0.7, limit = 10, useVectorSearch = true } = options;
  
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
    const { data, error } = await supabase
      .from('document_embeddings')
      .select('document_type, department', { count: 'exact' });
    
    if (error) throw error;
    
    const stats = {
      total: data?.length || 0,
      byType: {} as Record<string, number>,
      byDepartment: {} as Record<string, number>
    };
    
    data?.forEach(item => {
      // 문서 타입별 통계
      stats.byType[item.document_type] = (stats.byType[item.document_type] || 0) + 1;
      
      // 부서별 통계
      if (item.department) {
        stats.byDepartment[item.department] = (stats.byDepartment[item.department] || 0) + 1;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('💥 Error getting embedding stats:', error);
    return { total: 0, byType: {}, byDepartment: {} };
  }
};
