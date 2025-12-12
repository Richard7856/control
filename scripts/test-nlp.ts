import { extractTransactionDetails } from '../src/app/actions/nlp'

const mockAccounts = [
    { id: 'acc_1', name: 'Tarjeta BBVA' },
    { id: 'acc_2', name: 'Efectivo' },
    { id: 'acc_3', name: 'Nomina Santander' },
    { id: 'acc_4', name: 'Inversión' }
]

const mockCategories = [
    { id: 'cat_1', name: 'Comida' },
    { id: 'cat_2', name: 'Transporte' },
    { id: 'cat_3', name: 'Renta' },
    { id: 'cat_4', name: 'Salud' },
    { id: 'cat_5', name: 'Entretenimiento' },
    { id: 'cat_6', name: 'Servicios' },
    { id: 'cat_7', name: 'Ropa' },
    { id: 'cat_8', name: 'Gasolina' }
]

const examples = [
    "Gasté 500 en comida",
    "Pagué la renta 4000",
    "Me pagaron 15000 de nómina",
    "Transferí 200 a mi ahorro", // 'ahorro' not in mock cats/accs, might fail acc detection but type transfer
    "Cena ayer 250",
    "Uber 150",
    "Supermercado 1200 tarjeta",
    "Medicinas 500",
    "Cine 300 efectivo",
    "Depósito de 500",
    "Compré zapatos 1200",
    "Salida con amigos 800",
    "Gasolina 600",
    "Pagué la luz 300",
    "Ingreso extra 2000",
    "Moví 500 a cuenta de inversión",
    "Taxi 50",
    "Desayuno 120",
    "Subscripción Netflix 200",
    "Regalo mamá 1000"
]

console.log("Running NLP Tests...\n")

examples.forEach((text, i) => {
    const result = extractTransactionDetails(text, mockAccounts, mockCategories)
    console.log(`[${i + 1}] Input: "${text}"`)
    console.log(`    Parsed: ${result.type.toUpperCase()} $${result.amount}`)
    console.log(`    Cat: ${result.category_id ? mockCategories.find(c => c.id === result.category_id)?.name : 'None'}`)
    console.log(`    Acc: ${result.account_id ? mockAccounts.find(a => a.id === result.account_id)?.name : 'None'}`)
    console.log(`    Confidence: ${result.confidence.toFixed(2)}`)
    console.log('---')
})
