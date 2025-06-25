
import { SmartSearchBox } from "@/components/SmartSearchBox";
import { SearchTabContent } from "@/components/SearchTabContent";
import { PopularTabContent } from "@/components/PopularTabContent";
import { ManageTabContent } from "@/components/ManageTabContent";
import { UploadSection } from "@/components/UploadSection";
import { StatsSection } from "@/components/StatsSection";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchLogic } from "@/hooks/useSearchLogic";

const Index = () => {
  const {
    searchQuery,
    searchResults,
    isSearching,
    showComparison,
    showHistory,
    selectedRegulation,
    aiResponse,
    handleSmartSearch
  } = useSearchLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        <PageHeader />
        
        <SmartSearchBox onSearch={handleSmartSearch} isSearching={isSearching} />
        
        {/* 검색 결과를 더 위쪽에 배치 */}
        <div className="mt-4">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4 bg-white/80 backdrop-blur border shadow-sm">
              <TabsTrigger 
                value="search" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
              >
                검색 결과
              </TabsTrigger>
              <TabsTrigger 
                value="popular"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
              >
                인기 규정
              </TabsTrigger>
              <TabsTrigger 
                value="upload"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
              >
                문서 업로드
              </TabsTrigger>
              <TabsTrigger 
                value="manage"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
              >
                부서별 관리
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="mt-0">
              <Card className="shadow-md border-0 bg-white/95 backdrop-blur">
                <CardContent className="p-6">
                  <SearchTabContent
                    searchQuery={searchQuery}
                    searchResults={searchResults}
                    isSearching={isSearching}
                    showComparison={showComparison}
                    showHistory={showHistory}
                    selectedRegulation={selectedRegulation}
                    aiResponse={aiResponse}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="popular" className="mt-0">
              <Card className="shadow-md border-0 bg-white/95 backdrop-blur">
                <CardContent className="p-6">
                  <PopularTabContent />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="mt-0">
              <Card className="shadow-md border-0 bg-white/95 backdrop-blur">
                <CardContent className="p-6">
                  <UploadSection />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage" className="mt-0">
              <Card className="shadow-md border-0 bg-white/95 backdrop-blur">
                <CardContent className="p-6">
                  <ManageTabContent />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 통계 섹션을 하단으로 이동 */}
        <div className="mt-8">
          <StatsSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
