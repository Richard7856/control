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

import { extractTransactionDetails } from '@/utils/nlp'

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
