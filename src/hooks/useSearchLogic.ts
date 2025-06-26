
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { performSearch, SearchResult } from "@/services/searchService";
import { allMockResults } from "@/data/mockData";

export const useSearchLogic = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [aiResponse, setAiResponse] = useState("");

  const handleSmartSearch = async (query: string, isNaturalLanguage: boolean) => {
    setIsSearching(true);
    setSearchQuery(query);
    setShowComparison(false);
    setShowHistory(false);
    setAiResponse("");

    setTimeout(async () => {
      const loweredQuery = query.toLowerCase();
      let filteredResults;

      if (isNaturalLanguage) {
        // 자연어 키워드 기반 검색 키워드 배열
        const keywords = ["출장", "교육", "절차", "서류", "신청", "예산", "집행"];
        filteredResults = allMockResults.filter(result =>
          keywords.some(keyword =>
            (result.title + result.content).includes(keyword)
          )
        );

        if (filteredResults.length > 0) {
          setSelectedRegulation(filteredResults[0]);
          setShowComparison(true);
          setShowHistory(true);
        }
      } else {
        // 일반 키워드 검색 개선 → title + content 합쳐서 검색
        filteredResults = allMockResults.filter(result =>
          (result.title + result.content).toLowerCase().includes(loweredQuery)
        );
      }

      // 결과 확인용 로그
      console.log("검색어:", query);
      console.log("검색 결과 개수:", filteredResults.length);
      console.log("검색 결과:", filteredResults);

      if (filteredResults.length === 0) {
        console.log('No search results found, calling AI API...');
        try {
          const { data, error } = await supabase.functions.invoke('ai-regulation-search', {
            body: { query }
          });

          if (error) {
            console.error('Error calling AI function:', error);
          } else if (data?.success) {
            setAiResponse(data.response);
            console.log('AI response received:', data.response);
          }
        } catch (error) {
          console.error('Error in AI search:', error);
        }
      }

      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 1500);
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
    showComparison,
    showHistory,
    selectedRegulation,
    aiResponse,
    handleSmartSearch
  };
};
