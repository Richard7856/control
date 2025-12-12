import { getTransactions } from '@/app/actions/transactions'
import styles from './history.module.css'

export default async function HistoryPage() {
    const transactions = await getTransactions()

    // Format date grouping logic if desired, for now simple list
    return (
        <div className="container">
            <header className={styles.header}>
                <h1 className={styles.title}>History</h1>
            </header>

            <div className={styles.list}>
                {transactions.map((tx: any) => (
                    <div key={tx.id} className={`${styles.item} glass`}>
                        <div className={styles.content}>
                            <div className={styles.topRow}>
                                <span className={styles.category}>{tx.categories?.name || 'Uncategorized'}</span>
                                <span className={`${styles.amount} ${tx.type === 'expense' ? styles.expense : styles.income}`}>
                                    {tx.type === 'expense' ? '-' : '+'}${tx.amount}
                                </span>
                            </div>
                            <div className={styles.bottomRow}>
                                <span className={styles.note}>{tx.note || tx.accounts?.name}</span>
                                <span className={styles.date}>{new Date(tx.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {transactions.length === 0 && (
                    <div className={styles.empty}>No transactions recorded.</div>
                )}
            </div>
        </div>
    )
}
