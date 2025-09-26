// Main components
export { default as SchoolsTable } from './SchoolsTable';

// Modal components
export { default as LoginFormModal } from './modals/LoginFormModal';
export { default as BulkUploadModal } from './modals/BulkUploadModal';
export { default as BulkDeleteModal } from './modals/BulkDeleteModal';
export { default as EmailCredentialsModal } from './modals/EmailCredentialsModal';

// Utility exports
export { 
  schoolLoginApi, 
  validationUtils, 
  excelUtils, 
  userTypeConfig, 
  departments 
} from './utils/schoolLoginApi';
