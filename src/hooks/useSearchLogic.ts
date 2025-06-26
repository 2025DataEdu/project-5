import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { performSearch, SearchResult } from "@/services/searchService";
import { debugDatabaseContent } from "@/services/debugService";
import { performSmartSearch } from "@/services/smartSearchService";

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
    console.log('🎯 Starting enhanced smart search for:', query);
    setIsSearching(true);
    setSearchQuery(query);
    setShowComparison(false);
    setShowHistory(false);
    setAiResponse("");
    setSearchError(null);

    try {
      // 디버깅: 데이터베이스 내용 확인
      console.log('🔍 Checking database content first...');
      await debugDatabaseContent();
      
      // 1단계: 벡터 유사도 검색 시도
      console.log("🧠 Attempting smart vector search...");
      let smartResults: SearchResult[] = [];
      
      try {
        smartResults = await performSmartSearch(query, {
          threshold: 0.6, // 조금 더 관대한 임계값
          limit: 15,
          useVectorSearch: true
        });
        console.log(`🎯 Smart search results: ${smartResults.length} found`);
      } catch (smartError) {
        console.warn('⚠️ Smart search failed, continuing with traditional search:', smartError);
      }

      // 2단계: 기존 키워드 검색 수행
      console.log("🔍 Performing traditional database search...");
      const traditionalResults = await performSearch(query);
      console.log(`📊 Traditional search results: ${traditionalResults.length} found`);

      // 3단계: 결과 통합 및 중복 제거
      const combinedResults = [...smartResults];
      
      // 기존 검색 결과에서 중복되지 않는 것들만 추가
      traditionalResults.forEach(traditional => {
        const isDuplicate = smartResults.some(smart => 
          smart.id === traditional.id || 
          smart.title === traditional.title
        );
        
        if (!isDuplicate) {
          combinedResults.push(traditional);
        }
      });

      console.log(`🔗 Combined search results: ${combinedResults.length} total`);

      // 4단계: 결과가 있으면 표시
      if (combinedResults.length > 0) {
        console.log('✅ Search results found, displaying results');
        setSelectedRegulation(combinedResults[0]);
        setShowComparison(true);
        setShowHistory(true);
        setSearchResults(combinedResults);
      } else {
        // 5단계: 결과가 없을 때만 AI API 호출
        console.log('❌ No search results found, trying AI API...');
        try {
          console.log('🤖 Calling AI regulation search function...');
          const { data, error } = await supabase.functions.invoke('ai-regulation-search', {
            body: { query }
          });

          if (error) {
            console.error('❌ AI function error:', error);
            setSearchError(`AI 검색 중 오류가 발생했습니다: ${error.message}`);
          } else if (data?.success) {
            console.log('✅ AI response received:', data.response);
            setAiResponse(data.response);
          } else {
            console.log('⚠️ AI response received but no success flag:', data);
            setSearchError('AI에서 응답을 받지 못했습니다.');
          }
        } catch (aiError) {
          console.error('💥 Error in AI search:', aiError);
          setSearchError(`AI 검색 서비스에 연결할 수 없습니다: ${aiError instanceof Error ? aiError.message : '알 수 없는 오류'}`);
        }
        setSearchResults([]);
      }
    } catch (error) {
      console.error('💥 Error in search process:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      
      setSearchError(`"${query}" 검색 실패: ${errorMessage}`);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      console.log('🏁 Enhanced search process completed');
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
