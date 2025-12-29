import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { createUserThunk, reset } from "../../../features/UserSlice/UserSlice";


const SignUp = () => {
    const dispatch = useDispatch();
    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.user
    );
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Sale',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNext = () => {
        if (currentStep === 1) {
            // Validate step 1 fields
            if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
                alert('Please fill in all required fields');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
        }
        setCurrentStep(2);
    };

    const handlePrev = () => {
        setCurrentStep(1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Sign up attempted with:', formData);
        dispatch(createUserThunk(formData));
    };

    useEffect(() => {
        if (isSuccess) {
            navigate('/');
            dispatch(reset());
        }
    }, [isSuccess, navigate, dispatch]);


    const containerStyle = {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        fontFamily: 'Arial, sans-serif',
        padding: '80px 20px 20px 20px', // Top padding to account for navbar
        boxSizing: 'border-box'
    };

    const formContainerStyle = {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
        position: 'relative'
    };

    const progressBarContainerStyle = {
        marginBottom: '30px'
    };

    const progressBarStyle = {
        width: '100%',
        height: '4px',
        backgroundColor: '#e9ecef',
        borderRadius: '2px',
        overflow: 'hidden'
    };

    const progressFillStyle = {
        height: '100%',
        backgroundColor: '#007bff',
        borderRadius: '2px',
        transition: 'width 0.3s ease',
        width: currentStep === 1 ? '50%' : '100%'
    };

    const stepIndicatorStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
    };

    const stepStyle = {
        fontSize: '12px',
        color: '#6c757d',
        fontWeight: '500'
    };

    const activeStepStyle = {
        fontSize: '12px',
        color: '#007bff',
        fontWeight: '600'
    };

    const titleStyle = {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333',
        fontSize: '28px',
        fontWeight: '600'
    };

    const subtitleStyle = {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#6c757d',
        fontSize: '14px'
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    };

    const rowStyle = {
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
    };

    const inputGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1,
        minWidth: '200px'
    };

    const fullWidthInputGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    };

    const labelStyle = {
        fontSize: '14px',
        fontWeight: '500',
        color: '#495057'
    };

    const requiredLabelStyle = {
        fontSize: '14px',
        fontWeight: '500',
        color: '#495057'
    };

    const inputStyle = {
        padding: '12px 16px',
        border: '2px solid #e9ecef',
        borderRadius: '8px',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        outline: 'none'
    };

    const selectStyle = {
        padding: '12px 16px',
        border: '2px solid #e9ecef',
        borderRadius: '8px',
        fontSize: '16px',
        backgroundColor: 'white',
        transition: 'all 0.3s ease',
        outline: 'none'
    };

    const buttonStyle = {
        padding: '14px 24px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textTransform: 'none'
    };

    const secondaryButtonStyle = {
        padding: '14px 24px',
        backgroundColor: 'transparent',
        color: '#6c757d',
        border: '2px solid #e9ecef',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    const buttonRowStyle = {
        display: 'flex',
        gap: '15px',
        marginTop: '20px'
    };

    const loginLinkStyle = {
        textAlign: 'center',
        marginTop: '30px',
        padding: '20px 0',
        borderTop: '1px solid #e9ecef'
    };

    const linkStyle = {
        color: '#007bff',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500'
    };

    const renderStep1 = () => (
        <>
            <h1 style={titleStyle}>Create Account</h1>
            <p style={subtitleStyle}>Step 1: Basic Information</p>

            <div style={formStyle}>
                {/* Name and Email */}
                <div style={rowStyle}>
                    <div style={inputGroupStyle}>
                        <label style={requiredLabelStyle} htmlFor="name">Full Name *</label>
                        <input
                            style={inputStyle}
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>
                    <div style={inputGroupStyle}>
                        <label style={requiredLabelStyle} htmlFor="email">Email Address *</label>
                        <input
                            style={inputStyle}
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>
                </div>

                {/* Password and Confirm Password */}
                <div style={rowStyle}>
                    <div style={inputGroupStyle}>
                        <label style={requiredLabelStyle} htmlFor="password">Password *</label>
                        <input
                            style={inputStyle}
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            required
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>
                    <div style={inputGroupStyle}>
                        <label style={requiredLabelStyle} htmlFor="confirmPassword">Confirm Password *</label>
                        <input
                            style={inputStyle}
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>
                </div>

                {/* Role */}
                <div style={fullWidthInputGroupStyle}>
                    <label style={requiredLabelStyle} htmlFor="role">Role *</label>
                    <select
                        style={selectStyle}
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    >
                        <option value="Sale">Sales</option>
                        <option value="Tech">Technical</option>
                    </select>
                </div>

                <div style={buttonRowStyle}>
                    <button
                        style={buttonStyle}
                        onClick={handleNext}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                        Continue →
                    </button>
                </div>
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <h1 style={titleStyle}>Almost Done!</h1>
            <p style={subtitleStyle}>Step 2: Contact & Address Information</p>

            <form onSubmit={handleSubmit} style={formStyle}>

                {/* Phone */}
                <div style={fullWidthInputGroupStyle}>
                    <label style={labelStyle} htmlFor="phone">Phone Number</label>
                    <input
                        style={inputStyle}
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                </div>

                {/* Address */}
                <div style={fullWidthInputGroupStyle}>
                    <label style={labelStyle} htmlFor="address">Street Address</label>
                    <input
                        style={inputStyle}
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your street address"
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                </div>

                {/* City, State, Country */}
                <div style={rowStyle}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle} htmlFor="city">City</label>
                        <input
                            style={inputStyle}
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter your city"
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle} htmlFor="state">State</label>
                        <input
                            style={inputStyle}
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="Enter your state"
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>
                </div>

                <div style={fullWidthInputGroupStyle}>
                    <label style={labelStyle} htmlFor="country">Country</label>
                    <input
                        style={inputStyle}
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Enter your country"
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                </div>

                <div style={buttonRowStyle}>
                    <button
                        style={secondaryButtonStyle}
                        onClick={handlePrev}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f8f9fa';
                            e.target.style.borderColor = '#007bff';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.borderColor = '#e9ecef';
                        }}
                    >
                        ← Back
                    </button>
                    <button
                        style={{ ...buttonStyle, flex: 1 }}
                        type="submit"
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </>
    );

    return (
        <div style={containerStyle}>
            <div style={formContainerStyle}>
                {/* Progress Bar */}
                <div style={progressBarContainerStyle}>
                    <div style={stepIndicatorStyle}>
                        <span style={currentStep === 1 ? activeStepStyle : stepStyle}>
                            Basic Info
                        </span>
                        <span style={currentStep === 2 ? activeStepStyle : stepStyle}>
                            Contact Details
                        </span>
                    </div>
                    <div style={progressBarStyle}>
                        <div style={progressFillStyle}></div>
                    </div>
                </div>

                {/* Form Steps */}
                {currentStep === 1 ? renderStep1() : renderStep2()}

                {/* Login Link */}
                <div style={loginLinkStyle}>
                    <span style={{ color: '#6c757d', fontSize: '14px' }}>Already have an account? </span>
                    <a href="#" style={linkStyle}>Sign In</a>
                </div>
            </div>
        </div>
    );
};

export default SignUp;