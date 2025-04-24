import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/client.css";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("loan-application");
  
  // Loan Application State
  const [mfi, setmfi] = useState("");
  const [amount, setAmount] = useState("");
  const [netPay, setNetPay] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Loan Repayment State
  const [repaymentLoanID, setRepaymentLoanID] = useState("");
  const [repaymentAmount, setRepaymentAmount] = useState("");

  // Loan Tracking State
  const [loanID, setLoanID] = useState("");
  const [loanDetails, setLoanDetails] = useState(null);
  const [trackingError, setTrackingError] = useState("");
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  
  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // API Endpoints
  const API_BASE_URL = 'http://192.2.42.176:8000/api/';
  
  const [update_information] = useState([
    "Update your personal information here",
    "Manage your account settings and preferences",
    "Keep your details current for better service"
  ]);

  const menuItems = [
    { id: "loan-application", label: "Loan Application", emoji: "📝" },
    { id: "loan-repayment", label: "Loan Repayment", emoji: "💳" },
    { id: "loan-tracking", label: "Loan Tracking", emoji: "🔍" },
    { id: "account-information", label: "Account Information", emoji: "📋" },
    { id: "notifications", label: "Notifications", emoji: "🔔" },
    { id: "update-information", label: "Update Information", emoji: "📝" }
  ];

  const accountDetails = {
    mpesa: "254712345678",
    ecocash: "1234567890",
    bankTransfer: "Account Number: 987654321, Bank: Letsema Bank"
  };

  const getAccessToken = () => localStorage.getItem('access_token');

  // Format notification message with all transaction details
  const formatNotificationMessage = (notification) => {
    const transactionDate = new Date(notification.timestamp);
    const formattedDate = transactionDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(notification.amount);

    switch(notification.type) {
      case 'repayment':
        return `Payment Confirmation: On ${formattedDate}, you successfully made a payment of ${formattedAmount} ` +
               `to ${notification.mfi_name} for Loan #${notification.loan_id} via ${notification.payment_method}.`;
      case 'disbursement':
        return `Disbursement Notification: On ${formattedDate}, ${notification.mfi_name} transferred ${formattedAmount} ` +
               `to your ${notification.payment_method} account for Loan #${notification.loan_id}.`;
      default:
        return `Transaction Update: Activity on ${formattedDate} for Loan #${notification.loan_id}`;
    }
  };

  // Loan Application Handler
  const handleLoanApplicationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const loanApplicationData = {
      mfi,
      amount: parseFloat(amount),
      payment_method: paymentMethod,
      netpay: parseFloat(netPay),
    };

    try {
      const response = await fetch(`${API_BASE_URL}loans/application/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(loanApplicationData),
      });

      if (!response.ok) {
        const errorMsg = await response.json();
        throw new Error(errorMsg.detail || errorMsg.message || "Loan application failed");
      }

      const data = await response.json();
      setSuccessMessage("Loan application submitted successfully!");
      setmfi("");
      setAmount("");
      setPaymentMethod("");
      setNetPay("");
    } catch (error) {
      setErrorMessage(error.message || "Loan application failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loan Repayment Handler
  const handleLoanRepaymentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const repaymentData = {
      loan_id: repaymentLoanID,
      amount: parseFloat(repaymentAmount),
      payment_method: paymentMethod,
    };

    try {
      const response = await fetch(`${API_BASE_URL}loans/repay/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(repaymentData),
      });

      if (!response.ok) {
        const errorMsg = await response.json();
        throw new Error(`Failed to submit repayment: ${errorMsg.detail || errorMsg.message}`);
      }

      const data = await response.json();
      setSuccessMessage("Repayment submitted successfully!");
      setRepaymentLoanID("");
      setRepaymentAmount("");
      setPaymentMethod("");
    } catch (error) {
      setErrorMessage("Repayment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loan Tracking Handler
  const handleTrackingSubmit = async (e) => {
    e.preventDefault();
    setLoanDetails(null);
    setTrackingError("");
    setErrorMessage("");
    setSuccessMessage("");
    
    const trimmedLoanID = loanID.trim();
    if (!trimmedLoanID) {
      setTrackingError("Please enter a valid Loan ID");
      return;
    }

    setIsTrackingLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}borrowers/loans/${trimmedLoanID}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || "Loan not found");
      }

      const loanData = await response.json();
      
      const formatAmount = (value) => {
        if (value === null || value === undefined) return 'N/A';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? 'N/A' : `$${num.toFixed(2)}`;
      };

      const formatDateOnly = (dateString) => {
        if (!dateString) return 'N/A';
        try {
          return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } catch {
          return 'N/A';
        }
      };

      const formattedLoanData = {
        ...loanData,
        created_at: formatDateOnly(loanData.created_at),
        updated_at: formatDateOnly(loanData.updated_at),
        due_date: formatDateOnly(loanData.due_date),
        amount_due: formatAmount(loanData.amount_due),
        interest_rate: loanData.interest_rate ? `${loanData.interest_rate}%` : 'N/A',
        amount: formatAmount(loanData.amount),
        repayment_status: loanData.repayment_status || 'N/A'
      };
      
      setLoanDetails(formattedLoanData);
      setSuccessMessage("Loan details retrieved successfully!");
    } catch (err) {
      setTrackingError(err.message);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  // Load Notifications Handler
  const handleLoadNotifications = async () => {
    setIsLoadingNotifications(true);
    setNotificationsError("");
    setNotifications([]);

    try {
      const response = await fetch(`${API_BASE_URL}transactions/transactions/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || "Failed to fetch notifications");
      }

      const data = await response.json();
      
      const formattedNotifications = data.map(notification => ({
        id: notification.id,
        is_read: notification.is_read || false,
        type: notification.type || null,
        loan_id: notification.loan_id || "N/A",
        mfi_name: notification.mfi_name || "N/A",
        amount: notification.amount || 0,
        payment_method: notification.payment_method || "N/A",
        timestamp: notification.timestamp || new Date().toISOString(),
        formattedMessage: formatNotificationMessage({
          type: notification.type || null,
          loan_id: notification.loan_id || "N/A",
          mfi_name: notification.mfi_name || "N/A",
          amount: notification.amount || 0,
          payment_method: notification.payment_method || "N/A",
          timestamp: notification.timestamp || new Date().toISOString()
        })
      }));
      
      setNotifications(formattedNotifications);
    } catch (error) {
      setNotificationsError(error.message);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}notifications/${notificationId}/mark-as-read/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
    } catch (error) {
      setErrorMessage("Failed to mark notification as read");
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}notifications/mark-all-as-read/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          ({ ...notification, is_read: true })
        )
      );
      setSuccessMessage("All notifications marked as read!");
    } catch (error) {
      setErrorMessage("Failed to mark all notifications as read");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Letsema MicroFinance</h1>
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
                setTrackingError("");
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
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {activeTab === "loan-application" && (
          <section className="loan-application-section">
            <h2 className="section-title">Loan Application</h2>
            <form onSubmit={handleLoanApplicationSubmit} className="loan-application-form">
              <div className="form-group">
                <label>Company:</label>
                <input
                  type="text"
                  value={mfi}
                  onChange={(e) => setmfi(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label>Payment Method:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select Method</option>
                  <option value="Mpesa">Mpesa</option>
                  <option value="Ecocash">Ecocash</option>
                  <option value="BankTransfer">Bank Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Net Pay:</label>
                <input
                  type="number"
                  value={netPay}
                  onChange={(e) => setNetPay(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </section>
        )}

        {activeTab === "loan-repayment" && (
          <section className="loan-repayment-section">
            <h2 className="section-title">Loan Repayment</h2>
            <form onSubmit={handleLoanRepaymentSubmit} className="loan-repayment-form">
              <div className="form-group">
                <label>Loan ID:</label>
                <input
                  type="text"
                  value={repaymentLoanID}
                  onChange={(e) => setRepaymentLoanID(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input
                  type="number"
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label>Payment Method:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select Method</option>
                  <option value="Mpesa">Mpesa</option>
                  <option value="Ecocash">Ecocash</option>
                  <option value="BankTransfer">Bank Transfer</option>
                </select>
              </div>
              <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Submit Repayment'}
              </button>
            </form>
          </section>
        )}

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
                  disabled={isTrackingLoading}
                />
              </div>
              <button type="submit" className="btn btn-submit" disabled={isTrackingLoading}>
                {isTrackingLoading ? 'Searching...' : 'Track Loan'}
              </button>
            </form>

            {trackingError && <div className="error-message">{trackingError}</div>}

            {loanDetails && (
              <div className="loan-details">
                <h3>Loan Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Loan ID:</span>
                    <span>{loanDetails.id || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Amount Borrowed:</span>
                    <span>{loanDetails.amount || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Amount Due:</span>
                    <span>{loanDetails.amount_due || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Interest Rate:</span>
                    <span>{loanDetails.interest_rate || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-${loanDetails.status?.toLowerCase()}`}>
                      {loanDetails.status || 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Repayment Status:</span>
                    <span className={`status-${loanDetails.repayment_status?.toLowerCase()}`}>
                      {loanDetails.repayment_status || 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date Issued:</span>
                    <span>{loanDetails.created_at || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Updated:</span>
                    <span>{loanDetails.updated_at || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Due Date:</span>
                    <span>{loanDetails.due_date || 'N/A'}</span>
                  </div>
                  {loanDetails.payment_method && (
                    <div className="detail-item">
                      <span className="detail-label">Payment Method:</span>
                      <span>{loanDetails.payment_method}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === "account-information" && (
          <section className="account-information-section">
            <h2 className="section-title">Account Information</h2>
            <div className="account-details">
              <div className="form-group">
                <h3>Mpesa Details:</h3>
                <p>{accountDetails.mpesa}</p>
                <h3>Ecocash Details:</h3>
                <p>{accountDetails.ecocash}</p>
                <h3>Bank Transfer Details:</h3>
                <p>{accountDetails.bankTransfer}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "notifications" && (
          <section className="notifications-section">
            <h2 className="section-title">Transaction Notifications</h2>
            
            <div className="notifications-controls">
              <button 
                className="btn btn-load-notifications"
                onClick={handleLoadNotifications}
                disabled={isLoadingNotifications}
              >
                {isLoadingNotifications ? 'Loading...' : 'Refresh Notifications'}
              </button>
              
              {notifications.length > 0 && (
                <button 
                  className="btn btn-mark-all-read"
                  onClick={handleMarkAllAsRead}
                  disabled={isLoadingNotifications}
                >
                  Mark All as Read
                </button>
              )}
            </div>

            {notificationsError && <div className="error-message">{notificationsError}</div>}

            {isLoadingNotifications ? (
              <div className="loading-spinner">Loading your transactions...</div>
            ) : notifications.length > 0 ? (
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.is_read ? 'read' : 'unread'} ${notification.type}`}
                  >
                    <div className="notification-header">
                      <span className="notification-type">
                        {notification.type === 'repayment' ? 'Repayment Receipt' : 'Loan Disbursement'}
                      </span>
                      <span className="notification-date">
                        {new Date(notification.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {!notification.is_read && (
                        <button 
                          className="btn-mark-read"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                    </div>
                    
                    <div className="notification-message">
                      {notification.formattedMessage}
                    </div>
                    
                    <div className="notification-details">
                      <div className="detail-item">
                        <span>Reference:</span>
                        <strong>Loan #{notification.loan_id}</strong>
                      </div>
                      <div className="detail-item">
                        <span>Amount:</span>
                        <strong>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'ZAR'
                          }).format(notification.amount)}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !notificationsError && <div className="no-notifications">
                No transaction notifications found
              </div>
            )}
          </section>
        )}

        {activeTab === "update-information" && (
          <section className="update-information-section">
            <h2 className="section-title">Update Information</h2>
            <ul className="update-information-list">
              {update_information.map((info, index) => (
                <li key={index} className="update-item">
                  {info}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}