# StockFlow System Video Demonstration & Presentation Script

This guide outlines a step-by-step presentation script and recording workflow for **4 developers** to demonstrate the complete StockFlow Inventory Management System in a published video.

---

## 🎬 Recording Setup & Overview

- **Target Video Duration**: 8 – 10 Minutes
- **Video Format**: High Definition 1080p Screen Recording with Clear Voice Narration
- **App URL**: `http://localhost:3000`
- **Team Roster**:
  - **Developer 1 (Host & Frontend Lead)**: Introduction, Landing Page, Glassmorphism Auth Modals, Dedicated Navigation.
  - **Developer 2 (Staff Operations Lead)**: Staff Registration Workflow, Inventory Catalog, Stock Adjustments, Low-Stock Alerts.
  - **Developer 3 (Admin & RBAC Lead)**: Admin Portal, Pending Staff Approval Queue, User Configuration & Role Controls.
  - **Developer 4 (Analytics & Compliance Lead)**: Inventory Valuation Reports, Stock Movement Timelines, Audit Logging, System Confirmation Modals.

---

## 📋 Step-by-Step Video Script & Action Timeline

### ⏱️ Segment 1: System Introduction & Landing Page (0:00 - 2:00)
**Presenter**: Developer 1 (Host & Frontend Lead)  
**Screen Action**: Open `http://localhost:3000` on the StockFlow Landing Page.

- **Developer 1**:
  > *"Hello everyone, and welcome to our demonstration of StockFlow — an enterprise-grade IT equipment and hardware inventory management platform. Today, our engineering team will walk you through our application's key architectural features, security workflows, and user interfaces."*
  > 
  > *"Starting here on our Public Landing Page, you can see our responsive navigation header, hero banner, core feature highlights, and interactive company stats."*

**Screen Action**: Click on **Features** (`/features`), **About Us** (`/about`), and **Contact Support** (`/contact`) in the navbar.

- **Developer 1**:
  > *"We have implemented dedicated standalone page views with full contextual routing. Users can explore our complete features catalog, enterprise mission, and contact support forms."*

**Screen Action**: Click **"Sign In"** or **"Get Started Free"** to reveal the Glassmorphic Auth Modal.

- **Developer 1**:
  > *"Notice how our authentication forms use a modern glassmorphism design — floating semi-transparent frosted cards overlaying the live landing page backdrop, complete with a top-right exit button."*
  > 
  > *"Now I'll hand over to Developer 2 to demonstrate our staff registration and inventory operations."*

---

### ⏱️ Segment 2: Staff Registration & Inventory Operations (2:00 - 4:15)
**Presenter**: Developer 2 (Staff Operations Lead)  
**Screen Action**: On the Glassmorphic Register Modal, fill out a new staff account (e.g. `Kasun Perera`, `kasun@stockflow.com`).

- **Developer 2**:
  > *"Thank you, Developer 1! As a new staff member joining the team, I'll register my account."*
  > 
  > *"When I submit registration, StockFlow enforces a strict security policy: new staff accounts default to a 'Pending Admin Approval' status. As you see on screen, the system confirms my request was submitted, and I must wait for an administrator to approve my access."*

**Screen Action**: Attempt to sign in with the pending account `kasun@stockflow.com` to show the rejection notification.

- **Developer 2**:
  > *"If I attempt to log in right now, the system rejects authentication and notifies me to wait for admin approval."*
  > 
  > *"Now let's sign in with an existing active staff account to look at inventory management."*

**Screen Action**: Sign in as active staff (`ashan@stockflow.com`). Navigate to **Inventory Catalog**.

- **Developer 2**:
  > *"Here in the Inventory Catalog, staff members can search products by name or SKU, filter across our 6 core IT categories, and trigger quick stock adjustments. Watch as I update stock levels for this server rack unit — the system instantly updates quantity badges and logs the movement."*
  > 
  > *"Next, Developer 3 will demonstrate how Administrators manage user approvals and system security."*

---

### ⏱️ Segment 3: Admin Approval Queue & Staff Configuration (4:15 - 6:30)
**Presenter**: Developer 3 (Admin & RBAC Lead)  
**Screen Action**: Sign in as Administrator (`saranga@stockflow.com`). Navigate to **User & Staff Management** (`AdminUsersPage`).

- **Developer 3**:
  > *"Thanks, Developer 2! I've signed in as a System Administrator. Right at the top of our control panel, you'll see our Pending Staff Registrations Queue."*
  > 
  > *"Here is Kasun Perera's pending registration. With one click on 'Approve Staff', I authorize their account, enabling immediate sign-in capability."*

**Screen Action**: Click **"Select & Configure User"** (*Add User* button). Select Kasun Perera from the dropdown list.

- **Developer 3**:
  > *"When configuring users, Admins select registered staff from a pre-approved dropdown list. Here, Admins can customize the user's Full Name and User Handle (@username)."*
  > 
  > *"Notice that the Email Address field is strictly locked and read-only across all profile forms for account immutability and security."*
  > 
  > *"Notice also that every user is automatically assigned a dynamic DiceBear Initials SVG Avatar generated directly from their credentials."*
  > 
  > *"I'll pass the mic to Developer 4 to show our analytics, audit logs, and unified system modals."*

---

### ⏱️ Segment 4: Data Analytics, Audit Logging & UX Controls (6:30 - 9:00)
**Presenter**: Developer 4 (Analytics & Compliance Lead)  
**Screen Action**: Navigate to **Reports & Analytics** (`ReportsPage`).

- **Developer 4**:
  > *"Thank you, Developer 3! StockFlow features robust analytics tools. In our Reports portal, Administrators view real-time inventory valuation breakdowns, category distribution charts powered by Recharts, and chronological stock movement timelines."*

**Screen Action**: Navigate to **Staff Activity Portal** (`StaffActivityPage`).

- **Developer 4**:
  > *"For compliance, every stock adjustment, product edit, and user approval is recorded in our Staff Activity Audit Log with precise timestamps, action badges, and user avatars."*

**Screen Action**: Go to **Inventory** and click **Delete Product** on any item to trigger `ConfirmModal`.

- **Developer 4**:
  > *"Finally, we eliminated native browser alert and confirm popups. When performing destructive actions like deleting a product or user account, StockFlow presents our custom Unified System Confirm Modal, providing a consistent visual experience."*

---

### ⏱️ Segment 5: Conclusion & Summary (9:00 - 9:30)
**Presenter**: Developer 1 (Host & Frontend Lead)  
**Screen Action**: Return to Dashboard main view.

- **Developer 1**:
  > *"To summarize, StockFlow combines role-based security, staff approval workflows, dynamic DiceBear SVG avatars, and real-time inventory tracking into a sleek modern web application."*
  > 
  > *"Thank you for watching our demonstration! Full source code and developer guides are available in our GitHub repository."*
