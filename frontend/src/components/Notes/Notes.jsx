import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchSaleUserCases,
    fetchCaseById,
    updateCase,
    setSearchFilters,
    setPageSize,
    setCurrentPage,
    setShowModal,
    updateSelectedCase,
    fetchSaleUserOngoingCases
} from '../../features/SearchSlice/searchSlice';
import { RefreshCw, User, AlertCircle } from 'lucide-react';

const SalesUserCases = () => {
    const dispatch = useDispatch();
    const {
        ongoingCases: cases,
        selectedCase,
        loading,
        modalLoading,
        error,
        showModal,
        pagination,
        searchFilters
    } = useSelector((state) => state.salesCases);


    const { currentPage, pageSize, totalPages, totalCount } = pagination;

    const fetchCases = (page = currentPage, limit = pageSize) => {
        dispatch(fetchSaleUserOngoingCases({ page, limit}));
    };


    useEffect(() => {
        dispatch(fetchSaleUserOngoingCases({
            page: currentPage,
            limit: pageSize,
            // filters: searchFilters
        }));
    }, [dispatch]);

    const handlePageSizeChange = (newPageSize) => {
        dispatch(setPageSize(newPageSize));
        dispatch(fetchSaleUserOngoingCases({ page: 1, limit: newPageSize, filters: searchFilters }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setCurrentPage(newPage));
        dispatch(fetchSaleUserOngoingCases({ page: newPage, limit: pageSize, filters: searchFilters }));
    };


    const fetchCaseDetails = (caseId) => {
        dispatch(fetchCaseById(caseId));
    };


    const updateCaseHandler = async(caseId, updatedData) => {
        try {
            await dispatch(updateCase({ caseId, caseData: updatedData })).unwrap();

            dispatch(setCurrentPage(currentPage));

                dispatch(fetchSaleUserOngoingCases({
                    page: currentPage,
                    limit: pageSize,
                    }));
        } catch (error) {
            console.error("Update failed:", error);
        }
    };


    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Get status color
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'closed':
                return { backgroundColor: '#dcfce7', color: '#166534' };
            case 'open':
                return { backgroundColor: '#dbeafe', color: '#1e40af' };
            case 'in progress':
                return { backgroundColor: '#fef3c7', color: '#92400e' };
            case 'pending':
                return { backgroundColor: '#fed7aa', color: '#c2410c' };
            default:
                return { backgroundColor: '#f3f4f6', color: '#374151' };
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
            paddingTop: '100px',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        maxWidth: {
            maxWidth: '1400px',
            margin: '0 auto'
        },
        header: {
            marginBottom: '32px'
        },
        headerTop: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
        },
        subtitle: {
            color: '#6b7280',
            margin: 0
        },
        refreshButton: {
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
        },
        refreshButtonHover: {
            backgroundColor: '#1d4ed8'
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '24px',
            marginBottom: '24px'
        },
        loadingContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px'
        },
        errorContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#dc2626',
            padding: '48px'
        },

        filterContainer: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #e5e7eb',
            maxWidth: '1100px',
            margin: '0 auto 24px auto',
            padding: '20px'
        },

        filterGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '20px'
        },

        filterGridSecond: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
            marginBottom: '24px',
            maxWidth: '400px',
            marginBottom: '24px'
        },

        filterField: {
            display: 'flex',
            flexDirection: 'column'
        },

        filterLabel: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
        },

        filterInput: {
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            outline: 'none',
            width: '300px',
            backgroundColor: '#f9fafb',
            fontFamily: 'inherit'
        },

        searchButtonContainer: {
            display: 'flex',
            justifyContent: 'center'
        },

        searchButton: {
            padding: '12px 32px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
            minWidth: '140px'
        },

        modalOverlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
        },
        modalContent: {
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            width: "90%",
            maxWidth: "700px",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        },
        closeButton: {
            position: "absolute",
            top: "10px",
            right: "15px",
            border: "none",
            background: "transparent",
            fontSize: "22px",
            cursor: "pointer",
        },
        formGrid: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "15px",
        },
        formGroup: {
            display: "flex",
            flexDirection: "column",
        },
        label: {
            marginBottom: "6px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
        },
        input: {
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "14px",
        },
        textarea: {
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "14px",
            resize: "vertical",
            minHeight: "70px",
        },
        buttonRow: {
            marginTop: "25px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
        },
        updateButton: {
            background: "#4CAF50",
            color: "#fff",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.3s",
        },
        cancelButton: {
            background: "#f44336",
            color: "#fff",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.3s",
        },
        title: {
            margin: '0 0 30px 0',
            fontSize: '28px',
            textAlign: 'center',
            color: "#1e40af",
            fontWeight: '700'
        },
        tableContainer: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            marginTop: '1rem'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        tableHeader: {
            backgroundColor: '#37506aff',
            color: 'white',
            borderBottom: '1px solid #e5e7eb'
        },
        th: {
            textAlign: 'left',
            padding: '16px 12px',
            fontWeight: '600',
            color: 'white',
            whiteSpace: 'nowrap',
            fontSize: '16px',
            border: '1px solid #34495e'
        },

        td: {
            padding: '12px 10px',
            verticalAlign: 'top',
            fontSize: '14px',
            border: '1px solid #e5e7eb',
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        tbody: {
            backgroundColor: 'white'
        },
        tr: {
            borderBottom: '1px solid #f3f4f6',
            transition: 'background-color 0.2s'
        },
        trHover: {
            backgroundColor: '#f9fafb'
        },
        customerName: {
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 4px 0'
        },
        customerDetails: {
            fontSize: '12px',
            color: '#6b7280',
            margin: '2px 0'
        },
        contactItem: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
            color: '#6b7280',
            margin: '4px 0'
        },
        statusBadge: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            textTransform: 'capitalize'
        },
        planDetails: {
            fontSize: '12px',
            color: '#6b7280',
            margin: '4px 0'
        },
        amount: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#059669'
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.maxWidth}>
                    <div style={styles.card}>
                        <div style={styles.loadingContainer}>
                            <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginRight: '12px', color: '#2563eb' }} />
                            <span style={{ fontSize: '18px', color: '#6b7280' }}>Loading cases...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.maxWidth}>
                    <div style={styles.card}>
                        <div style={styles.errorContainer}>
                            <AlertCircle size={32} style={{ marginRight: '12px' }} />
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>Error Loading Cases</h3>
                                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>{error}</p>
                                <button
                                    onClick={fetchCases}
                                    style={styles.refreshButton}
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.maxWidth}>

                <h1 style={styles.title}>Ongoing Cases</h1>

                {/* Cases Table */}
                <div style={styles.tableContainer}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead style={styles.tableHeader}>
                                <tr>
                                    <th style={styles.th}>Case ID</th>
                                    <th style={styles.th}>Customer Name</th>
                                    <th style={styles.th}>Plan</th>
                                    {/* <th style={styles.th}>Created By</th> */}
                                    <th style={styles.th}>Assigned To</th>
                                    <th style={styles.th}>Note</th>
                                    {/* <th style={styles.th}>Amount</th>
                                    <th style={styles.th}>Deduction</th>
                                    <th style={styles.th}>Net Amount</th>
                                    <th style={styles.th}>Sale Amount</th> */}
                                    {/* <th style={styles.th}>Sale Status</th> */}
                                    <th style={styles.th}>Issue Status</th>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody style={styles.tbody}>
                                {cases.map((caseItem) => (
                                    <tr
                                        key={caseItem.caseId || caseItem.id || index}
                                        style={styles.tr}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        <td style={styles.td}>{caseItem.caseId}</td>
                                        <td style={styles.td}>{caseItem.customerName}</td>
                                        <td style={styles.td}>{caseItem.plan}</td>
                                        {/* <td style={styles.td}>{caseItem.caseCreatedBy || 'Unknown'}</td> */}
                                        <td style={styles.td}>{caseItem.assignedTo || 'Not assigned'}</td>
                                        <td style={styles.td}>{caseItem.specialNotes || "N/A"}</td>
                                        {/* <td style={styles.td}>{formatCurrency(caseItem.saleAmount)}</td>
                                        <td style={styles.td}>{formatCurrency(caseItem.deduction)}</td>
                                        <td style={styles.td}>{formatCurrency(caseItem.netAmount)}</td>
                                        <td style={styles.td}>{formatCurrency(caseItem.saleAmount)}</td> */}
                                        {/* <td style={styles.td}>
                                            <span style={{ ...styles.statusBadge, ...getStatusStyle('completed') }}>
                                                {caseItem.saleStatus}
                                            </span>
                                        </td> */}
                                        <td style={styles.td}>
                                            <span style={{ ...styles.statusBadge, ...getStatusStyle(caseItem.status) }}>
                                                {caseItem.issueStatus}
                                            </span>
                                        </td>
                                        <td style={{ ...styles.td, whiteSpace: "nowrap", width: "90px" }}>
                                            {formatDate(caseItem.date)}
                                        </td>

                                        <td style={{ ...styles.td, width: "70px", textAlign: "center" }}>
                                            <button
                                                style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#2563eb',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    console.log('Case item:', caseItem);
                                                    fetchCaseDetails(caseItem.caseId);
                                                }}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {cases.length === 0 && !loading && !error && (
                    <div style={styles.card}>
                        <div style={{ textAlign: 'center', color: '#6b7280', padding: '48px' }}>
                            <User size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                            <p style={{ fontSize: '18px', margin: 0 }}>No cases found</p>
                        </div>
                    </div>
                )}

                {/* Add this after the table container and before the "No cases found" section */}
                {cases.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        {/* Page size selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>Show:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                            </select>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>entries</span>
                        </div>

                        {/* Pagination info */}
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
                        </div>

                        {/* Pagination controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: currentPage <= 1 ? '#f3f4f6' : '#2563eb',
                                    color: currentPage <= 1 ? '#6b7280' : 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Previous
                            </button>

                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: currentPage >= totalPages ? '#f3f4f6' : '#2563eb',
                                    color: currentPage >= totalPages ? '#6b7280' : 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {showModal && (
                    <div style={styles.modalOverlay} onClick={() => dispatch(setShowModal(false))}>
                        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button style={styles.closeButton} onClick={() => dispatch(setShowModal(false))}>
                                ×
                            </button>
                            <h2 style={{ marginTop: 0, textAlign: "center", color: "#111827" }}>
                                Case Details
                            </h2>

                            {modalLoading ? (
                                <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
                            ) : selectedCase ? (
                                <form style={styles.formGrid}>
                                    {/* Case ID - read only */}
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Case ID</label>
                                        <input
                                            style={{ ...styles.input, background: "#f9fafb" }}
                                            type="text"
                                            value={selectedCase.id}
                                            disabled
                                        />
                                    </div>

                                    {/* Customer Name */}
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Customer Name</label>
                                        <input
                                            style={styles.input}
                                            type="text"
                                            value={selectedCase.customerName}
                                            onChange={(e) => dispatch(updateSelectedCase({ customerName: e.target.value }))}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Email</label>
                                        <input
                                            style={styles.input}
                                            type="email"
                                            value={selectedCase.email}
                                            onChange={(e) => dispatch(updateSelectedCase({ email: e.target.value }))}
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Phone</label>
                                        <input
                                            style={styles.input}
                                            type="text"
                                            value={selectedCase.phone}
                                            onChange={(e) => dispatch(updateSelectedCase({ phone: e.target.value }))}
                                        />
                                    </div>

                                    {/* Plan */}
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Plan</label>
                                        <input
                                            style={styles.input}
                                            type="text"
                                            value={selectedCase.plan}
                                            onChange={(e) => dispatch(updateSelectedCase({ plan: e.target.value }))}
                                        />
                                    </div>

                                    {/* Case Created By - read only */}
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Created By</label>
                                        <input
                                            style={{ ...styles.input, background: "#f9fafb" }}
                                            type="text"
                                            value={selectedCase?.saleUser?.name || ""}
                                            disabled
                                        />
                                    </div>

                                    {/* Assigned To */}
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Assigned To</label>
                                        <input
                                            style={styles.input}
                                            type="text"
                                            value={selectedCase?.techUser?.name || ""}
                                            onChange={(e) => dispatch(updateSelectedCase({ assignedTo: e.target.value }))}
                                        />
                                    </div>

                                    {/* Amounts */}
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Sale Amount</label>
                                        <input
                                            style={styles.input}
                                            type="number"
                                            value={selectedCase?.saleAmount || 0}
                                            onChange={(e) => dispatch(updateSelectedCase({ saleAmount: e.target.value }))}
                                        />
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Deduction</label>
                                        <input
                                            style={styles.input}
                                            type="number"
                                            value={0}
                                            onChange={(e) => dispatch(updateSelectedCase({ deduction: e.target.value }))}
                                        />
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Net Amount</label>
                                        <input
                                            style={{ ...styles.input, background: "#f9fafb" }}
                                            type="number"
                                            value={selectedCase?.saleAmount || 0}
                                            disabled
                                        />
                                    </div>

                                    {/* Sale Status */}
                                    {/* <div style={styles.formGroup}>
                                        <label style={styles.label}>Sale Status</label>
                                        <select
                                            style={styles.input}
                                            value={selectedCase.saleStatus}
                                            onChange={(e) =>
                                                setSelectedCase({ ...selectedCase, saleStatus: e.target.value })
                                            }
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Failed">Failed</option>
                                        </select>
                                    </div> */}

                                    {/* Issue Status */}
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Issue Status</label>
                                        <select
                                            style={styles.input}
                                            value={selectedCase?.issueStatus || "Open"}
                                            onChange={(e) => dispatch(updateSelectedCase({ issueStatus: e.target.value }))}
                                        >
                                            <option value="Open">Open</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>

                                    {/* Issue / Notes */}
                                    <div style={{ gridColumn: "1 / span 2", ...styles.formGroup }}>
                                        <label style={styles.label}>Issue</label>
                                        <textarea
                                            style={styles.textarea}
                                            value={selectedCase.issue || ""}
                                            onChange={(e) => dispatch(updateSelectedCase({ issue: e.target.value }))}
                                        />
                                    </div>

                                    <div style={{ gridColumn: "1 / span 2", ...styles.formGroup }}>
                                        <label style={styles.label}>Note</label>
                                        <textarea
                                            style={styles.textarea}
                                            value={selectedCase.specialNotes || ""}
                                            onChange={(e) => dispatch(updateSelectedCase({specialNotes: e.target.value }))}
                                        />
                                    </div>

                                    {/* Date - read only */}
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Date</label>
                                        <input
                                            style={{ ...styles.input, background: "#f9fafb" }}
                                            type="text"
                                            value={formatDate(selectedCase.createdAt)}
                                            disabled
                                        />
                                    </div>
                                </form>
                            ) : null}

                            {/* Buttons */}
                            <div style={styles.buttonRow}>
                                <button
                                    style={styles.updateButton}
                                    onClick={() => updateCaseHandler(selectedCase.id, selectedCase)}
                                >
                                    Save Changes
                                </button>
                                <button style={styles.cancelButton} onClick={() => dispatch(setShowModal(false))}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>

            <style>{`
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr !important;
  }
}
`}</style>
        </div>
    );
};

export default SalesUserCases;