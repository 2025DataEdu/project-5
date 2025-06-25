
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileIcon, User } from "lucide-react";

interface HistoryItem {
  date: string;
  version: string;
  changes: string[];
  modifier: string;
  reason: string;
}

interface RegulationHistoryProps {
  history: HistoryItem[];
  currentRegulation: string;
}

export const RegulationHistory = ({ history, currentRegulation }: RegulationHistoryProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          규정 변경 이력
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 현재 버전 */}
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-600">현재 버전</Badge>
              <span className="font-semibold">{currentRegulation}</span>
            </div>
            <p className="text-sm text-gray-600">현재 시행 중인 최신 버전입니다.</p>
          </div>

          {/* 변경 이력 */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {history.map((item, index) => (
              <div key={index} className="relative pl-10 pb-6">
                <div className="absolute left-2 w-4 h-4 bg-white border-2 border-purple-400 rounded-full"></div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.version}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.modifier}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>변경 사유:</strong> {item.reason}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">주요 변경사항:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {item.changes.map((change, changeIndex) => (
                        <li key={changeIndex} className="flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
