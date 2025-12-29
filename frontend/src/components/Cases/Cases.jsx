import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCase, clearCaseState } from '../../features/CaseSlice/CaseSlice';

const CaseForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, success, error } = useSelector((state) => state.cases);
    const [activeStep, setActiveStep] = useState(0);
    const isNoSaleCase = window.location.href.includes('/create-case/no-sale');
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        altPhone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        country: 'USA',
        remoteAccess: [{
            remoteID: '',
            remotePass: '',
            operatingSystem: '',
            computerPass: ''
        }],
        issue: '',
        modelNo: '',
        workToBeDone: '',
        specialNotes: '',
        securitySoftware: '',
        plan: '',
        planDuration: '',
        validity: '',
        saleAmount: '',
        status: 'Open',
    });

    const usStates = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
        'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
        'Wisconsin', 'Wyoming'
    ];

    const operatingSystems = ['Windows 10', 'Windows 11', 'macOS', 'Linux Ubuntu', 'Linux Mint'];
    const securitySoftwareOptions = ['Norton', 'McAfee', 'Kaspersky', 'Bitdefender', 'Avast'];
    const planOptions = ['Basic', 'Premium', 'Enterprise'];

    useEffect(() => {
        if (formData.planDuration) {
            const currentDate = new Date();
            let validityDate;

            if (formData.planDuration === 'Lifetime') {
                validityDate = 'Lifetime';
            } else {
                const years = parseInt(formData.planDuration);
                validityDate = new Date(currentDate.getFullYear() + years, currentDate.getMonth(), currentDate.getDate());
                validityDate = validityDate.toISOString().split('T')[0];
            }

            setFormData(prev => ({ ...prev, validity: validityDate }));
        }
    }, [formData.planDuration]);

    useEffect(() => {
        return () => {
            setFormData({
                customerName: '',
                phone: '',
                altPhone: '',
                email: '',
                address: '',
                city: '',
                state: '',
                country: 'USA',
                remoteAccess: [{
                    remoteID: '',
                    remotePass: '',
                    operatingSystem: '',
                    computerPass: ''
                }],
                issue: '',
                modelNo: '',
                workToBeDone: '',
                specialNotes: '',
                securitySoftware: '',
                plan: '',
                planDuration: '',
                validity: '',
                saleAmount: '',
                status: 'Open',
            });
        };
    }, []);


    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRemoteAccessChange = (index, field, value) => {
        const newRemoteAccess = [...formData.remoteAccess];
        newRemoteAccess[index] = { ...newRemoteAccess[index], [field]: value };
        setFormData(prev => ({ ...prev, remoteAccess: newRemoteAccess }));
    };

    const addRemoteAccess = () => {
        setFormData(prev => ({
            ...prev,
            remoteAccess: [...prev.remoteAccess, {
                remoteID: '',
                remotePass: '',
                operatingSystem: '',
                computerPass: ''
            }]
        }));
    };

    const removeRemoteAccess = (index) => {
        if (formData.remoteAccess.length > 1) {
            const newRemoteAccess = formData.remoteAccess.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, remoteAccess: newRemoteAccess }));
        }
    };

    const validateStep1 = () => {
        return formData.customerName && formData.phone && formData.email &&
            formData.city && formData.state && formData.address;
    };

    const validateStep2 = () => {
        const firstRemote = formData.remoteAccess[0];
        return firstRemote.remoteID && firstRemote.remotePass &&
            firstRemote.operatingSystem && firstRemote.computerPass &&
            formData.issue && formData.modelNo && formData.workToBeDone &&
            formData.securitySoftware && formData.plan && formData.planDuration &&
            formData.saleAmount;
    };

    const handleNext = () => {
        if (activeStep === 0 && validateStep1()) {
            setActiveStep(1);
        }
    };

    const handleBack = () => {
        setActiveStep(0);
    };

    const handleSubmit = async () => {
        const isValid = isNoSaleCase ? validateStep1() : validateStep2();

        if (isValid) {
            let submitData;

            if (isNoSaleCase) {
                submitData = {
                    ...formData,
                };
                delete submitData.remoteAccess;
            } else {
                submitData = {
                    ...formData,
                    remoteID: formData.remoteAccess[0].remoteID,
                    remotePass: formData.remoteAccess[0].remotePass,
                    operatingSystem: formData.remoteAccess[0].operatingSystem,
                    computerPass: formData.remoteAccess[0].computerPass
                };
                delete submitData.remoteAccess;
            }

            console.log('Form Data to Submit:', submitData);

            try {
                console.log('Dispatching createCase...');
                const result = await dispatch(createCase(submitData)).unwrap();
                console.log('Success result:', result);
                alert('Form submitted successfully!');

                setFormData({
                    customerName: '',
                    phone: '',
                    altPhone: '',
                    email: '',
                    address: '',
                    city: '',
                    state: '',
                    country: 'USA',
                    remoteAccess: [{
                        remoteID: '',
                        remotePass: '',
                        operatingSystem: '',
                        computerPass: ''
                    }],
                    issue: '',
                    modelNo: '',
                    workToBeDone: '',
                    specialNotes: '',
                    securitySoftware: '',
                    plan: '',
                    planDuration: '',
                    validity: '',
                    saleAmount: '',
                    status: 'Open',
                });
                setActiveStep(0);

            } catch (error) {
                console.error('Submit error:', error);
                alert(`Error: ${error}`);
            }
        } else {
            console.log('Validation failed');
        }
    };

    useEffect(() => {
        return () => {
            dispatch(clearCaseState());
        };
    }, [dispatch]);

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Create New Case</h1>

                    {/* Step Indicator */}
                    <div style={styles.stepIndicator}>
                        <div style={styles.stepContainer}>
                            <div style={{ ...styles.stepCircle, ...(activeStep >= 0 ? styles.stepActive : {}) }}>
                                1
                            </div>
                            <span style={styles.stepLabel}>Customer Information</span>
                        </div>
                        <div style={styles.stepLine}></div>
                        <div style={styles.stepContainer}>
                            <div style={{ ...styles.stepCircle, ...(activeStep >= 1 ? styles.stepActive : {}) }}>
                                2
                            </div>
                            <span style={styles.stepLabel}>Case Details</span>
                        </div>
                    </div>
                </div>

                {activeStep === 0 && (
                    <div style={styles.formSection}>
                        <h2 style={styles.sectionTitle}>Customer Information</h2>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Customer Name *</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                                    placeholder="Enter customer name"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Phone Number *</label>
                                <input
                                    style={styles.input}
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Alternate Phone Number</label>
                                <input
                                    style={styles.input}
                                    type="tel"
                                    value={formData.altPhone}
                                    onChange={(e) => handleInputChange('altPhone', e.target.value)}
                                    placeholder="Enter alternate phone number"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email Address *</label>
                                <input
                                    style={styles.input}
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter email address"
                                />
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Country *</label>
                                <input
                                    style={{ ...styles.input, backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                                    type="text"
                                    value={formData.country}
                                    disabled
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>State *</label>
                                <select
                                    style={styles.select}
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                >
                                    <option value="">Select State</option>
                                    {usStates.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>City *</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    placeholder="Enter city"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Street Address *</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    placeholder="Enter street address"
                                />
                            </div>
                        </div>

                        <div style={{
                            ...styles.buttonContainer,
                            justifyContent: isNoSaleCase ? 'center' : 'space-between'
                        }}>
                            {isNoSaleCase ? (
                                <button
                                    style={{ ...styles.button, ...styles.successButton }}
                                    onClick={handleSubmit}
                                    disabled={!validateStep1()}
                                >
                                    Submit Case
                                </button>
                            ) : (
                                <button
                                    style={{ ...styles.button, ...styles.primaryButton }}
                                    onClick={handleNext}
                                    disabled={!validateStep1()}
                                >
                                    Next →
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {activeStep === 1 && (
                    <div style={styles.formSection}>
                        <h2 style={styles.sectionTitle}>Case Details</h2>

                        {/* Remote Access Section */}
                        <h3 style={styles.subSectionTitle}>Remote Access Information</h3>
                        {formData.remoteAccess.map((remote, index) => (
                            <div key={index} style={styles.remoteAccessCard}>
                                <div style={styles.cardHeader}>
                                    <h4 style={styles.cardTitle}>Remote Access {index + 1}</h4>
                                    {formData.remoteAccess.length > 1 && (
                                        <button
                                            style={styles.removeButton}
                                            onClick={() => removeRemoteAccess(index)}
                                            type="button"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Remote ID *</label>
                                        <input
                                            style={styles.input}
                                            type="text"
                                            value={remote.remoteID}
                                            onChange={(e) => handleRemoteAccessChange(index, 'remoteID', e.target.value)}
                                            placeholder="Enter remote ID"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Remote Password *</label>
                                        <input
                                            style={styles.input}
                                            type="password"
                                            value={remote.remotePass}
                                            onChange={(e) => handleRemoteAccessChange(index, 'remotePass', e.target.value)}
                                            placeholder="Enter remote password"
                                        />
                                    </div>
                                </div>

                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Operating System *</label>
                                        <select
                                            style={styles.select}
                                            value={remote.operatingSystem}
                                            onChange={(e) => handleRemoteAccessChange(index, 'operatingSystem', e.target.value)}
                                        >
                                            <option value="">Select OS</option>
                                            {operatingSystems.map((os) => (
                                                <option key={os} value={os}>
                                                    {os}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Computer Password *</label>
                                        <input
                                            style={styles.input}
                                            type="password"
                                            value={remote.computerPass}
                                            onChange={(e) => handleRemoteAccessChange(index, 'computerPass', e.target.value)}
                                            placeholder="Enter computer password"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            style={styles.addButton}
                            onClick={addRemoteAccess}
                            type="button"
                        >
                            + Add Remote Access
                        </button>

                        {/* Case Information */}
                        <h3 style={styles.subSectionTitle}>Case Information</h3>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Issue *</label>
                                <textarea
                                    style={styles.textarea}
                                    rows="3"
                                    value={formData.issue}
                                    onChange={(e) => handleInputChange('issue', e.target.value)}
                                    placeholder="Describe the issue"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Model No *</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    value={formData.modelNo}
                                    onChange={(e) => handleInputChange('modelNo', e.target.value)}
                                    placeholder="Enter model number"
                                />
                            </div>
                        </div>

                        <div style={styles.formGroupFull}>
                            <label style={styles.label}>Work To Be Done *</label>
                            <textarea
                                style={styles.textarea}
                                rows="3"
                                value={formData.workToBeDone}
                                onChange={(e) => handleInputChange('workToBeDone', e.target.value)}
                                placeholder="Describe work to be done"
                            />
                        </div>

                        <div style={styles.formGroupFull}>
                            <label style={styles.label}>Special Notes</label>
                            <textarea
                                style={styles.textarea}
                                rows="2"
                                value={formData.specialNotes}
                                onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                                placeholder="Any special notes"
                            />
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Security Software *</label>
                                <select
                                    style={styles.select}
                                    value={formData.securitySoftware}
                                    onChange={(e) => handleInputChange('securitySoftware', e.target.value)}
                                >
                                    <option value="">Select Security Software</option>
                                    {securitySoftwareOptions.map((software) => (
                                        <option key={software} value={software}>
                                            {software}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Plan *</label>
                                <select
                                    style={styles.select}
                                    value={formData.plan}
                                    onChange={(e) => handleInputChange('plan', e.target.value)}
                                >
                                    <option value="">Select Plan</option>
                                    {planOptions.map((plan) => (
                                        <option key={plan} value={plan}>
                                            {plan}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Plan Duration *</label>
                                <select
                                    style={styles.select}
                                    value={formData.planDuration}
                                    onChange={(e) => handleInputChange('planDuration', e.target.value)}
                                >
                                    <option value="">Select Duration</option>
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i + 1} value={`${i + 1} Year${i > 0 ? 's' : ''}`}>
                                            {i + 1} Year{i > 0 ? 's' : ''}
                                        </option>
                                    ))}
                                    <option value="Lifetime">Lifetime</option>
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Validity</label>
                                <input
                                    style={{ ...styles.input, backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                                    type="text"
                                    value={formData.validity}
                                    disabled
                                />
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Sale Amount *</label>
                                <input
                                    style={styles.input}
                                    type="number"
                                    step="0.01"
                                    value={formData.saleAmount}
                                    onChange={(e) => handleInputChange('saleAmount', e.target.value)}
                                    placeholder="Enter sale amount"
                                />
                            </div>
                        </div>

                        <div style={styles.buttonContainer}>
                            <button
                                style={{ ...styles.button, ...styles.secondaryButton }}
                                onClick={handleBack}
                            >
                                ← Back
                            </button>
                            <button
                                style={{ ...styles.button, ...styles.successButton }}
                                onClick={handleSubmit}
                                disabled={!validateStep2()}
                            >
                                Submit Case
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        paddingTop: '100px',
        paddingBottom: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    formCard: {
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    },
    header: {
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '30px',
        textAlign: 'center'
    },
    title: {
        margin: '0 0 30px 0',
        fontSize: '28px',
        fontWeight: '600'
    },
    stepIndicator: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px'
    },
    stepContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
    },
    stepCircle: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'all 0.3s ease'
    },
    stepActive: {
        backgroundColor: 'white',
        color: '#2563eb'
    },
    stepLabel: {
        fontSize: '14px',
        fontWeight: '500'
    },
    stepLine: {
        width: '60px',
        height: '2px',
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    formSection: {
        padding: '40px'
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '30px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '10px'
    },
    subSectionTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#475569',
        marginTop: '30px',
        marginBottom: '20px'
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    formGroupFull: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '8px'
    },
    input: {
        padding: '12px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '16px',
        transition: 'all 0.2s ease',
        outline: 'none',
        ':focus': {
            borderColor: '#2563eb',
            boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
        }
    },
    select: {
        padding: '12px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '16px',
        backgroundColor: 'white',
        cursor: 'pointer',
        outline: 'none'
    },
    textarea: {
        padding: '12px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '16px',
        fontFamily: 'inherit',
        resize: 'vertical',
        outline: 'none'
    },
    remoteAccessCard: {
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#f8fafc'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#475569',
        margin: 0
    },
    removeButton: {
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addButton: {
        background: '#10b981',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginBottom: '30px',
        transition: 'all 0.2s ease'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '2px solid #e2e8f0'
    },
    button: {
        padding: '14px 28px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.2s ease',
        minWidth: '120px'
    },
    primaryButton: {
        background: '#2563eb',
        color: 'white'
    },
    secondaryButton: {
        background: '#6b7280',
        color: 'white'
    },
    successButton: {
        background: '#059669',
        color: 'white'
    }
};

export default CaseForm;