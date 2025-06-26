
-- pgvector 확장 활성화 (이미 활성화되어 있다면 무시됨)
CREATE EXTENSION IF NOT EXISTS vector;

-- 문서 임베딩을 저장할 테이블 생성
CREATE TABLE public.document_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id BIGINT NOT NULL,
  document_title TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT '결재문서',
  department TEXT,
  content_text TEXT,
  embedding VECTOR(1536), -- OpenAI ada-002 embedding dimension
  similarity_threshold FLOAT DEFAULT 0.7,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 인덱스 생성 (벡터 유사도 검색 성능 향상)
CREATE INDEX document_embeddings_embedding_idx ON public.document_embeddings 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 문서 ID 인덱스
CREATE INDEX document_embeddings_document_id_idx ON public.document_embeddings (document_id);

-- 문서 타입 인덱스  
CREATE INDEX document_embeddings_document_type_idx ON public.document_embeddings (document_type);

-- 유사도 검색을 위한 함수 생성
CREATE OR REPLACE FUNCTION public.search_similar_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  document_id BIGINT,
  document_title TEXT,
  document_type TEXT,
  department TEXT,
  content_text TEXT,
  similarity FLOAT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    document_embeddings.id,
    document_embeddings.document_id,
    document_embeddings.document_title,
    document_embeddings.document_type,
    document_embeddings.department,
    document_embeddings.content_text,
    1 - (document_embeddings.embedding <=> query_embedding) AS similarity
  FROM document_embeddings
  WHERE 1 - (document_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY document_embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- RLS 정책 설정 (모든 사용자가 읽기 가능)
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view document embeddings" ON public.document_embeddings
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage document embeddings" ON public.document_embeddings
  FOR ALL USING (true);
