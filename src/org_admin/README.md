# Organization Admin Portal

This folder contains the organization admin portal pages and components for managing school/organization operations.

## Folder Structure

```
src/
├── org_admin/                           # Main organization admin pages
│   ├── org-dashboard.jsx               # Main dashboard page
│   └── README.md                       # This file
│
└── components/
    └── org-admin-components/           # Organization admin components
        ├── index.js                    # Component exports
        ├── dashboard-components/       # Dashboard related components
        │   └── OrgNavigation.jsx      # Navigation component
        ├── student-management-components/ # Student management
        │   └── StudentList.jsx        # Student list component
        ├── teacher-management-components/ # Teacher management
        ├── class-management-components/   # Class management
        ├── attendance-components/         # Attendance tracking
        ├── reports-components/           # Reports and analytics
        └── settings-components/          # Settings and configuration
```

## Components Overview

### Dashboard Components
- **OrgNavigation**: Sidebar navigation for the organization admin portal

### Student Management Components
- **StudentList**: Component for displaying and managing student information

### Future Components (To be implemented)
- Teacher Management
- Class Management
- Attendance Tracking
- Reports and Analytics
- Settings and Configuration

## Usage

Import components from the main index file:

```javascript
import { OrgNavigation, StudentList } from '../components/org-admin-components';
```

## API Integration

Components are designed to work with the backend API using the `VITE_SERVER_API_URL` environment variable. Make sure to set this in your `.env` file:

```
VITE_SERVER_API_URL=http://localhost:8000
```

## Styling

All components use Tailwind CSS for styling and maintain consistency with the existing design system. The color scheme and component styles follow the same patterns as the master admin components.
