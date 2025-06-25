
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock } from "lucide-react";

interface SmartSearchBoxProps {
  onSearch: (query: string, isNaturalLanguage: boolean) => void;
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
    onSearch(keyword, false);
  };

  const handleSmartSearch = () => {
    if (query.trim()) {
      // 질문 형태나 긴 문장인 경우 자연어 검색으로, 짧은 키워드는 일반 검색으로 처리
      const isNaturalLanguage = query.includes('?') || query.includes('어떻게') || query.includes('무엇') || query.length > 10;
      onSearch(query, isNaturalLanguage);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    onSearch(search, true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSmartSearch();
    }
  };

  return (
    <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur">
      <CardHeader>
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

        {/* 최근 검색어 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            최근 검색
          </h4>
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <div 
                key={index} 
                className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer p-2 rounded hover:bg-blue-50 transition-colors" 
                onClick={() => handleRecentSearchClick(search)}
              >
                {search}
              </div>
            ))}
          </div>
        </div>

        {/* 통합 검색 입력 */}
        <div className="space-y-3">
          <Textarea 
            placeholder="키워드나 질문을 입력하세요 (예: 개인정보, 출장비 신청 절차는 어떻게 되나요?)" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[100px] border-2 border-blue-200 focus:border-blue-400" 
          />
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
