
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitCompare, Calendar, FileText } from "lucide-react";

interface ComparisonData {
  id: number;
  title: string;
  similarity: number;
  differences: string[];
  department: string;
  type: string;
}

interface RegulationComparisonProps {
  mainRegulation: any;
  comparisons: ComparisonData[];
}

export const RegulationComparison = ({ mainRegulation, comparisons }: RegulationComparisonProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-green-600" />
          유사 규정 비교
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {comparisons.map((comparison) => (
            <div key={comparison.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{comparison.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{comparison.department}</span>
                    <Badge variant="outline" className="text-xs">
                      {comparison.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    유사도 {comparison.similarity}%
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700">주요 차이점:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {comparison.differences.map((diff, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{diff}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <Button variant="outline" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  상세 비교보기
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
