
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Starting popular statistics update...')

    // 1. 전체 조회수 집계
    const { data: viewCounts, error: viewError } = await supabase
      .from('document_views')
      .select('document_id, document_type, document_title, department, view_date')

    if (viewError) {
      console.error('Error fetching view counts:', viewError)
      throw viewError
    }

    console.log(`Processing ${viewCounts?.length || 0} view records...`)

    // 2. 데이터 집계 처리
    const statisticsMap = new Map()
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    viewCounts?.forEach(view => {
      const key = `${view.document_id}_${view.document_type}`
      const viewDate = new Date(view.view_date)
      
      if (!statisticsMap.has(key)) {
        statisticsMap.set(key, {
          document_id: view.document_id,
          document_type: view.document_type,
          document_title: view.document_title,
          department: view.department,
          view_count: 0,
          weekly_views: 0,
          monthly_views: 0,
          last_viewed: view.view_date,
          updated_at: now.toISOString()
        })
      }

      const stat = statisticsMap.get(key)
      stat.view_count += 1

      if (viewDate >= oneWeekAgo) {
        stat.weekly_views += 1
      }

      if (viewDate >= oneMonthAgo) {
        stat.monthly_views += 1
      }

      // 최근 조회 시간 업데이트
      if (new Date(view.view_date) > new Date(stat.last_viewed)) {
        stat.last_viewed = view.view_date
      }
    })

    // 3. 기존 통계와 비교하여 주간 성장률 계산
    const statistics = Array.from(statisticsMap.values())
    
    for (const stat of statistics) {
      // 기존 통계 조회
      const { data: existingStat } = await supabase
        .from('popular_statistics')
        .select('weekly_views')
        .eq('document_id', stat.document_id)
        .eq('document_type', stat.document_type)
        .single()

      // 주간 성장률 계산
      if (existingStat && existingStat.weekly_views > 0) {
        const growthRate = ((stat.weekly_views - existingStat.weekly_views) / existingStat.weekly_views) * 100
        stat.weekly_growth_rate = Math.round(growthRate * 100) / 100
      } else {
        stat.weekly_growth_rate = stat.weekly_views > 0 ? 100 : 0
      }
    }

    // 4. 조회수 기준으로 순위 매기기
    statistics.sort((a, b) => b.view_count - a.view_count)
    statistics.forEach((stat, index) => {
      stat.rank_position = index + 1
    })

    console.log(`Updating ${statistics.length} statistics records...`)

    // 5. 데이터베이스 업데이트 (upsert 사용)
    if (statistics.length > 0) {
      const { error: upsertError } = await supabase
        .from('popular_statistics')
        .upsert(statistics, {
          onConflict: 'document_id,document_type'
        })

      if (upsertError) {
        console.error('Error upserting statistics:', upsertError)
        throw upsertError
      }
    }

    console.log('Popular statistics update completed successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${statistics.length} statistics records`,
        processed_views: viewCounts?.length || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error updating popular statistics:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
