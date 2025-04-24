import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/business.css";

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("approve-loans");
  const [pendingLoans, setPendingLoans] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loanID, setLoanID] = useState("");
  const [trackedLoan, setTrackedLoan] = useState(null);
  const [trackingError, setTrackingError] = useState("");
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  // API Configuration
  const API_BASE_URL = "http://192.2.42.176:8000/api/";

  // Menu Items
  const menuItems = [
    { id: "approve-loans", label: "Approve Loans", emoji: "✅" },
    { id: "active-loans", label: "Active Loans", emoji: "📊" },
    { id: "loan-tracking", label: "Loan Tracking", emoji: "🔍" },
    { id: "business-analytics", label: "Business Analytics", emoji: "📈" },
    { id: "update-information", label: "Update Information", emoji: "📝" }
  ];

  const [update_information] = useState([
    "Fix your details man!",
    "A place where you will be fixing your account details.",
    "It is very easy, you got this."
  ]);

  const getAccessToken = () => localStorage.getItem('access_token');

  // Fetch Pending Loans
  const fetchPendingLoans = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}mfi/loan-requests/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || "Failed to fetch loans");
      }

      const data = await response.json();
      setPendingLoans(data.results || data);
      setSuccessMessage("Pending loans loaded successfully");
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage(err.message || 'Failed to fetch pending loans');
      if (err.message.includes('authentication')) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Active Loans
  const fetchActiveLoans = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}mfi/active-loans/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || "Failed to fetch active loans");
      }

      const data = await response.json();
      setActiveLoans(data.results || data);
      setSuccessMessage("Active loans loaded successfully");
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage(err.message || 'Failed to fetch active loans');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Analytics Data
  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}loans/analytics/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || "Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalyticsData(data);
      setSuccessMessage("Analytics data loaded");
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage(err.message || 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  // Loan Approval Handler
  const handleApproveLoan = async (loanId) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}loans/application/${loanId}/approve/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || "Approval failed");
      }

      setSuccessMessage("Loan approved successfully!");
      fetchPendingLoans();
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage(err.message || "Failed to approve loan");
    } finally {
      setIsLoading(false);
    }
  };

  // Loan Rejection Handler
  const handleRejectLoan = async (loanId) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}loans/application/${loanId}/reject/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || "Rejection failed");
      }

      setSuccessMessage("Loan rejected successfully!");
      fetchPendingLoans();
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage(err.message || "Failed to reject loan");
    } finally {
      setIsLoading(false);
    }
  };

  // Loan Tracking Handler
  const handleTrackingSubmit = async (e) => {
    e.preventDefault();
    setTrackedLoan(null);
    setTrackingError("");
    
    if (!loanID.trim()) {
      setTrackingError("Please enter a valid Loan ID");
      return;
    }

    setIsTrackingLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}mfi/loan-requests/${loanID.trim()}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || "Loan not found");
      }

      const loanData = await response.json();
      setTrackedLoan(loanData);
    } catch (err) {
      console.error('Loan tracking error:', err);
      setTrackingError(err.message || "Failed to fetch loan details");
    } finally {
      setIsTrackingLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    navigate("/");
  };

  // Generic Loan Card Renderer
  const renderLoanCards = (loans, showActions = false) => {
    if (isLoading) return <div className="loading-message">Loading...</div>;
    if (errorMessage) return <div className="error-message">{errorMessage}</div>;
    if (loans.length === 0) return <p className="no-loans">No loans found</p>;

    return loans.map((loan) => (
      <div key={loan.id} className="loan-card">
        <div className="loan-details">
          <p><strong>Loan_ID:</strong> {loan.id}</p>
          <p><strong>Name:</strong> {loan.borrower?.name || 'N/A'}</p>
          <p><strong>Surname:</strong> {loan.borrower?.surname || 'N/A'}</p>
          <p><strong>Email:</strong> {loan.borrower?.email || 'N/A'}</p>
          <p><strong>IDNumber:</strong> {loan.borrower?.idNumber || 'N/A'}</p>
          <p><strong>Address:</strong> {loan.borrower?.address || 'N/A'}</p>
          <p><strong>Loan_Amount:</strong> M {loan.amount}</p>
          <p><strong>Netpay:</strong> M {loan.netpay}</p>
          <p><strong>Payment Method:</strong> {loan.payment_method || 'N/A'}</p>
          <p><strong>Date:</strong> {new Date(loan.application_date || loan.approval_date).toLocaleDateString()}</p>
          <p><strong>Status: </strong> 
            <span className={`status-${loan.status.toLowerCase()}`}>
              {loan.status}
            </span>
          </p>
        </div>
        
        {showActions && (
          <div className="loan-actions">
            <button 
              onClick={() => handleApproveLoan(loan.id)} 
              className="btn btn-approve"
              disabled={isLoading}
            >
              Approve
            </button>
            <button 
              onClick={() => handleRejectLoan(loan.id)} 
              className="btn btn-reject"
              disabled={isLoading}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    ));
  };

  // Enhanced Analytics Handler
  const renderAnalyticsCards = () => {
    if (isLoading) return <div className="loading-message">Loading analytics...</div>;
    if (errorMessage) return <div className="error-message">{errorMessage}</div>;
    if (!analyticsData) return <p className="no-data">No analytics data available</p>;

    return (
      <div className="analytics-container">
        {/* MFI Information Section */}
        <div className="analytics-section">
          <h3>MFI Information</h3>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h4>MFI Name</h4>
              <p className="analytics-value">{analyticsData.mfi?.name || 'N/A'}</p>
            </div>
            <div className="analytics-card">
              <h4>Registration Number</h4>
              <p className="analytics-value">{analyticsData.mfi?.registration_number || 'N/A'}</p>
            </div>
            <div className="analytics-card">
              <h4>Contact Email</h4>
              <p className="analytics-value">{analyticsData.mfi?.contact_email || 'N/A'}</p>
            </div>
            <div className="analytics-card">
              <h4>Date Registered</h4>
              <p className="analytics-value">
                {analyticsData.mfi?.date_registered ? 
                  new Date(analyticsData.mfi.date_registered).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Loan Analytics Section */}
        <div className="analytics-section">
          <h3>Loan Portfolio</h3>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h4>Total Loans</h4>
              <p className="analytics-value">{analyticsData.loan_analytics?.total_loans || 0}</p>
              <p className="analytics-description">All loans issued</p>
            </div>
            <div className="analytics-card">
              <h4>Active Loans</h4>
              <p className="analytics-value">{analyticsData.loan_analytics?.active_loans || 0}</p>
              <p className="analytics-description">Currently active</p>
            </div>
            <div className="analytics-card highlight-card">
              <h4>Total Amount Issued</h4>
              <p className="analytics-value">M {analyticsData.loan_analytics?.total_amount_issued?.toLocaleString() || 0}</p>
              <p className="analytics-description">Total disbursed</p>
            </div>
            <div className="analytics-card">
              <h4>Average Loan Size</h4>
              <p className="analytics-value">M {analyticsData.loan_analytics?.average_loan_size?.toLocaleString() || 0}</p>
              <p className="analytics-description">Mean loan amount</p>
            </div>
          </div>
        </div>

        {/* Repayment Analytics Section */}
        <div className="analytics-section">
          <h3>Repayment Performance</h3>
          <div className="analytics-grid">
            <div className="analytics-card highlight-card">
              <h4>Repayment Rate</h4>
              <p className="analytics-value">{analyticsData.repayment_analytics?.repayment_rate || 0}%</p>
              <p className="analytics-description">Of total issued</p>
            </div>
            <div className="analytics-card">
              <h4>Total Repaid</h4>
              <p className="analytics-value">M {analyticsData.repayment_analytics?.total_amount_repaid?.toLocaleString() || 0}</p>
              <p className="analytics-description">Amount collected</p>
            </div>
            <div className="analytics-card">
              <h4>Repayment Transactions</h4>
              <p className="analytics-value">{analyticsData.repayment_analytics?.total_repayments || 0}</p>
              <p className="analytics-description">Total payments</p>
            </div>
            <div className="analytics-card highlight-card">
              <h4>Outstanding Balance</h4>
              <p className="analytics-value">M {analyticsData.repayment_analytics?.outstanding_balance?.toLocaleString() || 0}</p>
              <p className="analytics-description">Yet to be repaid</p>
            </div>
          </div>
        </div>

        {/* Visualization Placeholder */}
        <div className="visualization-section">
          <h3>Performance Trends</h3>
          <div className="visualization-placeholder">
            <p>Loan disbursement and repayment charts would appear here</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Letsema Microfinance</h1>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setErrorMessage("");
                setSuccessMessage("");
                setTrackedLoan(null);
                setTrackingError("");
                
                // Fetch data when tab changes
                if (item.id === "approve-loans") {
                  fetchPendingLoans();
                } else if (item.id === "active-loans") {
                  fetchActiveLoans();
                } else if (item.id === "business-analytics") {
                  fetchAnalyticsData();
                }
              }}
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-logout" onClick={handleLogout}>Log Out</button>
        </div>
      </aside>

      <main className="main-content">
        {/* Success/Error Messages */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {/* Approve Loans Section */}
        {activeTab === "approve-loans" && (
          <section className="loan-section">
            <h2 className="section-title">Pending Loan Approvals</h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                fetchPendingLoans();
              }} 
              className="loan-tracking-form"
            >
              <button type="submit" className="btn btn-submit">
                {pendingLoans.length ? 'Refresh Applications' : 'Loan Applications'}
              </button>
            </form>
            <div className="loans-container">
              {renderLoanCards(pendingLoans, true)}
            </div>
          </section>
        )}

        {/* Active Loans Section */}
        {activeTab === "active-loans" && (
          <section className="loan-section">
            <h2 className="section-title">Active Loans</h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                fetchActiveLoans();
              }} 
              className="loan-tracking-form"
            >
              <button type="submit" className="btn btn-submit">
                {activeLoans.length ? 'Refresh Active Loans' : 'Load Active Loans'}
              </button>
            </form>
            <div className="loans-container">
              {renderLoanCards(activeLoans)}
            </div>
          </section>
        )}

        {/* Loan Tracking Section */}
        {activeTab === "loan-tracking" && (
          <section className="loan-tracking-section">
            <h2 className="section-title">Loan Tracking</h2>
            <form onSubmit={handleTrackingSubmit} className="loan-tracking-form">
              <div className="form-group">
                <label>Loan ID:</label>
                <input
                  type="text"
                  value={loanID}
                  onChange={(e) => setLoanID(e.target.value)}
                  required
                  placeholder="Enter loan ID"
                  disabled={isTrackingLoading}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-submit"
                disabled={isTrackingLoading}
              >
                {isTrackingLoading ? 'Searching...' : 'Track Loan'}
              </button>
            </form>

            {isTrackingLoading && <div className="loading-message">Searching for loan...</div>}
            {trackingError && <div className="error-message">{trackingError}</div>}
            
            {trackedLoan && (
              <div className="loan-card">
                <div className="loan-details">
                  <p><strong>Loan_ID:</strong> {trackedLoan.id}</p>
                  <p><strong>Name:</strong> {trackedLoan.borrower?.name || 'N/A'}</p>
                  <p><strong>Surname:</strong> {trackedLoan.borrower?.surname || 'N/A'}</p>
                  <p><strong>Email:</strong> {trackedLoan.borrower?.email || 'N/A'}</p>
                  <p><strong>IDNumber:</strong> {trackedLoan.borrower?.idNumber || 'N/A'}</p>
                  <p><strong>Address:</strong> {trackedLoan.borrower?.address || 'N/A'}</p>
                  <p><strong>Loan_Amount:</strong> M {trackedLoan.amount}</p>
                  <p><strong>Netpay:</strong> M {trackedLoan.netpay}</p>
                  <p><strong>Payment Method:</strong> {trackedLoan.payment_method || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(trackedLoan.application_date || trackedLoan.approval_date).toLocaleDateString()}</p>
                  <p><strong>Status: </strong> 
                    <span className={`status-${trackedLoan.status.toLowerCase()}`}>
                      {trackedLoan.status}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Business Analytics Section */}
        {activeTab === "business-analytics" && (
          <section className="business-analytics-section">
            <h2 className="section-title">Business Analytics</h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                fetchAnalyticsData();
              }} 
              className="loan-tracking-form"
            >
              <button type="submit" className="btn btn-submit">
                Refresh Analytics
              </button>
            </form>
            {renderAnalyticsCards()}
          </section>
        )}

        {/* Update Information Section */}
        {activeTab === "update-information" && (
          <section className="notifications-section">
            <h2 className="section-title">Update Information</h2>
            <ul className="notifications-list">
              {update_information.map((info, index) => (
                <li key={index} className="notification-item">
                  {info}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Default Section for Unimplemented Tabs */}
        {activeTab !== "approve-loans" && 
         activeTab !== "active-loans" && 
         activeTab !== "loan-tracking" && 
         activeTab !== "business-analytics" &&
         activeTab !== "update-information" && (
          <div className="coming-soon">
            <h2>{menuItems.find((item) => item.id === activeTab)?.label}</h2>
            <p>Feature coming soon</p>
          </div>
        )}
      </main>
    </div>
  );
}