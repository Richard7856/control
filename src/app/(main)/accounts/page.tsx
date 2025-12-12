import { getAccounts } from '@/app/actions/accounts'
import Link from 'next/link'
import styles from './accounts.module.css'
import { Plus } from 'lucide-react'

export default async function AccountsPage() {
    const accounts = await getAccounts()

    return (
        <div className="container">
            <header className={styles.header}>
                <h1 className={styles.title}>Accounts</h1>
                <Link href="/accounts/new" className={styles.addButton}>
                    <Plus size={20} />
                    New
                </Link>
            </header>

            <div className={styles.grid}>
                {accounts.map((account) => (
                    <div key={account.id} className={`${styles.card} glass`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.accountName}>{account.name}</span>
                            <span className={styles.accountType}>{account.type}</span>
                        </div>
                        <div className={styles.balance}>
                            {new Intl.NumberFormat('es-MX', {
                                style: 'currency',
                                currency: account.currency
                            }).format(account.balance)}
                        </div>
                    </div>
                ))}

                {accounts.length === 0 && (
                    <div className={styles.empty}>
                        No accounts found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
