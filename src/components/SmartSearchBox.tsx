
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, Clock } from "lucide-react";

interface SmartSearchBoxProps {
  onSearch: (query: string, isNaturalLanguage: boolean) => void;
  isSearching: boolean;
}

export const SmartSearchBox = ({ onSearch, isSearching }: SmartSearchBoxProps) => {
  const [query, setQuery] = useState("");
  const [showNaturalInput, setShowNaturalInput] = useState(false);

  const recommendedKeywords = [
    "개인정보", "예산집행", "출장", "보안", "인사관리", 
    "계약", "정보공개", "교육훈련", "문서관리", "감사"
  ];

  const recentSearches = [
    "출장비 신청 절차는 어떻게 되나요?",
    "개인정보 수집 시 주의사항",
    "예산 승인 권한자는 누구인가요?",
    "보안사고 발생 시 대응절차"
  ];

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
    onSearch(keyword, false);
  };

  const handleNaturalSearch = () => {
    if (query.trim()) {
      onSearch(query, true);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    onSearch(search, true);
  };

  return (
    <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-blue-600" />
          스마트 업무규정 검색
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 자연어 입력 토글 */}
        <div className="flex gap-2">
          <Button
            variant={!showNaturalInput ? "default" : "outline"}
            onClick={() => setShowNaturalInput(false)}
            className="flex-1"
          >
            <Search className="h-4 w-4 mr-2" />
            키워드 검색
          </Button>
          <Button
            variant={showNaturalInput ? "default" : "outline"}
            onClick={() => setShowNaturalInput(true)}
            className="flex-1"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            자연어 검색
          </Button>
        </div>

        {/* 검색 입력 */}
        {showNaturalInput ? (
          <div className="space-y-3">
            <Textarea
              placeholder="예: 출장을 가려고 하는데 어떤 절차를 거쳐야 하나요? 필요한 서류는 무엇인가요?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px] border-2 border-blue-200 focus:border-blue-400"
            />
            <Button 
              onClick={handleNaturalSearch}
              disabled={isSearching || !query.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? "분석 중..." : "스마트 검색하기"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="키워드를 입력하세요 (예: 개인정보, 출장, 계약)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch(query, false)}
              className="w-full px-4 py-3 border-2 border-blue-200 focus:border-blue-400 rounded-md"
            />
            <Button 
              onClick={() => onSearch(query, false)}
              disabled={isSearching || !query.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? "검색 중..." : "검색"}
            </Button>
          </div>
        )}

        {/* 추천 키워드 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">추천 키워드</h4>
          <div className="flex flex-wrap gap-2">
            {recommendedKeywords.map((keyword) => (
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
      </CardContent>
    </Card>
  );
};
