Letsema - Digital Loan Management System for MFIs

Letsema is a web-based platform designed to digitize and streamline the loan process between **Microfinance Institutions (MFIs)** and **loan borrowers**. The platform bridges the gap between loan applicants and MFIs by providing a centralized, transparent, and data-driven system for loan administration.

🌍 Project Goal

Letsema was developed to:
- Improve the efficiency of loan application and management
- Enable MFIs to make informed lending decisions based on verified borrower data
- Allow borrowers to apply and track loans online without the need to visit physical offices
- Promote transparency, accountability, and financial inclusion in underserved communities

🎯 Target Users

- **Microfinance Institutions (MFIs):** To better assess risk and manage borrowers
- **Loan Borrowers:** Individuals in need of loans who often struggle with manual, paper-based application processes
- **Government and Financial Regulators:** (Optional future expansion) for oversight and analytics on borrowing trends and credit risk

💥 Impact

Letsema addresses core challenges in the microfinance sector:
- **Lack of borrower information:** MFIs gain access to comprehensive borrower profiles (credit score, income, loan history)
- **Manual loan processes:** Borrowers can now apply for loans fully online
- **Poor tracking:** Both MFIs and borrowers can track all loans, rejections, approvals, and payments
- **Lack of scalability:** With a distributed database architecture, Letsema is built to grow across multiple districts efficiently

By digitizing the loan management workflow, Letsema empowers MFIs to make better lending decisions and ensures borrowers have fair access to finance.

---

## 🧠 Technology and Innovation

Letsema introduces a **distributed database architecture** to enhance performance and scalability:
- Each **district operates as an independent node**
- Data is synchronized using **PostgreSQL with Citus extension** for horizontal scaling
- **Cassandra** is integrated for high-throughput and fault-tolerant distributed data storage

### 🔧 Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Django (Python)
- **Database:** PostgreSQL (central and sharded using Citus), Cassandra
- **Notifications:** Email and in-app alerts
- **Architecture:** Distributed nodes by district for load balancing and fault tolerance

## 👥 Founders and Contributors

Letsema was developed by a dedicated student team with defined responsibilities:

-  **Tlotliso Khosi** – *Project Leader & Full-Stack Developer (excluding Cassandra)*  
  Oversaw the entire development process, contributed significantly to frontend design, user interface development, documentation, and system architecture.

- **Tlhokomelo Mohobane, Bahlakoana Tau, Seabata Nchoba** – *Documentation & System Design*  
  Responsible for project documentation, planning, and drafting system architecture

- **Kelello Mapesela** – *Frontend Developer*  
  Designed and developed the user interface for both MFIs and borrowers

- **Bafokeng Masitha** – *Backend Developer*  
  Developed backend logic using Django and implemented PostgreSQL with Citus for the distributed database setup

- **Khotso Mojakhomo** – *Distributed Systems Engineer*  
  Implemented Apache Cassandra for decentralized, fault-tolerant data storage


