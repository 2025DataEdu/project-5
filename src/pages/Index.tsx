import { SmartSearchBox } from "@/components/SmartSearchBox";
import { SearchTabContent } from "@/components/SearchTabContent";
import { PopularTabContent } from "@/components/PopularTabContent";
import { ManageTabContent } from "@/components/ManageTabContent";
import { UploadSection } from "@/components/UploadSection";
import { StatsSection } from "@/components/StatsSection";
import { PageHeader } from "@/components/PageHeader";
import { SmartSearchManager } from "@/components/SmartSearchManager";
import { ConfettiEffect } from "@/components/effects/ConfettiEffect";
import { SubtleGrayBombEffect } from "@/components/effects/SubtleGrayBombEffect";
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
    searchError,
    showConfetti,
    showGrayBomb,
    setShowConfetti,
    setShowGrayBomb,
    handleSmartSearch
  } = useSearchLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* 배경 데코레이션 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <PageHeader />
        
        <div className="mb-8">
          <SmartSearchBox onSearch={handleSmartSearch} isSearching={isSearching} />
        </div>
        
        {/* 검색 결과 탭 */}
        <div className="mt-6">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl p-1.5 h-16">
              <TabsTrigger 
                value="search" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold rounded-xl px-6 py-4 text-base transition-all duration-300 hover:bg-blue-50 flex-1 min-w-0"
              >
                검색 결과
              </TabsTrigger>
              <TabsTrigger 
                value="popular"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold rounded-xl px-6 py-4 text-base transition-all duration-300 hover:bg-green-50 flex-1 min-w-0"
              >
                인기 규정
              </TabsTrigger>
              <TabsTrigger 
                value="upload"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold rounded-xl px-6 py-4 text-base transition-all duration-300 hover:bg-orange-50 flex-1 min-w-0"
              >
                문서 업로드
              </TabsTrigger>
              <TabsTrigger 
                value="smart"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold rounded-xl px-6 py-4 text-base transition-all duration-300 hover:bg-purple-50 flex-1 min-w-0"
              >
                임베딩 관리
              </TabsTrigger>
              <TabsTrigger 
                value="manage"
                className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold rounded-xl px-6 py-4 text-base transition-all duration-300 hover:bg-indigo-50 flex-1 min-w-0"
              >
                부서별 관리
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="mt-0">
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <SearchTabContent
                    searchQuery={searchQuery}
                    searchResults={searchResults}
                    isSearching={isSearching}
                    showComparison={showComparison}
                    showHistory={showHistory}
                    selectedRegulation={selectedRegulation}
                    aiResponse={aiResponse}
                    searchError={searchError}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="popular" className="mt-0">
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <PopularTabContent />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="mt-0">
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <UploadSection />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="smart" className="mt-0">
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <SmartSearchManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage" className="mt-0">
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <ManageTabContent />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 통계 섹션 */}
        <div className="mt-12">
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <StatsSection />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 이펙트 컴포넌트들 */}
      <ConfettiEffect 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      <SubtleGrayBombEffect 
        show={showGrayBomb} 
        onComplete={() => setShowGrayBomb(false)} 
      />
    </div>
  );
};

export default Index;
