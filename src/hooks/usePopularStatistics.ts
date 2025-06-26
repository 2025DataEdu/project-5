
import { useState, useEffect } from "react";
import { getPopularStatistics } from "@/services/analyticsService";

interface PopularItem {
  rank: number;
  title: string;
  department: string;
  viewCount: number;
  weeklyGrowth: number;
  type: string;
  lastViewed: string;
}

export const usePopularStatistics = (department?: string) => {
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const statistics = await getPopularStatistics(department);
        setPopularItems(statistics);
      } catch (err) {
        console.error('Error fetching popular statistics:', err);
        setError('인기 통계를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [department]);

  return { popularItems, isLoading, error };
};
