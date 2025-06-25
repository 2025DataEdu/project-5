
import { useState } from "react";
import { SearchHeader } from "@/components/SearchHeader";
import { SearchResults } from "@/components/SearchResults";
import { UploadSection } from "@/components/UploadSection";
import { StatsSection } from "@/components/StatsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string, filters: any) => {
    setIsSearching(true);
    setSearchQuery(query);
    
    // 시뮬레이션된 검색 결과
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: "개인정보보호법 시행령",
          content: "개인정보보호법 제2조제1호에 따른 개인정보의 처리에 관한 사항을 규정함...",
          source: "법제처",
          department: "개인정보보호위원회",
          lastModified: "2024-03-15",
          fileName: "개인정보보호법_시행령.pdf",
          type: "법률",
          url: "#"
        },
        {
          id: 2,
          title: "정보시스템 운영 관리지침",
          content: "정보시스템의 안정적 운영을 위한 관리 절차 및 방법을 정의...",
          source: "내부문서",
          department: "정보보안팀",
          lastModified: "2024-06-10",
          fileName: "정보시스템_운영관리지침.hwp",
          type: "지침",
          url: "#"
        },
        {
          id: 3,
          title: "예산집행 업무처리 규정",
          content: "예산의 편성, 집행, 결산에 관한 업무처리 절차를 규정...",
          source: "내부문서",
          department: "기획재정부",
          lastModified: "2024-05-20",
          fileName: "예산집행_업무처리규정.pdf",
          type: "규정",
          url: "#"
        }
      ].filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.content.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            통합 업무규정 검색시스템
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            각 부서의 내부규정, 지침, 가이드 및 법률을 한 곳에서 검색하고 관리할 수 있습니다.
          </p>
        </div>

        {/* 검색 섹션 */}
        <SearchHeader onSearch={handleSearch} isSearching={isSearching} />

        {/* 통계 정보 */}
        <StatsSection />

        {/* 메인 컨텐츠 */}
        <div className="mt-8">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="search">검색 결과</TabsTrigger>
              <TabsTrigger value="upload">문서 업로드</TabsTrigger>
              <TabsTrigger value="manage">부서별 관리</TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <Card>
                <CardContent className="p-6">
                  {searchQuery ? (
                    <SearchResults 
                      results={searchResults} 
                      query={searchQuery}
                      isLoading={isSearching}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-lg mb-4">
                        검색어를 입력하여 규정, 지침, 법률을 찾아보세요
                      </div>
                      <div className="text-sm text-gray-500">
                        키워드 예시: 개인정보, 예산, 보안, 인사 등
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload">
              <UploadSection />
            </TabsContent>

            <TabsContent value="manage">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-4">
                      부서별 문서 관리 기능
                    </div>
                    <div className="text-sm text-gray-500">
                      부서별 업로드된 문서 현황 및 관리 기능이 제공됩니다
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
