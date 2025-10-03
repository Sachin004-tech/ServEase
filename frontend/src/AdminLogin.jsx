import React, { useState } from 'react';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/customer/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })  // backend ko data bhejna
            });

            const data = await response.json();
            
            if(response.ok){
                setMessage("Login Successful!");
                console.log(data); // backend ka response console me dekh sakte ho
            } else {
                setMessage(data.message || "Login Failed!");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("Server Error");
        }
    }

    return (
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required
                /><br/>
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required
                /><br/>
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default AdminLogin;
