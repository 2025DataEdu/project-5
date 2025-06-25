
import { Card, CardContent } from "@/components/ui/card";

export const ManageTabContent = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            부서별 문서 관리 기능
          </div>
          <div className="text-sm text-gray-500">
            부서별 업로드된 문서 현황 및 관리 기능이 제공됩니다
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
