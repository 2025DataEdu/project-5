
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Building, FileText, ExternalLink, Download, Eye } from "lucide-react";
import { SearchResult } from "@/services/searchService";
import { logDocumentView } from "@/services/analyticsService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SearchResultCardProps {
  result: SearchResult & { similarity?: number }; // 유사도 점수 추가
  searchQuery?: string;
}

export const SearchResultCard = ({ result, searchQuery }: SearchResultCardProps) => {
  const { toast } = useToast();

  const handleCardClick = async () => {
    // 문서 조회 로그 기록 (ID는 이미 문자열로 처리됨)
    await logDocumentView(
      result.id,
      result.type,
      result.title,
      result.department,
      searchQuery
    );
  };

  const handleViewFile = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 문서 조회 로그 기록
    await handleCardClick();
    
    // PDF 문서인 경우 실제 파일 URL로 열기
    if (result.type === 'PDF문서' && result.url && result.url !== '#') {
      window.open(result.url, '_blank');
    } else {
      // 다른 문서 타입의 경우 정보 표시
      toast({
        title: "문서 보기",
        description: `${result.title} - 파일을 미리볼 수 없습니다. 담당부서(${result.department})에 문의하세요.`,
      });
    }
  };

  const handleDownloadFile = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // PDF 문서인 경우 실제 다운로드
      if (result.type === 'PDF문서' && result.url && result.url !== '#') {
        // Supabase Storage에서 파일 다운로드
        const fileName = result.fileName || `${result.title}.pdf`;
        
        // 파일 URL에서 파일 경로 추출
        const urlParts = result.url.split('/');
        const filePath = urlParts[urlParts.length - 1];
        
        if (filePath) {
          const { data, error } = await supabase.storage
            .from('pdf-documents')
            .download(filePath);
          
          if (error) {
            console.error('다운로드 오류:', error);
            toast({
              title: "다운로드 실패",
              description: "파일을 다운로드할 수 없습니다.",
              variant: "destructive",
            });
            return;
          }
          
          // 파일 다운로드 트리거
          const url = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast({
            title: "다운로드 완료",
            description: `${fileName} 파일이 다운로드되었습니다.`,
          });
        }
      } else {
        // 다른 문서 타입의 경우 안내 메시지
        toast({
          title: "다운로드 불가",
          description: `${result.title} - 이 문서는 다운로드할 수 없습니다. 담당부서(${result.department})에 문의하세요.`,
        });
      }
    } catch (error) {
      console.error('다운로드 처리 중 오류:', error);
      toast({
        title: "다운로드 오류",
        description: "파일 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900 leading-tight flex-1 mr-4">
            {result.title}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {result.type}
            </Badge>
            {result.similarity && (
              <Badge 
                variant={result.similarity > 0.8 ? "default" : "outline"}
                className="text-xs font-medium"
              >
                {Math.round(result.similarity * 100)}% 유사
              </Badge>
            )}
            {result.url && result.url !== '#' && (
              <ExternalLink className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {result.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {result.department}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {result.lastModified}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {result.fileName}
            </span>
          </div>
          
          {/* 파일 액션 버튼들 */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewFile}
              className="h-8 px-3 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              보기
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadFile}
              className="h-8 px-3 text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              다운로드
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
