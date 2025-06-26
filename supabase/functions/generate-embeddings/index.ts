
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

    // 임베딩이 없는 문서들만 가져오기 (더 큰 배치 크기)
    const batchSize = 200;
    let offset = 0;
    let totalProcessed = 0;
    let totalErrors = 0;
    let batchCount = 0;
    
    while (true) {
      batchCount++;
      console.log(`📄 Processing batch ${batchCount} (offset: ${offset})...`);
      
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

      console.log(`📊 Batch ${batchCount}: ${documents.length} documents fetched`);

      // 이미 임베딩이 있는 문서 필터링
      const documentsToProcess = documents.filter(doc => !existingDocIds.has(doc.id));
      console.log(`🔍 Batch ${batchCount}: ${documentsToProcess.length} documents need embeddings`);

      if (documentsToProcess.length === 0) {
        console.log(`⚠️ Batch ${batchCount}: All documents already have embeddings, skipping...`);
        offset += batchSize;
        continue;
      }

      // 배치 내에서 병렬 처리 (동시 처리 수 제한)
      const concurrentLimit = 5;
      for (let i = 0; i < documentsToProcess.length; i += concurrentLimit) {
        const batch = documentsToProcess.slice(i, i + concurrentLimit);
        const promises = batch.map(async (doc) => {
          try {
            // 텍스트 준비 (제목 + 부서명)
            const textToEmbed = `${doc.제목 || ''} ${doc.전체부서명 || ''}`.trim();
            
            if (!textToEmbed) {
              console.log(`⚠️ Skipping document ${doc.id} - no text content`);
              return { success: false, reason: 'no_text' };
            }

            console.log(`🔤 Processing doc ${doc.id}: "${textToEmbed.substring(0, 30)}..."`);

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
              return { success: false, reason: 'openai_error', error: errorText };
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
              return { success: false, reason: 'insert_error', error: insertError };
            }

            console.log(`✅ Successfully processed document ${doc.id}`);
            return { success: true };

          } catch (docError) {
            console.error(`💥 Error processing document ${doc.id}:`, docError);
            return { success: false, reason: 'exception', error: docError };
          }
        });

        // 병렬 처리 결과 수집
        const results = await Promise.all(promises);
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        totalProcessed += successful;
        totalErrors += failed;

        console.log(`📈 Mini-batch completed: ${successful} success, ${failed} failed (Total: ${totalProcessed} processed, ${totalErrors} errors)`);

        // API 레이트 제한 방지를 위한 딜레이
        if (i + concurrentLimit < documentsToProcess.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // 다음 배치로 이동
      offset += batchSize;
      
      // 진행 상황 로그
      const progress = Math.round((totalProcessed / (totalCount || 1)) * 100);
      console.log(`📊 Batch ${batchCount} completed. Overall progress: ${totalProcessed}/${totalCount} (${progress}%) processed, ${totalErrors} errors`);

      // 중간 진행 상황 체크 (너무 많은 오류가 발생하면 중단)
      if (totalErrors > 100) {
        console.log('⚠️ Too many errors, stopping batch processing');
        break;
      }
    }

    console.log(`🏁 Embedding generation completed: ${totalProcessed} processed, ${totalErrors} errors`);

    return new Response(JSON.stringify({ 
      success: true, 
      processed: totalProcessed,
      errors: totalErrors,
      total: totalCount || 0,
      existing: existingDocIds.size,
      message: `임베딩 생성 완료: ${totalProcessed}개 신규 처리, ${totalErrors}개 오류`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      message: `임베딩 생성 중 오류 발생: ${error.message}`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
