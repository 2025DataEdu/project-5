
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SearchResultsLoading = () => {
  return (
    <div className="space-y-6">
      <div className="text-gray-600">검색 중...</div>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border border-gray-200">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
