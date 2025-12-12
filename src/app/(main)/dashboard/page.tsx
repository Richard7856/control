import { getDashboardMetrics } from '@/app/actions/dashboard'
import { getAccounts } from '@/app/actions/accounts' // Show accounts balance too
import styles from './dashboard.module.css'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default async function DashboardPage() {
    const metrics = await getDashboardMetrics()
    const accounts = await getAccounts()

    const totalBalance = accounts?.reduce((sum, acc) => sum + Number(acc.balance), 0) || 0

    return (
        <div className="container">
            <header className={styles.header}>
                <h1 className={styles.greeting}>Overview</h1>
                <p className={styles.subtitle}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </header>

            <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>Total Balance</span>
                <div className={styles.summaryAmount}>${totalBalance.toFixed(2)}</div>
                <div className={styles.incomeMetric}>Income: +${metrics.incomeMonth.toFixed(2)}</div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Spending</h2>
                <div className={styles.metricsGrid}>
                    <div className={`${styles.metricCard} glass`}>
                        <span className={styles.metricLabel}>Today</span>
                        <span className={styles.metricValue}>${metrics.today.toFixed(2)}</span>
                    </div>
                    <div className={`${styles.metricCard} glass`}>
                        <span className={styles.metricLabel}>This Week</span>
                        <span className={styles.metricValue}>${metrics.week.toFixed(2)}</span>
                    </div>
                    <div className={`${styles.metricCard} glass`}>
                        <span className={styles.metricLabel}>This Month</span>
                        <span className={styles.metricValue}>${metrics.month.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Distribution</h2>
                </div>
                <div className={`${styles.distribution} glass`}>
                    {metrics.categories.map((cat) => (
                        <div key={cat.name} className={styles.distRow}>
                            <div className={styles.distInfo}>
                                <span className={styles.distName}>{cat.name}</span>
                                <div className={styles.distBarWrapper}>
                                    <div className={styles.distBar} style={{ width: `${cat.percent}%` }}></div>
                                </div>
                            </div>
                            <span className={styles.distAmount}>${cat.amount.toFixed(0)}</span>
                        </div>
                    ))}
                    {metrics.categories.length === 0 && <span className={styles.emptyText}>No expenses yet.</span>}
                </div>
            </div>

            <div className={styles.section}>
                <Link href="/fixed" className={`${styles.fixedCard} glass`}>
                    <div className={styles.fixedInfo}>
                        <span className={styles.fixedLabel}>Fixed Expenses (Est.)</span>
                        <span className={styles.fixedValue}>${metrics.fixedTotal.toFixed(2)} / mo</span>
                    </div>
                    <div className={styles.fixedPercent}>
                        {metrics.month > 0
                            ? `${Math.min((metrics.fixedTotal / metrics.month) * 100, 100).toFixed(0)}% of total`
                            : 'N/A'}
                    </div>
                    <ChevronRight size={20} color="#666" />
                </Link>
            </div>
        </div>
    )
}
