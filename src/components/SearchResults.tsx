
import { SearchResult } from "@/services/searchService";
import { SearchResultCard } from "@/components/search/SearchResultCard";
import { SearchResultsHeader } from "@/components/search/SearchResultsHeader";
import { SearchResultsEmpty } from "@/components/search/SearchResultsEmpty";
import { SearchResultsLoading } from "@/components/search/SearchResultsLoading";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
}

// 안정적인 키 생성 함수
const generateStableKey = (result: SearchResult, index: number): string => {
  // ID가 있으면 ID 사용, 없으면 제목과 부서로 키 생성
  if (result.id && result.id !== 'unknown') {
    return result.id;
  }
  
  const title = result.title?.replace(/\s+/g, '-').toLowerCase() || 'untitled';
  const dept = result.department?.replace(/\s+/g, '-').toLowerCase() || 'unknown';
  const type = result.type?.replace(/\s+/g, '-').toLowerCase() || 'document';
  
  return `${type}-${title}-${dept}-${index}`;
};

export const SearchResults = ({ results, query, isLoading }: SearchResultsProps) => {
  if (isLoading) {
    return <SearchResultsLoading />;
  }

  if (results.length === 0) {
    return <SearchResultsEmpty query={query} />;
  }

  // 최대 50개 결과로 제한
  const limitedResults = results.slice(0, 50);
  const isLimited = results.length > 50;

  console.log('📊 SearchResults rendering:', {
    totalResults: results.length,
    limitedResults: limitedResults.length,
    isLimited,
    resultKeys: limitedResults.map((result, index) => ({
      key: generateStableKey(result, index),
      title: result.title,
      id: result.id
    }))
  });

  return (
    <div className="space-y-6">
      <SearchResultsHeader resultsCount={limitedResults.length} query={query} />
      
      {isLimited && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-amber-800 text-sm">
            검색 결과가 {results.length}개 발견되었지만, 성능을 위해 상위 50개 결과만 표시합니다.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {limitedResults.map((result, index) => {
          const stableKey = generateStableKey(result, index);
          return (
            <SearchResultCard 
              key={stableKey}
              result={result} 
              searchQuery={query} 
            />
          );
        })}
      </div>
    </div>
  );
};
