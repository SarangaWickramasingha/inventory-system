# StockFlow Enterprise ERP — 10-Minute Video Demonstration & Presentation Script

This comprehensive guide outlines a step-by-step presentation script and recording workflow for **4 developers / team members** to demonstrate the complete StockFlow IT Equipment & Hardware Inventory Management System in a 10-minute published video.

---

## 🎬 Presentation Overview & Time Allocation

- **Target Video Duration**: Exactly **10:00 Minutes** (2 minutes 30 seconds per presenter)
- **Video Format**: High Definition 1080p Screen Recording with Clear Voice Narration
- **Team Roster & Presenter Roles**:
  - 🎙️ **Presenter 1 (Frontend & Navigation Lead)** [0:00 – 2:30]: Host Introduction, Public Landing Page, Blue-Underline Dynamic Navbar, Standalone Pages, and Glassmorphic Auth Modal Navigation.
  - 🎙️ **Presenter 2 (Staff Portal & Operations Lead)** [2:30 – 5:00]: Staff Registration Workflow, Pending Admin Approval Lockout, Active Staff Login, Inventory Search/Filters, and Stock IN/OUT Movements.
  - 🎙️ **Presenter 3 (Admin Control & RBAC Lead)** [5:00 – 7:30]: Administrator Executive Portal, Pending Staff Approval Queue, User Role Configuration, DiceBear SVG Avatars, and Predefined Category Hierarchy.
  - 🎙️ **Presenter 4 (Analytics, Data Export & Compliance Lead)** [7:30 – 10:00]: Recharts Valuation Analytics, Reports Layout Navigation, Automated CSV/JSON Data Exports, Staff Activity Audit Trail, Custom System Modals, and Final Wrap-Up.

---

## 📋 Step-by-Step Video Script & Action Timeline

### ⏱️ Segment 1: System Introduction, Public Navigation & Auth Flow (0:00 – 2:30)
**Presenter**: Presenter 1 (Frontend & Navigation Lead)  
**Screen Action**: Open browser to `http://localhost:3000` on the StockFlow Home Landing Page.

- **Presenter 1 (0:00 – 0:45)**:
  > *"Hello everyone, and welcome to our demonstration of **StockFlow Enterprise ERP** — a modern, full-stack IT hardware and equipment inventory management platform engineered for precision, scale, and operational control.*
  > 
  > *Starting here on our main Landing Page, StockFlow greets users with a sleek dark hero banner, core system capabilities, and interactive company performance metrics."*

- **Screen Action (0:45 – 1:30)**: Click through top navbar links: **Features**, **About**, **Contact**, **Privacy**, and **Terms**. Point cursor to the active blue highlight underline (`border-b-[3px] border-blue-600`).

- **Presenter 1 (1:30 – 2:00)**:
  > *"Notice our top navigation bar: as I select **Features**, **About**, and **Contact**, the navbar highlights the currently active page with a crisp blue underline indicator. Each link routes to a dedicated standalone page view detailing our 6 core IT hardware categories, financial valuation engine, and support channels."*

- **Screen Action (2:00 – 2:30)**: Navigate to **Features** page. Click **"Try Feature with Staff Account"** or **"Login"**. The glassmorphic auth modal appears over the Features page backdrop. Click the close (**X**) button to demonstrate returning back to the Features page.

- **Presenter 1 (2:00 – 2:30)**:
  > *"When users click 'Sign Up as Staff' or 'Login', StockFlow launches a glassmorphism auth popup layered over the active page backdrop. Notice that clicking the close button or backdrop immediately returns us to our previous page — in this case, Features — retaining full contextual navigation.*
  > 
  > *Now, Presenter 2 will walk you through our staff registration workflow and daily stock operations."*

---

### ⏱️ Segment 2: Staff Registration & Inventory Operations (2:30 – 5:00)
**Presenter**: Presenter 2 (Staff Portal & Operations Lead)  
**Screen Action (2:30 – 3:15)**: Click **"Sign Up as Staff"** from Features page. Fill out registration form (`Kasun Perera`, `kasun@stockflow.com`, password `staff123`). Submit form.

- **Presenter 2 (2:30 – 3:15)**:
  > *"Thank you, Presenter 1! As a new employee joining the warehouse team, I'll register a new staff account.*
  > 
  > *Upon submitting registration, StockFlow enforces strict role-based security: new staff accounts default to a **'Pending Admin Approval'** status. A confirmation notification informs me that my request is pending administrator review."*

- **Screen Action (3:15 – 3:45)**: Attempt to log in immediately with `kasun@stockflow.com`. System shows an authentication alert banner rejecting login.

- **Presenter 2 (3:15 – 3:45)**:
  > *"If I attempt to log in right now, the system blocks authentication and notifies me to wait for admin authorization. This prevents unauthorized access to sensitive company inventory data."*

- **Screen Action (3:45 – 5:00)**: Log in as an approved active staff member (`john.doe@stockflow.com`). Navigate to **Inventory Catalog**. Search for `"Server"`, select category filter `"Servers & Storage"`, click a product to open `ProductViewModal`, and perform a Stock Adjust (+10 pcs).

- **Presenter 2 (3:45 – 5:00)**:
  > *"Now I'll log in as an active staff member. In the Inventory Catalog, staff can instantly search items by SKU or product name, filter across our 6 IT hardware categories, and view detailed specs.*
  > 
  > *Watch as I log a Stock IN adjustment of +10 units — stock quantity levels, status badges ('In Stock'), and audit logs update immediately.*
  > 
  > *Next, Presenter 3 will show how Administrators manage staff approvals and security configurations."*

---

### ⏱️ Segment 3: Executive Admin Portal & RBAC Management (5:00 – 7:30)
**Presenter**: Presenter 3 (Admin Control & RBAC Lead)  
**Screen Action (5:00 – 5:45)**: Log in as Administrator (`admin@stockflow.com`). Navigate to **User & Staff Management** (`AdminUsersPage`).

- **Presenter 3 (5:00 – 5:45)**:
  > *"Thanks, Presenter 2! I've signed in as a System Administrator. Here on the Admin Control Panel, we have complete governance over user access and staff privileges.*
  > 
  > *At the top of the User Management portal, you can see our **Pending Staff Registrations Queue** showing Kasun Perera's request."*

- **Screen Action (5:45 – 6:30)**: Click **"Approve Staff"** button for Kasun Perera. Show status badge update to active. Click **"Select & Configure User"** to open user configuration modal.

- **Presenter 3 (5:45 – 6:30)**:
  > *"With a single click on 'Approve Staff', I activate Kasun's account, enabling immediate sign-in capability.*
  > 
  > *When configuring user profiles, Admins can assign roles ('Admin' or 'Staff') and update user handles. Notice that email address fields remain strictly locked and read-only for security and account integrity."*

- **Screen Action (6:30 – 7:30)**: Point out the dynamic DiceBear user avatars next to staff accounts. Navigate to **Category Management** (`CategoriesPage`), show the 6 standardized IT hardware category cards (Computers, Servers, Networking, Monitors, Peripherals, and Power), and click a card to filter inventory by category.

- **Presenter 3 (6:30 – 7:30)**:
  > *"Notice also that every user is assigned an automatic, unique DiceBear SVG avatar generated from their profile initials.*
  > 
  > *Under Category Management, our stock is organized across 6 standardized IT hardware categories: Computers & Laptops, Servers & Storage, Networking & Telecom, Monitors & Displays, Peripherals & Components, and Power & Infrastructure. Clicking any category instantly filters our inventory view.*
  > 
  > *Now Presenter 4 will present our financial valuation analytics, automated exports, and audit compliance logs."*

---

### ⏱️ Segment 4: Financial Analytics, Automated Exports & Audit Trails (7:30 – 10:00)
**Presenter**: Presenter 4 (Analytics, Data Export & Compliance Lead)  
**Screen Action (7:30 – 8:15)**: Navigate to **Dashboard** and **Reports Page** (`ReportsPage`). Highlight Metric Cards (Total Products, Low Stock Count, Out of Stock Count, Cost-Basis Valuation) and top Recharts charts.

- **Presenter 4 (7:30 – 8:15)**:
  > *"Thank you, Presenter 3! StockFlow delivers executive-grade business intelligence. On our Executive Dashboard and Reports page, Administrators gain real-time visibility into total cost-basis inventory valuation, market sales margins, and projected gross profit.*
  > 
  > *Our interactive Recharts graphs display category distribution and stock volume breakdown across all hardware assets."*

- **Screen Action (8:15 – 9:00)**: Show the Reports layout with stock movement charts at top, followed by the section tab bar (`Comprehensive Valuation Table` / `Stock Movement Timeline`). Click **"Export CSV"** and **"Export JSON"** in the top toolbar to trigger automated data exports.

- **Presenter 4 (8:15 – 9:00)**:
  > *"Notice our refined reports layout: financial analytics and stock movement charts are prominently positioned at the top, with sub-navigation tabs right below for deep-dive valuation tables and movement timelines.*
  > 
  > *Administrators can export complete valuation reports directly to formatted CSV files or raw JSON payloads with a single click."*

- **Screen Action (9:00 – 9:30)**: Navigate to **Staff Activity Audit Trail** (`StaffActivityPage`). Show logged events with timestamps, action badges, and user avatars. Trigger a custom confirmation modal on **Settings Page**.

- **Presenter 4 (9:00 – 9:30)**:
  > *"For compliance and governance, every stock transaction, product addition, and user approval is recorded in our Staff Activity Audit Log with exact timestamps and staff avatars.*
  > 
  > *Furthermore, we replaced native browser alert popups with modern Custom System Modals for seamless UX feedback and threshold configuration."*

- **Screen Action (9:30 – 10:00)**: Navigate back to Main Dashboard view. Final concluding remarks.

- **Presenter 4 (9:30 – 10:00)**:
  > *"In conclusion, StockFlow Enterprise ERP brings together role-based security, automated staff approval workflows, real-time financial valuation, and modern UI design into an all-in-one inventory platform.*
  > 
  > *On behalf of our entire engineering team, thank you for watching our demonstration!"*

---

## 📌 Summary Checklist for Recording Day

| Segment & Time | Presenter | Key Focus Area | Key UI Components Demonstrated |
| :--- | :--- | :--- | :--- |
| **Segment 1 (0:00 – 2:30)** | Presenter 1 | Introduction & Public Site | Landing Page, Blue Underline Navbar, Standalone Pages (Features, About, Contact), Glassmorphism Modal Return |
| **Segment 2 (2:30 – 5:00)** | Presenter 2 | Staff Operations | Staff Registration, Pending Admin Approval Lockout, Inventory Catalog Search, Stock IN/OUT Movements |
| **Segment 3 (5:00 – 7:30)** | Presenter 3 | Admin & Security (RBAC) | Admin Executive Control Panel, Pending Staff Queue Approval, Lockable Email Validation, DiceBear Avatars, 6 Predefined Category Cards |
| **Segment 4 (7:30 – 10:00)** | Presenter 4 | Analytics, Automated Exports & Wrap-Up | Recharts Financial Valuation, Reports Layout & Sub-Navigation Tabs, Automated CSV/JSON Export, Staff Activity Audit Trail, Custom System Modals, Conclusion |Wrap-Up | Recharts Financial Valuation, Bulk CSV Drag-and-Drop Import, Staff Activity Audit Trail, Custom System Modals, Conclusion |
