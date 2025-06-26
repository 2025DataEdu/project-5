
import { useState } from "react";
import { PopularRegulations } from "@/components/PopularRegulations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePopularStatistics } from "@/hooks/usePopularStatistics";

export const PopularTabContent = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("전체");
  const { popularItems: allItems, isLoading: allLoading } = usePopularStatistics("전체");
  const { popularItems: deptItems, isLoading: deptLoading } = usePopularStatistics(selectedDepartment === "전체" ? undefined : selectedDepartment);

  const departments = ["전체", "인사팀", "기획재정부", "정보보안팀", "총무팀", "민원담당팀"];

  return (
    <div className="space-y-4">
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
