
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const PageHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
          통합 업무규정 검색시스템
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
          "업무 규정, 조례, 훈령 등 다양한 문서를 한 번에 검색하고 활용"
        </p>
        <div className="mt-8 flex justify-center">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
            onClick={() => setIsDialogOpen(true)}
          >
            AI 기반 스마트 검색 지원
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-blue-600 mb-4">
              개발팀 소개
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold text-gray-800">안녕하세요~ 5조입니다</p>
            <div className="space-y-2 text-gray-700">
              <p>중소벤처기업부 기획조정실 <span className="font-medium">모윤택</span></p>
              <p>강원특별자치도 원주시 <span className="font-medium">이보람</span></p>
              <p>제주특별자치도 <span className="font-medium">최주일</span></p>
              <p>대구광역시 달성군 <span className="font-medium">조호현</span></p>
            </div>
            <p className="text-lg font-medium text-purple-600 mt-6">
              언능 마치고 집에 가요~
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
