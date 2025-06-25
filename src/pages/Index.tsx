
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
    handleSmartSearch
  } = useSearchLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <PageHeader />
        
        <SmartSearchBox onSearch={handleSmartSearch} isSearching={isSearching} />
        
        <StatsSection />

        <div className="mt-8">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="search">검색 결과</TabsTrigger>
              <TabsTrigger value="popular">인기 규정</TabsTrigger>
              <TabsTrigger value="upload">문서 업로드</TabsTrigger>
              <TabsTrigger value="manage">부서별 관리</TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <Card>
                <CardContent className="p-6">
                  <SearchTabContent
                    searchQuery={searchQuery}
                    searchResults={searchResults}
                    isSearching={isSearching}
                    showComparison={showComparison}
                    showHistory={showHistory}
                    selectedRegulation={selectedRegulation}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="popular">
              <PopularTabContent />
            </TabsContent>

            <TabsContent value="upload">
              <UploadSection />
            </TabsContent>

            <TabsContent value="manage">
              <ManageTabContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
