
-- PDF 파일 정보를 저장할 테이블 생성
CREATE TABLE public.pdf_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  title TEXT,
  content_text TEXT, -- PDF에서 추출된 텍스트 내용
  department TEXT,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  file_size BIGINT,
  page_count INTEGER,
  file_url TEXT,
  status TEXT DEFAULT 'active' -- active, deleted 등
);

-- PDF 파일용 Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdf-documents', 'pdf-documents', true);

-- Storage 정책 설정 (공개 읽기 허용)
CREATE POLICY "Anyone can view PDF files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'pdf-documents');

CREATE POLICY "Anyone can upload PDF files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'pdf-documents');

-- pdf_documents 테이블에 대한 공개 접근 정책
CREATE POLICY "Anyone can view PDF documents" 
  ON public.pdf_documents 
  FOR SELECT 
  USING (status = 'active');

-- RLS 활성화
ALTER TABLE public.pdf_documents ENABLE ROW LEVEL SECURITY;
