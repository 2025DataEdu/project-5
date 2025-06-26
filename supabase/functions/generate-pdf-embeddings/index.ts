
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
    console.log('🚀 Starting generate-pdf-embeddings function');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // 업로드된 PDF 문서 수 확인
    console.log('📊 Checking PDF document count...');
    const { count: totalCount } = await supabase
      .from('pdf_documents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    console.log(`📄 Total PDF documents: ${totalCount}`);

    // 이미 임베딩이 생성된 PDF 문서 ID들 가져오기 (UUID 타입)
    const { data: existingEmbeddings } = await supabase
      .from('document_embeddings')
      .select('document_id')
      .eq('document_type', 'PDF문서')
      .not('document_id', 'is', null);

    const existingPdfIds = new Set(existingEmbeddings?.map(e => e.document_id) || []);
    console.log(`✅ Existing PDF embeddings: ${existingPdfIds.size}`);

    // 임베딩이 없는 PDF 문서들만 가져오기
    const batchSize = 50;
    let offset = 0;
    let totalProcessed = 0;
    let totalErrors = 0;
    let batchCount = 0;
    
    while (true) {
      batchCount++;
      console.log(`📄 Processing PDF batch ${batchCount} (offset: ${offset})...`);
      
      const { data: documents, error: fetchError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('status', 'active')
        .range(offset, offset + batchSize - 1);

      if (fetchError) {
        console.error('❌ Error fetching PDF documents:', fetchError);
        throw fetchError;
      }

      if (!documents || documents.length === 0) {
        console.log('🏁 No more PDF documents to process');
        break;
      }

      console.log(`📊 PDF Batch ${batchCount}: ${documents.length} documents fetched`);

      // 이미 임베딩이 있는 문서 필터링 (UUID 비교)
      const documentsToProcess = documents.filter(doc => !existingPdfIds.has(doc.id));
      console.log(`🔍 PDF Batch ${batchCount}: ${documentsToProcess.length} documents need embeddings`);

      if (documentsToProcess.length === 0) {
        console.log(`⚠️ PDF Batch ${batchCount}: All documents already have embeddings, skipping...`);
        offset += batchSize;
        continue;
      }

      // 배치 내에서 병렬 처리
      const concurrentLimit = 3;
      for (let i = 0; i < documentsToProcess.length; i += concurrentLimit) {
        const batch = documentsToProcess.slice(i, i + concurrentLimit);
        const promises = batch.map(async (doc) => {
          try {
            // 텍스트 준비 (제목 + 내용 + 부서명)
            const textToEmbed = `${doc.title || ''} ${doc.content_text || ''} ${doc.department || ''}`.trim();
            
            if (!textToEmbed) {
              console.log(`⚠️ Skipping PDF document ${doc.id} - no text content`);
              return { success: false, reason: 'no_text' };
            }

            console.log(`🔤 Processing PDF doc ${doc.id}: "${textToEmbed.substring(0, 30)}..."`);

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
              console.error(`❌ OpenAI API error for PDF doc ${doc.id}:`, errorText);
              return { success: false, reason: 'openai_error', error: errorText };
            }

            const embeddingData = await embeddingResponse.json();
            const embedding = embeddingData.data[0].embedding;

            // 임베딩을 데이터베이스에 저장 (UUID 타입의 document_id 사용)
            const { error: insertError } = await supabase
              .from('document_embeddings')
              .insert({
                document_id: doc.id, // UUID 타입으로 직접 저장
                document_title: doc.title || doc.file_name || '제목 없음',
                document_type: 'PDF문서',
                department: doc.department,
                content_text: textToEmbed,
                embedding: embedding,
              });

            if (insertError) {
              console.error(`❌ Error inserting embedding for PDF doc ${doc.id}:`, insertError);
              return { success: false, reason: 'insert_error', error: insertError };
            }

            console.log(`✅ Successfully processed PDF document ${doc.id}`);
            return { success: true };

          } catch (docError) {
            console.error(`💥 Error processing PDF document ${doc.id}:`, docError);
            return { success: false, reason: 'exception', error: docError };
          }
        });

        // 병렬 처리 결과 수집
        const results = await Promise.all(promises);
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        totalProcessed += successful;
        totalErrors += failed;

        console.log(`📈 PDF Mini-batch completed: ${successful} success, ${failed} failed (Total: ${totalProcessed} processed, ${totalErrors} errors)`);

        // API 레이트 제한 방지를 위한 딜레이
        if (i + concurrentLimit < documentsToProcess.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // 다음 배치로 이동
      offset += batchSize;
      
      // 진행 상황 로그
      const progress = Math.round((totalProcessed / (totalCount || 1)) * 100);
      console.log(`📊 PDF Batch ${batchCount} completed. Overall progress: ${totalProcessed}/${totalCount} (${progress}%) processed, ${totalErrors} errors`);

      // 중간 진행 상황 체크
      if (totalErrors > 50) {
        console.log('⚠️ Too many errors, stopping PDF batch processing');
        break;
      }
    }

    console.log(`🏁 PDF embedding generation completed: ${totalProcessed} processed, ${totalErrors} errors`);

    return new Response(JSON.stringify({ 
      success: true, 
      processed: totalProcessed,
      errors: totalErrors,
      total: totalCount || 0,
      existing: existingPdfIds.size,
      message: `PDF 임베딩 생성 완료: ${totalProcessed}개 신규 처리, ${totalErrors}개 오류`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 PDF Function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      message: `PDF 임베딩 생성 중 오류 발생: ${error.message}`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
