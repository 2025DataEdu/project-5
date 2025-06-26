
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Eye, Users, Building, Loader2 } from "lucide-react";

interface PopularItem {
  rank: number;
  title: string;
  department: string;
  viewCount: number;
  weeklyGrowth: number;
  type: string;
  lastViewed: string;
}

interface PopularRegulationsProps {
  popularItems: PopularItem[];
  department?: string;
  isLoading?: boolean;
}

export const PopularRegulations = ({ popularItems, department, isLoading }: PopularRegulationsProps) => {
  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            {department ? `${department} 부서 인기 규정` : "전체 부서 인기 규정"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">통계를 불러오는 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (popularItems.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            {department ? `${department} 부서 인기 규정` : "전체 부서 인기 규정"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>아직 통계 데이터가 없습니다.</p>
            <p className="text-sm mt-1">검색과 문서 조회가 누적되면 인기 통계를 확인할 수 있습니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-red-600" />
          {department ? `${department} 부서 인기 규정` : "전체 부서 인기 규정"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {popularItems.map((item) => (
            <div key={item.rank} className="flex items-center gap-4 p-3 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  item.rank <= 3 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.rank}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {item.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.viewCount.toLocaleString()}회
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
              </div>
              
              <div className="flex-shrink-0 text-right">
                <div className={`text-sm font-medium ${
                  item.weeklyGrowth > 0 ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {item.weeklyGrowth > 0 ? '+' : ''}{item.weeklyGrowth}%
                </div>
                <div className="text-xs text-gray-500">{item.lastViewed}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full gap-2">
            <Users className="h-4 w-4" />
            전체 통계 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
