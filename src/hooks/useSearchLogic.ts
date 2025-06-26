
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
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSmartSearch = async (query: string) => {
    console.log('🎯 Starting smart search for:', query);
    setIsSearching(true);
    setSearchQuery(query);
    setShowComparison(false);
    setShowHistory(false);
    setAiResponse("");
    setSearchError(null);

    try {
      // 실제 데이터베이스에서 검색 수행
      console.log("🔍 Performing database search for:", query);
      const databaseResults = await performSearch(query);
      
      console.log("📊 Database search completed:", {
        query,
        resultsCount: databaseResults.length,
        results: databaseResults
      });

      // 데이터베이스에서 결과가 있으면 표시
      if (databaseResults.length > 0) {
        console.log('✅ Database results found, displaying results');
        setSelectedRegulation(databaseResults[0]);
        setShowComparison(true);
        setShowHistory(true);
        setSearchResults(databaseResults);
      } else {
        // 데이터베이스에서 검색 결과가 없을 때만 AI API 호출
        console.log('❌ No database results found, trying AI API...');
        try {
          console.log('🤖 Calling AI regulation search function...');
          const { data, error } = await supabase.functions.invoke('ai-regulation-search', {
            body: { query }
          });

          if (error) {
            console.error('❌ AI function error:', error);
            setSearchError('AI 검색 중 오류가 발생했습니다.');
          } else if (data?.success) {
            console.log('✅ AI response received:', data.response);
            setAiResponse(data.response);
          } else {
            console.log('⚠️ AI response received but no success flag:', data);
            setSearchError('AI에서 응답을 받지 못했습니다.');
          }
        } catch (aiError) {
          console.error('💥 Error in AI search:', aiError);
          setSearchError('AI 검색 서비스에 연결할 수 없습니다.');
        }
        setSearchResults([]);
      }
    } catch (error) {
      console.error('💥 Error in database search:', error);
      setSearchError('데이터베이스 검색 중 오류가 발생했습니다.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      console.log('🏁 Search process completed');
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
    searchError,
    handleSmartSearch
  };
};
