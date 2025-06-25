
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

  const handleSmartSearch = async (query: string, isNaturalLanguage: boolean) => {
    setIsSearching(true);
    setSearchQuery(query);
    setShowComparison(false);
    setShowHistory(false);
    setAiResponse("");

    try {
      console.log('Starting search for:', query);
      
      // Search in Supabase tables
      const results = await performSearch(query);
      console.log('Search results from Supabase:', results);
      
      if (results.length > 0) {
        setSearchResults(results);
        
        // 자연어 검색의 경우 비교 및 히스토리 표시
        if (isNaturalLanguage && results.length > 0) {
          setSelectedRegulation(results[0]);
          setShowComparison(true);
          setShowHistory(true);
        }
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
        
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
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
