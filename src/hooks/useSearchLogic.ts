
import { useState } from "react";
import { allMockResults } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";

export const useSearchLogic = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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
      let filteredResults;
      
      if (isNaturalLanguage) {
        // 자연어 검색 시뮬레이션 - 더 지능적인 매칭
        const keywords = ["출장", "교육", "절차", "서류", "신청"];
        filteredResults = allMockResults.filter(result => 
          keywords.some(keyword => 
            result.title.includes(keyword) || result.content.includes(keyword)
          )
        );
        
        // 자연어 검색의 경우 비교 및 히스토리 표시
        if (filteredResults.length > 0) {
          setSelectedRegulation(filteredResults[0]);
          setShowComparison(true);
          setShowHistory(true);
        }
      } else {
        // 일반 키워드 검색
        filteredResults = allMockResults.filter(result => 
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.content.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      // 검색 결과가 없을 때 AI API 호출
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
