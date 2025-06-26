
-- RLS 비활성화하여 업로드 테스트
ALTER TABLE public.pdf_documents DISABLE ROW LEVEL SECURITY;

-- 기존 정책들을 모두 삭제
DROP POLICY IF EXISTS "Anyone can view PDF documents" ON public.pdf_documents;
DROP POLICY IF EXISTS "Anyone can insert PDF documents" ON public.pdf_documents;
DROP POLICY IF EXISTS "Anyone can update PDF documents" ON public.pdf_documents;
DROP POLICY IF EXISTS "Anyone can delete PDF documents" ON public.pdf_documents;
