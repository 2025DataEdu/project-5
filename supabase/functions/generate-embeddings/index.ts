
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
    
    // 결재문서목록에서 아직 임베딩이 생성되지 않은 문서들 가져오기
    console.log('📄 Fetching documents without embeddings...');
    const { data: documents, error: fetchError } = await supabase
      .from('결재문서목록')
      .select('*')
      .limit(50); // 한 번에 50개씩 처리

    if (fetchError) {
      console.error('❌ Error fetching documents:', fetchError);
      throw fetchError;
    }

    console.log(`📊 Found ${documents?.length || 0} documents to process`);

    if (!documents || documents.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No documents to process',
        processed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let processed = 0;
    let errors = 0;

    for (const doc of documents) {
      try {
        // 이미 임베딩이 존재하는지 확인
        const { data: existing } = await supabase
          .from('document_embeddings')
          .select('id')
          .eq('document_id', doc.id)
          .single();

        if (existing) {
          console.log(`⏭️ Skipping document ${doc.id} - embedding already exists`);
          continue;
        }

        // 텍스트 준비 (제목 + 부서명)
        const textToEmbed = `${doc.제목 || ''} ${doc.전체부서명 || ''}`.trim();
        
        if (!textToEmbed) {
          console.log(`⚠️ Skipping document ${doc.id} - no text content`);
          continue;
        }

        console.log(`🔤 Generating embedding for: "${textToEmbed.substring(0, 100)}..."`);

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
          errors++;
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
          errors++;
          continue;
        }

        processed++;
        console.log(`✅ Successfully processed document ${doc.id} (${processed}/${documents.length})`);

        // API 레이트 제한 방지를 위한 딜레이
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (docError) {
        console.error(`💥 Error processing document ${doc.id}:`, docError);
        errors++;
      }
    }

    console.log(`🏁 Embedding generation completed: ${processed} processed, ${errors} errors`);

    return new Response(JSON.stringify({ 
      success: true, 
      processed,
      errors,
      total: documents.length
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
