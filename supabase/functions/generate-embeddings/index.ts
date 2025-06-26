
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
    console.log('🚀 Starting generate-embeddings function');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // 전체 문서 수 확인
    console.log('📊 Checking total document count...');
    const { count: totalCount } = await supabase
      .from('결재문서목록')
      .select('*', { count: 'exact', head: true });

    console.log(`📄 Total documents in database: ${totalCount}`);

    // 이미 임베딩이 생성된 문서 ID들 가져오기
    const { data: existingEmbeddings } = await supabase
      .from('document_embeddings')
      .select('document_id');

    const existingDocIds = new Set(existingEmbeddings?.map(e => e.document_id) || []);
    console.log(`✅ Existing embeddings: ${existingDocIds.size}`);

    // 임베딩이 없는 문서들만 가져오기 (배치 처리)
    const batchSize = 100;
    let offset = 0;
    let totalProcessed = 0;
    let totalErrors = 0;
    
    while (true) {
      console.log(`📄 Fetching batch starting from offset ${offset}...`);
      
      const { data: documents, error: fetchError } = await supabase
        .from('결재문서목록')
        .select('*')
        .range(offset, offset + batchSize - 1);

      if (fetchError) {
        console.error('❌ Error fetching documents:', fetchError);
        throw fetchError;
      }

      if (!documents || documents.length === 0) {
        console.log('🏁 No more documents to process');
        break;
      }

      console.log(`📊 Processing batch: ${documents.length} documents`);

      // 이미 임베딩이 있는 문서 필터링
      const documentsToProcess = documents.filter(doc => !existingDocIds.has(doc.id));
      console.log(`🔍 Documents needing embeddings in this batch: ${documentsToProcess.length}`);

      for (const doc of documentsToProcess) {
        try {
          // 텍스트 준비 (제목 + 부서명)
          const textToEmbed = `${doc.제목 || ''} ${doc.전체부서명 || ''}`.trim();
          
          if (!textToEmbed) {
            console.log(`⚠️ Skipping document ${doc.id} - no text content`);
            continue;
          }

          console.log(`🔤 Generating embedding for doc ${doc.id}: "${textToEmbed.substring(0, 50)}..."`);

          // OpenAI 임베딩 생성
          const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'text-embedding-ada-002',
              input: textToEmbed,
            }),
          });

          if (!embeddingResponse.ok) {
            const errorText = await embeddingResponse.text();
            console.error(`❌ OpenAI API error for doc ${doc.id}:`, errorText);
            totalErrors++;
            continue;
          }

          const embeddingData = await embeddingResponse.json();
          const embedding = embeddingData.data[0].embedding;

          // 임베딩을 데이터베이스에 저장
          const { error: insertError } = await supabase
            .from('document_embeddings')
            .insert({
              document_id: doc.id,
              document_title: doc.제목 || '제목 없음',
              document_type: '결재문서',
              department: doc.전체부서명,
              content_text: textToEmbed,
              embedding: embedding,
            });

          if (insertError) {
            console.error(`❌ Error inserting embedding for doc ${doc.id}:`, insertError);
            totalErrors++;
            continue;
          }

          totalProcessed++;
          console.log(`✅ Successfully processed document ${doc.id} (${totalProcessed} total)`);

          // API 레이트 제한 방지를 위한 딜레이
          await new Promise(resolve => setTimeout(resolve, 50));

        } catch (docError) {
          console.error(`💥 Error processing document ${doc.id}:`, docError);
          totalErrors++;
        }
      }

      // 다음 배치로 이동
      offset += batchSize;
      
      // 현재 진행 상황 로그
      console.log(`📈 Progress: Processed ${totalProcessed} documents, ${totalErrors} errors, checked ${offset} documents`);
    }

    console.log(`🏁 Embedding generation completed: ${totalProcessed} processed, ${totalErrors} errors`);

    return new Response(JSON.stringify({ 
      success: true, 
      processed: totalProcessed,
      errors: totalErrors,
      total: totalCount || 0,
      existing: existingDocIds.size
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
