
import { SmartSearchManager } from "@/components/SmartSearchManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Settings, Database } from "lucide-react";

export const ManageTabContent = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">시스템 관리</h2>
        <p className="text-gray-600">검색 시스템과 문서 관리 기능을 설정합니다</p>
      </div>

      <Tabs defaultValue="smart-search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="smart-search" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            스마트 검색
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            데이터베이스
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="smart-search" className="mt-6">
          <SmartSearchManager />
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                데이터베이스 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                데이터베이스 관리 기능이 곧 추가될 예정입니다.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                시스템 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                시스템 설정 기능이 곧 추가될 예정입니다.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
