import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk, reset } from '../../features/UserSlice/UserSlice';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, isError, isSuccess, message } = useSelector(state => state.user);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempted with:', { email, password });
        dispatch(loginUserThunk({ email, password }));
    };

    useEffect(() => {
        if (isSuccess && user) {
            console.log('Login successful:', user);
            navigate("/dashboard");
        }
        if (isError) {
            console.log('Login error:', message);
            // Handle login error
        }

        return () => {
            dispatch(reset());
        };
    }, [isSuccess, isError, user, message, dispatch]);

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
    };

    const formContainerStyle = {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
    };

    const titleStyle = {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333',
        fontSize: '28px',
        fontWeight: '600'
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    };

    const inputGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    };

    const labelStyle = {
        fontSize: '14px',
        fontWeight: '500',
        color: '#555'
    };

    const inputStyle = {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        transition: 'border-color 0.3s ease'
    };

    const buttonStyle = {
        padding: '12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
    };

    const forgotPasswordStyle = {
        textAlign: 'center',
        marginTop: '15px'
    };

    const linkStyle = {
        color: '#007bff',
        textDecoration: 'none',
        fontSize: '14px'
    };

    return (
        <div style={containerStyle}>
            <div style={formContainerStyle}>
                <h1 style={titleStyle}>Login</h1>
                <div style={formStyle}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle} htmlFor="email">Email</label>
                        <input
                            style={inputStyle}
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                        />
                    </div>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle} htmlFor="password">Password</label>
                        <input
                            style={inputStyle}
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                        />
                    </div>
                    <button
                        style={{
                            ...buttonStyle,
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                        onClick={handleSubmit}
                        disabled={isLoading}
                        onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#0056b3')}
                        onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#007bff')}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
                <div style={forgotPasswordStyle}>
                    <a href="#" style={linkStyle}>Forgot Password?</a>
                </div>
            </div>
        </div>
    );
};

export default Home;