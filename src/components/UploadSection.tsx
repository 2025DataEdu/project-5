import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const UploadSection = () => {
  const [uploadData, setUploadData] = useState({
    title: "",
    department: "",
    type: "",
    description: "",
    keywords: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['pdf', 'hwp', 'doc', 'docx'].includes(extension || '');
    });
    
    if (validFiles.length !== files.length) {
      toast({
        title: "파일 형식 오류",
        description: "PDF, HWP, DOC, DOCX 파일만 업로드할 수 있습니다.",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFileToStorage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${uploadData.department}/${fileName}`;

      console.log('🔄 파일 업로드 시작:', {
        fileName: file.name,
        filePath,
        fileSize: file.size,
        department: uploadData.department
      });

      const { data, error } = await supabase.storage
        .from('pdf-documents')
        .upload(filePath, file);

      if (error) {
        console.error('❌ Storage 업로드 오류:', error);
        toast({
          title: "파일 업로드 실패",
          description: `Storage 업로드 오류: ${error.message}`,
          variant: "destructive"
        });
        return null;
      }

      console.log('✅ Storage 업로드 성공:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pdf-documents')
        .getPublicUrl(filePath);

      console.log('📄 Public URL 생성:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('💥 파일 업로드 예외:', error);
      toast({
        title: "파일 업로드 오류",
        description: `업로드 중 예외 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        variant: "destructive"
      });
      return null;
    }
  };

  const saveFileMetadata = async (file: File, fileUrl: string) => {
    try {
      const metaData = {
        file_name: file.name,
        file_path: fileUrl,
        title: uploadData.title || file.name,
        department: uploadData.department,
        file_size: file.size,
        file_url: fileUrl,
        content_text: uploadData.description || `${uploadData.title} - ${uploadData.keywords}`,
        status: 'active'
      };

      console.log('💾 데이터베이스 저장 시도:', metaData);

      const { data, error } = await supabase
        .from('pdf_documents')
        .insert(metaData)
        .select();

      if (error) {
        console.error('❌ 데이터베이스 저장 오류:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        toast({
          title: "메타데이터 저장 실패",
          description: `DB 오류 (${error.code}): ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }

      console.log('✅ 데이터베이스 저장 성공:', data);
      return data;
    } catch (error) {
      console.error('💥 메타데이터 저장 예외:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!uploadData.title || !uploadData.department || !uploadData.type || selectedFiles.length === 0) {
      toast({
        title: "필수 정보 누락",
        description: "제목, 부서, 문서 유형, 파일을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    console.log('🚀 업로드 프로세스 시작:', {
      fileCount: selectedFiles.length,
      uploadData
    });

    setIsUploading(true);

    try {
      let successCount = 0;
      let failCount = 0;

      for (const file of selectedFiles) {
        try {
          console.log(`📁 파일 처리 중: ${file.name}`);
          
          // Upload file to storage
          const fileUrl = await uploadFileToStorage(file);
          
          if (fileUrl) {
            // Save metadata to database
            await saveFileMetadata(file, fileUrl);
            successCount++;
            console.log(`✅ 파일 업로드 완료: ${file.name}`);
          } else {
            failCount++;
            console.error(`❌ 파일 업로드 실패: ${file.name}`);
          }
        } catch (error) {
          console.error(`💥 파일 처리 중 오류 (${file.name}):`, error);
          failCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "업로드 완료",
          description: `${successCount}개 파일이 성공적으로 업로드되었습니다.${failCount > 0 ? ` (${failCount}개 파일 실패)` : ''}`,
        });

        // 폼 초기화
        setUploadData({
          title: "",
          department: "",
          type: "",
          description: "",
          keywords: ""
        });
        setSelectedFiles([]);
      } else {
        toast({
          title: "업로드 실패",
          description: "모든 파일 업로드에 실패했습니다. 콘솔 로그를 확인해주세요.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('💥 업로드 프로세스 오류:', error);
      toast({
        title: "업로드 오류",
        description: "업로드 중 예상치 못한 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    return <FileIcon className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 업로드 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            문서 업로드
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">문서 제목 *</Label>
            <Input
              id="title"
              value={uploadData.title}
              onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
              placeholder="예: 개인정보보호 관리지침"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">담당 부서 *</Label>
              <Select value={uploadData.department} onValueChange={(value) => setUploadData({...uploadData, department: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="security">정보보안팀</SelectItem>
                  <SelectItem value="hr">인사팀</SelectItem>
                  <SelectItem value="finance">기획재정부</SelectItem>
                  <SelectItem value="legal">법무팀</SelectItem>
                  <SelectItem value="admin">총무팀</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">문서 유형 *</Label>
              <Select value={uploadData.type} onValueChange={(value) => setUploadData({...uploadData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regulation">규정</SelectItem>
                  <SelectItem value="guideline">지침</SelectItem>
                  <SelectItem value="guide">가이드</SelectItem>
                  <SelectItem value="manual">매뉴얼</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">문서 설명</Label>
            <Textarea
              id="description"
              value={uploadData.description}
              onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
              placeholder="문서에 대한 간단한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">키워드</Label>
            <Input
              id="keywords"
              value={uploadData.keywords}
              onChange={(e) => setUploadData({...uploadData, keywords: e.target.value})}
              placeholder="검색에 도움이 되는 키워드를 입력하세요 (쉼표로 구분)"
            />
          </div>

          {/* 파일 선택 */}
          <div className="space-y-2">
            <Label>파일 선택 *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.hwp,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  클릭하여 파일을 선택하거나 드래그하여 업로드
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, HWP, DOC, DOCX 파일 지원
                </p>
              </label>
            </div>
          </div>

          <Button 
            onClick={handleUpload} 
            className="w-full" 
            size="lg"
            disabled={isUploading}
          >
            {isUploading ? "업로드 중..." : "업로드"}
          </Button>
        </CardContent>
      </Card>

      {/* 선택된 파일 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>선택된 파일 ({selectedFiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              선택된 파일이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name)}
                    <div>
                      <div className="font-medium text-sm">{file.name}</div>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
