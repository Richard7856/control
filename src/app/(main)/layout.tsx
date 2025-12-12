import Link from 'next/link'
import { Home, Wallet, PlusCircle, History, Mic, Settings } from 'lucide-react'
import styles from './layout.module.css'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.wrapper}>
            <main className={styles.main}>{children}</main>

            <nav className={styles.nav}>
                <Link href="/dashboard" className={styles.navItem}>
                    <Home size={24} />
                    <span>Home</span>
                </Link>
                <Link href="/accounts" className={styles.navItem}>
                    <Wallet size={24} />
                    <span>Accounts</span>
                </Link>
                <Link href="/new" className={styles.navItemMain}>
                    <PlusCircle size={32} />
                </Link>
                <Link href="/history" className={styles.navItem}>
                    <History size={24} />
                    <span>History</span>
                </Link>
                <Link href="/assistant" className={styles.navItem}>
                    <Mic size={24} />
                    <span>AI</span>
                </Link>
            </nav>
        </div>
    )
}
