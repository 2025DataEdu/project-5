
import { useState } from "react";
import { PopularRegulations } from "@/components/PopularRegulations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { usePopularStatistics } from "@/hooks/usePopularStatistics";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PopularTabContent = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("전체");
  const [isUpdating, setIsUpdating] = useState(false);
  const { popularItems: allItems, isLoading: allLoading } = usePopularStatistics("전체");
  const { popularItems: deptItems, isLoading: deptLoading } = usePopularStatistics(selectedDepartment === "전체" ? undefined : selectedDepartment);

  const departments = ["전체", "인사팀", "기획재정부", "정보보안팀", "총무팀", "민원담당팀"];

  const handleUpdateStatistics = async () => {
    setIsUpdating(true);
    try {
      console.log('📊 Manually updating popular statistics...');
      
      const { data, error } = await supabase.functions.invoke('update-popular-statistics');
      
      if (error) {
        console.error('❌ Error updating statistics:', error);
        toast.error('통계 업데이트에 실패했습니다.');
        return;
      }
      
      console.log('✅ Statistics updated successfully:', data);
      toast.success('인기 통계가 업데이트되었습니다. 페이지를 새로고침하면 최신 데이터를 확인할 수 있습니다.');
      
      // 페이지 새로고침으로 최신 데이터 로드
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('💥 Statistics update failed:', error);
      toast.error('통계 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">인기 규정 통계</h3>
        <Button 
          onClick={handleUpdateStatistics}
          disabled={isUpdating}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
          {isUpdating ? '업데이트 중...' : '통계 업데이트'}
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">전체 부서</TabsTrigger>
          <TabsTrigger value="department">부서별</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <PopularRegulations 
            popularItems={allItems}
            department="전체"
            isLoading={allLoading}
          />
        </TabsContent>
        
        <TabsContent value="department" className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              부서 선택
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <PopularRegulations 
            popularItems={selectedDepartment === "전체" ? allItems : deptItems}
            department={selectedDepartment}
            isLoading={selectedDepartment === "전체" ? allLoading : deptLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
