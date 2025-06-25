
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SearchHeaderProps {
  onSearch: (query: string, filters: any) => void;
  isSearching: boolean;
}

export const SearchHeader = ({ onSearch, isSearching }: SearchHeaderProps) => {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    source: "all",
    department: "all",
    type: "all",
    dateRange: "all"
  });

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, filters);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardContent className="p-6">
        {/* 메인 검색 */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="규정, 지침, 법률 검색..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 h-12 text-lg border-2 border-blue-200 focus:border-blue-400"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isSearching || !query.trim()}
            className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
          >
            {isSearching ? "검색중..." : "검색"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-4 border-2 border-gray-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            필터
          </Button>
        </div>

        {/* 필터 섹션 */}
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">출처</label>
                <Select value={filters.source} onValueChange={(value) => setFilters({...filters, source: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="moleg">법제처</SelectItem>
                    <SelectItem value="internal">내부문서</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">부서</label>
                <Select value={filters.department} onValueChange={(value) => setFilters({...filters, department: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="security">정보보안팀</SelectItem>
                    <SelectItem value="hr">인사팀</SelectItem>
                    <SelectItem value="finance">기획재정부</SelectItem>
                    <SelectItem value="legal">법무팀</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">문서 유형</label>
                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="law">법률</SelectItem>
                    <SelectItem value="regulation">규정</SelectItem>
                    <SelectItem value="guideline">지침</SelectItem>
                    <SelectItem value="guide">가이드</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">수정일</label>
                <Select value={filters.dateRange} onValueChange={(value) => setFilters({...filters, dateRange: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="1month">1개월 이내</SelectItem>
                    <SelectItem value="3months">3개월 이내</SelectItem>
                    <SelectItem value="6months">6개월 이내</SelectItem>
                    <SelectItem value="1year">1년 이내</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 활성 필터 표시 */}
            <div className="flex flex-wrap gap-2">
              {filters.source !== "all" && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  출처: {filters.source === "moleg" ? "법제처" : "내부문서"}
                </Badge>
              )}
              {filters.department !== "all" && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  부서: {filters.department}
                </Badge>
              )}
              {filters.type !== "all" && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  유형: {filters.type}
                </Badge>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
