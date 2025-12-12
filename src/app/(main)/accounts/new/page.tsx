import { createAccount } from '@/app/actions/accounts'
import styles from './new-account.module.css'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewAccountPage() {
    return (
        <div className="container">
            <header className={styles.header}>
                <Link href="/accounts" className={styles.backButton}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 className={styles.title}>New Account</h1>
            </header>

            <form className={styles.form} action={createAccount}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Account Name</label>
                    <input name="name" className={styles.input} type="text" placeholder="e.g. BBVA Debit" required />
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Currency</label>
                        <select name="currency" className={styles.select}>
                            <option value="MXN">MXN ($)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Initial Balance</label>
                        <input name="balance" className={styles.input} type="number" step="0.01" placeholder="0.00" />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Type</label>
                    <select name="type" className={styles.select}>
                        <option value="debit">Debit Card</option>
                        <option value="credit">Credit Card</option>
                        <option value="cash">Cash</option>
                        <option value="investment">Investment</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <button type="submit" className={styles.submitButton}>
                    Create Account
                </button>
            </form>
        </div>
    )
}
