# Software Requirements Specification (SRS): CSR Portal

## 1. Introduction
### 1.1 Purpose
The purpose of this document is to define the functional and non-functional requirements for the  Customer Service Representative (CSR) Portal. This portal is designed to empower support staff to manage car wash memberships, handle billing inquiries, and resolve account-related issues efficiently.

### 1.2 Scope
The CSR Portal is a front-end web application that interfaces with the  membership and loyalty platform. It focuses on user lookup, subscription management (canceling, transferring, adding), and account modification for the car wash membership ecosystem.

---

## 2. General Description
### 2.1 User Classes
* **Customer Service Representative (CSR):** The primary user. They require a high-density, high-speed interface to assist customers over the phone.
* **System Administrator (Implicit):** Responsible for maintaining the portal and ensuring data integrity between the portal and the  backend.

### 2.2 Design Constraints
* **Front-End Only:** The scope of this specific deliverable is the client-side implementation.
* **Framework:** JavaScript-based (e.g., React, Vue, Angular).
* **Deployment:** Must be accessible via a public URL (Vercel, Netlify, or GitHub Pages).

---

## 3. Functional Requirements

### 3.1 User Management (UM)
* **FR-UM-1: User Directory:** The system shall display a paginated list of all registered mobile app users.
* **FR-UM-2: Search & Filter:** CSRs shall be able to search for users by **Name**, **Email**, or **Phone Number** with real-time or near-real-time results.
* **FR-UM-3: Profile Modification:** CSRs shall be able to edit user metadata, including Name, Email address, and Phone number.

### 3.2 Subscription & Vehicle Management (SVM)
* **FR-SVM-1: Vehicle Overview:** The system shall display all vehicles associated with a user, including Make, Model, and License Plate.
* **FR-SVM-2: Subscription Lifecycle:** CSRs shall have the ability to:
    * **Cancel** an active monthly subscription.
    * **Add** a new subscription or single wash to a vehicle.
    * **Transfer** an existing subscription from one vehicle to another.
* **FR-SVM-3: Status Indicators:** The system must clearly flag "Overdue" or "Inactive" statuses (e.g., highlighting in red) to help CSRs diagnose why a wash was denied.

### 3.3 Transactional Visibility (TV)
* **FR-TV-1: Purchase History:** The system shall provide a chronological log of all transactions (Subscriptions, Single Washes, and Coupons) for a specific user.
* **FR-TV-2: Payment Status:** The system shall show the success/failure status of the most recent billing attempts.

---

## 4. UI/UX Requirements
* **UIR-1: Dashboard Layout:** A "Master-Detail" view where the user list is easily accessible, and selecting a user opens a comprehensive "Customer 360" view.
* **UIR-2: Action Confirmations:** Critical actions (like Deleting or Canceling) must trigger a confirmation modal to prevent accidental data loss.
* **UIR-3: Responsiveness:** The portal should be optimized for desktop use, as CSRs typically work on large monitors during support calls.

---

## 5. Non-Functional Requirements
* **Performance:** Search queries and page transitions should occur in under 300ms to minimize customer wait times on calls.
* **Maintainability:** The code should follow modular component patterns (e.g., separate components for User Cards, Transaction Tables, and Modals).
* **Usability:** The interface should require minimal training, utilizing intuitive icons and clear typography.

---

## 6. Technical Stack (Proposed)
* **Framework:** React / Vite
* **Styling:** Tailwind CSS (for rapid, consistent UI development)
* **State Management:** React Context API or Redux (to manage user/subscription data)
* **Routing:** React Router
