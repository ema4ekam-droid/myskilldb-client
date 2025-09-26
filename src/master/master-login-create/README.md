# School Login Management System

A comprehensive system for managing school user logins including principals, HODs, teachers, and parent/student accounts.

## Features

### 🏫 School Management
- View all schools with filtering by country, state, and district
- Display login counts for each user type per school
- Bulk operations across multiple schools

### 👥 User Login Creation
- **Principal Login**: Name, Email, Mobile Number (optional)
- **HOD Login**: Name, Email, Mobile Number, Department (required)
- **Teacher Login**: Name, Email, Mobile Number (optional)
- **Parent/Student Login**: Name, Email, Mobile Number (optional)

### 📊 Bulk Operations
- **Bulk Upload**: Excel-based bulk creation of user logins
- **Bulk Delete**: Remove multiple users from a school
- **Template Download**: Get Excel templates for each user type
- **Email Credentials**: Send login credentials via email

### 🔧 Key Components

#### Main Components
- `SchoolLoginManager` - Main page component with navigation and state management
- `SchoolsTable` - Displays schools with login counts and action buttons

#### Modal Components
- `LoginFormModal` - Create individual user logins
- `BulkUploadModal` - Handle bulk uploads with file validation
- `BulkDeleteModal` - Manage bulk user deletion
- `EmailCredentialsModal` - Send login credentials via email

#### Utilities
- `schoolLoginApi` - API functions for all backend operations
- `validationUtils` - Form and data validation helpers
- `excelUtils` - Excel template generation and validation
- `userTypeConfig` - Configuration for different user types

## File Structure

```
src/master/master-login-create/
├── school_login_manager.jsx          # Main page component
└── README.md                         # This documentation

src/components/master-user-components/master-login-create-components/
├── SchoolsTable.jsx                  # Schools display table
├── index.js                          # Component exports
├── modals/
│   ├── LoginFormModal.jsx           # Individual login creation
│   ├── BulkUploadModal.jsx          # Bulk upload interface
│   ├── BulkDeleteModal.jsx          # Bulk deletion interface
│   └── EmailCredentialsModal.jsx    # Email credentials interface
└── utils/
    └── schoolLoginApi.js            # API utilities and configurations
```

## API Endpoints

The system expects the following backend endpoints:

### School Management
- `GET /api/schools` - Get schools with filters
- `GET /api/schools/:id/login-counts` - Get login counts for a school

### User Management
- `POST /api/school-logins` - Create individual login
- `GET /api/schools/:id/users/:type` - Get users by type for a school
- `PUT /api/school-logins/:id` - Update user details
- `DELETE /api/school-logins/:id` - Delete individual user

### Bulk Operations
- `POST /api/school-logins/bulk-upload` - Bulk upload users
- `DELETE /api/school-logins/bulk-delete` - Bulk delete users
- `GET /api/school-logins/template/:type` - Download template

### Email & Utilities
- `POST /api/school-logins/email-credentials` - Email login credentials
- `GET /api/school-logins/stats` - Get system statistics

## Usage

### Navigation
The system is accessible via the "School Logins" menu option in the master navigation sidebar.

### Creating Individual Logins
1. Navigate to the School Logins page
2. Find the desired school in the table
3. Click "Create Login" dropdown
4. Select the user type (Principal, HOD, Teacher, Parent/Student)
5. Fill in the required information
6. Submit to create the login

### Bulk Upload
1. Click "Bulk Upload" button
2. Select user type for upload
3. Download the appropriate template
4. Fill in user data following the template format
5. Upload the completed Excel file
6. System validates and creates all user accounts

### Email Credentials
1. Click on user type actions menu (three dots)
2. Select "Email All Credentials" or "Email Credentials"
3. Choose recipients and email options
4. Send credentials to selected users

## Data Validation

### Required Fields
- **All Users**: Name, Email
- **HOD**: Name, Email, Department
- **Optional**: Mobile Number (for all user types)

### Email Validation
- Must be valid email format
- Must be unique across the system

### Mobile Validation
- Optional field
- If provided, must be valid format (10+ digits with optional country code)

## Excel Template Format

### Principal/Teacher/Parent Template
| Name | Email | Mobile Number |
|------|-------|---------------|
| John Doe | john.doe@school.com | +1234567890 |

### HOD Template
| Name | Email | Mobile Number | Department |
|------|-------|---------------|------------|
| Jane Smith | jane.smith@school.com | +1234567891 | Mathematics |

## Error Handling

The system includes comprehensive error handling for:
- Form validation errors
- API communication errors
- File upload validation
- Excel data validation
- Network connectivity issues

## Styling

The system uses Tailwind CSS with a consistent design language:
- Clean, modern interface
- Responsive design for mobile and desktop
- Color-coded user types and status indicators
- Intuitive icons and visual feedback

## Security Considerations

- Email addresses are validated for uniqueness
- File uploads are restricted to Excel format
- All API calls include proper error handling
- User permissions are managed per user type
- Bulk operations include confirmation dialogs

## Future Enhancements

Potential improvements could include:
- Advanced filtering and search capabilities
- User activity tracking and analytics
- Integration with school management systems
- Automated password reset functionality
- Role-based access control
- Audit logging for all operations
