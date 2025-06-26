
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

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
        <DialogPortal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[40%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
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
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
};
