'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addTransaction(formData: FormData) {
    const supabase = await createClient()

    const accountId = formData.get('account_id') as string
    const amount = parseFloat(formData.get('amount') as string)
    const type = formData.get('type') as string // 'expense', 'income', 'transfer'
    const categoryId = formData.get('category_id') as string || null
    const date = formData.get('date') as string
    const note = formData.get('note') as string

    const user = (await supabase.auth.getUser()).data.user
    if (!user) {
        return { error: 'Not authenticated' }
    }

    // 1. Insert Transaction
    const { error: txError } = await supabase.from('transactions').insert({
        user_id: user.id,
        account_id: accountId,
        amount,
        type,
        category_id: categoryId,
        date: date || new Date().toISOString(),
        note
    })

    if (txError) {
        return { error: txError.message }
    }

    // 2. Update Account Balance
    // Note: For production, use RPC or Database Triggers to ensure atomicity.
    // Here we do it via application logic as a simple implementation.

    // Get current account balance first (optional check) or just increment/decrement
    // Supabase doesn't support atomic increment via simple update without RPC nicely, 
    // but we can read then write or use a custom query.
    // For MVP: Read -> Calculate -> Write.

    const { data: account } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', accountId)
        .single()

    if (account) {
        let newBalance = account.balance
        if (type === 'expense' || type === 'transfer') {
            newBalance -= amount
        } else if (type === 'income') {
            newBalance += amount
        }

        await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', accountId)
    }

    revalidatePath('/dashboard')
    revalidatePath('/accounts')
    revalidatePath('/history')

    redirect('/history')
}

export async function getTransactions() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('transactions')
        .select(`
      *,
      categories (name),
      accounts (name, currency)
    `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
        return []
    }

    return data
}

export async function getCategories() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
    return data || []
}
