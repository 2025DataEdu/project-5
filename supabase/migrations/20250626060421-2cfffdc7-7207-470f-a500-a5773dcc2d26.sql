
-- document_id_old 컬럼을 nullable하게 변경
ALTER TABLE public.document_embeddings ALTER COLUMN document_id_old DROP NOT NULL;
