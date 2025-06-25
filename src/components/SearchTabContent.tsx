
import { SearchResults } from "@/components/SearchResults";
import { RegulationComparison } from "@/components/RegulationComparison";
import { RegulationHistory } from "@/components/RegulationHistory";
import { mockComparisons, mockHistory } from "@/data/mockData";

interface SearchTabContentProps {
  searchQuery: string;
  searchResults: any[];
  isSearching: boolean;
  showComparison: boolean;
  showHistory: boolean;
  selectedRegulation: any;
}

export const SearchTabContent = ({
  searchQuery,
  searchResults,
  isSearching,
  showComparison,
  showHistory,
  selectedRegulation
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
