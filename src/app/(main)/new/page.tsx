import { addTransaction, getCategories } from '@/app/actions/transactions'
import { getAccounts } from '@/app/actions/accounts'
import styles from './new-transaction.module.css'
import Link from 'next/link'
import { X } from 'lucide-react'

export default async function NewTransactionPage() {
    const accounts = await getAccounts()
    const categories = await getCategories()

    return (
        <div className="container">
            <header className={styles.header}>
                <h1 className={styles.title}>New Transaction</h1>
                <Link href="/dashboard" className={styles.closeButton}>
                    <X size={24} />
                </Link>
            </header>

            <form className={styles.form} action={addTransaction}>
                <div className={styles.amountWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                        name="amount"
                        type="number"
                        step="0.01"
                        className={styles.amountInput}
                        placeholder="0.00"
                        autoFocus
                        required
                    />
                </div>

                <div className={styles.typeSelector}>
                    <div className={styles.radioGroup}>
                        <input type="radio" id="expense" name="type" value="expense" defaultChecked />
                        <label htmlFor="expense" className={styles.radioLabel}>Expense</label>

                        <input type="radio" id="income" name="type" value="income" />
                        <label htmlFor="income" className={styles.radioLabel}>Income</label>

                        <input type="radio" id="transfer" name="type" value="transfer" />
                        <label htmlFor="transfer" className={styles.radioLabel}>Transfer</label>
                    </div>
                </div>

                <div className={styles.fields}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Note</label>
                        <input name="note" className={styles.input} type="text" placeholder="What is this for?" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Date</label>
                        <input
                            name="date"
                            className={styles.input}
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Category</label>
                        <select name="category_id" className={styles.select}>
                            <option value="">Select Category</option>
                            {categories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Account</label>
                        <select name="account_id" className={styles.select} required>
                            <option value="">Select Account</option>
                            {accounts.map((acc: any) => (
                                <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="submit" className={styles.submitButton}>
                    Save Transaction
                </button>
            </form>
        </div>
    )
}
