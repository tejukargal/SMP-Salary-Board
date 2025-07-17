// Global variables
let salaryData = [];
let filteredData = [];
let currentEmployee = null;

// DOM elements
const dashboardView = document.getElementById('dashboardView');
const loginView = document.getElementById('loginView');
const employeeView = document.getElementById('employeeView');
const adminView = document.getElementById('adminView');
const dashboardBtn = document.getElementById('dashboardBtn');
const loginBtn = document.getElementById('loginBtn');
const backBtn = document.getElementById('backBtn'); // This element doesn't exist in HTML
const loginForm = document.getElementById('loginForm');
const empIdInput = document.getElementById('empId');
const themeToggle = document.getElementById('themeToggle');
const cancelBtn = document.getElementById('cancelBtn');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const clearFiltersBtn = document.getElementById('clearFilters');
const salaryModal = document.getElementById('salaryModal');
const closeModalBtn = document.getElementById('closeModal');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const employeeLogoutBtn = document.getElementById('employeeLogoutBtn');
const backToAdminBtn = document.getElementById('backToAdminBtn');
let cameFromAdmin = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadCSVData();
    setupEventListeners();
    initializeTheme();
    showView('dashboard');
});

// Setup event listeners
function setupEventListeners() {
    dashboardBtn.addEventListener('click', handleDashboardNavigation);
    loginBtn.addEventListener('click', () => showView('login'));
    // backBtn.addEventListener('click', handleDashboardNavigation); // Commented out as backBtn doesn't exist
    themeToggle.addEventListener('click', toggleTheme);
    cancelBtn.addEventListener('click', () => showView('dashboard'));
    adminLoginBtn.addEventListener('click', handleAdminLogin);
    
    // Check if logout buttons exist before adding listeners
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', handleAdminLogout);
    }
    if (employeeLogoutBtn) {
        employeeLogoutBtn.addEventListener('click', handleEmployeeLogout);
    }
    if (backToAdminBtn) {
        backToAdminBtn.addEventListener('click', handleBackToAdmin);
    }
    
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Ensure close modal button works
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    loginForm.addEventListener('submit', handleLogin);
    
    document.getElementById('yearFilter').addEventListener('change', filterData);
    document.getElementById('monthFilter').addEventListener('change', filterData);
    document.getElementById('employeeSearchInput').addEventListener('input', debounce(filterEmployeeData, 300));
    
    // Close modal when clicking outside
    if (salaryModal) {
        salaryModal.addEventListener('click', (e) => {
            if (e.target === salaryModal) {
                closeModal();
            }
        });
    }
    
    // Add keyboard ESC support for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && salaryModal && salaryModal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('.material-icons');
    if (icon) {
        icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
}

// Clear filters function
function clearFilters() {
    document.getElementById('yearFilter').value = '';
    document.getElementById('monthFilter').value = '';
    filterData();
}

// Admin Login with keyword
function handleAdminLogin() {
    const keyword = prompt('Enter admin password:');
    if (keyword === 'teju2015') {
        showView('admin');
    } else if (keyword !== null) {
        alert('Invalid admin password!');
    }
}

// Load and parse CSV data
async function loadCSVData() {
    try {
        const response = await fetch('Salary.csv');
        const csvText = await response.text();
        salaryData = parseCSV(csvText);
        filteredData = [...salaryData];
        
        populateFilters();
        updateDashboard();
        updateEmployeeTable();
    } catch (error) {
        console.error('Error loading CSV data:', error);
        alert('Error loading salary data. Please ensure Salary.csv is in the same directory.');
    }
}

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index].trim();
            });
            
            // Convert numeric fields
            row['Basic'] = parseFloat(row['Basic']) || 0;
            row['DA'] = parseFloat(row['DA']) || 0;
            row['HRA'] = parseFloat(row['HRA']) || 0;
            row['IR'] = parseFloat(row['IR']) || 0;
            row['SFN'] = parseFloat(row['SFN']) || 0;
            row['SPAY-TYPIST'] = parseFloat(row['SPAY-TYPIST']) || 0;
            row['P'] = parseFloat(row['P']) || 0;
            row['Gross Salary'] = parseFloat(row['Gross Salary']) || 0;
            row['IT'] = parseFloat(row['IT']) || 0;
            row['PT'] = parseFloat(row['PT']) || 0;
            row['GSLIC'] = parseFloat(row['GSLIC']) || 0;
            row['LIC'] = parseFloat(row['LIC']) || 0;
            row['FBF'] = parseFloat(row['FBF']) || 0;
            row['Total Deductions'] = parseFloat(row['Total Deductions']) || 0;
            row['Net Salary'] = parseFloat(row['Net Salary']) || 0;
            
            data.push(row);
        }
    }
    
    return data;
}

// Parse a single CSV line (handles commas within quoted values)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

// Populate filter dropdowns
function populateFilters() {
    const yearFilter = document.getElementById('yearFilter');
    const monthFilter = document.getElementById('monthFilter');
    
    const years = [...new Set(salaryData.map(row => row.Year))].sort();
    const months = [...new Set(salaryData.map(row => row.Month))];
    
    // Add year options
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
    
    // Add month options
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthFilter.appendChild(option);
    });
}

// Filter data based on selected filters
function filterData() {
    const yearFilter = document.getElementById('yearFilter').value;
    const monthFilter = document.getElementById('monthFilter').value;
    
    filteredData = salaryData.filter(row => {
        const yearMatch = !yearFilter || row.Year === yearFilter;
        const monthMatch = !monthFilter || row.Month === monthFilter;
        return yearMatch && monthMatch;
    });
    
    updateDashboard();
}

// Filter employee data for the employee table
function filterEmployeeData() {
    const searchQuery = document.getElementById('employeeSearchInput').value.toLowerCase();
    updateEmployeeTable(searchQuery);
}

// Update dashboard with filtered data
function updateDashboard() {
    updateStats();
    updateSummaryTable();
}

// Update statistics cards
function updateStats() {
    const totalEmployees = new Set(filteredData.map(row => row['EMP No'])).size;
    const totalGross = filteredData.reduce((sum, row) => sum + row['Gross Salary'], 0);
    const totalDeductions = filteredData.reduce((sum, row) => sum + row['Total Deductions'], 0);
    const totalNet = filteredData.reduce((sum, row) => sum + row['Net Salary'], 0);
    
    document.getElementById('totalEmployees').textContent = formatIndianNumber(totalEmployees);
    document.getElementById('totalGross').textContent = `₹${formatIndianNumber(totalGross)}`;
    document.getElementById('totalDeductions').textContent = `₹${formatIndianNumber(totalDeductions)}`;
    document.getElementById('totalNet').textContent = `₹${formatIndianNumber(totalNet)}`;
}

// Update year & month-wise consolidated summary table
function updateSummaryTable() {
    const tbody = document.getElementById('summaryTableBody');
    tbody.innerHTML = '';
    
    // Group data by year and month
    const summaryData = {};
    filteredData.forEach(row => {
        const key = `${row.Year}-${row.Month}`;
        if (!summaryData[key]) {
            summaryData[key] = {
                year: row.Year,
                month: row.Month,
                totalBasic: 0,
                totalDA: 0,
                totalHRA: 0,
                totalGross: 0,
                totalDeductions: 0,
                totalNet: 0
            };
        }
        summaryData[key].totalBasic += row['Basic'];
        summaryData[key].totalDA += row['DA'];
        summaryData[key].totalHRA += row['HRA'];
        summaryData[key].totalGross += row['Gross Salary'];
        summaryData[key].totalDeductions += row['Total Deductions'];
        summaryData[key].totalNet += row['Net Salary'];
    });
    
    // Sort by year and month
    const sortedData = Object.values(summaryData).sort((a, b) => {
        if (a.year !== b.year) {
            return b.year - a.year;
        }
        return getMonthNumber(b.month) - getMonthNumber(a.month);
    });
    
    sortedData.forEach(summary => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${summary.year}</td>
            <td class="clickable-cell" onclick="showSummaryModal('${summary.year}', '${summary.month}')">
                <span class="month-btn ${getMonthClass(summary.month)}">${summary.month}</span>
            </td>
            <td>₹${formatIndianNumber(summary.totalBasic)}</td>
            <td>₹${formatIndianNumber(summary.totalDA)}</td>
            <td>₹${formatIndianNumber(summary.totalHRA)}</td>
            <td>₹${formatIndianNumber(summary.totalGross)}</td>
            <td>₹${formatIndianNumber(summary.totalDeductions)}</td>
            <td>₹${formatIndianNumber(summary.totalNet)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Update employee table
function updateEmployeeTable(searchQuery = '') {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';
    
    // Group by employee to get unique entries
    const employeeMap = {};
    salaryData.forEach(row => {
        const empNo = row['EMP No'];
        if (!employeeMap[empNo]) {
            employeeMap[empNo] = {
                empNo: empNo,
                name: row.Name,
                designation: row.Designation,
                group: row.Group,
                totalGross: 0,
                totalNet: 0,
                monthCount: 0
            };
        }
        employeeMap[empNo].totalGross += row['Gross Salary'];
        employeeMap[empNo].totalNet += row['Net Salary'];
        employeeMap[empNo].monthCount++;
    });
    
    // Filter employees based on search query
    const filteredEmployees = Object.values(employeeMap).filter(employee => {
        if (!searchQuery) return true;
        return employee.name.toLowerCase().includes(searchQuery) ||
               employee.empNo.toString().includes(searchQuery) ||
               employee.designation.toLowerCase().includes(searchQuery);
    });
    
    filteredEmployees.forEach(employee => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${employee.empNo}</td>
            <td>${employee.name}</td>
            <td>${employee.designation}</td>
            <td>${employee.group}</td>
            <td>₹${formatIndianNumber(employee.totalGross)}</td>
            <td>₹${formatIndianNumber(employee.totalNet)}</td>
            <td><button class="btn-action" onclick="viewEmployee('${employee.empNo}')">View Details</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Handle employee login
function handleLogin(event) {
    event.preventDefault();
    const empId = empIdInput.value.trim();
    
    if (!empId) {
        alert('Please enter your Employee ID');
        return;
    }
    
    // Check if data is loaded
    if (!salaryData || salaryData.length === 0) {
        alert('Data is still loading. Please wait a moment and try again.');
        return;
    }
    
    const employee = salaryData.find(row => row['EMP No'] === empId);
    if (!employee) {
        alert('Employee ID not found. Please check your ID and try again.');
        return;
    }
    
    viewEmployee(empId);
}

// View employee details
function viewEmployee(empNo) {
    const employeeData = salaryData.filter(row => row['EMP No'] === empNo);
    if (employeeData.length === 0) {
        alert('Employee not found');
        return;
    }
    
    currentEmployee = employeeData[0];
    
    // Check if we came from admin view
    const currentView = document.querySelector('.view.active');
    if (currentView && currentView.id === 'adminView') {
        cameFromAdmin = true;
        backToAdminBtn.style.display = 'block';
    } else {
        cameFromAdmin = false;
        backToAdminBtn.style.display = 'none';
    }
    
    // Update employee info
    document.getElementById('employeeName').textContent = currentEmployee.Name;
    document.getElementById('employeeId').textContent = `EMP ID: ${currentEmployee['EMP No']}`;
    document.getElementById('employeeDesignation').textContent = `Designation: ${currentEmployee.Designation}`;
    document.getElementById('employeeGroup').textContent = `Group: ${currentEmployee.Group}`;
    
    // Update employee stats (removed average stats)
    const totalMonths = employeeData.length;
    const totalGross = employeeData.reduce((sum, row) => sum + row['Gross Salary'], 0);
    const totalDeductions = employeeData.reduce((sum, row) => sum + row['Total Deductions'], 0);
    const totalNet = employeeData.reduce((sum, row) => sum + row['Net Salary'], 0);
    
    document.getElementById('empTotalMonths').textContent = totalMonths;
    document.getElementById('empTotalGross').textContent = `₹${formatIndianNumber(totalGross)}`;
    document.getElementById('empTotalDeductions').textContent = `₹${formatIndianNumber(totalDeductions)}`;
    document.getElementById('empTotalNet').textContent = `₹${formatIndianNumber(totalNet)}`;
    
    // Update salary history table
    updateSalaryHistoryTable(employeeData);
    
    showView('employee');
}

// Update salary history table
function updateSalaryHistoryTable(employeeData) {
    const tbody = document.getElementById('salaryHistoryBody');
    tbody.innerHTML = '';
    
    // Sort by year and month
    const sortedData = employeeData.sort((a, b) => {
        if (a.Year !== b.Year) {
            return b.Year - a.Year;
        }
        return getMonthNumber(b.Month) - getMonthNumber(a.Month);
    });
    
    sortedData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="clickable-cell" onclick="showEmployeeModal('${row['EMP No']}', '${row.Year}', '${row.Month}')">
                <span class="month-btn ${getMonthClass(row.Month)}">${row.Month}</span>
            </td>
            <td>${row.Year}</td>
            <td>₹${formatIndianNumber(row.Basic)}</td>
            <td>₹${formatIndianNumber(row.DA)}</td>
            <td>₹${formatIndianNumber(row.HRA)}</td>
            <td>₹${formatIndianNumber(row['Gross Salary'])}</td>
            <td>₹${formatIndianNumber(row['Total Deductions'])}</td>
            <td>₹${formatIndianNumber(row['Net Salary'])}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Show salary details modal for summary table
function showSummaryModal(year, month) {
    // Get all employees for this month/year
    const monthData = salaryData.filter(row => row.Year === year && row.Month === month);
    if (monthData.length === 0) return;
    
    // Show aggregated data for the month
    const totalBasic = monthData.reduce((sum, row) => sum + row['Basic'], 0);
    const totalDA = monthData.reduce((sum, row) => sum + row['DA'], 0);
    const totalHRA = monthData.reduce((sum, row) => sum + row['HRA'], 0);
    const totalGross = monthData.reduce((sum, row) => sum + row['Gross Salary'], 0);
    const totalDeductions = monthData.reduce((sum, row) => sum + row['Total Deductions'], 0);
    const totalNet = monthData.reduce((sum, row) => sum + row['Net Salary'], 0);
    
    // Populate modal with aggregated data
    document.getElementById('modalMonthYear').textContent = `${month} ${year}`;
    document.getElementById('modalEmpNo').textContent = `All Employees (${monthData.length})`;
    document.getElementById('modalName').textContent = 'Consolidated Summary';
    document.getElementById('modalDesignation').textContent = 'All Designations';
    document.getElementById('modalPayScale').textContent = 'Multiple Groups';
    document.getElementById('modalBasic').textContent = `₹${formatIndianNumber(totalBasic)}`;
    document.getElementById('modalDA').textContent = `₹${formatIndianNumber(totalDA)}`;
    document.getElementById('modalHRA').textContent = `₹${formatIndianNumber(totalHRA)}`;
    document.getElementById('modalP').textContent = `₹${formatIndianNumber(monthData.reduce((sum, row) => sum + row['P'], 0))}`;
    document.getElementById('modalSFN').textContent = `₹${formatIndianNumber(monthData.reduce((sum, row) => sum + row['SFN'], 0))}`;
    document.getElementById('modalSPAY').textContent = `₹${formatIndianNumber(monthData.reduce((sum, row) => sum + row['SPAY-TYPIST'], 0))}`;
    document.getElementById('modalIT').textContent = `₹${formatIndianNumber(monthData.reduce((sum, row) => sum + row['IT'], 0))}`;
    document.getElementById('modalPT').textContent = `₹${formatIndianNumber(monthData.reduce((sum, row) => sum + row['PT'], 0))}`;
    document.getElementById('modalGSLIC').textContent = `₹${formatIndianNumber(monthData.reduce((sum, row) => sum + row['GSLIC'], 0))}`;
    document.getElementById('modalLIC').textContent = `₹${formatIndianNumber(monthData.reduce((sum, row) => sum + row['LIC'], 0))}`;
    document.getElementById('modalFBF').textContent = `₹${formatIndianNumber(monthData.reduce((sum, row) => sum + row['FBF'], 0))}`;
    document.getElementById('modalTotalDeductions').textContent = `₹${formatIndianNumber(totalDeductions)}`;
    document.getElementById('modalGrossSalary').textContent = `₹${formatIndianNumber(totalGross)}`;
    document.getElementById('modalNetSalary').textContent = `₹${formatIndianNumber(totalNet)}`;
    document.getElementById('modalBankAC').textContent = 'Multiple Accounts';
    
    salaryModal.classList.add('active');
}

// Show salary details modal for specific employee
function showEmployeeModal(empNo, year, month) {
    const employeeData = salaryData.find(row => 
        row['EMP No'] === empNo && row.Year === year && row.Month === month
    );
    
    if (!employeeData) return;
    
    // Populate modal with employee data
    document.getElementById('modalMonthYear').textContent = `${month} ${year}`;
    document.getElementById('modalEmpNo').textContent = employeeData['EMP No'];
    document.getElementById('modalName').textContent = employeeData.Name;
    document.getElementById('modalDesignation').textContent = employeeData.Designation;
    document.getElementById('modalPayScale').textContent = `Group ${employeeData.Group}/${employeeData['Next Increment Date']}`;
    document.getElementById('modalBasic').textContent = `₹${formatIndianNumber(employeeData['Basic'])}`;
    document.getElementById('modalDA').textContent = `₹${formatIndianNumber(employeeData['DA'])}`;
    document.getElementById('modalHRA').textContent = `₹${formatIndianNumber(employeeData['HRA'])}`;
    document.getElementById('modalP').textContent = `₹${formatIndianNumber(employeeData['P'])}`;
    document.getElementById('modalSFN').textContent = `₹${formatIndianNumber(employeeData['SFN'])}`;
    document.getElementById('modalSPAY').textContent = `₹${formatIndianNumber(employeeData['SPAY-TYPIST'])}`;
    document.getElementById('modalIT').textContent = `₹${formatIndianNumber(employeeData['IT'])}`;
    document.getElementById('modalPT').textContent = `₹${formatIndianNumber(employeeData['PT'])}`;
    document.getElementById('modalGSLIC').textContent = `₹${formatIndianNumber(employeeData['GSLIC'])}`;
    document.getElementById('modalLIC').textContent = `₹${formatIndianNumber(employeeData['LIC'])}`;
    document.getElementById('modalFBF').textContent = `₹${formatIndianNumber(employeeData['FBF'])}`;
    document.getElementById('modalTotalDeductions').textContent = `₹${formatIndianNumber(employeeData['Total Deductions'])}`;
    document.getElementById('modalGrossSalary').textContent = `₹${formatIndianNumber(employeeData['Gross Salary'])}`;
    document.getElementById('modalNetSalary').textContent = `₹${formatIndianNumber(employeeData['Net Salary'])}`;
    document.getElementById('modalBankAC').textContent = employeeData['Bank A/C Number'];
    
    salaryModal.classList.add('active');
}

// Close modal
function closeModal() {
    salaryModal.classList.remove('active');
}

// Get month number for sorting
function getMonthNumber(monthName) {
    const months = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4,
        'May': 5, 'June': 6, 'July': 7, 'August': 8,
        'September': 9, 'October': 10, 'November': 11, 'December': 12
    };
    return months[monthName] || 0;
}

// Format numbers in Indian style (lakhs and crores)
function formatIndianNumber(num) {
    if (num === 0) return '0';
    
    const numStr = Math.abs(num).toString();
    const isNegative = num < 0;
    
    let result = '';
    let count = 0;
    
    // Process from right to left
    for (let i = numStr.length - 1; i >= 0; i--) {
        // Add comma after every 3 digits for the first group (thousands)
        if (count === 3) {
            result = ',' + result;
        }
        // Add comma after every 2 digits for subsequent groups (lakhs, crores, etc.)
        else if (count > 3 && (count - 3) % 2 === 0) {
            result = ',' + result;
        }
        
        result = numStr[i] + result;
        count++;
    }
    
    return isNegative ? '-' + result : result;
}

// Show specific view
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected view and activate corresponding nav button
    switch(viewName) {
        case 'dashboard':
            dashboardView.classList.add('active');
            dashboardBtn.classList.add('active');
            break;
        case 'login':
            loginView.classList.add('active');
            loginBtn.classList.add('active');
            empIdInput.value = '';
            empIdInput.focus();
            break;
        case 'admin':
            adminView.classList.add('active');
            updateEmployeeTable();
            break;
        case 'employee':
            employeeView.classList.add('active');
            break;
    }
}

// Dashboard navigation with logout check
function handleDashboardNavigation() {
    const currentView = document.querySelector('.view.active');
    
    if (currentView && (currentView.id === 'employeeView' || currentView.id === 'adminView')) {
        const confirmLogout = confirm('Are you sure you want to logout? You will be redirected to the dashboard.');
        if (confirmLogout) {
            currentEmployee = null;
            showView('dashboard');
        }
    } else {
        showView('dashboard');
    }
}

// Handle admin logout
function handleAdminLogout() {
    const confirmLogout = confirm('Are you sure you want to logout from admin panel?');
    if (confirmLogout) {
        showView('dashboard');
    }
}

// Handle employee logout
function handleEmployeeLogout() {
    const confirmLogout = confirm('Are you sure you want to logout? You will be redirected to the dashboard.');
    if (confirmLogout) {
        currentEmployee = null;
        cameFromAdmin = false;
        backToAdminBtn.style.display = 'none';
        showView('dashboard');
    }
}

// Handle back to admin button
function handleBackToAdmin() {
    if (cameFromAdmin) {
        cameFromAdmin = false;
        backToAdminBtn.style.display = 'none';
        showView('admin');
    }
}

// Get month CSS class for background color
function getMonthClass(monthName) {
    const monthClasses = {
        'January': 'month-january',
        'February': 'month-february',
        'March': 'month-march',
        'April': 'month-april',
        'May': 'month-may',
        'June': 'month-june',
        'July': 'month-july',
        'August': 'month-august',
        'September': 'month-september',
        'October': 'month-october',
        'November': 'month-november',
        'December': 'month-december'
    };
    return monthClasses[monthName] || '';
}

// Utility function to debounce search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}