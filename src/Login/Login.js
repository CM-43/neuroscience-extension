// Login/Login.js
import React, { useState } from 'react';
import './Login.css';


const Login = ({ onLogin }) => {
    document.body.setAttribute('class', 'login-class');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();

        // You would replace this with your actual login logic.
        // This example just checks if the username and password are both "admin".
        if (username === 'CaseMentor9042' && password === 'PYM-SIM-ST12kL6') {
            localStorage.setItem('isLoggedIn', 'true'); // Set isLoggedIn to true in local storage
            onLogin(); // Call the onLogin function to update the app state
        } else {
            // Failed login
            // Display an error message
            setError('Invalid username or password.');
        }
    };

    return (

        <div className="login-page">
            <div className="login-container">
                <div className="loginText">Login</div>
                <form id="loginForm" onSubmit={handleLogin}>
                    <label htmlFor="username">Username:</label><br />
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    /><br />
                    <label htmlFor="password">Password:</label><br />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /><br />
                    <input type="submit" value="Login" />
                </form>
                {error && <p id="login-error" className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default Login;
