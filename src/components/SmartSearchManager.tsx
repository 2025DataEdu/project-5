
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Database, RefreshCw, TrendingUp, Info, CheckCircle, Clock, Zap, FileText } from "lucide-react";
import { generateEmbeddings, generatePdfEmbeddings, getEmbeddingStats } from "@/services/smartSearchService";
import { toast } from "sonner";

export const SmartSearchManager = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [stats, setStats] = useState<{
    total: number;
    byType: Record<string, number>;
    byDepartment: Record<string, number>;
  } | null>(null);
  const [lastGeneration, setLastGeneration] = useState<{
    processed: number;
    errors: number;
    total: number;
    existing?: number;
    message?: string;
  } | null>(null);
  const [lastPdfGeneration, setLastPdfGeneration] = useState<{
    processed: number;
    errors: number;
    total: number;
    existing?: number;
    message?: string;
  } | null>(null);

  const loadStats = async () => {
    try {
      const embeddingStats = await getEmbeddingStats();
      setStats(embeddingStats);
    } catch (error) {
      console.error('Stats loading failed:', error);
      toast.error('통계 로딩에 실패했습니다');
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleGenerateEmbeddings = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    toast.info('결재문서 임베딩 생성을 시작합니다...');
    
    try {
      console.log('🚀 Starting embedding generation...');
      const result = await generateEmbeddings();
      setLastGeneration(result);
      
      // 임베딩 생성 완료 후 통계 새로고침
      await loadStats();
      
      console.log('✅ Embedding generation completed:', result);
      
      if (result.success) {
        toast.success(result.message || `임베딩 생성 완료: ${result.processed}개 처리됨`);
      } else {
        toast.error(result.message || '임베딩 생성 중 오류가 발생했습니다');
      }
    } catch (error) {
      console.error('💥 Embedding generation failed:', error);
      toast.error('임베딩 생성에 실패했습니다');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePdfEmbeddings = async () => {
    if (isPdfGenerating) return;
    
    setIsPdfGenerating(true);
    toast.info('PDF 문서 임베딩 생성을 시작합니다...');
    
    try {
      console.log('🚀 Starting PDF embedding generation...');
      const result = await generatePdfEmbeddings();
      setLastPdfGeneration(result);
      
      // PDF 임베딩 생성 완료 후 통계 새로고침
      await loadStats();
      
      console.log('✅ PDF Embedding generation completed:', result);
      
      if (result.success) {
        toast.success(result.message || `PDF 임베딩 생성 완료: ${result.processed}개 처리됨`);
      } else {
        toast.error(result.message || 'PDF 임베딩 생성 중 오류가 발생했습니다');
      }
    } catch (error) {
      console.error('💥 PDF Embedding generation failed:', error);
      toast.error('PDF 임베딩 생성에 실패했습니다');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const getCompletionPercentage = () => {
    if (!stats?.total || !lastGeneration?.total) return 0;
    return Math.round((stats.total / lastGeneration.total) * 100);
  };

  const getRemainingCount = () => {
    if (!lastGeneration?.total || !stats?.total) return 0;
    return Math.max(0, lastGeneration.total - stats.total);
  };

  const isCompleted = getCompletionPercentage() === 100;
  const hasRemaining = getRemainingCount() > 0;

  return (
    <div className="space-y-6">
      {/* 스마트 검색 안내 */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          스마트 검색은 AI 벡터 임베딩을 사용하여 의미적 유사성을 기반으로 문서를 검색합니다. 
          더 정확하고 자연스러운 검색 결과를 제공합니다.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 결재문서 임베딩 생성 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              결재문서 임베딩 생성
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              결재문서들의 벡터 임베딩을 생성하여 스마트 검색 기능을 활성화합니다.
            </div>

            {lastGeneration && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">진행률</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-600 font-semibold">
                      {getCompletionPercentage()}% 완료
                    </span>
                    {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
                <Progress 
                  value={getCompletionPercentage()} 
                  className="h-3 mb-3"
                />
                <div className="text-xs text-gray-600">
                  {stats?.byType?.['결재문서'] || 0} / {lastGeneration.total} 문서 처리 완료
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleGenerateEmbeddings}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  결재문서 임베딩 생성 중...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  결재문서 임베딩 생성
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* PDF 문서 임베딩 생성 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              PDF 문서 임베딩 생성
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              업로드된 PDF 문서들의 벡터 임베딩을 생성하여 스마트 검색에 포함시킵니다.
            </div>

            {lastPdfGeneration && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">PDF 처리 결과</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{lastPdfGeneration.processed}</div>
                    <div className="text-gray-500 text-xs">처리됨</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">{lastPdfGeneration.errors}</div>
                    <div className="text-gray-500 text-xs">오류</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{lastPdfGeneration.total}</div>
                    <div className="text-gray-500 text-xs">전체</div>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleGeneratePdfEmbeddings}
              disabled={isPdfGenerating}
              className="w-full"
              size="lg"
              variant="outline"
            >
              {isPdfGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  PDF 임베딩 생성 중...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF 문서 임베딩 생성
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 통합 임베딩 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            전체 임베딩 통계
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats ? (
            <>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-500">총 임베딩 개수</div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-2">문서 타입별</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(stats.byType).map(([type, count]) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">상위 부서별</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(stats.byDepartment)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([dept, count]) => (
                        <Badge key={dept} variant="outline" className="text-xs">
                          {dept}: {count}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div>통계를 불러오는 중...</div>
            </div>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadStats}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            통계 새로고침
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
