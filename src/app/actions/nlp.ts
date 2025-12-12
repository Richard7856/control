'use server'

import { createClient } from '@/utils/supabase/server'

export type ParsedTransaction = {
    amount: number | null
    type: 'income' | 'expense' | 'transfer'
    category_id: string | null
    account_id: string | null
    note: string | null
    date: string | null // ISO string
    confidence: number
}

// Pure logic for testing
export function extractTransactionDetails(
    text: string,
    accounts: { id: string, name: string }[] = [],
    categories: { id: string, name: string }[] = []
): ParsedTransaction {
    const lower = text.toLowerCase()

    // 1. Detect Type
    let type: ParsedTransaction['type'] = 'expense' // Default
    if (/(gan[eé]|cobr[eé]|ingreso|recib[ií]|dep[oó]sito|pagaron)/.test(lower)) {
        type = 'income'
    } else if (/(transfer[ií]|pas[eé]|mov[ií]|envi[eé])/.test(lower)) {
        type = 'transfer'
    }

    // 2. Detect Amount
    // Matches: 1200, 1,200.50, $500, etc.
    // Flexible regex catching any sequence of digits/commas, optionally followed by decimal
    const amountMatch = text.match(/(\$)?([0-9,]+(\.[0-9]+)?)/)
    let amount = null
    if (amountMatch) {
        // Remove $ and ,
        const clean = amountMatch[0].replace(/[$,]/g, '')
        // Filter out if it parsed as empty or just .
        if (clean && !isNaN(parseFloat(clean))) {
            amount = parseFloat(clean)
        }
    }

    // 3. Detect Account
    let accountId = null
    if (accounts.length > 0) {
        const sorted = [...accounts].sort((a, b) => b.name.length - a.name.length)
        for (const acc of sorted) {
            if (lower.includes(acc.name.toLowerCase())) {
                accountId = acc.id
                break
            }
        }
        if (!accountId) {
            if (lower.includes('tarjeta') || lower.includes('tc')) {
                const fallback = accounts.find(a => /credit|tc|tarjeta/i.test(a.name));
                if (fallback) accountId = fallback.id;
            } else if (lower.includes('efectivo') || lower.includes('cash')) {
                const fallback = accounts.find(a => /cash|efectivo/i.test(a.name));
                if (fallback) accountId = fallback.id;
            }
        }
    }

    // 4. Detect Category
    let categoryId = null
    if (categories.length > 0) {
        for (const cat of categories) {
            if (lower.includes(cat.name.toLowerCase())) {
                categoryId = cat.id
                break
            }
        }
    }

    // 5. Detect Date
    let date = new Date().toISOString()
    if (lower.includes('ayer')) {
        const d = new Date()
        d.setDate(d.getDate() - 1)
        date = d.toISOString()
    }

    const note = text

    let confidence = 0.5
    if (amount) confidence += 0.2
    if (accountId) confidence += 0.2
    if (categoryId) confidence += 0.1

    return {
        amount,
        type,
        category_id: categoryId,
        account_id: accountId,
        note,
        date,
        confidence: Math.min(confidence, 1)
    }
}

// Server Action
export async function parseTextInput(text: string): Promise<ParsedTransaction> {
    const soup = await createClient()

    const { data: accounts } = await soup.from('accounts').select('id, name')
    const { data: categories } = await soup.from('categories').select('id, name')

    return extractTransactionDetails(text, accounts || [], categories || [])
}

export async function parseAudioInput(formData: FormData) {
    const file = formData.get('audio') as Blob

    if (!file) {
        return { error: 'No audio file provided' }
    }

    // Check for API Key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
        // Mock for demo/dev without key
        console.warn('OPENAI_API_KEY not found. Using mock transcription.')
        const mockText = "Gasto simulado de 50 pesos en prueba"
        const parsed = await parseTextInput(mockText)
        return {
            text: mockText,
            parsed
        }
    }

    // Call OpenAI Whisper ID
    const apiFormData = new FormData()
    apiFormData.append('file', file, 'audio.webm')
    apiFormData.append('model', 'whisper-1')

    try {
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: apiFormData // browser/node fetch constructs boundaries automatically with FormData
        })

        if (!response.ok) {
            const err = await response.text()
            console.error('Whisper API Error', err)
            return { error: 'Transcription failed' }
        }

        const data = await response.json()
        const text = data.text

        // Parse the transcribed text
        const parsed = await parseTextInput(text)

        return { text, parsed }

    } catch (error) {
        console.error('Audio processing error', error)
        return { error: 'Audio processing error' }
    }
}
