import { ParsedTransaction } from '@/app/actions/nlp'

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
