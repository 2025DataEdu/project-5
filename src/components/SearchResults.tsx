
import { SearchResult } from "@/services/searchService";
import { SearchResultCard } from "@/components/search/SearchResultCard";
import { SearchResultsHeader } from "@/components/search/SearchResultsHeader";
import { SearchResultsEmpty } from "@/components/search/SearchResultsEmpty";
import { SearchResultsLoading } from "@/components/search/SearchResultsLoading";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
}

export const SearchResults = ({ results, query, isLoading }: SearchResultsProps) => {
  if (isLoading) {
    return <SearchResultsLoading />;
  }

  if (results.length === 0) {
    return <SearchResultsEmpty query={query} />;
  }

  return (
    <div className="space-y-6">
      <SearchResultsHeader resultsCount={results.length} query={query} />

      <div className="space-y-4">
        {results.map((result) => (
          <SearchResultCard 
            key={result.id} 
            result={result} 
            searchQuery={query} 
          />
        ))}
      </div>
    </div>
  );
};
