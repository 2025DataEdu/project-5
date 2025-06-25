
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileIcon, Calendar, Building, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResult {
  id: number;
  title: string;
  content: string;
  source: string;
  department: string;
  lastModified: string;
  fileName: string;
  type: string;
  url: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
}

export const SearchResults = ({ results, query, isLoading }: SearchResultsProps) => {
  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "법제처":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "내부문서":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "법률":
        return "bg-red-100 text-red-800 border-red-200";
      case "규정":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "지침":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "가이드":
        return "bg-teal-100 text-teal-800 border-teal-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-gray-600">검색 중...</div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-gray-200">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-4">
          '{query}'에 대한 검색 결과가 없습니다
        </div>
        <div className="text-sm text-gray-500">
          다른 키워드로 검색해보시거나 필터를 조정해보세요
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-gray-600">
          <span className="font-semibold text-blue-600">{results.length}개</span>의 검색 결과
        </div>
        <div className="text-sm text-gray-500">
          '{query}' 검색 결과
        </div>
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                  {highlightText(result.title, query)}
                </CardTitle>
                <div className="flex gap-2 flex-shrink-0">
                  <Badge variant="outline" className={getSourceBadgeColor(result.source)}>
                    {result.source}
                  </Badge>
                  <Badge variant="outline" className={getTypeBadgeColor(result.type)}>
                    {result.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {highlightText(result.content, query)}
              </p>
              
              <Separator className="my-4" />
              
              {/* 출처 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="h-4 w-4" />
                  <span className="font-medium">부서:</span>
                  <span>{result.department}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">수정일:</span>
                  <span>{result.lastModified}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <FileIcon className="h-4 w-4" />
                  <span className="font-medium">파일:</span>
                  <span className="truncate">{result.fileName}</span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  원문 보기
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
