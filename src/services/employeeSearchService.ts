
import { supabase } from "@/integrations/supabase/client";
import { SearchResult } from "@/types/searchTypes";
import { generateDocumentId, normalizeTitle } from "@/utils/searchUtils";

export const searchEmployees = async (query: string): Promise<SearchResult[]> => {
  try {
    console.log('🔍 Searching employees with query:', query);
    
    const { data: employees, error: empError } = await supabase
      .from('직원정보')
      .select('*')
      .or(`담당업무.ilike.%${query}%,부서명.ilike.%${query}%,직책.ilike.%${query}%`)
      .limit(15);

    console.log('👥 Employees query result:', { 
      employees, 
      error: empError, 
      queryUsed: query,
      employeesCount: employees?.length || 0 
    });

    if (empError) {
      console.error('❌ Error searching employees:', empError);
      throw new Error(`직원정보 검색 오류: ${empError.message}`);
    }

    if (!employees || employees.length === 0) {
      console.log('👥 No employees found for query:', query);
      return [];
    }

    const employeeResults: SearchResult[] = employees.map(emp => {
      console.log('🔄 Transforming employee:', emp);
      return {
        id: generateDocumentId(emp, '직원정보'),
        title: normalizeTitle(`${emp.직책 || '직책미상'} - ${emp.담당업무 || '업무미상'}`),
        content: `${emp.부서명 || ''}에서 ${emp.담당업무 || ''}를 담당하고 있습니다. 연락처: ${emp.전화번호 || '미등록'}`,
        source: "내부문서",
        department: emp.부서명 || '미분류',
        lastModified: new Date().toISOString().split('T')[0],
        fileName: `직원정보_${emp.직책 || 'staff'}.pdf`,
        type: "직원정보",
        url: '#'
      };
    });

    console.log('✅ Employee results transformed:', employeeResults);
    return employeeResults;
  } catch (error) {
    console.error('💥 Employee search error:', error);
    throw error;
  }
};
