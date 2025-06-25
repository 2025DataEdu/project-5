
interface SearchResultsHeaderProps {
  resultsCount: number;
  query: string;
}

export const SearchResultsHeader = ({ resultsCount, query }: SearchResultsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="text-gray-600">
        <span className="font-semibold text-blue-600">{resultsCount}개</span>의 검색 결과
      </div>
      <div className="text-sm text-gray-500">
        '{query}' 검색 결과
      </div>
    </div>
  );
};
