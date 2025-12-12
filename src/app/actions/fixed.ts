'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getFixedExpenses() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('fixed_expenses')
        .select(`
      *,
      categories (name),
      accounts (name)
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
        return []
    }

    return data
}

export async function addFixedExpense(formData: FormData) {
    const supabase = await createClient()

    const amount = parseFloat(formData.get('amount') as string)
    const categoryId = formData.get('category_id') as string
    const accountId = formData.get('account_id') as string
    const period = formData.get('period') as string
    const nextChargeDate = formData.get('next_charge_date') as string

    const user = (await supabase.auth.getUser()).data.user
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase.from('fixed_expenses').insert({
        user_id: user.id,
        amount,
        category_id: categoryId,
        account_id: accountId,
        period,
        next_charge_date: nextChargeDate
    })

    if (error) return { error: error.message }

    revalidatePath('/fixed')
    redirect('/fixed')
}

export async function deleteFixedExpense(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('fixed_expenses')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/fixed')
}
