
import { supabase } from "@/integrations/supabase/client";

// 사용자 세션 ID 생성 (브라우저별 고유 ID)
const getUserSession = () => {
  let sessionId = localStorage.getItem('user_session');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_session', sessionId);
  }
  return sessionId;
};

// 검색 로그 기록
export const logSearch = async (query: string, resultsCount: number) => {
  try {
    const { error } = await supabase
      .from('search_logs')
      .insert({
        query,
        results_count: resultsCount,
        user_session: getUserSession()
      });

    if (error) {
      console.error('Error logging search:', error);
    }
  } catch (error) {
    console.error('Search logging error:', error);
  }
};

// 문서 조회 기록
export const logDocumentView = async (
  documentId: string,
  documentType: string,
  documentTitle: string,
  department: string,
  searchQuery?: string
) => {
  try {
    const { error } = await supabase
      .from('document_views')
      .insert({
        document_id: documentId,
        document_type: documentType,
        document_title: documentTitle,
        department,
        user_session: getUserSession(),
        search_query: searchQuery
      });

    if (error) {
      console.error('Error logging document view:', error);
    }
  } catch (error) {
    console.error('Document view logging error:', error);
  }
};

// 인기 통계 가져오기
export const getPopularStatistics = async (department?: string) => {
  try {
    let query = supabase
      .from('popular_statistics')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(10);

    if (department && department !== '전체') {
      query = query.eq('department', department);
    }

    const { data: statistics, error } = await query;

    if (error) {
      console.error('Error fetching popular statistics:', error);
      return [];
    }

    return statistics?.map((stat, index) => ({
      rank: index + 1,
      title: stat.document_title || '제목 없음',
      department: stat.department || '미분류',
      viewCount: stat.view_count || 0,
      weeklyGrowth: stat.weekly_growth_rate || 0,
      type: stat.document_type,
      lastViewed: formatLastViewed(stat.last_viewed)
    })) || [];
  } catch (error) {
    console.error('Popular statistics error:', error);
    return [];
  }
};

// 최근 조회 시간 포맷
const formatLastViewed = (lastViewed: string | null) => {
  if (!lastViewed) return '기록 없음';
  
  const now = new Date();
  const viewDate = new Date(lastViewed);
  const diffInHours = Math.floor((now.getTime() - viewDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return '1시간 이내';
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}일 전`;
  return '1주일 이상';
};
