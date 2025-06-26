
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, X } from "lucide-react";

interface SmartSearchBoxProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export const SmartSearchBox = ({
  onSearch,
  isSearching
}: SmartSearchBoxProps) => {
  const [query, setQuery] = useState("");

  const recommendedKeywords = ["개인정보", "예산집행", "출장", "보안", "인사관리", "계약", "정보공개", "교육훈련", "문서관리", "감사"];
  const recentSearches = ["출장비 신청 절차는 어떻게 되나요?", "개인정보 수집 시 주의사항", "예산 승인 권한자는 누구인가요?", "보안사고 발생 시 대응절차"];

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
    onSearch(keyword);
  };

  const handleSmartSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
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

  return (
    <Card className="mb-4 shadow-lg border-0 bg-white/95 backdrop-blur">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="h-5 w-5 text-blue-600" />
          스마트 업무규정 검색
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 추천 키워드 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">추천 키워드</h4>
          <div className="flex flex-wrap gap-2">
            {recommendedKeywords.map(keyword => (
              <Badge 
                key={keyword} 
                variant="secondary" 
                className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition-colors" 
                onClick={() => handleKeywordClick(keyword)}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* 최근 검색어 - 컴팩트한 박스 형태 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            최근 검색
          </h4>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="cursor-pointer hover:bg-gray-50 hover:text-gray-800 transition-colors max-w-xs truncate text-xs"
                onClick={() => handleRecentSearchClick(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>

        {/* 통합 검색 입력 - X 버튼 포함 */}
        <div className="space-y-3">
          <div className="relative">
            <Textarea 
              placeholder="키워드나 질문을 입력하세요 (예: 개인정보, 출장비 신청 절차는 어떻게 되나요?)" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[100px] border-2 border-blue-200 focus:border-blue-400 pr-10" 
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-gray-100"
                onClick={handleClearQuery}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            )}
          </div>
          <Button 
            onClick={handleSmartSearch} 
            disabled={isSearching || !query.trim()} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSearching ? "검색 중..." : "스마트 검색하기"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
