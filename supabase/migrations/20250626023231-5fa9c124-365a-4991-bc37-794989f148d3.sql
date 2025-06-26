
-- 결재문서목록 테이블에 RLS 활성화 및 공개 읽기 정책 추가
ALTER TABLE public.결재문서목록 ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 결재문서목록을 조회할 수 있도록 정책 생성 (통계 목적)
CREATE POLICY "Anyone can view 결재문서목록" 
  ON public.결재문서목록 
  FOR SELECT 
  USING (true);
