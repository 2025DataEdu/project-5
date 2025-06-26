
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building, FileText, ExternalLink } from "lucide-react";
import { SearchResult } from "@/services/searchService";
import { logDocumentView } from "@/services/analyticsService";

interface SearchResultCardProps {
  result: SearchResult;
  searchQuery?: string;
}

export const SearchResultCard = ({ result, searchQuery }: SearchResultCardProps) => {
  const handleCardClick = async () => {
    // 문서 조회 로그 기록 (ID는 이미 문자열로 처리됨)
    await logDocumentView(
      result.id,
      result.type,
      result.title,
      result.department,
      searchQuery
    );
    
    // 실제 문서 링크가 있다면 새 탭에서 열기
    if (result.url && result.url !== '#') {
      window.open(result.url, '_blank');
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900 leading-tight">
            {result.title}
          </h3>
          <div className="flex items-center gap-2 ml-4">
            <Badge variant="secondary" className="text-xs font-medium">
              {result.type}
            </Badge>
            {result.url && result.url !== '#' && (
              <ExternalLink className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {result.content}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {result.department}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {result.lastModified}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {result.fileName}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
