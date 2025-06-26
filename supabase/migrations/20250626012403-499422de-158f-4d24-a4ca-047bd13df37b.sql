
-- 검색 로그를 저장하는 테이블
CREATE TABLE public.search_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  search_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  results_count INTEGER DEFAULT 0,
  user_session TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 문서별 조회 기록을 저장하는 테이블
CREATE TABLE public.document_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id TEXT NOT NULL,
  document_type TEXT NOT NULL, -- '결재문서', 'PDF문서', '직원정보'
  document_title TEXT,
  department TEXT,
  view_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_session TEXT,
  search_query TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 인기 통계를 집계하는 테이블
CREATE TABLE public.popular_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_title TEXT,
  department TEXT,
  view_count INTEGER DEFAULT 0,
  weekly_views INTEGER DEFAULT 0,
  monthly_views INTEGER DEFAULT 0,
  last_viewed TIMESTAMP WITH TIME ZONE,
  weekly_growth_rate DECIMAL(5,2) DEFAULT 0.0,
  rank_position INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(document_id, document_type)
);

-- 검색 로그 테이블에 인덱스 추가
CREATE INDEX idx_search_logs_date ON public.search_logs(search_date);
CREATE INDEX idx_search_logs_query ON public.search_logs(query);

-- 문서 조회 테이블에 인덱스 추가
CREATE INDEX idx_document_views_date ON public.document_views(view_date);
CREATE INDEX idx_document_views_doc ON public.document_views(document_id, document_type);
CREATE INDEX idx_document_views_dept ON public.document_views(department);

-- 인기 통계 테이블에 인덱스 추가
CREATE INDEX idx_popular_stats_type ON public.popular_statistics(document_type);
CREATE INDEX idx_popular_stats_dept ON public.popular_statistics(department);
CREATE INDEX idx_popular_stats_rank ON public.popular_statistics(rank_position);
CREATE INDEX idx_popular_stats_views ON public.popular_statistics(view_count DESC);

-- 테이블에 대한 공개 접근 정책 (RLS 비활성화로 간단하게 처리)
ALTER TABLE public.search_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.popular_statistics DISABLE ROW LEVEL SECURITY;
