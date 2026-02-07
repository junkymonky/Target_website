# Target Website - WAF Dashboard & Testing Platform

## ⚠️ Educational Purpose Only

This project is **created for educational purposes only** and is designed as a test environment for Web Application Firewall (WAF) dashboard and middleware development. It provides a vulnerable web application with integrated WAF analysis capabilities for learning and testing security mechanisms.

## 📋 Project Overview

Target Website is an Express.js-based web application that combines a simple login system with an integrated Web Application Firewall (WAF) analyzer. This platform serves as a sandbox environment for:

- **Testing WAF middleware** - Evaluate how the WAF detects and blocks malicious requests
- **Security analysis** - Monitor and log incoming requests for security threats
- **WAF rule development** - Test and refine WAF rules for different attack vectors
- **Dashboard monitoring** - View and analyze security events in real-time

## 🏗️ Project Structure

```
Target_website/
├── public/                    # Static assets
│   └── style.css             # Application styling
├── views/                     # Frontend templates
│   └── login.html            # Login page
├── waf_analyzer/             # WAF analysis engine
│   ├── logger.js             # Request logging module
│   ├── severity.js           # Threat severity assessment
│   ├── waf.js                # Main WAF middleware
│   ├── database/             # WAF database
│   └── rules/                # Security rule definitions
│       ├── bruteforce.js     # Brute-force attack detection
│       ├── sqli.js           # SQL injection detection
│       └── xss.js            # Cross-site scripting detection
├── server.js                 # Express server configuration
├── package.json              # Project dependencies
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (included with Node.js)

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd Target_website
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server

Start the application:
```bash
npm start
```

The server will run on **http://localhost:3000**

## 🔐 WAF Features

The integrated WAF analyzer provides the following capabilities:

### Detection Rules
- **Brute Force Detection** - Identifies repeated login attempts
- **SQL Injection (SQLi)** - Detects SQL injection attack patterns
- **Cross-Site Scripting (XSS)** - Identifies XSS payload attempts

### Monitoring & Logging
- **Request Logger** - Logs all incoming requests with IP, method, URL, and body
- **Severity Assessment** - Classifies threats by severity level
- **Real-time Analysis** - Analyzes requests as they occur

## 📊 Core Components

### server.js
Main Express server configuration with:
- Body parser middleware for request parsing
- Static file serving from the `public/` directory
- Request logging middleware for visibility
- SQLite database integration
- WAF middleware integration

### waf_analyzer/waf.js
The WAF middleware that:
- Intercepts and analyzes all incoming requests
- Applies security rules to detect threats
- Logs security events
- Blocks or flags suspicious requests

### Database
- **SQLite3** database for storing user credentials and security logs
- Test user credentials included for demonstration

## 🛠️ Dependencies

- **express** (v5.2.1) - Web application framework
- **body-parser** (v2.2.2) - Middleware for parsing request bodies
- **sqlite3** (v5.1.7) - SQLite database driver

## 📝 Default Test Credentials

Username: `admin`
Password: `admin123`

> ⚠️ **Note:** These credentials are for testing only and should never be used in production environments.

## ⚙️ Configuration

The server runs on:
- **Port**: 3000
- **Database**: `./database.db` (SQLite)
- **IP Detection**: Configured to handle proxy headers (`X-Forwarded-For`)

## 🔍 Testing the WAF

You can test the WAF by:

1. Sending requests to the login endpoint with various payloads
2. Monitoring console logs for detected threats
3. Reviewing severity assessments
4. Testing different attack vectors (SQLi, XSS, brute-force)

## ⚖️ Disclaimer

This project is intended **solely for educational and authorized security testing purposes**. Users are responsible for ensuring they have proper authorization before testing on any system. Unauthorized access to computer systems is illegal.

## 📚 Learning Objectives

This project helps understand:
- How WAF middleware integrates with web applications
- Request pattern analysis and threat detection
- Security rule implementation and evaluation
- Web application security best practices

## 📄 License

ISC

---

**Note:** This is an educational tool designed for learning about WAF systems and security testing. It should only be used in controlled environments for authorized testing purposes.
