import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserThunk } from '../../../features/UserSlice/UserSlice';
import cyberHub_Logo from '../../../assets/images/cyberhub_Logo.png'

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector(state => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateCaseDropdownOpen, setIsCreateCaseDropdownOpen] = useState(false);
  const [isMobileCreateCaseDropdownOpen, setIsMobileCreateCaseDropdownOpen] = useState(false);

  const userRole = localStorage.getItem("Role").toLowerCase();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUserThunk()).then(() => {
      navigate('/');
    });
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoContainer} onClick={() => navigate('/dashboard')}>
          <img
            src={cyberHub_Logo}
            alt="CyberHub Logo"
            style={styles.logoImage}
          />
        </div>

        {/* Desktop Navigation */}
        {userRole == "sale" && 
        <ul style={styles.navLinks}>
          <li style={styles.navItem}>
            <Link to="/dashboard" style={styles.navLink}>
              <HomeIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Home</div>
            </Link>
          </li>
          <li
            style={styles.navItem}
            onMouseEnter={() => setIsCreateCaseDropdownOpen(true)}
            onMouseLeave={() => setIsCreateCaseDropdownOpen(false)}
          >
            <div style={styles.navLink}>
              <AssignmentIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Create Case
                <span style={{ fontSize: '12px', transform: isCreateCaseDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.6s ease', display: 'inline-block' }}>▼</span>
              </div>
            </div>
            {isCreateCaseDropdownOpen && (
              <div
                style={styles.dropdown}
                onMouseEnter={() => setIsCreateCaseDropdownOpen(true)}
                onMouseLeave={() => setIsCreateCaseDropdownOpen(false)}
              >
                <Link to="/create-case/DIG" style={styles.dropdownItem} onClick={() => setIsCreateCaseDropdownOpen(false)} >DIG</Link>
                <Link to="/create-case/CBH" style={styles.dropdownItem} onClick={() => setIsCreateCaseDropdownOpen(false)} >CBH</Link>
                <Link to="/create-case/TD" style={styles.dropdownItem} onClick={() => setIsCreateCaseDropdownOpen(false)} >TD</Link>
                <Link to="/create-case/PWS" style={styles.dropdownItem} onClick={() => setIsCreateCaseDropdownOpen(false)} >PWS</Link>
                <Link to="/create-case/no-sale" style={styles.dropdownItem} onClick={() => setIsCreateCaseDropdownOpen(false)} >No Sale</Link>
              </div>
            )}
          </li>
          <li style={styles.navItem}>
            <Link to="/search" style={styles.navLink}>
              <SearchIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Search</div>
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/notes" style={styles.navLink}>
              <NoteAltIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Notes</div>
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/chat" style={styles.navLink}>
              <ChatIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Chat</div>
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/notifications" style={styles.navLink}>
              <NotificationsIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Notifications</div>
            </Link>
          </li>
        </ul>
          }

           {userRole == "tech" && <ul style={styles.navLinks}>
          <li style={styles.navItem}>
            <Link to="/dashboard" style={styles.navLink}>
              <HomeIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Home</div>
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/search" style={styles.navLink}>
              <SearchIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Search My Cases</div>
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to='/update-status' style={styles.navLink}>
                <AssignmentIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
                <div>Update My Case</div>
            </Link>
          </li>
            <li style={styles.navItem}>
            <Link to="/chat" style={styles.navLink}>
              <ChatIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Chat</div>
            </Link>
          </li>
         
           <li style={styles.navItem}>
            <Link to="/notifications" style={styles.navLink}>
              <NotificationsIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Notifications</div>
            </Link>
          </li>
          </ul>}

          {userRole == "admin" && <ul style={styles.navLinks}>
          <li style={styles.navItem}>
            <Link to="/dashboard" style={styles.navLink}>
              <HomeIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Home</div>
            </Link>
          </li>
          {/* <li style={styles.navItem}>
            <Link to='/update-status' style={styles.navLink}>
                <AssignmentIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
                <div>Manage Cases</div>
            </Link>
          </li> */}
          <li style={styles.navItem}>
            <Link to="/search" style={styles.navLink}>
              <SearchIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Search My Cases</div>
            </Link>
          </li>

           <li style={styles.navItem}>
            <Link to='/notices' style={styles.navLink}>
                <AssignmentIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
                <div>Manage Notice</div>
            </Link>
          </li>
          
            <li style={styles.navItem}>
            <Link to="/chat" style={styles.navLink}>
              <ChatIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Chat</div>
            </Link>
          </li>
         
           <li style={styles.navItem}>
            <Link to="/notifications" style={styles.navLink}>
              <NotificationsIcon style={{ display: "block", margin: "0 auto", fontSize: "28px" }} />
              <div>Notifications</div>
            </Link>
          </li>
          </ul>}

        {/* Login Button & Mobile Menu Button */}
        <div style={styles.rightSection}>

          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={styles.loadingSpinner}>⟳</span>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ExitToAppIcon style={styles.logoutIcon} />
                <span style={styles.logoutText}>Logout</span>
              </div>
            )}
          </button>

          <button
            style={styles.mobileMenuBtn}
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div>
          {userRole == "sale" &&
        <div style={styles.mobileMenu}>
          <Link to="/dashboard" style={styles.mobileNavLink}>
            <HomeIcon style={styles.mobileNavIcon} />
            <span>Home</span>
          </Link>
          <div>
            <div
              style={{ ...styles.mobileNavLink, cursor: 'pointer' }}
              onClick={() => setIsMobileCreateCaseDropdownOpen(!isMobileCreateCaseDropdownOpen)}
            >
              <AssignmentIcon style={styles.mobileNavIcon} />
              <span>Create Case</span>
              <span style={{
                fontSize: '14px',
                marginLeft: 'auto',
                transform: isMobileCreateCaseDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.6s ease',
                display: 'inline-block'
              }}>▼</span>
            </div>

            {isMobileCreateCaseDropdownOpen && (
              <div style={styles.mobileDropdown}>
                <Link to="/create-case/DIG" style={styles.mobileDropdownItem} onClick={() => setIsMobileCreateCaseDropdownOpen(false)} >DIG</Link>
                <Link to="/create-case/CBH" style={styles.mobileDropdownItem} onClick={() => setIsMobileCreateCaseDropdownOpen(false)} >CBH</Link>
                <Link to="/create-case/TD" style={styles.mobileDropdownItem} onClick={() => setIsMobileCreateCaseDropdownOpen(false)} >TD</Link>
                <Link to="/create-case/PWS" style={styles.mobileDropdownItem} onClick={() => setIsMobileCreateCaseDropdownOpen(false)} >PWS</Link>
                <Link to="/create-case/no-sale" style={styles.mobileDropdownItem} onClick={() => setIsMobileCreateCaseDropdownOpen(false)} >No Sale</Link>
              </div>
            )}
          </div>
          <Link to="/search" style={styles.mobileNavLink}>
            <SearchIcon style={styles.mobileNavIcon} />
            <span>Search</span>
          </Link>
          <Link to="/notes" style={styles.mobileNavLink}>
            <NoteAltIcon style={styles.mobileNavIcon} />
            <span>Notes</span>
          </Link>
          <Link to="/chat" style={styles.mobileNavLink}>
            <ChatIcon style={styles.mobileNavIcon} />
            <span>Chat</span>
          </Link>
          <Link to="/notifications" style={styles.mobileNavLink}>
            <NotificationsIcon style={styles.mobileNavIcon} />
            <span>Notifications</span>
          </Link>
          </div>}

          {userRole == "tech" && <div style={styles.mobileMenu}>
          <Link to="/dashboard" style={styles.mobileNavLink}>
            <HomeIcon style={styles.mobileNavIcon} />
            <span>Home</span>
          </Link>
          {/* <Link to="/my-cases" style={styles.mobileNavLink}>
            <AssignmentIcon style={styles.mobileNavIcon} />
            <span>My Cases</span>
          </Link> */}
          
          <Link to="/search" style={styles.mobileNavLink}>
            <SearchIcon style={styles.mobileNavIcon} />
            <span>Search My Cases</span>
          </Link>
           <Link to="/update-status" style={styles.mobileNavLink}>
            <AssignmentIcon style={styles.mobileNavIcon} />
            <span>Update My Cases</span>
          </Link>
            <Link to="/chat" style={styles.mobileNavLink}>
            <ChatIcon style={styles.mobileNavIcon} />
            <span>Chat</span>
          </Link>
          {/* <Link to="/notes" style={styles.mobileNavLink}>
            <NoteAltIcon style={styles.mobileNavIcon} />
            <span>Notes</span>
          </Link> */}
          
          <Link to="/notifications" style={styles.mobileNavLink}>
            <NotificationsIcon style={styles.mobileNavIcon} />
            <span>Notifications</span>
          </Link>
          </div>}

          <button
            style={styles.mobileLogoutBtn}
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={styles.loadingSpinner}>⟳</span>
            ) : (
              <>
                <ExitToAppIcon style={styles.logoutIcon} />
                <span style={styles.logoutText}>Logout</span>
              </>
            )}
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2c3e50',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    minHeight: '70px',
  },
  logoContainer: {
    flex: "0 0 auto",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  logoImage: {
    height: "85px",
    width: "auto",
    objectFit: "contain",
  },
  navLinks: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '100px',
    flex: '1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItem: {
    margin: 0,
    position: 'relative',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    position: 'relative',
    display: 'block',
    letterSpacing: '0.3px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textTransform: 'capitalize',
    cursor: 'pointer',
  },
  logoutBtn: {
    display: 'flex',
    flexDirection: "column",
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(45deg, #34495e, #2c3e50)',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  logoutIcon: {
    fontSize: '20px',
  },
  logoutText: {
    fontSize: '16px',
    fontWeight: '600',
  },
  loadingSpinner: {
    animation: 'spin 1s linear infinite',
    fontSize: '18px',
  },

  mobileLogoutBtn: {
    background: 'linear-gradient(45deg, #34495e, #2c3e50)',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '18px 24px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    marginTop: '16px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: '0 0 auto',
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    width: '48px',
    height: '48px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileNavIcon: {
    fontSize: '20px',
    marginRight: '12px',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#2c3e50',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '24px',
    gap: '8px',
  },
  mobileNavLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '500',
    padding: '16px 24px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    letterSpacing: '0.3px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textTransform: 'capitalize',
    display: 'flex',
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(90% + 5px)',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#34495e',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minWidth: '200px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '8px 0',
    zIndex: 1001,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-5px',
      left: '0',
      right: '0',
      height: '5px',
    }
  },
  dropdownItem: {
    display: 'block',
    padding: '12px 20px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '400',
    transition: 'all 0.2s ease',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  mobileDropdown: {
    backgroundColor: '#34495e',
    marginLeft: '40px',
    borderRadius: '6px',
    marginTop: '8px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  mobileDropdownItem: {
    display: 'block',
    padding: '14px 20px',
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '400',
    transition: 'all 0.2s ease',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
};

// Add hover effects and responsive styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `

@media (min-width: 769px) {
    nav ul li a {
      position: relative;
      overflow: hidden;
    }
    
    nav ul li a:hover {
      color: #ecf0f1 !important;
      transform: translateY(-3px);
      text-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
    }
    
    nav ul li a::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
      transition: left 0.5s ease;
    }
    
    nav ul li a:hover::before {
      left: 100%;
    }
    
    nav ul li a::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: linear-gradient(45deg, #f39c12, #e67e22);
      border-radius: 2px;
      transition: width 0.4s ease;
    }
    
    nav ul li a:hover::after {
      width: 80%;
    }
      nav .dropdown a:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  padding-left: 24px !important;
}

nav .dropdown a:last-child {
  border-bottom: none !important;
}
  nav a[href], nav a {
  color: inherit;
  text-decoration: none;
}
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    /* Hide desktop nav links on mobile */
    nav ul {
      display: none !important;
    }
       nav > div:first-child > div:last-child > button:first-child {
    display: none !important;
  }
    
    /* Show mobile menu button */
    nav button {
      display: flex !important;
    }
    
    /* Mobile container adjustments */
    nav > div:first-child {
      padding: 0 20px !important;
      height: 80px !important;
      min-height: 80px !important;
    }
    
    /* Mobile logo adjustments */
    nav img {
      height: 70px !important;
    }
    
    /* Mobile menu button hover */
    nav button:hover {
      background: rgba(255, 255, 255, 0.2) !important;
      transform: scale(1.05);
      border-color: rgba(255, 255, 255, 0.3) !important;
    }
    
    /* Mobile nav link hover */
    nav > div:last-child a:hover {
      background: rgba(255, 255, 255, 0.15) !important;
      transform: translateX(8px);
      border-left: 4px solid rgba(255, 255, 255, 0.4);
    }
       .mobile-dropdown-item:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    padding-left: 24px !important;
  }
  
  .mobile-dropdown-item:last-child {
    border-bottom: none !important;
  }
  }
  
  @media (max-width: 480px) {
    nav > div:first-child {
      height: 75px !important;
      min-height: 75px !important;
      padding: 0 16px !important;
    }
    
    nav img {
      height: 60px !important;
    }
    
    nav > div:last-child {
      padding: 20px 16px !important;
    }
    
    nav button {
      width: 48px !important;
      height: 48px !important;
      font-size: 22px !important;
    }
  }
  
  /* Smooth animations */
  nav a {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

if (!document.querySelector('[data-navbar-styles]')) {
  styleSheet.setAttribute('data-navbar-styles', 'true');
  document.head.appendChild(styleSheet);
}

export default Navbar;