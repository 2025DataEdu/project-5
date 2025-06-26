
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { performSearch, SearchResult } from "@/services/searchService";
import { debugDatabaseContent } from "@/services/debugService";
import { performSmartSearch } from "@/services/smartSearchService";

// 강화된 중복 제거 함수
const removeDuplicatesAdvanced = (smartResults: SearchResult[], traditionalResults: SearchResult[]): SearchResult[] => {
  console.log('🔍 Advanced duplicate removal starting...');
  console.log(`Smart results: ${smartResults.length}, Traditional results: ${traditionalResults.length}`);
  
  const seen = new Map<string, SearchResult>();
  const combinedResults: SearchResult[] = [];
  
  // 문서의 고유 키를 생성하는 함수
  const generateUniqueKey = (result: SearchResult): string => {
    const title = result.title?.trim().replace(/\s+/g, ' ').toLowerCase() || '';
    const dept = result.department?.trim().toLowerCase() || '';
    const type = result.type?.trim().toLowerCase() || '';
    return `${title}|${dept}|${type}`;
  };
  
  // 스마트 검색 결과를 우선적으로 추가 (더 정확한 결과로 간주)
  smartResults.forEach(result => {
    const key = generateUniqueKey(result);
    if (!seen.has(key)) {
      seen.set(key, result);
      combinedResults.push(result);
      console.log('✅ Added smart result:', { title: result.title, key });
    } else {
      console.log('🔄 Skipped duplicate smart result:', { title: result.title, key });
    }
  });
  
  // 전통적 검색 결과에서 중복되지 않는 것들만 추가
  traditionalResults.forEach(result => {
    const key = generateUniqueKey(result);
    if (!seen.has(key)) {
      seen.set(key, result);
      combinedResults.push(result);
      console.log('✅ Added traditional result:', { title: result.title, key });
    } else {
      console.log('🔄 Skipped duplicate traditional result:', { title: result.title, key });
    }
  });
  
  console.log(`🎯 Advanced duplicate removal completed: ${smartResults.length + traditionalResults.length} -> ${combinedResults.length}`);
  return combinedResults;
};

export const useSearchLogic = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGrayBomb, setShowGrayBomb] = useState(false);

  const handleSmartSearch = async (query: string) => {
    console.log('🎯 Starting enhanced smart search for:', query);
    setIsSearching(true);
    setSearchQuery(query);
    setShowComparison(false);
    setShowHistory(false);
    setAiResponse("");
    setSearchError(null);
    setShowConfetti(false);
    setShowGrayBomb(false);

    try {
      console.log('🔍 Checking database content first...');
      await debugDatabaseContent();
      
      console.log("🧠 Attempting smart vector search...");
      let smartResults: SearchResult[] = [];
      
      try {
        smartResults = await performSmartSearch(query, {
          threshold: 0.8,
          limit: 50,
          useVectorSearch: true
        });
        console.log(`🎯 Smart search results: ${smartResults.length} found`);
      } catch (smartError) {
        console.warn('⚠️ Smart search failed, continuing with traditional search:', smartError);
      }

      console.log("🔍 Performing traditional database search...");
      let traditionalResults: SearchResult[] = [];
      
      try {
        traditionalResults = await performSearch(query);
        console.log(`📊 Traditional search results: ${traditionalResults.length} found`);
      } catch (searchError) {
        console.error('❌ Traditional search failed:', searchError);
      }

      // 강화된 중복 제거 로직 적용
      const combinedResults = removeDuplicatesAdvanced(smartResults, traditionalResults);

      console.log(`🔗 Final combined search results: ${combinedResults.length} total`);

      if (combinedResults.length > 0) {
        console.log('✅ Search results found, displaying results');
        setSelectedRegulation(combinedResults[0]);
        setShowComparison(true);
        setShowHistory(true);
        setSearchResults(combinedResults);
        setShowConfetti(true);
      } else {
        console.log('💥 No search results found - showing gray bomb effect!');
        setShowGrayBomb(true);
        
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
    showConfetti,
    showGrayBomb,
    setShowConfetti,
    setShowGrayBomb,
    handleSmartSearch
  };
};
