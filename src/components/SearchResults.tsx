
import { SearchResult } from "@/services/searchService";
import { SearchResultCard } from "@/components/search/SearchResultCard";
import { SearchResultsHeader } from "@/components/search/SearchResultsHeader";
import { SearchResultsEmpty } from "@/components/search/SearchResultsEmpty";
import { SearchResultsLoading } from "@/components/search/SearchResultsLoading";
import { usePagination } from "@/hooks/usePagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
}

// 안정적인 키 생성 함수
const generateStableKey = (result: SearchResult, index: number): string => {
  if (result.id && result.id !== 'unknown') {
    return result.id;
  }
  
  const title = result.title?.replace(/\s+/g, '-').toLowerCase() || 'untitled';
  const dept = result.department?.replace(/\s+/g, '-').toLowerCase() || 'unknown';
  const type = result.type?.replace(/\s+/g, '-').toLowerCase() || 'document';
  
  return `${type}-${title}-${dept}-${index}`;
};

export const SearchResults = ({ results, query, isLoading }: SearchResultsProps) => {
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    totalItems
  } = usePagination({ data: results, itemsPerPage: 10 });

  if (isLoading) {
    return <SearchResultsLoading />;
  }

  if (results.length === 0) {
    return <SearchResultsEmpty query={query} />;
  }

  console.log('📊 SearchResults rendering:', {
    totalResults: results.length,
    currentPage,
    totalPages,
    paginatedResults: paginatedData.length,
    resultKeys: paginatedData.map((result, index) => ({
      key: generateStableKey(result, index),
      title: result.title,
      id: result.id
    }))
  });

  // 페이지 번호 생성 로직
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="space-y-6">
      <SearchResultsHeader resultsCount={totalItems} query={query} />
      
      {/* 페이지 정보 표시 */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          총 {totalItems}개 결과 중 {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalItems)}개 표시
        </div>
        <div>
          페이지 {currentPage} / {totalPages}
        </div>
      </div>

      <div className="space-y-4">
        {paginatedData.map((result, index) => {
          const stableKey = generateStableKey(result, index);
          return (
            <SearchResultCard 
              key={stableKey}
              result={result} 
              searchQuery={query} 
            />
          );
        })}
      </div>

      {/* 페이지네이션 컨트롤 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={goToPreviousPage}
                  className={!hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {pageNumbers[0] > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => goToPage(1)} className="cursor-pointer">
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {pageNumbers[0] > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}
              
              {pageNumbers.map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => goToPage(pageNum)}
                    isActive={pageNum === currentPage}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink onClick={() => goToPage(totalPages)} className="cursor-pointer">
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={goToNextPage}
                  className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
