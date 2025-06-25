
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileIcon, Calendar, Building, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { SearchResult } from "@/services/searchService";

interface SearchResultCardProps {
  result: SearchResult;
  query: string;
}

export const SearchResultCard = ({ result, query }: SearchResultCardProps) => {
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
      case "결재문서":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "직원정보":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
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

  const handleViewOriginal = (url: string, fileName: string) => {
    console.log('Attempting to open URL:', url);
    
    if (!url || url === '' || url === '#' || url === 'undefined') {
      toast.error(`죄송합니다. ${fileName}의 원문 링크가 현재 사용할 수 없습니다.`);
      return;
    }

    // URL이 http로 시작하지 않으면 https를 추가
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = `https://${url}`;
    }

    try {
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening URL:', error);
      toast.error(`원문 링크를 열 수 없습니다. URL: ${finalUrl}`);
    }
  };

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
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
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => handleViewOriginal(result.url, result.fileName)}
          >
            <ExternalLink className="h-4 w-4" />
            원문 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
