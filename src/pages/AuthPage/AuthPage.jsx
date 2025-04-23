import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from './AuthPage.module.scss';

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, user, logout } = useAuth();
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            setError("Eroare la logare: " + err.message);
        }
    };

    const handleLogout = async (e) => {
        
        try {
            await logout();
        } catch (err) {
            setError("Eroare la logare: " + err.message);
        }
    };

    if (user) {
        return(
            <div>
                Ai fost autentificat ca {user.email}
                <button onClick={handleLogout}>Log out</button>
            </div>
        );
    }

    return (
        <div className={styles.Login}>
            <h2>Quiz Panel</h2>
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
            {error && <p style={{ color: 'red' }}>{error}</p>} 
        </div>
    );
};

export default AuthPage;
