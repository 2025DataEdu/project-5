
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  FileText, 
  BarChart3, 
  Shield, 
  Settings, 
  Building, 
  UserCheck,
  Eye,
  Calendar,
  TrendingUp,
  Database
} from "lucide-react";

export const ManageTabContent = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">부서별 관리</h2>
        <p className="text-gray-600">각 부서의 문서 관리 및 통계를 확인하고 관리합니다</p>
      </div>

      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            부서 관리
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            문서 현황
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            분석 리포트
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            권한 관리
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 주요 부서 카드들 */}
            {[
              { name: "총무과", docs: 245, users: 12, recent: 3 },
              { name: "기획예산실", docs: 189, users: 8, recent: 7 },
              { name: "민원봉사과", docs: 321, users: 15, recent: 12 },
              { name: "안전건설과", docs: 156, users: 10, recent: 5 },
              { name: "문화관광과", docs: 98, users: 6, recent: 2 },
              { name: "복지정책과", docs: 203, users: 11, recent: 8 }
            ].map((dept) => (
              <Card key={dept.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    {dept.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">보유 문서</span>
                    <Badge variant="secondary">{dept.docs}개</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">담당자</span>
                    <Badge variant="outline">{dept.users}명</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">최근 활동</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {dept.recent}건
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Settings className="h-4 w-4 mr-2" />
                    부서 관리
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  부서별 문서 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { dept: "민원봉사과", total: 321, public: 285, private: 36, growth: "+12%" },
                    { dept: "총무과", total: 245, public: 220, private: 25, growth: "+8%" },
                    { dept: "복지정책과", total: 203, public: 180, private: 23, growth: "+15%" },
                    { dept: "기획예산실", total: 189, public: 165, private: 24, growth: "+5%" },
                    { dept: "안전건설과", total: 156, public: 140, private: 16, growth: "+9%" }
                  ].map((item) => (
                    <div key={item.dept} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium">{item.dept}</div>
                          <div className="text-sm text-gray-500">
                            공개: {item.public}개 | 비공개: {item.private}개
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">{item.total}</div>
                        <div className="text-sm text-green-600">{item.growth}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  부서별 문서 조회 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { dept: "민원봉사과", views: 1250, percentage: 85 },
                    { dept: "총무과", views: 980, percentage: 68 },
                    { dept: "복지정책과", views: 756, percentage: 52 },
                    { dept: "기획예산실", views: 645, percentage: 44 }
                  ].map((item) => (
                    <div key={item.dept} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.dept}</span>
                        <span className="font-medium">{item.views}회</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  월별 성장률
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">+23%</div>
                    <div className="text-sm text-gray-500">전월 대비 문서 등록 증가</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-semibold text-blue-600">1,234</div>
                      <div className="text-xs text-gray-500">이번 달 조회수</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-purple-600">89</div>
                      <div className="text-xs text-gray-500">신규 문서</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                부서별 권한 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  각 부서의 문서 접근 권한과 관리자 권한을 설정할 수 있습니다.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                {[
                  { dept: "총무과", admin: 2, editor: 5, viewer: 8 },
                  { dept: "기획예산실", admin: 1, editor: 3, viewer: 6 },
                  { dept: "민원봉사과", admin: 3, editor: 7, viewer: 12 },
                  { dept: "안전건설과", admin: 2, editor: 4, viewer: 8 }
                ].map((item) => (
                  <div key={item.dept} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserCheck className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{item.dept}</div>
                        <div className="text-sm text-gray-500">
                          관리자: {item.admin}명 | 편집자: {item.editor}명 | 조회자: {item.viewer}명
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      권한 설정
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
