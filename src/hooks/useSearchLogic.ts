
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

  const handleSmartSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    setShowComparison(false);
    setShowHistory(false);
    setAiResponse("");

    setTimeout(async () => {
      const loweredQuery = query.toLowerCase();
      
      // 통합 검색: 키워드 기반 + 자연어 키워드 매칭
      const naturalLanguageKeywords = ["출장", "교육", "절차", "서류", "신청", "예산", "집행"];
      
      const filteredResults = allMockResults.filter(result => {
        const combinedContent = (result.title + result.content).toLowerCase();
        
        // 1. 직접 키워드 매칭
        const directMatch = combinedContent.includes(loweredQuery);
        
        // 2. 자연어 키워드 매칭
        const naturalMatch = naturalLanguageKeywords.some(keyword =>
          combinedContent.includes(keyword) && (
            query.includes(keyword) || 
            query.includes('?') || 
            query.includes('어떻게') || 
            query.includes('무엇')
          )
        );
        
        return directMatch || naturalMatch;
      });

      // 결과 확인용 로그
      console.log("검색어:", query);
      console.log("검색 결과 개수:", filteredResults.length);
      console.log("검색 결과:", filteredResults);

      // 결과가 있으면 비교 및 히스토리 표시
      if (filteredResults.length > 0) {
        setSelectedRegulation(filteredResults[0]);
        setShowComparison(true);
        setShowHistory(true);
      } else {
        // 검색 결과가 없을 때 AI API 호출
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
