'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type AccountData = {
    name: string
    currency: string
    balance: number
    type: string
}

export async function getAccounts() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching accounts:', error)
        return []
    }

    return data
}

export async function getAccount(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching account:', error)
        return null
    }

    return data
}

export async function createAccount(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const currency = formData.get('currency') as string
    const balance = parseFloat(formData.get('balance') as string) || 0
    const type = formData.get('type') as string

    const { error } = await supabase.from('accounts').insert({
        name,
        currency,
        balance,
        type,
        user_id: (await supabase.auth.getUser()).data.user?.id
    })

    if (error) {
        redirect(`/accounts/new?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/accounts')
    revalidatePath('/dashboard')
    redirect('/accounts')
}

export async function updateAccount(id: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const currency = formData.get('currency') as string
    const balance = parseFloat(formData.get('balance') as string) || 0
    const type = formData.get('type') as string

    const { error } = await supabase
        .from('accounts')
        .update({
            name,
            currency,
            balance,
            type
        })
        .eq('id', id)

    if (error) {
        // Assuming edit page is at /accounts/[id] or we don't have one yet?
        // Task said "Create/Edit/Delete accounts", but in UI tasks I only did "New".
        // I'll redirect to accounts list with error for now or generic.
        redirect(`/accounts?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/accounts')
    revalidatePath('/dashboard')
    redirect('/accounts')
}

export async function deleteAccount(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id)

    if (error) {
        redirect(`/accounts?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/accounts')
    revalidatePath('/dashboard')
}
