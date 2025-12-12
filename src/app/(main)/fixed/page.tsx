import { getFixedExpenses } from '@/app/actions/fixed'
import styles from './fixed.module.css'
import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'

export default async function FixedExpensesPage() {
    const fixed = await getFixedExpenses()

    return (
        <div className="container">
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/dashboard" className={styles.backButton}>
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className={styles.title}>Fixed Expenses</h1>
                </div>
                <Link href="/fixed/new" className={styles.addButton}>
                    <Plus size={20} />
                    Add
                </Link>
            </header>

            <div className={styles.list}>
                {fixed.map((item: any) => (
                    <div key={item.id} className={`${styles.item} glass`}>
                        <div className={styles.row}>
                            <span className={styles.category}>{item.categories?.name}</span>
                            <span className={styles.amount}>${item.amount}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.details}>{item.period} • {item.accounts?.name}</span>
                            <span className={styles.date}>Next: {new Date(item.next_charge_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                {fixed.length === 0 && <div className={styles.empty}>No fixed expenses.</div>}
            </div>
        </div>
    )
}
