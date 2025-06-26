
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileIcon, Building, Calendar, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StatData {
  totalDocuments: number;
  totalDepartments: number;
  monthlyUpdates: number;
  monthlySearches: number;
}

export const StatsSection = () => {
  const [stats, setStats] = useState<StatData>({
    totalDocuments: 0,
    totalDepartments: 0,
    monthlyUpdates: 0,
    monthlySearches: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('📊 Fetching real statistics from Supabase...');
        
        // 1. 총 문서 수 (결재문서목록 테이블에서 정확한 행 수 조회)
        console.log('📄 Fetching total documents from 결재문서목록...');
        const { count: totalDocs, error: docsError } = await supabase
          .from('결재문서목록')
          .select('*', { count: 'exact', head: true });

        console.log('📊 Total documents result:', {
          count: totalDocs,
          error: docsError
        });

        if (docsError) {
          console.error('❌ Error fetching total documents:', docsError);
        }

        // 2. 참여 부서 수 (고유 부서명)
        console.log('🏢 Fetching departments...');
        const { data: deptData, error: deptError } = await supabase
          .from('결재문서목록')
          .select('전체부서명')
          .not('전체부서명', 'is', null);

        console.log('📊 Departments query result:', {
          dataLength: deptData?.length,
          error: deptError
        });

        if (deptError) {
          console.error('❌ Error fetching departments:', deptError);
        }

        const uniqueDepartments = new Set(
          (deptData as any[])?.map((item: any) => item.전체부서명)
        ).size;

        console.log('🔢 Unique departments count:', uniqueDepartments);

        // 3. 이번 달 업데이트 (이번 달에 생성된 문서)
        const currentMonth = new Date();
        const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        
        console.log('📅 Fetching monthly updates since:', firstDayOfMonth.toISOString().split('T')[0]);
        
        const { count: monthlyDocs, error: monthlyError } = await supabase
          .from('결재문서목록')
          .select('*', { count: 'exact', head: true })
          .gte('생성일자', firstDayOfMonth.toISOString().split('T')[0]);

        console.log('📊 Monthly updates result:', {
          count: monthlyDocs,
          error: monthlyError
        });

        if (monthlyError) {
          console.error('❌ Error fetching monthly updates:', monthlyError);
        }

        // 4. 월 검색 수 (이번 달 search_logs)
        console.log('🔍 Fetching monthly searches...');
        const { count: monthlySearchCount, error: searchError } = await supabase
          .from('search_logs')
          .select('*', { count: 'exact', head: true })
          .gte('search_date', firstDayOfMonth.toISOString());

        console.log('📊 Monthly searches result:', {
          count: monthlySearchCount,
          error: searchError
        });

        if (searchError) {
          console.error('❌ Error fetching monthly searches:', searchError);
        }

        const finalStats = {
          totalDocuments: totalDocs || 0,
          totalDepartments: uniqueDepartments,
          monthlyUpdates: monthlyDocs || 0,
          monthlySearches: monthlySearchCount || 0
        };

        setStats(finalStats);

        console.log('✅ Final statistics loaded:', finalStats);

      } catch (error) {
        console.error('💥 Error fetching statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  const statsConfig = [
    {
      label: "총 문서 수",
      value: isLoading ? "..." : formatNumber(stats.totalDocuments),
      icon: FileIcon,
      color: "text-blue-600"
    },
    {
      label: "참여 부서",
      value: isLoading ? "..." : formatNumber(stats.totalDepartments),
      icon: Building,
      color: "text-green-600"
    },
    {
      label: "이번 달 업데이트",
      value: isLoading ? "..." : formatNumber(stats.monthlyUpdates),
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      label: "월 검색 수",
      value: isLoading ? "..." : formatNumber(stats.monthlySearches),
      icon: Search,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="border-0 shadow-md bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
