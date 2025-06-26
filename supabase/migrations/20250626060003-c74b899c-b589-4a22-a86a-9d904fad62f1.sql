
-- 기존 데이터가 있는 경우를 고려한 안전한 스키마 변경
-- 1. 새로운 UUID 컬럼 추가
ALTER TABLE public.document_embeddings ADD COLUMN document_uuid UUID;

-- 2. PDF 문서의 경우 document_uuid를 실제 PDF document id로 설정
-- (기존 결재문서 데이터는 그대로 유지)

-- 3. 기존 document_id 컬럼을 document_id_old로 이름 변경
ALTER TABLE public.document_embeddings RENAME COLUMN document_id TO document_id_old;

-- 4. document_uuid 컬럼을 document_id로 이름 변경
ALTER TABLE public.document_embeddings RENAME COLUMN document_uuid TO document_id;

-- 5. 검색 함수도 업데이트 (UUID 타입 사용)
DROP FUNCTION IF EXISTS public.search_similar_documents(extensions.vector, double precision, integer);

CREATE OR REPLACE FUNCTION public.search_similar_documents(
  query_embedding extensions.vector,
  match_threshold double precision DEFAULT 0.7,
  match_count integer DEFAULT 10
)
RETURNS TABLE(
  id uuid,
  document_id uuid,
  document_title text,
  document_type text,
  department text,
  content_text text,
  similarity double precision
)
LANGUAGE sql
STABLE
AS $function$
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
$function$;
