import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardData } from "../../features/DashboardSlice/dashboardSlice";
import { User, DollarSign, FileText, TrendingUp, Bell, RefreshCw, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { data: dashboardData, loading, error } = useSelector(
        (state) => state.dashboard
    );

    useEffect(() => {
        dispatch(fetchDashboardData());
    }, [dispatch]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };


    const formatCurrentDateTime = () => {
        const now = new Date();
        const date = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        const time = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return { date, time };
    };

    if (loading) {
        return (
            <div style={styles.pageContainer}>
                <div style={styles.loadingContainer}>
                    <RefreshCw size={32} style={styles.spinner} />
                    <p style={styles.loadingText}>Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.pageContainer}>
                <div style={styles.errorContainer}>
                    <div style={styles.errorCard}>
                        <AlertCircle size={32} color="#dc3545" style={{ marginBottom: '16px' }} />
                        <h3 style={styles.errorTitle}>Unable to Load Dashboard</h3>
                        <p style={styles.errorText}>{error}</p>
                        <button onClick={fetchDashboardData} style={styles.retryButton}>
                            <RefreshCw size={16} style={{ marginRight: '8px' }} />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { user = {}, cases = [] } = dashboardData || {};

    // Role-based metrics
    const getMetricCards = () => {
        if (user.role === 'Sale') {
            const { todayCases, todaySales, monthlyCases, monthlySales, casesGrowth, salesGrowth } = dashboardData;
            return [
                {
                    title: 'Today Cases',
                    value: todayCases,
                    subtitle: `${formatCurrency(todaySales)} sales`,
                    icon: <FileText size={20} />,
                    iconBg: '#e3f2fd',
                    iconColor: '#1976d2'
                },
                {
                    title: 'Monthly Cases',
                    value: monthlyCases,
                    subtitle: `${formatCurrency(monthlySales)} sales`,
                    icon: <TrendingUp size={20} />,
                    iconBg: '#e8f5e9',
                    iconColor: '#388e3c'
                },
                {
                    title: 'Cases Growth',
                    value: `${casesGrowth}%`,
                    subtitle: 'vs last month',
                    icon: <TrendingUp size={20} />,
                    iconBg: '#fff3e0',
                    iconColor: '#f57c00'
                },
                {
                    title: 'Sales Growth',
                    value: `${salesGrowth}%`,
                    subtitle: 'vs last month',
                    icon: <DollarSign size={20} />,
                    iconBg: '#f3e5f5',
                    iconColor: '#7b1fa2'
                }
            ];
        } else if (user.role === 'Tech') {
            const { totalAssignedCases, statusCounts } = dashboardData;
            return [
                {
                    title: 'Total Assigned',
                    value: totalAssignedCases,
                    subtitle: 'cases',
                    icon: <FileText size={20} />,
                    iconBg: '#e3f2fd',
                    iconColor: '#1976d2'
                },
                {
                    title: 'Open Cases',
                    value: statusCounts.open,
                    subtitle: 'pending work',
                    icon: <AlertCircle size={20} />,
                    iconBg: '#fff3cd',
                    iconColor: '#856404'
                },
                {
                    title: 'Closed Cases',
                    value: statusCounts.closed,
                    subtitle: 'completed',
                    icon: <RefreshCw size={20} />,
                    iconBg: '#d1edff',
                    iconColor: '#0c5460'
                },
                {
                    title: 'In Progress',
                    value: statusCounts.inProgress,
                    subtitle: 'working on',
                    icon: <TrendingUp size={20} />,
                    iconBg: '#e8f5e9',
                    iconColor: '#388e3c'
                }
            ];
        }
        return [];
    };

    const metricCards = getMetricCards();

    return (
        <div style={styles.pageContainer}>

            <div style={styles.container}>

                <div style={styles.noticeBoard}>
                    <div style={styles.noticeBoardHeader}>
                        <div style={styles.noticeBoardIcon}>
                            <Bell size={18} color="#ffffff" />
                        </div>
                        <h3 style={styles.noticeBoardTitle}>Notice Board</h3>
                    </div>
                    <div style={styles.noticeContent}>
                        {user.role === 'Sale' ? (
                            <div style={styles.noticeItem}>
                                <div style={styles.noticeDate}>Today's Goals</div>
                                <div style={styles.noticeText}>
                                    🎯 Create 5 new cases today<br />
                                    💡 Focus on premium plans<br />
                                    📞 Follow up pending customers<br />
                                    💰 Target: $50K in sales
                                </div>
                            </div>
                        ) : (
                            <div style={styles.noticeItem}>
                                <div style={styles.noticeDate}>Today's Tasks</div>
                                <div style={styles.noticeText}>
                                    🔧 Close pending cases<br />
                                    ⚡ Update case status<br />
                                    📋 Complete daily reports<br />
                                    ✅ Team sync at 3 PM
                                </div>
                            </div>
                        )}
                        <div style={styles.noticeItem}>
                            <div style={styles.noticeDate}>Reminder</div>
                            <div style={styles.noticeText}>
                                📅 Monthly review meeting tomorrow<br />
                                🎉 Team lunch on Friday
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header Section */}
                <div style={styles.header}>
                    <div style={styles.headerContent}>
                        <div style={styles.userSection}>
                            <div style={styles.userAvatar}>
                                <User size={24} color="#666" />
                            </div>
                            <div>
                                <h1 style={styles.welcomeTitle}>Welcome back, {user.name}</h1>
                                <p style={styles.roleText}>{user.role} Dashboard</p>
                            </div>
                        </div>
                        <div style={styles.dateSection}>
                            <p style={styles.dateLabel}>Today</p>
                            <p style={styles.dateValue}>{formatCurrentDateTime().date}</p>
                        </div>
                    </div>

                    <div style={styles.userInfo}>
                        <div style={styles.infoItem}>
                            <Mail size={16} color="#666" />
                            <span>{user.email}</span>
                        </div>
                        <div style={styles.infoItem}>
                            <Phone size={16} color="#666" />
                            <span>{user.phone}</span>
                        </div>
                        <div style={styles.infoItem}>
                            <MapPin size={16} color="#666" />
                            <span>{user.city}, {user.state}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div style={styles.mainGrid}>
                    {/* Left Side - Metrics and Cases */}
                    <div style={styles.leftColumn}>
                        {/* Metrics Cards */}
                        <div style={styles.metricsGrid}>
                            {metricCards.map((metric, index) => (
                                <div key={index} style={styles.metricCard}>
                                    <div style={styles.metricHeader}>
                                        <span style={styles.metricTitle}>{metric.title}</span>
                                        <div style={{
                                            ...styles.metricIconContainer,
                                            backgroundColor: metric.iconBg
                                        }}>
                                            <span style={{ color: metric.iconColor }}>
                                                {metric.icon}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={styles.metricValue}>{metric.value}</div>
                                    {metric.subtitle && (
                                        <div style={styles.metricSubtitle}>{metric.subtitle}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Cases Table */}
                        <div style={styles.tableSection}>
                            <h2 style={styles.sectionTitle}>Recent Cases</h2>
                            <div style={styles.tableContainer}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.tableHeader}>Customer</th>
                                            <th style={styles.tableHeader}>Issue</th>
                                            <th style={styles.tableHeader}>Plan</th>
                                            <th style={styles.tableHeader}>Amount</th>
                                            <th style={styles.tableHeader}>Status</th>
                                            <th style={styles.tableHeader}>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cases.map((caseItem) => (
                                            <tr key={caseItem.id} style={styles.tableRow}>
                                                <td style={styles.tableCell}>
                                                    <div>
                                                        <div style={styles.customerName}>{caseItem.customerName}</div>
                                                        <div style={styles.customerId}>{caseItem.customerID}</div>
                                                    </div>
                                                </td>
                                                <td style={styles.tableCell}>{caseItem.issue}</td>
                                                <td style={styles.tableCell}>
                                                    <div>{caseItem.plan}</div>
                                                    <div style={styles.planDuration}>{caseItem.planDuration}</div>
                                                </td>
                                                <td style={styles.tableCell}>
                                                    <span style={styles.amount}>{formatCurrency(caseItem.saleAmount)}</span>
                                                </td>
                                                <td style={styles.tableCell}>
                                                    <span style={{
                                                        ...styles.statusBadge,
                                                        ...(caseItem.status === 'Open'
                                                            ? styles.statusOpen
                                                            : styles.statusClosed
                                                        )
                                                    }}>
                                                        {caseItem.status}
                                                    </span>
                                                </td>
                                                <td style={styles.tableCell}>
                                                    {formatDate(caseItem.createdAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    // GLOBAL FIX: Main page container with proper navbar spacing
    pageContainer: {
        minHeight: '100vh',
        backgroundColor: '#f8fafaff',
        paddingTop: '80px',
       fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative'
    },

    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
    },

    // Notice Board - Fixed position
    noticeBoard: {
        position: 'fixed',
        top: '100px',
        right: '24px',
        width: '320px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        zIndex: 1000,
        overflow: 'hidden',
    },

    noticeBoardHeader: {
        background: 'linear-gradient(135deg, #697ac5ff 0%, #9d80bbff 100%)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },

    noticeBoardIcon: {
        width: '32px',
        height: '32px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    noticeBoardTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#ffffff',
        margin: 0
    },

    noticeContent: {
        padding: '20px',
        maxHeight: '400px',
        overflowY: 'auto'
    },

    noticeItem: {
        marginBottom: '16px',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        borderLeft: '4px solid #6366f1'
    },

    noticeDate: {
        fontSize: '12px',
        color: '#6366f1',
        fontWeight: '600',
        marginBottom: '8px',
        textTransform: 'uppercase'
    },

    noticeText: {
        fontSize: '13px',
        color: '#475569',
        lineHeight: '1.5'
    },

    // Loading & Error States
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '16px'
    },
    spinner: {
        animation: 'spin 1s linear infinite',
        color: '#6c757d'
    },
    loadingText: {
        color: '#6c757d',
        fontSize: '16px',
        margin: 0
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
    },
    errorCard: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
    },
    errorTitle: {
        color: '#212529',
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px'
    },
    errorText: {
        color: '#6c757d',
        marginBottom: '24px'
    },
    retryButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto'
    },

    // Header Section
    header: {
        backgroundColor: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px',
        width: '70%'
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    userAvatar: {
        width: '50px',
        height: '50px',
        backgroundColor: '#f8f9fa',
        border: '2px solid #dee2e6',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    welcomeTitle: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#212529',
        margin: '0 0 4px 0'
    },
    roleText: {
        color: '#6c757d',
        fontSize: '14px',
        margin: 0
    },
    dateSection: {
        textAlign: 'right'
    },
    dateLabel: {
        fontSize: '12px',
        color: '#6c757d',
        margin: '0 0 4px 0'
    },
    dateValue: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#212529',
        margin: 0
    },
    userInfo: {
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap'
    },
    infoItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#495057'
    },

    // Metrics Grid
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
    },
    metricCard: {
        backgroundColor: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '20px'
    },
    metricHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    },
    metricTitle: {
        fontSize: '14px',
        color: '#6c757d',
        fontWeight: '500'
    },
    metricIconContainer: {
        width: '36px',
        height: '36px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    metricValue: {
        fontSize: '28px',
        fontWeight: '600',
        color: '#212529'
    },

    // Add these new styles to your styles object:
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '24px',
        alignItems: 'start'
    },
    leftColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    rightColumn: {
        position: 'sticky',
        top: '100px'
    },
    metricSubtitle: {
        fontSize: '12px',
        color: '#6c757d',
        marginTop: '4px'
    },

    // Table Section
    tableSection: {
        backgroundColor: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#212529',
        margin: '0',
        padding: '20px 24px',
        borderBottom: '1px solid #dee2e6'
    },
    tableContainer: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    tableHeader: {
        backgroundColor: '#f8f9fa',
        padding: '12px 24px',
        textAlign: 'left',
        fontSize: '13px',
        fontWeight: '600',
        color: '#495057',
        borderBottom: '1px solid #dee2e6'
    },
    tableRow: {
        borderBottom: '1px solid #dee2e6',
        transition: 'background-color 0.2s'
    },
    tableCell: {
        padding: '16px 24px',
        fontSize: '14px',
        color: '#212529'
    },
    customerName: {
        fontWeight: '500',
        marginBottom: '2px'
    },
    customerId: {
        fontSize: '12px',
        color: '#6c757d'
    },
    planDuration: {
        fontSize: '12px',
        color: '#6c757d',
        marginTop: '2px'
    },
    amount: {
        fontWeight: '500',
        color: '#28a745'
    },
    statusBadge: {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    statusOpen: {
        backgroundColor: '#fff3cd',
        color: '#856404'
    },
    statusClosed: {
        backgroundColor: '#d1edff',
        color: '#0c5460'
    }
};

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .table-row:hover {
    background-color: #f8f9fa !important;
  }
  
  .metric-card:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: box-shadow 0.2s ease;
  }
  
  .retry-button:hover {
    background-color: #c82333;
  }
  
  /* Enhanced Mobile Responsiveness */
  @media (max-width: 1024px) {
    .page-container {
      padding-right: 24px !important;
    }
    
    .notice-board {
      position: relative !important;
      width: 100% !important;
      margin: 0 0 24px 0 !important;
      right: auto !important;
      top: auto !important;
      order: -1;
    }
    
    .container {
      padding-right: 24px !important;
    }
  }
  
  @media (max-width: 768px) {
    .main-grid {
      grid-template-columns: 1fr !important;
    }
    
    .right-column {
      position: static !important;
    }
    
    .header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .user-info {
      flex-direction: column;
      gap: 12px;
    }
    
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    
    .page-container {
      padding-top: 60px;
    }
    
    .notice-board {
      position: static !important;
      width: 100% !important;
      margin: 0 0 20px 0 !important;
      right: auto !important;
      top: auto !important;
    }
    
    .container {
      padding: 16px !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;