# Account Managers Module

This module provides comprehensive management functionality for account managers in the MySkillDB system.

## Features

### 📋 **Account Manager Management**
- **Create**: Add new account managers with complete profile information
- **Read**: View all account managers in a paginated table
- **Update**: Edit existing account manager details
- **Delete**: Remove account managers (single or bulk deletion)

### 🔍 **Search & Filtering**
- **Name Search**: Filter by account manager name
- **Email Search**: Filter by email address
- **Mobile Search**: Filter by mobile number
- **School Assignment Search**: Filter by assigned school names
- **Real-time Filtering**: Instant results as you type

### 📊 **Data Display**
- **Paginated Table**: Shows 7 account managers per page
- **Comprehensive Information**: Name, email, mobile, Aadhar card, assigned schools, status, last login
- **Status Indicators**: Visual status badges (Active, Inactive, Pending)
- **School Assignment Display**: Shows number of assigned schools with names

### 🏫 **School Assignment**
- **Multi-school Assignment**: Assign account managers to multiple schools
- **Visual School Selection**: Checkbox-based school selection interface
- **Select All/Deselect All**: Quick selection controls
- **Assignment Summary**: Shows selected schools with school details

### 📱 **Responsive Design**
- **Mobile Optimized**: Works seamlessly on all device sizes
- **Touch Friendly**: Optimized for touch interactions
- **Adaptive Layout**: Responsive grid and table layouts

## Components

### Main Components
- **`AccountManagers`**: Main page component with full functionality
- **`AccountManagersTable`**: Table component with pagination and actions
- **`AccountManagerModal`**: Modal for creating/editing account managers

### Data Fields

#### Required Fields
- **Name**: Full name of the account manager
- **Email**: Valid email address (unique)
- **Mobile Number**: Contact number with country code
- **Aadhar Card Number**: 12-digit Aadhar card number
- **Assigned Schools**: At least one school must be assigned

#### Optional Fields
- **Status**: Active, Inactive, or Pending (default: Active)

### Validation Rules

#### Name
- Required field
- Cannot be empty

#### Email
- Required field
- Must be valid email format
- Should be unique across system

#### Mobile Number
- Required field
- Must be valid phone number format
- Supports international formats

#### Aadhar Card Number
- Required field
- Must be exactly 12 digits
- Only numeric characters allowed
- Auto-formatted for display

#### School Assignment
- At least one school must be selected
- Multiple schools can be assigned
- Schools can be selected/deselected individually

## API Integration

### Mock Data
Currently uses mock data for demonstration. To integrate with real API:

1. **Uncomment API calls** in `fetchAccountManagers()`
2. **Uncomment API calls** in `fetchSchools()`
3. **Uncomment API calls** in `handleAccountManagerSubmit()`
4. **Uncomment API calls** in `handleDeleteAccountManager()`
5. **Uncomment API calls** in `handleBulkDelete()`

### API Endpoints (Expected)
```
GET    /api/account-managers          - Get all account managers
POST   /api/account-managers          - Create new account manager
PUT    /api/account-managers/:id      - Update account manager
DELETE /api/account-managers/:id      - Delete account manager
DELETE /api/account-managers/bulk     - Bulk delete account managers
GET    /api/schools                   - Get all schools for assignment
```

## Usage

### Navigation
Access via: **Master Dashboard → Account Managers**

### Adding Account Manager
1. Click "Add Account Manager" button
2. Fill in required information
3. Select assigned schools
4. Choose status
5. Click "Create Account Manager"

### Editing Account Manager
1. Click edit icon in the table row
2. Modify information as needed
3. Update school assignments
4. Click "Update Account Manager"

### Bulk Operations
1. Select multiple account managers using checkboxes
2. Click "Delete Selected" for bulk deletion
3. Confirm the action

### Search & Filter
1. Use search fields to filter results
2. Apply multiple filters simultaneously
3. Click "Clear Filters" to reset
4. Results update in real-time

## Technical Details

### State Management
- **Local State**: Uses React hooks for component state
- **Form State**: Managed with controlled components
- **Pagination State**: Independent pagination for each table
- **Filter State**: Persistent filter state during session

### Performance Optimizations
- **Pagination**: Only renders 7 items per page
- **Lazy Loading**: Components load on demand
- **Efficient Filtering**: Client-side filtering for mock data
- **Optimized Re-renders**: Proper dependency arrays in useEffect

### Error Handling
- **Form Validation**: Comprehensive client-side validation
- **API Error Handling**: Graceful error handling with user feedback
- **User Feedback**: Toast notifications for all actions
- **Loading States**: Loading indicators during API calls

## File Structure
```
src/master/master-account-managers/
├── account_managers.jsx          # Main page component
└── README.md                     # This documentation

src/components/master-user-components/master-account-manager-components/
├── AccountManagersTable.jsx      # Table component
├── index.js                      # Component exports
└── modals/
    └── AccountManagerModal.jsx   # Create/Edit modal
```

## Future Enhancements
- **Export Functionality**: Export account manager data to Excel/CSV
- **Advanced Filtering**: Date range filters, status filters
- **Bulk Import**: Import account managers from Excel
- **Activity Logging**: Track account manager activities
- **Permission Management**: Role-based access control
- **Dashboard Analytics**: Account manager performance metrics
