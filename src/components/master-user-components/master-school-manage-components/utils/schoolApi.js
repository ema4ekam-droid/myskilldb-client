// Mock API functions for school management
// Replace these with actual API calls when backend is ready

export const fetchStates = async () => {
  // Mock API call - replace with actual endpoint
  const mockStates = ['Karnataka', 'Tamil Nadu', 'Kerala', 'Maharashtra', 'Delhi'];
  return mockStates;
};

export const fetchDistricts = async (state) => {
  if (!state) return [];
  
  // Mock API call - replace with actual endpoint
  const mockDistricts = {
    'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    'Delhi': ['Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi']
  };
  return mockDistricts[state] || [];
};

export const fetchSchools = async (state, district) => {
  if (!state || !district) return [];
  
  // Mock API call - replace with actual endpoint
  const mockSchools = [
    { id: 's1', name: 'Greenwood High School', address: '123 Education Street' },
    { id: 's2', name: 'St. Mary\'s School', address: '456 Learning Avenue' },
    { id: 's3', name: 'Delhi Public School', address: '789 Knowledge Road' },
    { id: 's4', name: 'Kendriya Vidyalaya', address: '321 Wisdom Lane' }
  ];
  return mockSchools;
};

export const createLogin = async (loginData) => {
  // Mock API call - replace with actual endpoint
  console.log('Creating login:', loginData);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { success: true, message: 'Login created successfully!' };
};

export const uploadBulkLogins = async (formData) => {
  // Mock API call - replace with actual endpoint
  console.log('Uploading bulk logins:', formData);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return { success: true, message: 'Bulk login upload completed successfully!' };
};

export const downloadTemplate = () => {
  // Create CSV template content
  const csvContent = `loginType,name,email,phone,qualification,department,subject,experience,studentName,class,rollNumber
principal,John Smith,john.smith@school.com,9876543210,M.Ed,,,,,,
hod,Jane Doe,jane.doe@school.com,9876543211,Ph.D,Mathematics,,,,,,
teacher,Mike Johnson,mike.johnson@school.com,9876543212,M.Sc,Mathematics,5,,,,,
parent-student,Sarah Wilson,sarah.wilson@email.com,9876543213,,,John Wilson,10,12345`;

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'login_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
