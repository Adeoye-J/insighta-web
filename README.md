# 🌐 Insighta Web Portal

**Insighta Labs+ — Secure Demographic Intelligence Interface**

---

## 📌 Overview

The Insighta Web Portal is the browser-based interface for the **Insighta Labs+ platform**.

It provides a secure and user-friendly environment for:

* Authenticating users via GitHub OAuth
* Viewing and querying profile intelligence data
* Applying advanced filters and natural language search
* Exporting profile data as CSV
* Performing role-based operations

The portal integrates directly with the Stage 3 backend and shares the same authentication and authorization model as the CLI.

---

## 🧠 System Architecture

```txt
Browser (React Web Portal)
        ↓
Backend API (Express + MongoDB)
        ↓
GitHub OAuth (Identity Provider)
```

* The web portal communicates with the backend using **HTTP requests with cookies**
* Authentication is handled by the backend
* GitHub is used for user identity verification

---

## 🔐 Authentication Flow

### Step-by-step

1. User clicks:

```txt
Continue with GitHub
```

2. Browser redirects to backend:

```txt
GET /api/v1/auth/github?client=web
```

3. Backend:

   * Generates OAuth state and PKCE values
   * Stores them in HTTP-only cookies
   * Redirects to GitHub OAuth

4. User logs in and approves access on GitHub

5. GitHub redirects back:

```txt
GET /api/v1/auth/github/callback
```

6. Backend:

   * Validates state and PKCE
   * Exchanges code for GitHub token
   * Fetches GitHub user data
   * Creates or retrieves user in database

7. Backend generates:

   * Access token
   * Refresh token

8. Backend sets cookies:

```txt
access_token (HTTP-only)
refresh_token (HTTP-only)
```

9. Backend redirects to:

```txt
/dashboard
```

---

## 🔑 Token Handling Strategy

| Token Type    | Purpose            | Storage          | Expiry      |
| ------------- | ------------------ | ---------------- | ----------- |
| Access Token  | API authentication | HTTP-only cookie | ~15 minutes |
| Refresh Token | Renew access token | HTTP-only cookie | ~7 days     |

### Key Points

* Tokens are **never accessible via JavaScript**
* Stored as **HTTP-only cookies**
* Automatically sent with every request using:

```txt
withCredentials: true
```

### Token Refresh

* If access token expires:

  * Frontend request fails with `401`
  * Backend `/auth/refresh` endpoint is used
  * New access token is issued
* User stays logged in without interruption

---

## 👥 Role-Based Access Control

Roles are enforced entirely on the backend.

### Roles

#### Analyst

* View profiles
* Search profiles
* Export data

#### Admin

* All analyst capabilities
* Delete profiles

### Frontend Behavior

* UI adapts based on role:

```txt
Admin → sees delete buttons
Analyst → delete option hidden
```

---

## ⚙️ Tech Stack

* React (Vite)
* Axios
* React Router
* CSS (custom styling)

---

## 🚀 Installation & Setup

```bash
git clone https://github.com/YOUR_USERNAME/insighta-web.git
cd insighta-web
npm install
```

---

## 🔧 Environment Variables

Create `.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

For production:

```env
VITE_BACKEND_URL=https://your-backend-url.com
```

---

## ▶️ Run the Application

```bash
npm run dev
```

Visit:

```txt
http://localhost:5173
```

---

## 📥 API Integration

All requests are made using Axios:

```js
axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true
})
```

This ensures:

* Cookies are sent with requests
* Auth is maintained automatically

---

## 📊 Features

### 1. Dashboard

Displays:

* Total profiles
* Logged-in user
* Role

---

### 2. Profiles Page

Supports:

* Filtering
* Sorting
* Pagination

Example filters:

* gender
* age_group
* country_id
* min_age, max_age

---

### 3. Natural Language Search

Users can enter queries like:

```txt
young males from nigeria
```

Backend converts this to structured filters.

---

### 4. CSV Export

```txt
GET /api/v1/profiles/export
```

Frontend downloads file automatically.

---

### 5. Profile Deletion (Admin Only)

* Delete button only visible to admin
* Sends:

```txt
DELETE /api/v1/profiles/:id
```

---

## 🔐 Security Features

* GitHub OAuth with PKCE
* HTTP-only cookie storage
* CSRF protection (via same-site cookies + backend validation)
* Role-based access control
* Secure backend-only token handling
* Rate limiting (backend)
* Request logging (backend)

---

## 🧪 Error Handling

All errors follow backend structure:

```json
{
  "status": "error",
  "message": "Error description"
}
```

Frontend displays:

* Unauthorized → redirect to login
* Forbidden → restricted UI action
* Invalid query → error message

---

## ⚠️ Limitations

* No persistent frontend session storage (depends on cookies)
* Natural language parsing limited to backend rules
* No advanced query builder UI
* No real-time updates
* Limited UI styling (focus on functionality)

---

## 🔄 Interaction with CLI

Both CLI and Web Portal:

* Use the same backend
* Share the same authentication system
* Respect the same roles and permissions

Difference:

| Interface | Token Storage     |
| --------- | ----------------- |
| CLI       | Local JSON file   |
| Web       | HTTP-only cookies |

---

## 🧩 System Integration Summary

```txt
CLI            → Backend → Database
Web Portal     → Backend → Database
GitHub OAuth   → Backend
```

All components are synchronized through the backend.

---

## 👨‍💻 Author

**Jeremiah Bankole (FunGeek)**

---

## 🎯 Final Note

This web portal completes the Insighta Labs+ platform by providing:

* Secure authentication
* Real-time data interaction
* Role-based UI behavior
* Seamless integration with backend and CLI

It demonstrates a full-stack implementation of a **secure, production-style system**.
