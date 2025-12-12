import { addFixedExpense } from '@/app/actions/fixed'
import { getAccounts } from '@/app/actions/accounts'
import { getCategories } from '@/app/actions/transactions'
import styles from './new-fixed.module.css'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewFixedExpensePage({
    searchParams
}: {
    searchParams: { error?: string }
}) {
    const accounts = await getAccounts()
    const categories = await getCategories()

    return (
        <div className="container">
            <header className={styles.header}>
                <Link href="/fixed" className={styles.backButton}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 className={styles.title}>New Fixed Expense</h1>
            </header>

            {searchParams.error && (
                <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>
                    {searchParams.error}
                </div>
            )}

            <form action={addFixedExpense} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>Amount</label>
                    <input name="amount" type="number" step="0.01" className={styles.input} placeholder="0.00" required />
                </div>

                <div className={styles.inputGroup}>
                    <label>Category</label>
                    <select name="category_id" className={styles.select} required>
                        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Account</label>
                    <select name="account_id" className={styles.select} required>
                        {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Period</label>
                    <select name="period" className={styles.select}>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Next Charge Date</label>
                    <input name="next_charge_date" type="date" className={styles.input} required />
                </div>

                <button type="submit" className={styles.submitButton}>Save</button>
            </form>
        </div>
    )
}
