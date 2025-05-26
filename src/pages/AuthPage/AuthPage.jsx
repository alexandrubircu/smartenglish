import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from 'notistack';
import styles from './AuthPage.module.scss';
import AuthLayout from '../../components/authLayout/index'

const AuthPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            enqueueSnackbar('invalid-credential ',{ variant: 'error' });
        }
    };

    return (
        <AuthLayout>
            <div className={styles.LoginWrapp}>
                <div className={styles.login}>
                    <h2>Teacher Login</h2>
                    <form onSubmit={handleLogin} className={styles.inputContainer}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Log in</button>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
};

export default AuthPage;
