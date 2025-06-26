
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, X, Trash2 } from "lucide-react";

interface SmartSearchBoxProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  onSearchComplete?: (query: string) => void;
}

export const SmartSearchBox = ({
  onSearch,
  isSearching,
  onSearchComplete
}: SmartSearchBoxProps) => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const recommendedKeywords = ["개인정보", "예산집행", "출장", "보안", "인사관리", "계약", "정보공개", "교육훈련", "문서관리", "감사"];
  const sampleRecentSearches = ["출장비 신청 절차는 어떻게 되나요?", "개인정보 수집 시 주의사항", "예산 승인 권한자는 누구인가요?", "보안사고 발생 시 대응절차"];

  // 검색 기록 로드
  useEffect(() => {
    const loadSearchHistory = () => {
      try {
        const saved = localStorage.getItem('searchHistory');
        if (saved) {
          const history = JSON.parse(saved);
          setRecentSearches(Array.isArray(history) ? history : []);
        }
      } catch (error) {
        console.error('검색 기록 로드 실패:', error);
      }
    };

    loadSearchHistory();
  }, []);

  // 검색 기록 저장
  const saveSearchHistory = (history: string[]) => {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(history));
      setRecentSearches(history);
    } catch (error) {
      console.error('검색 기록 저장 실패:', error);
    }
  };

  // 검색 기록에 추가
  const addToSearchHistory = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    const newHistory = [trimmedQuery, ...recentSearches.filter(item => item !== trimmedQuery)].slice(0, 10);
    saveSearchHistory(newHistory);
  };

  // 개별 검색 기록 삭제
  const removeFromSearchHistory = (indexToRemove: number) => {
    const newHistory = recentSearches.filter((_, index) => index !== indexToRemove);
    saveSearchHistory(newHistory);
  };

  // 전체 검색 기록 삭제
  const clearSearchHistory = () => {
    saveSearchHistory([]);
  };

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
    addToSearchHistory(keyword);
    onSearch(keyword);
  };

  const handleSmartSearch = () => {
    if (query.trim()) {
      addToSearchHistory(query);
      onSearch(query);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    addToSearchHistory(search);
    onSearch(search);
  };

  const handleClearQuery = () => {
    setQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSmartSearch();
    }
  };

  // 표시할 최근 검색어 결정
  const displayRecentSearches = recentSearches.length > 0 ? recentSearches : sampleRecentSearches;
  const isUsingRealHistory = recentSearches.length > 0;

  return (
    <Card className="mb-4 shadow-lg border-0 bg-white/95 backdrop-blur">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="h-5 w-5 text-blue-600" />
          스마트 업무규정 검색
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 추천 키워드 */}
        <div>
          <h4 className="text-base font-semibold text-gray-800 mb-3">추천 키워드</h4>
          <div className="flex flex-wrap gap-3">
            {recommendedKeywords.map(keyword => (
              <Badge 
                key={keyword} 
                variant="secondary" 
                className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition-colors text-sm px-3 py-2" 
                onClick={() => handleKeywordClick(keyword)}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* 최근 검색어 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              최근 검색 {!isUsingRealHistory && <span className="text-sm text-gray-500">(샘플)</span>}
            </h4>
            {isUsingRealHistory && recentSearches.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearchHistory}
                className="h-auto p-2 text-gray-500 hover:text-red-600"
                title="전체 삭제"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {displayRecentSearches.map((search, index) => (
              <div key={isUsingRealHistory ? `real-${index}` : `sample-${index}`} className="relative group">
                <Badge 
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-50 hover:text-gray-800 transition-colors max-w-xs truncate text-sm pr-8 py-2"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  {search}
                </Badge>
                {isUsingRealHistory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromSearchHistory(index);
                    }}
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 hover:bg-red-100 rounded-full"
                    title="삭제"
                  >
                    <X className="h-3 w-3 text-gray-600 hover:text-red-600" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 통합 검색 입력 - X 버튼 포함 */}
        <div className="space-y-4">
          <div className="relative">
            <Textarea 
              placeholder="키워드나 질문을 입력하세요 (예: 개인정보, 출장비 신청 절차는 어떻게 되나요?)" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[120px] border-2 border-blue-200 focus:border-blue-400 pr-12 text-base" 
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 h-8 w-8 p-0 hover:bg-gray-100"
                onClick={handleClearQuery}
              >
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            )}
          </div>
          <Button 
            onClick={handleSmartSearch} 
            disabled={isSearching || !query.trim()} 
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
          >
            {isSearching ? "검색 중..." : "스마트 검색하기"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
