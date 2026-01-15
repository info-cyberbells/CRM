import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSaleUserCases,
  fetchCaseById,
  updateCase,
  setSearchFilters,
  setPageSize,
  setCurrentPage,
  setShowModal,
  updateSelectedCase,
} from "../../features/SearchSlice/searchSlice";
import { RefreshCw, User, AlertCircle } from "lucide-react";
import { useToast } from "../../ToastContext/ToastContext";
import {
  getTechUserAssignedCases,
  setTechCurrentPage,
  setTechPageSize,
  setTechSearchFilters,
  getSingleCaseById,
  setTechShowModal,
  updateCaseByTech,
  updateTechSelectedCase,
} from "../../features/TechUserSlice/TechUserSlice";
import {
  fetchAllCasesAdmin,
  setAdminSearchFilters,
  setAdminCurrentPage,
  setAdminShowModal,
  setAdminPageSize,
  adminViewCase,
  updateAdminSelectedCase,
  updateCaseDetailsByAdmin,
  searchTechUser,
} from "../../features/ADMIN/adminSlice";

const SalesUserCases = () => {
  const dispatch = useDispatch();
  const {
    cases: salesCases,
    selectedCase: salesSelectedCase,
    loading: salesLoading,
    modalLoading,
    error: salesError,
    showModal: saleShowModal,
    pagination: salesPagination,
    searchFilters: salesSearchFilters,
  } = useSelector((state) => state.salesCases);

  const {
    cases: techCases,
    selectedCase: techSelectedCase,
    pagination: techPagination,
    isLoading: techLoading,
    error: techError,
    showModal: techShowModal,
    searchFilters: techSearchFilters,
  } = useSelector((state) => state.techUser);

  const {
    cases: adminCases,
    pagination: adminPagination,
    isLoading: adminLoading,
    error: adminError,
    showModal: adminShowModal,
    searchFilters: adminSearchFilters,
    selectedCase: adminSelectedCase,
    searchLoading,
    searchTechusers,
  } = useSelector((state) => state.admin);

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const role = localStorage.getItem("Role")?.toLowerCase() || "Admin";
  const isTech = role === "tech";
  const isSale = role === "sale";
  const isAdmin = role === "admin";

  const { showToast } = useToast();

  const debounceRef = useRef();
  const isInitialMount = useRef(true);

  const [techSearch, setTechSearch] = useState("");
  const [showTechDropdown, setShowTechDropDown] = useState(false);

  const operatingSystems = [
    "Windows 10",
    "Windows 11",
    "macOS",
    "Linux Ubuntu",
    "Linux Mint",
  ];
  const securitySoftwareOptions = [
    "Norton",
    "McAfee",
    "Kaspersky",
    "Bitdefender",
    "Avast",
  ];
  const planOptions = ["Basic", "Premium", "Enterprise"];

  const cases =
    role === "tech" ? techCases : role === "admin" ? adminCases : salesCases;
  const pagination =
    role === "tech"
      ? techPagination
      : role === "admin"
      ? adminPagination
      : salesPagination;

  const loading =
    role === "tech"
      ? techLoading
      : role === "admin"
      ? adminLoading
      : salesLoading;

  const error =
    role === "tech" ? techError : role === "admin" ? adminError : salesError;

  const searchFilters =
    role === "tech"
      ? techSearchFilters
      : role === "admin"
      ? adminSearchFilters
      : salesSearchFilters;

  const selectedCase =
    role === "tech"
      ? techSelectedCase
      : role === "admin"
      ? adminSelectedCase
      : salesSelectedCase;

  const showModal =
    role === "tech"
      ? techShowModal
      : role === "admin"
      ? adminShowModal
      : saleShowModal;

  const { currentPage, pageSize, totalPages, totalCount } = pagination;

  const fetchCases = ({ page, limit, filters }) => {
    if (role === "admin") {
      dispatch(fetchAllCasesAdmin({ page, limit, filters }));
    }
    if (role === "tech") {
      dispatch(getTechUserAssignedCases({ page, limit, filters }));
    }
    if (role === "sale") {
      dispatch(fetchSaleUserCases({ page, limit, filters }));
    }
  };

  useEffect(() => {
    if (!selectedCase || !selectedCase.planDuration) return;

    const currentDate = new Date();
    let validityDate;

    if (selectedCase.planDuration === "Lifetime") {
      validityDate = "Lifetime";
    } else {
      const years = parseInt(selectedCase.planDuration, 10);

      const expiryDate = new Date(
        currentDate.getFullYear() + years,
        currentDate.getMonth(),
        currentDate.getDate()
      );

      validityDate = expiryDate.toISOString().split("T")[0];
    }

    handleModalFieldChange("validity", validityDate);
  }, [selectedCase?.planDuration]);

  useEffect(() => {
    if (techSearch.length < 2) {
      setShowTechDropDown(false);
      return;
    }

    const timer = setTimeout(() => {
      dispatch(searchTechUser(techSearch));
      setShowTechDropDown(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [techSearch]);

  const handleRefresh = () => {
    const emptyFilters = {
      customerName: "",
      phone: "",
      customerID: "",
      email: "",
    };

    if (isTech) dispatch(setTechSearchFilters(emptyFilters));
    else if (isAdmin) dispatch(setAdminSearchFilters(emptyFilters));
    else dispatch(setSearchFilters(emptyFilters));

    // dispatch(isTech ? setTechCurrentPage(1) : setCurrentPage(1));

    if (isTech) {
      dispatch(setTechCurrentPage(1));
    }
    if (isAdmin) {
      dispatch(setAdminCurrentPage(1));
    }
    if (isSale) {
      dispatch(setCurrentPage(1));
    }

    fetchCases({
      page: 1,
      limit: pageSize,
      filters: emptyFilters,
    });
  };

  useEffect(() => {
    const emptyFilters = {
      customerName: "",
      phone: "",
      customerID: "",
      email: "",
    };

    if (isTech) dispatch(setTechSearchFilters(emptyFilters));
    else if (isAdmin) dispatch(setAdminSearchFilters(emptyFilters));
    else dispatch(setSearchFilters(emptyFilters));

    if (isTech) {
      dispatch(setTechCurrentPage(1));
    }
    if (isAdmin) {
      dispatch(setAdminCurrentPage(1));
    }
    if (isSale) {
      dispatch(setCurrentPage(1));
    }

    // Fetch once on mount
    // fetchCases({
    //   page: 1,
    //   limit: pageSize,
    //   filters: emptyFilters,
    // });

    return () => {
      if (isTech) {
        dispatch(setTechSearchFilters(emptyFilters));
        dispatch(setTechCurrentPage(1));
      } else if (isAdmin) {
        dispatch(setAdminSearchFilters(emptyFilters));
        dispatch(setAdminCurrentPage(1));
      } else if (isSale) {
        dispatch(setSearchFilters(emptyFilters));
        dispatch(setCurrentPage(1));
      }
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Skip fetch on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchCases({
        page: 1,
        limit: pageSize,
        filters: searchFilters,
      });
    }, 1000);

    return () => clearTimeout(debounceRef.current);
  }, [searchFilters]); // Remove pageSize from here

  const handleFilterChange = (field, value) => {
    if (isTech) dispatch(setTechSearchFilters({ [field]: value }));
    else if (isAdmin) dispatch(setAdminSearchFilters({ [field]: value }));
    else dispatch(setSearchFilters({ [field]: value }));
  };

  const handlePageSizeChange = (newPageSize) => {
    if (isTech) {
      dispatch(setTechPageSize(newPageSize));
      dispatch(setTechCurrentPage(1));
    } else if (isAdmin) {
      dispatch(setAdminPageSize(newPageSize));
      dispatch(setAdminCurrentPage(1));
    } else {
      dispatch(setPageSize(newPageSize));
      dispatch(setCurrentPage(1));
    }

    // Fetch with new page size and reset to page 1
    fetchCases({
      page: 1,
      limit: newPageSize,
      filters: searchFilters,
    });
  };

  const handlePageChange = (newPage) => {
    if (isTech) dispatch(setTechCurrentPage(newPage));
    else if (isAdmin) dispatch(setAdminCurrentPage(newPage));
    else dispatch(setCurrentPage(newPage));
    fetchCases({
      page: newPage,
      limit: pageSize,
      filters: searchFilters,
    });
  };

  const fetchCaseDetails = (caseId) => {
    if (isTech) {
      dispatch(getSingleCaseById(caseId));
    } else if (isAdmin) {
      dispatch(adminViewCase(caseId));
    } else {
      dispatch(fetchCaseById(caseId));
    }

    dispatch(setShowModal(true));
  };

  const handleModalFieldChange = (field, value) => {
    if (isTech) {
      dispatch(updateTechSelectedCase({ [field]: value }));
    } else if (isAdmin) {
      dispatch(updateAdminSelectedCase({ [field]: value }));
    } else {
      dispatch(updateSelectedCase({ [field]: value }));
    }
  };

  const updateCaseHandler = async (caseId, updatedData) => {
    try {
      if (isTech) {
        await dispatch(
          updateCaseByTech({ caseId, caseData: updatedData })
        ).unwrap();
      } else if (isAdmin) {
        await dispatch(
          updateCaseDetailsByAdmin({ caseId, caseData: updatedData })
        ).unwrap();
      } else {
        await dispatch(updateCase({ caseId, caseData: updatedData })).unwrap();
      }

      showToast("Updated Successfully", "success");

      // refresh list after update
      fetchCases({
        page: currentPage,
        limit: pageSize,
        filters: searchFilters,
      });
    } catch (error) {
      console.error("Update failed:", error);
      showToast("Failed to update", "error");
    }
  };

  const closeModal = () => {
    if (isTech) {
      dispatch(setTechShowModal(false));
    } else if (isAdmin) {
      dispatch(setAdminShowModal(false));
      setShowTechDropDown(false);
      setTechSearch("");
    } else {
      dispatch(setShowModal(false));
    }
  };

  const hasSearchFilters = () => {
    return (
      searchFilters.customerName.trim() !== "" ||
      searchFilters.phone.trim() !== "" ||
      searchFilters.customerID.trim() !== "" ||
      searchFilters.email.trim() !== ""
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get status color
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "closed":
        return { backgroundColor: "#dcfce7", color: "#166534" };
      case "open":
        return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "in progress":
        return { backgroundColor: "#fef3c7", color: "#92400e" };
      case "pending":
        return { backgroundColor: "#fed7aa", color: "#c2410c" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)",
      paddingTop: "100px",
      paddingLeft: "20px",
      paddingRight: "20px",
      paddingBottom: "20px",
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    maxWidth: {
      maxWidth: "1400px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "32px",
    },
    headerTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "16px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#111827",
      margin: "0 0 8px 0",
    },
    subtitle: {
      color: "#6b7280",
      margin: 0,
    },
    refreshButton: {
      display: "flex",
      alignItems: "center",
      padding: "12px 20px",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "background-color 0.2s",
    },
    refreshButtonHover: {
      backgroundColor: "#1d4ed8",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      padding: "24px",
      marginBottom: "24px",
    },
    loadingContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px",
    },
    errorContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#dc2626",
      padding: "48px",
    },

    filterContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      padding: "32px",
      marginBottom: "24px",
      border: "1px solid #e5e7eb",
      maxWidth: "1100px",
      margin: "0 auto 24px auto",
      padding: "20px",
    },

    filterGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "24px",
      marginBottom: "20px",
    },

    filterGridSecond: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "16px",
      marginBottom: "24px",
      maxWidth: "400px",
      marginBottom: "24px",
    },

    filterField: {
      display: "flex",
      flexDirection: "column",
    },

    filterLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "8px",
    },

    filterInput: {
      padding: "12px 16px",
      border: "2px solid #e5e7eb",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "all 0.3s ease",
      outline: "none",
      width: "300px",
      backgroundColor: "#f9fafb",
      fontFamily: "inherit",
    },

    searchButtonContainer: {
      display: "flex",
      justifyContent: "center",
    },

    searchButton: {
      padding: "12px 32px",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
      minWidth: "140px",
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
      background: "#2563EB",
      color: "#fff",
      padding: "12px 20px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    },
    cancelButton: {
      background: "#F3F4F6",
      color: "#99a1b9ff",
      padding: "12px 20px",
      border: "1px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    },

    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: "#37506aff",
      color: "white",
      borderBottom: "1px solid #e5e7eb",
    },
    th: {
      textAlign: "left",
      padding: "16px 12px",
      fontWeight: "600",
      color: "white",
      whiteSpace: "nowrap",
      fontSize: "16px",
      border: "1px solid #34495e",
    },

    td: {
      padding: "12px 10px",
      verticalAlign: "top",
      fontSize: "14px",
      border: "1px solid #e5e7eb",
      maxWidth: "120px",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    tbody: {
      backgroundColor: "white",
    },
    tr: {
      borderBottom: "1px solid #f3f4f6",
      transition: "background-color 0.2s",
    },
    trHover: {
      backgroundColor: "#f9fafb",
    },
    customerName: {
      fontWeight: "600",
      color: "#111827",
      margin: "0 0 4px 0",
    },
    customerDetails: {
      fontSize: "12px",
      color: "#6b7280",
      margin: "2px 0",
    },
    contactItem: {
      display: "flex",
      alignItems: "center",
      fontSize: "12px",
      color: "#6b7280",
      margin: "4px 0",
    },
    statusBadge: {
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "500",
      textTransform: "capitalize",
    },
    planDetails: {
      fontSize: "12px",
      color: "#6b7280",
      margin: "4px 0",
    },
    amount: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#059669",
    },
  };

  // if (loading) {
  //     return (
  //         <div style={styles.container}>
  //             <div style={styles.maxWidth}>
  //                 <div style={styles.card}>
  //                     <div style={styles.loadingContainer}>
  //                         <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginRight: '12px', color: '#2563eb' }} />
  //                         <span style={{ fontSize: '18px', color: '#6b7280' }}>Loading cases...</span>
  //                     </div>
  //                 </div>
  //             </div>
  //         </div>
  //     );
  // }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.card}>
            <div style={styles.errorContainer}>
              <AlertCircle size={32} style={{ marginRight: "12px" }} />
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    margin: "0 0 8px 0",
                  }}
                >
                  Error Loading Cases
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: "0 0 16px 0",
                  }}
                >
                  {error}
                </p>
                <button
                  onClick={() =>
                    fetchCases({
                      page: currentPage,
                      limit: pageSize,
                      filters: searchFilters,
                    })
                  }
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
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <div></div>
            <button
              // onClick={() => fetchCases()}
              onClick={handleRefresh}
              style={styles.refreshButton}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              <RefreshCw size={16} style={{ marginRight: "8px" }} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div style={styles.filterContainer}>
          <div style={styles.filterGrid} className="filter-grid">
            <div style={styles.filterField}>
              <label style={styles.filterLabel}>Customer Name</label>
              <input
                type="text"
                placeholder="Enter customer name"
                style={styles.filterInput}
                value={searchFilters.customerName}
                onChange={(e) =>
                  handleFilterChange("customerName", e.target.value)
                }
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563eb";
                  e.target.style.backgroundColor = "white";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.backgroundColor = "#f9fafb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div style={styles.filterField}>
              <label style={styles.filterLabel}>Phone Number</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={searchFilters.phone}
                onChange={(e) => handleFilterChange("phone", e.target.value)}
                style={styles.filterInput}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563eb";
                  e.target.style.backgroundColor = "white";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.backgroundColor = "#f9fafb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div style={styles.filterField}>
              <label style={styles.filterLabel}>Customer ID</label>
              <input
                type="text"
                placeholder="Enter customer ID"
                style={styles.filterInput}
                value={searchFilters.customerID}
                onChange={(e) =>
                  handleFilterChange("customerID", e.target.value)
                }
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563eb";
                  e.target.style.backgroundColor = "white";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.backgroundColor = "#f9fafb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          <div style={styles.filterGridSecond}>
            <div style={styles.filterField}>
              <label style={styles.filterLabel}>Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                style={styles.filterInput}
                value={searchFilters.email}
                onChange={(e) => handleFilterChange("email", e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563eb";
                  e.target.style.backgroundColor = "white";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.backgroundColor = "#f9fafb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* <div style={styles.searchButtonContainer}>
                        <button
                            style={{
                                ...styles.searchButton,
                                backgroundColor: hasSearchFilters() ? '#2563eb' : '#9ca3af',
                                cursor: hasSearchFilters() ? 'pointer' : 'not-allowed',
                                opacity: hasSearchFilters() ? 1 : 0.6
                            }}
                            onClick={hasSearchFilters() ? handleSearch : undefined}
                            disabled={!hasSearchFilters()}
                            onMouseOver={(e) => {
                                if (hasSearchFilters()) {
                                    e.target.style.backgroundColor = '#1d4ed8';
                                    e.target.style.transform = 'translateY(-1px)';
                                    e.target.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.4)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (hasSearchFilters()) {
                                    e.target.style.backgroundColor = '#2563eb';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.3)';
                                }
                            }}
                        >
                            Search
                        </button>
                    </div> */}
        </div>

        {/* Cases Table */}
        <div style={styles.tableContainer}>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>Case ID</th>
                  <th style={styles.th}>Customer Name</th>
                  <th style={styles.th}>Plan</th>
                  <th style={styles.th}>Created By</th>
                  {role == "sale" && <th style={styles.th}>Assigned To</th>}
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Deduction</th>
                  <th style={styles.th}>Net Amount</th>
                  <th style={styles.th}>Sale Amount</th>
                  <th style={styles.th}>Sale Status</th>
                  <th style={styles.th}>Case Status</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody style={styles.tbody}>
                {loading ? (
                  <tr>
                    <td
                      colSpan="13"
                      style={{ textAlign: "center", padding: "30px" }}
                    >
                      <div style={styles.loadingContainer}>
                        <RefreshCw
                          size={32}
                          style={{
                            animation: "spin 1s linear infinite",
                            marginRight: "12px",
                            color: "#2563eb",
                          }}
                        />
                        <span style={{ fontSize: "18px", color: "#6b7280" }}>
                          Loading cases...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  cases.map((caseItem) => (
                    <tr
                      key={caseItem.caseId || caseItem.id || index}
                      style={styles.tr}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                    >
                      <td style={styles.td}>{caseItem.caseId}</td>
                      <td style={styles.td}>{caseItem.customerName}</td>
                      <td style={styles.td}>{caseItem.plan}</td>
                      <td style={styles.td}>
                        {caseItem.caseCreatedBy || "Unknown"}
                      </td>
                      {role == "sale" && (
                        <td style={styles.td}>
                          {caseItem.assignedTo || "Not assigned"}
                        </td>
                      )}
                      <td style={styles.td}>
                        {formatCurrency(caseItem.saleAmount)}
                      </td>
                      <td style={styles.td}>
                        {formatCurrency(caseItem.deduction)}
                      </td>
                      <td style={styles.td}>
                        {formatCurrency(caseItem.netAmount)}
                      </td>
                      <td style={styles.td}>
                        {formatCurrency(caseItem.saleAmount)}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...getStatusStyle("completed"),
                          }}
                        >
                          {caseItem.saleStatus}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...getStatusStyle(caseItem.status),
                          }}
                        >
                          {caseItem.issueStatus}
                        </span>
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          whiteSpace: "nowrap",
                          width: "90px",
                        }}
                      >
                        {formatDate(caseItem.date)}
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          width: "70px",
                          textAlign: "center",
                        }}
                      >
                        <button
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            console.log("Case item:", caseItem);
                            fetchCaseDetails(caseItem.caseId);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {cases.length === 0 && !loading && !error && (
          <div style={styles.card}>
            <div
              style={{ textAlign: "center", color: "#6b7280", padding: "48px" }}
            >
              <User size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
              <p style={{ fontSize: "18px", margin: 0 }}>No cases found</p>
            </div>
          </div>
        )}

        {/* Add this after the table container and before the "No cases found" section */}
        {cases.length > 0 && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {/* Page size selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                entries
              </span>
            </div>

            {/* Pagination info */}
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
              entries
            </div>

            {/* Pagination controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                style={{
                  padding: "8px 12px",
                  backgroundColor: currentPage <= 1 ? "#f3f4f6" : "#2563eb",
                  color: currentPage <= 1 ? "#6b7280" : "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                Previous
              </button>

              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                style={{
                  padding: "8px 12px",
                  backgroundColor:
                    currentPage >= totalPages ? "#f3f4f6" : "#2563eb",
                  color: currentPage >= totalPages ? "#6b7280" : "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div
            style={styles.modalOverlay}
            // onClick={() => dispatch(setShowModal(false))}
            onClick={closeModal}
          >
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={styles.closeButton}
                // onClick={() => dispatch(setShowModal(false))}
                onClick={closeModal}
              >
                ×
              </button>
              <h2
                style={{ marginTop: 0, textAlign: "center", color: "#111827" }}
              >
                Case Details
              </h2>

              {modalLoading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  Loading...
                </div>
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
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Customer ID</label>
                    <input
                      style={{ ...styles.input, background: "#f9fafb" }}
                      type="text"
                      value={selectedCase.customerID}
                      disabled
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

                  {!isTech && (
                    <div style={{ ...styles.formGroup, position: "relative" }}>
                      <label style={styles.label}>Assigned To</label>

                      <input
                        style={styles.input}
                        type="text"
                        value={techSearch || selectedCase?.techUser?.name || ""}
                        disabled={isSale}
                        onChange={(e) => {
                          setTechSearch(e.target.value);
                          handleModalFieldChange("techUserId", null);
                        }}
                        placeholder={
                          isAdmin ? "Search Tech User" : "Not assigned yet"
                        }
                        autoComplete="off"
                      />

                      {showTechDropdown && techSearch.length >= 2 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            background: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            zIndex: 50,
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                        >
                          {searchLoading ? (
                            <div style={{ padding: "8px" }}>Loading...</div>
                          ) : searchTechusers.length === 0 ? (
                            <div style={{ padding: "8px", color: "#666" }}>
                              No tech user found with this keyword
                            </div>
                          ) : (
                            searchTechusers.map((user) => (
                              <div
                                key={user.id}
                                style={{ padding: "8px", cursor: "pointer" }}
                                onClick={() => {
                                  handleModalFieldChange("techUserId", user.id); // send ID only
                                  setTechSearch(user.name); // show name
                                  setShowTechDropDown(false);
                                }}
                              >
                                <strong>{user.name}</strong>
                                <div
                                  style={{ fontSize: "12px", color: "#666" }}
                                >
                                  {user.email}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Customer Name */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Customer Name</label>
                    <input
                      style={styles.input}
                      type="text"
                      value={selectedCase.customerName}
                      onChange={(e) =>
                        handleModalFieldChange("customerName", e.target.value)
                      }
                    />
                  </div>

                  {/* Email */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                      style={styles.input}
                      type="email"
                      value={selectedCase.email}
                      onChange={(e) =>
                        handleModalFieldChange("email", e.target.value)
                      }
                    />
                  </div>

                  {/* Phone */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone</label>
                    <input
                      style={styles.input}
                      type="text"
                      value={selectedCase.phone}
                      onChange={(e) =>
                        handleModalFieldChange("phone", e.target.value)
                      }
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Alt Phone</label>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Not Provided"
                      value={selectedCase.altphone}
                      onChange={(e) =>
                        handleModalFieldChange("altphone", e.target.value)
                      }
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Address</label>
                    <input
                      style={styles.input}
                      type="text"
                      value={selectedCase.address}
                      onChange={(e) =>
                        handleModalFieldChange("address", e.target.value)
                      }
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>City</label>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Not Provided"
                      value={selectedCase.city}
                      onChange={(e) =>
                        handleModalFieldChange("city", e.target.value)
                      }
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>State</label>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Not Provided"
                      value={selectedCase.state}
                      onChange={(e) =>
                        handleModalFieldChange("state", e.target.value)
                      }
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Country</label>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Not Provided"
                      value={selectedCase.country}
                      onChange={(e) =>
                        handleModalFieldChange("country", e.target.value)
                      }
                    />
                  </div>

                  

                  {/* Amounts */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Sale Amount</label>
                    <input
                      style={styles.input}
                      type="text"
                      value={selectedCase?.saleAmount || 0}
                      onChange={(e) =>
                        handleModalFieldChange("saleAmount", e.target.value)
                      }
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Deduction</label>
                    <input
                      style={styles.input}
                      type="text"
                      value={selectedCase?.deductions || 0}
                      onChange={(e) =>
                        handleModalFieldChange("deductions", e.target.value)
                      }
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Chargeback</label>
                    <input
                      style={styles.input}
                      type="text"
                      value={selectedCase?.chargeBack || 0}
                      onChange={(e) =>
                        handleModalFieldChange("chargeBack", e.target.value)
                      }
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Device Amount</label>
                    <input
                      style={styles.input}
                      type="text"
                      value={selectedCase?.deviceAmount || 0}
                      onChange={(e) =>
                        handleModalFieldChange("deviceAmount", e.target.value)
                      }
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

                  {/* Issue Status */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Case Status</label>
                    <select
                      style={styles.input}
                      value={selectedCase?.status || "Open"}
                      disabled={isSale}
                      // onChange={(e) =>
                      //   handleModalFieldChange( "status", e.target.value)
                      // }
                      onChange={(e) => {
                        setPendingStatus(e.target.value);
                        setShowConfirm(true);
                      }}
                    >
                      <option value="Open">Open</option>
                      <option value="Pending">Pending</option>
                      <option value="Closed">Closed</option>
                      {isAdmin && (
                        <>
                          <option value="Void">Void</option>
                          <option value="Refund">Refund</option>
                          <option value="Chargeback">Chargeback</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Remote ID</label>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Not Provided"
                      value={selectedCase.remoteID}
                      onChange={(e) =>
                        handleModalFieldChange("remoteID", e.target.value)
                      }
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Remote Pass</label>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Not Provided"
                      value={selectedCase.remotePass}
                      onChange={(e) =>
                        handleModalFieldChange("remotePass", e.target.value)
                      }
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Operating System</label>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Not Provided"
                      value={selectedCase.operatingSystem}
                      onChange={(e) =>
                        handleModalFieldChange(
                          "operatingSystem",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Computer Pass</label>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Not Provided"
                      value={selectedCase.computerPass}
                      onChange={(e) =>
                        handleModalFieldChange("computerPass", e.target.value)
                      }
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Model No</label>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Not Provided"
                      value={selectedCase.modelNo}
                      onChange={(e) =>
                        handleModalFieldChange("modelNo", e.target.value)
                      }
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Security Software</label>
                    <select
                      style={styles.input}
                      value={selectedCase.securitySoftware}
                      onChange={(e) =>
                        handleModalFieldChange(
                          "securitySoftware",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Security Software</option>
                      {securitySoftwareOptions.map((software) => (
                        <option key={software} value={software}>
                          {software}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Plan */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Plan Name</label>
                    <select
                      style={styles.input}
                      value={selectedCase.plan}
                      onChange={(e) =>
                        handleModalFieldChange("plan", e.target.value)
                      }
                    >
                      <option value="">Select Plan</option>
                      {planOptions.map((plan) => (
                        <option key={plan} value={plan}>
                          {plan}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Plan Duration </label>
                    <select
                      style={styles.input}
                      value={selectedCase.planDuration}
                      onChange={(e) =>
                        handleModalFieldChange("planDuration", e.target.value)
                      }
                    >
                      <option value="">Select Duration</option>
                      {[...Array(10)].map((_, i) => (
                        <option
                          key={i + 1}
                          value={`${i + 1} Year${i > 0 ? "s" : ""}`}
                        >
                          {i + 1} Year{i > 0 ? "s" : ""}
                        </option>
                      ))}
                      <option value="Lifetime">Lifetime</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Validity</label>
                    <input
                      style={{
                        ...styles.input,
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                      type="text"
                      value={selectedCase.validity}
                      disabled
                    />
                  </div>

                  {/* Issue / Notes */}
                  <div
                    style={{ gridColumn: "1 / span 2", ...styles.formGroup }}
                  >
                    <label style={styles.label}>Issue </label>
                    <textarea
                      style={styles.textarea}
                      value={selectedCase.issue || ""}
                      onChange={(e) =>
                        handleModalFieldChange("issue", e.target.value)
                      }
                    />
                  </div>
                  <div
                    style={{ gridColumn: "1 / span 2", ...styles.formGroup }}
                  >
                    <label style={styles.label}>Notes</label>
                    <textarea
                      style={styles.textarea}
                      value={selectedCase.specialNotes || ""}
                      onChange={(e) =>
                        handleModalFieldChange("specialNotes", e.target.value)
                      }
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
                  onClick={() =>
                    updateCaseHandler(selectedCase.id, selectedCase)
                  }
                >
                  Save Changes
                </button>
                <button
                  style={styles.cancelButton}
                  // onClick={() => dispatch(setShowModal(false))}
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirm && (
          <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Status Change
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Once you change the case status, this action cannot be undone.
                <br />
                Are you sure you want to continue?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setPendingStatus(null);
                  }}
                  className="px-4 py-2 cursor-pointer bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    if (pendingStatus) {
                      handleModalFieldChange("status", pendingStatus);
                    }
                    setShowConfirm(false);
                    setPendingStatus(null);
                    showToast(
                      "Click save button to complete the process.",
                      "info"
                    );
                  }}
                  className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Yes
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
