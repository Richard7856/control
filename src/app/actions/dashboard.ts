'use server'

import { createClient } from '@/utils/supabase/server'

export async function getDashboardMetrics() {
    const supabase = await createClient()

    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString() // Sunday match
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

    const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, type, date, category_id, categories(name)')
        .gte('date', startOfMonth) // Get full month for calculations
        .order('date', { ascending: false })

    if (!transactions) {
        return {
            today: 0,
            week: 0,
            month: 0,
            incomeMonth: 0,
            categories: [],
            fixedTotal: 0
        }
    }

    // Calculate Metrics
    let today = 0
    let week = 0
    let month = 0
    let incomeMonth = 0
    const categoryMap = new Map<string, number>()

    for (const t of transactions) {
        const tDate = t.date
        const amount = Number(t.amount)

        if (t.type === 'expense') {
            month += amount
            if (tDate >= startOfWeek) week += amount
            if (tDate >= startOfDay) today += amount

            const catName = t.categories?.name || 'Uncategorized'
            categoryMap.set(catName, (categoryMap.get(catName) || 0) + amount)
        } else if (t.type === 'income') {
            incomeMonth += amount
        }
    }

    // Calculate Aggregates for Categories
    const categories = Array.from(categoryMap.entries())
        .map(([name, amount]) => ({ name, amount, percent: (amount / month) * 100 }))
        .sort((a, b) => b.amount - a.amount)

    // Get Fixed Expenses Estimate
    const { data: fixed } = await supabase.from('fixed_expenses').select('amount, period')
    let fixedTotal = 0
    if (fixed) {
        for (const f of fixed) {
            const amt = Number(f.amount)
            if (f.period === 'monthly') fixedTotal += amt
            else if (f.period === 'weekly') fixedTotal += amt * 4
            else if (f.period === 'biweekly') fixedTotal += amt * 2
            else if (f.period === 'yearly') fixedTotal += amt / 12
        }
    }

    return {
        today,
        week,
        month,
        incomeMonth,
        categories,
        fixedTotal
    }
}
