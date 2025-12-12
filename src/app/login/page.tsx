import { login, signup } from '@/app/actions/auth'
import styles from './login.module.css'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { error?: string, message?: string }
}) {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Sign in to your account</p>
                </div>

                {searchParams.error && (
                    <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255,0,0,0.1)', borderRadius: '8px', textAlign: 'center' }}>
                        {searchParams.error}
                    </div>
                )}
                {searchParams.message && (
                    <div style={{ color: 'green', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(0,255,0,0.1)', borderRadius: '8px', textAlign: 'center' }}>
                        {searchParams.message}
                    </div>
                )}

                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            className={styles.input}
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            className={styles.input}
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {(searchParams.message || searchParams.error) && (
                        <div className={searchParams.error ? styles.error : styles.message}>
                            {searchParams.error || searchParams.message}
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button formAction={login} className={styles.buttonPrimary}>
                            Log In
                        </button>
                        <button formAction={signup} className={styles.buttonSecondary}>
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
