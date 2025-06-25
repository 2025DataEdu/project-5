
interface SearchResultsEmptyProps {
  query: string;
}

export const SearchResultsEmpty = ({ query }: SearchResultsEmptyProps) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-lg mb-4">
        '{query}'에 대한 검색 결과가 없습니다
      </div>
      <div className="text-sm text-gray-500">
        다른 키워드로 검색해보시거나 필터를 조정해보세요
      </div>
    </div>
  );
};
