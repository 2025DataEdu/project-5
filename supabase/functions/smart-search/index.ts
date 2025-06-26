
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎯 Starting smart search function');
    
    const { query, threshold = 0.8, limit = 30 } = await req.json(); // 기본 임계값을 0.8로 상향
    
    if (!query || typeof query !== 'string') {
      throw new Error('검색 쿼리가 필요합니다');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    console.log(`🔍 Processing search query: "${query}"`);

    // 1. 검색 쿼리를 임베딩으로 변환
    console.log('🔤 Generating query embedding...');
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: query,
      }),
    });

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('❌ OpenAI embedding error:', errorText);
      throw new Error('임베딩 생성 실패');
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    console.log('✅ Query embedding generated successfully');

    // 2. 벡터 유사도 검색 수행
    console.log(`🔍 Performing vector similarity search (threshold: ${threshold}, limit: ${limit})`);
    const { data: similarDocs, error: searchError } = await supabase
      .rpc('search_similar_documents', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit
      });

    if (searchError) {
      console.error('❌ Vector search error:', searchError);
      throw new Error('벡터 검색 실패');
    }

    console.log(`📊 Found ${similarDocs?.length || 0} similar documents`);

    // 3. 80% 이상 유사도만 필터링하고 결과를 SearchResult 형태로 변환
    const filteredResults = similarDocs?.filter(doc => doc.similarity >= 0.8) || [];
    console.log(`🎯 Filtered to ${filteredResults.length} results with 80%+ similarity`);

    const searchResults = filteredResults.map(doc => {
      // document_id가 UUID인지 확인하여 적절한 ID 사용
      const documentId = doc.document_id || doc.document_id_old?.toString() || 'unknown';
      
      return {
        id: documentId,
        title: doc.document_title,
        content: doc.content_text || `${doc.document_title} - ${doc.department || ''}에서 작성된 ${doc.document_type}입니다.`,
        source: "벡터검색",
        department: doc.department || '미분류',
        lastModified: new Date().toISOString().split('T')[0],
        fileName: `${doc.document_title}.pdf`,
        type: doc.document_type,
        url: '#',
        similarity: Math.round(doc.similarity * 100) / 100 // 소수점 2자리로 반올림
      };
    });

    console.log(`🎯 Smart search completed: ${searchResults.length} results with 80%+ similarity`);

    return new Response(JSON.stringify({ 
      success: true,
      results: searchResults,
      query,
      resultsCount: searchResults.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Smart search error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      results: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
