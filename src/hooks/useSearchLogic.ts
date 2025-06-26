
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { performSearch, SearchResult } from "@/services/searchService";

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

    try {
      // 실제 데이터베이스에서 검색 수행
      console.log("데이터베이스에서 검색 중:", query);
      const databaseResults = await performSearch(query);
      
      console.log("검색어:", query);
      console.log("데이터베이스 검색 결과 개수:", databaseResults.length);
      console.log("검색 결과:", databaseResults);

      // 데이터베이스에서 결과가 있으면 비교 및 히스토리 표시
      if (databaseResults.length > 0) {
        setSelectedRegulation(databaseResults[0]);
        setShowComparison(true);
        setShowHistory(true);
        setSearchResults(databaseResults);
      } else {
        // 데이터베이스에서 검색 결과가 없을 때만 AI API 호출
        console.log('No database results found, calling AI API...');
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
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error in database search:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
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
