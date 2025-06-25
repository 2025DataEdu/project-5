
import { SearchResults } from "@/components/SearchResults";
import { RegulationComparison } from "@/components/RegulationComparison";
import { RegulationHistory } from "@/components/RegulationHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockComparisons, mockHistory } from "@/data/mockData";
import { Bot, Lightbulb } from "lucide-react";

interface SearchTabContentProps {
  searchQuery: string;
  searchResults: any[];
  isSearching: boolean;
  showComparison: boolean;
  showHistory: boolean;
  selectedRegulation: any;
  aiResponse: string;
}

export const SearchTabContent = ({
  searchQuery,
  searchResults,
  isSearching,
  showComparison,
  showHistory,
  selectedRegulation,
  aiResponse
}: SearchTabContentProps) => {
  if (!searchQuery) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-4">
          자연어 또는 키워드로 규정을 검색하세요
        </div>
        <div className="text-sm text-gray-500">
          예시: "출장을 가려면 어떤 절차를 거쳐야 하나요?"
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI 응답 표시 (검색 결과가 없을 때만) */}
      {searchResults.length === 0 && aiResponse && !isSearching && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Bot className="h-5 w-5" />
              AI 규정 안내
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {aiResponse}
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-100 rounded-md">
              <p className="text-sm text-blue-700">
                💡 위 내용은 AI가 제공하는 일반적인 가이드라인입니다. 정확한 규정은 해당 부서에 문의하시기 바랍니다.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <SearchResults 
        results={searchResults} 
        query={searchQuery}
        isLoading={isSearching}
      />
      
      {showComparison && (
        <RegulationComparison 
          mainRegulation={selectedRegulation}
          comparisons={mockComparisons}
        />
      )}
      
      {showHistory && (
        <RegulationHistory 
          currentRegulation="출장 및 교육훈련 관리 규정 v2.1"
          history={mockHistory}
        />
      )}
    </div>
  );
};
