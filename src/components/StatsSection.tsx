
import { Card, CardContent } from "@/components/ui/card";
import { FileIcon, Building, Calendar, Search } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    {
      label: "총 문서 수",
      value: "1,247",
      icon: FileIcon,
      color: "text-blue-600"
    },
    {
      label: "참여 부서",
      value: "15",
      icon: Building,
      color: "text-green-600"
    },
    {
      label: "이번 달 업데이트",
      value: "68",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      label: "월 검색 수",
      value: "3,421",
      icon: Search,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
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
