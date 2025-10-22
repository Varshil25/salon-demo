# Salon Admin Functionality Analysis

## Overview
This document provides a comprehensive list of all functionality from the `salon-admin` dashboard to be migrated to the `tokyo-free-white-react-admin-dashboard`.

---

## Technology Stack Comparison

### Salon Admin
- **Framework**: React 18.3.1 with TypeScript
- **UI Library**: Reactstrap (Bootstrap-based)
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v6
- **Charts**: ApexCharts, Chart.js, ECharts
- **Forms**: Formik with Yup validation
- **Icons**: Remix Icons, Feather Icons
- **Calendar**: FullCalendar
- **Additional**: i18next for internationalization, Socket.io for real-time features

### Tokyo Dashboard
- **Framework**: React 17.0.2 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router DOM v6
- **Charts**: ApexCharts
- **Styling**: Emotion (CSS-in-JS)
- **Theme**: Custom MUI theme system

---

## Core Features to Migrate

### 1. **Dashboard (Main)**
**Location**: `salon-admin/src/pages/DashboardEcommerce/`
**Components**:
- `index.tsx` - Main dashboard container
- `Widgets.tsx` - Dashboard widgets/stats cards
- `Section.tsx` - Dashboard sections
- `BestSellingProducts.tsx` - Product analytics
- `RecentActivity.tsx` - Activity feed
- `RecentOrders.tsx` - Order listing
- `Revenue.tsx` - Revenue charts
- `SalesByLocations.tsx` - Location-based analytics
- `StoreVisits.tsx` - Visit statistics
- `TopSellers.tsx` - Top sellers list

**Functionality**:
- Dashboard overview with KPIs
- Real-time statistics
- Revenue tracking
- Activity monitoring
- Sales analytics

---

### 2. **Customer Management**
**Location**: `salon-admin/src/pages/Pages/Admin/Customer/`
**Components**:
- `CustomerTable.tsx` - Customer data grid
- `CustomerAppointmentList.tsx` - Customer appointment history

**Features**:
- View all customers
- Customer details
- Appointment history per customer
- Customer filtering and search
- Export customer data

**Menu Item**: "Customers" - `ri-user-3-line` icon
**Route**: `/customer-table`
**Roles**: Admin, Salon Owner

---

### 3. **User Management**
**Location**: `salon-admin/src/pages/Pages/Admin/User/`
**Components**:
- `UserTable.tsx` - User management grid

**Features**:
- View all users
- Create/Edit/Delete users
- User role management
- User status management

**Menu Item**: "Users" - `ri-shield-user-fill` icon
**Route**: `/user-table`
**Roles**: Admin only

---

### 4. **Barber Management**
**Location**: `salon-admin/src/pages/Pages/Admin/Barbers/`
**Components**:
- `BarberTable.tsx` - Barber management grid

**Features**:
- View all barbers
- Add/Edit/Delete barbers
- Barber profile management
- Service assignments
- Availability management

**Menu Item**: "Barber" - `ri-scissors-cut-line` icon
**Route**: `/barber-table`
**Roles**: Admin, Salon Owner

---

### 5. **Barber Schedule Management**
**Location**: `salon-admin/src/pages/Pages/Admin/BarberSessions/`
**Components**:
- `BarberSessionsTable.tsx` - Schedule management

**Features**:
- Barber session scheduling
- Recurring sessions
- Session date management
- Start/End time configuration
- Salon-specific sessions

**Menu Item**: "Barber Schedule" - `ri-time-line` icon
**Route**: `/barber-schedule`
**Roles**: Admin, Salon Owner

---

### 6. **Salon Management**
**Location**: `salon-admin/src/pages/Pages/Admin/Salon/`
**Components**:
- `SalonTable.tsx` - Salon management grid

**Features**:
- View all salons
- Add/Edit/Delete salons
- Salon status management
- Location management
- Operating hours configuration

**Menu Item**: "Salon" - `ri-store-line` icon
**Route**: `/salon-table`
**Roles**: Admin only

---

### 7. **Role Management**
**Location**: `salon-admin/src/pages/Pages/Admin/Role/`
**Components**:
- `RoleTable.tsx` - Role management

**Features**:
- View all roles (Admin, Barber, Salon Owner)
- Create/Edit roles
- Permission management

**Menu Item**: "Role" - `ri-user-2-fill` icon
**Route**: `/role-table`
**Roles**: Admin only

---

### 8. **Board/Kanban**
**Location**: `salon-admin/src/pages/Pages/Admin/Board/`
**Components**:
- `Board.tsx` - Kanban board

**Features**:
- Task board management
- Drag-and-drop functionality
- Task status tracking
- Collaborative workspace

**Menu Item**: "Board" - `ri-dashboard-fill` icon
**Route**: `/board-table`
**Roles**: Admin, Barber, Salon Owner

---

### 9. **Service Management**
**Location**: `salon-admin/src/pages/Pages/Admin/OurService/`
**Components**:
- `OurServiceTable.tsx` - Service listing

**Features**:
- View all services
- Add/Edit/Delete services
- Service pricing
- Service duration
- Service descriptions

**Menu Item**: "Our Service" - `ri-service-line` icon
**Route**: `/service-table`
**Roles**: Admin only

---

### 10. **Appointment Management**
**Location**: `salon-admin/src/pages/Pages/Admin/Appointments/`
**Components**:
- `AppointmentTable.tsx` - Appointment grid
- `AppointmentListCol.tsx` - Column definitions
- `Widgets.tsx` - Appointment statistics

**Features**:
- View all appointments
- Appointment status tracking (Pending, Confirmed, Completed, Cancelled)
- Check-in/Check-out times
- Appointment services
- Customer details
- Barber assignment
- Dashboard with appointment metrics

**Menu Item**: "Appointment" - `ri-calendar-check-fill` icon
**Route**: `/appointment-table`
**Roles**: Admin, Barber, Salon Owner

---

### 11. **In-Salon Appointments**
**Location**: `salon-admin/src/pages/Pages/Admin/Insalonappointment/`
**Components**:
- `salonappointment.tsx` - In-salon booking system

**Features**:
- Walk-in appointment management
- Direct booking system
- Quick appointment creation

**Menu Item**: "In Salon Appointment" - `ri-calendar-check-line` icon
**Route**: `/Insalon-table`
**Roles**: Admin, Salon Owner

---

### 12. **Blog Management**
**Location**: `salon-admin/src/pages/Pages/Admin/Blog/`
**Components**:
- `BlogTable.tsx` - Blog post management

**Features**:
- Create/Edit/Delete blog posts
- Content management
- Blog publishing

**Menu Item**: "Blog" - `ri-book-open-line` icon
**Route**: `/blog-table`
**Roles**: Admin only

---

### 13. **Haircut Details**
**Location**: `salon-admin/src/pages/Pages/Admin/HaircutDetail/`
**Components**:
- `HaircutDetailsTable.tsx` - Haircut service details

**Features**:
- Haircut service tracking
- Service history
- Detail management

**Route**: `/haircut-details-table`
**(Currently commented out in menu)**

---

### 14. **Favorite Salon**
**Location**: `salon-admin/src/pages/Pages/Admin/FavoriteSalon/`
**Components**:
- `FavoriteSalon.tsx` - Favorite salon listings

**Features**:
- Customer favorite salons
- Favorite tracking
- Salon preferences

**Route**: `/favorite-salon-table`
**(Currently commented out in menu)**

---

### 15. **User Profile**
**Location**: `salon-admin/src/pages/Authentication/`
**Components**:
- `user-profile.tsx` - User profile page

**Features**:
- View user profile
- Profile information
- Personal details

**Route**: `/profile`
**Roles**: Admin, Barber, Salon Owner

---

### 16. **Profile Settings**
**Location**: `salon-admin/src/pages/Pages/Profile/Settings/`
**Components**:
- `Settings.tsx` - Profile settings page

**Features**:
- Update profile information
- Change password
- Account settings
- Notification preferences

**Route**: `/pages-profile-settings`
**Roles**: Admin, Barber, Salon Owner

---

### 17. **Notifications**
**Location**: `salon-admin/src/pages/Authentication/`
**Components**:
- `Notification.tsx` - Notification center

**Features**:
- View notifications
- Real-time updates
- Notification management

**Route**: `/notification`
**Roles**: Admin, Barber, Salon Owner

---

### 18. **Team Management**
**Location**: `salon-admin/src/pages/Pages/Team/`
**Components**:
- `Team.tsx` - Team overview

**Features**:
- View team members
- Team structure
- Collaborative features

**Route**: `/pages-team`
**Roles**: Admin, Barber, Salon Owner

---

### 19. **Privacy Policy**
**Location**: `salon-admin/src/pages/Pages/PrivacyPolicy/`

**Route**: `/pages-privacy-policy`
**Roles**: Admin, Barber, Salon Owner

---

### 20. **Terms & Conditions**
**Location**: `salon-admin/src/pages/Pages/TermsCondition/`

**Route**: `/termscondition`
**Roles**: Admin, Barber, Salon Owner

---

### 21. **Timeline**
**Location**: `salon-admin/src/pages/Pages/Timeline/`
**Components**:
- `Timeline.tsx` - Activity timeline

**Route**: `/pages-timeline`

---

### 22. **FAQs**
**Location**: `salon-admin/src/pages/Pages/Faqs/`
**Components**:
- `Faqs.tsx` - FAQ page

**Route**: `/pages-faqs`

---

## Authentication Features

### Login System
**Location**: `salon-admin/src/pages/Authentication/`
- `Login.tsx` - Login page
- `Register.tsx` - Registration page
- `ForgetPassword.tsx` - Password recovery
- `Logout.tsx` - Logout handler

**Features**:
- Email/password authentication
- Remember me
- Password reset
- User registration
- Role-based access control

---

## Services Layer

### Dashboard Service
**Location**: `salon-admin/src/Services/DashboardService.ts`
**Functions**:
- `fetchDashboardData()` - Main dashboard data
- `fetchAppointmentDashboardData()` - Appointment statistics

### API Services
**Location**: `salon-admin/src/Services/`
Multiple service files for different entities

---

## Redux State Management

### Slices
**Location**: `salon-admin/src/slices/`
**Key Slices**:
- Authentication slice
- Dashboard slice
- User management slice
- Appointment slice
- Salon management slice
- Various feature-specific slices

---

## Common Components

### Reusable Components
**Location**: `salon-admin/src/Components/`
- BreadCrumb
- DeleteModal
- Loaders
- Common UI elements

---

## Helpers & Utilities

### Helper Functions
**Location**: `salon-admin/src/helpers/`
**Common Utilities**:
- API helper functions
- Date/time utilities
- Format helpers
- Validation helpers

---

## Internationalization

**Setup**: i18next
**Location**: `salon-admin/src/locales/`
**Supported Languages**: Multiple language JSON files

---

## Key Migration Considerations

### 1. **UI Framework Differences**
- **From**: Reactstrap (Bootstrap components)
- **To**: Material-UI
- Need to convert all Bootstrap components to MUI equivalents

### 2. **Icon Libraries**
- **From**: Remix Icons, Feather Icons
- **To**: MUI Icons
- Icon mappings needed

### 3. **State Management**
- Salon Admin uses Redux Toolkit extensively
- Need to implement Redux in Tokyo dashboard or use alternative state management

### 4. **API Integration**
- All API calls need to be connected to `salon-api` backend
- Services layer needs to be migrated

### 5. **Role-Based Access Control**
- Implement three roles: Admin, Salon Owner, Barber
- Menu filtering based on roles
- Route protection

### 6. **Real-time Features**
- Socket.io integration for notifications
- Real-time updates for appointments

---

## Migration Priority

### Phase 1: Core Setup
1. Add Redux Toolkit to Tokyo dashboard
2. Setup API services layer
3. Implement authentication
4. Setup routing structure

### Phase 2: Main Features
1. Dashboard (Main)
2. Appointment Management
3. Customer Management
4. Barber Management
5. Salon Management

### Phase 3: Secondary Features
1. User Management
2. Role Management
3. Service Management
4. Board/Kanban
5. Barber Schedule

### Phase 4: Additional Features
1. Blog Management
2. In-Salon Appointments
3. Notifications
4. Profile & Settings
5. Team Management

### Phase 5: Static Pages
1. Privacy Policy
2. Terms & Conditions
3. FAQs
4. Timeline

---

## Component Mapping Guide

### Bootstrap to MUI Conversions

| Reactstrap Component | MUI Equivalent |
|---------------------|----------------|
| `Container` | `Container` |
| `Row` | `Grid container` |
| `Col` | `Grid item` |
| `Button` | `Button` |
| `Card` | `Card` |
| `CardBody` | `CardContent` |
| `CardHeader` | `CardHeader` |
| `Form` | `Box component="form"` |
| `Input` | `TextField` |
| `Label` | `InputLabel` |
| `Table` | `Table` or `DataGrid` |
| `Modal` | `Dialog` |
| `Nav` | `Tabs` or `List` |
| `Navbar` | `AppBar` |
| `Dropdown` | `Menu` |
| `Alert` | `Alert` |
| `Badge` | `Badge` |
| `Pagination` | `Pagination` |

---

## Next Steps

1. Install required dependencies in Tokyo dashboard
2. Setup Redux store
3. Create service layer
4. Implement authentication flow
5. Build layout with role-based navigation
6. Migrate components one by one following the priority order

---

**Document Created**: For migration planning
**Source**: salon-admin dashboard
**Target**: tokyo-free-white-react-admin-dashboard

