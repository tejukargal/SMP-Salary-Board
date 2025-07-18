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
const salaryAnalysisBtn = document.getElementById('salaryAnalysisBtn');
const salaryAnalysisModal = document.getElementById('salaryAnalysisModal');
const closeAnalysisModalBtn = document.getElementById('closeAnalysisModal');
// const dashboardAnalysisBtn = document.getElementById('dashboardAnalysisBtn'); // Removed
const dashboardAnalysisModal = document.getElementById('dashboardAnalysisModal');
const closeDashboardAnalysisModalBtn = document.getElementById('closeDashboardAnalysisModal');
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
    if (salaryAnalysisBtn) {
        salaryAnalysisBtn.addEventListener('click', showSalaryAnalysis);
    }
    if (closeAnalysisModalBtn) {
        closeAnalysisModalBtn.addEventListener('click', closeSalaryAnalysisModal);
    }
    // if (dashboardAnalysisBtn) {
    //     dashboardAnalysisBtn.addEventListener('click', showDashboardAnalysis);
    // }
    if (closeDashboardAnalysisModalBtn) {
        closeDashboardAnalysisModalBtn.addEventListener('click', closeDashboardAnalysisModal);
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
    
    // Close analysis modal when clicking outside
    if (salaryAnalysisModal) {
        salaryAnalysisModal.addEventListener('click', (e) => {
            if (e.target === salaryAnalysisModal) {
                closeSalaryAnalysisModal();
            }
        });
    }
    
    // Close dashboard analysis modal when clicking outside
    if (dashboardAnalysisModal) {
        dashboardAnalysisModal.addEventListener('click', (e) => {
            if (e.target === dashboardAnalysisModal) {
                closeDashboardAnalysisModal();
            }
        });
    }
    
    // Add keyboard ESC support for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (salaryModal && salaryModal.classList.contains('active')) {
                closeModal();
            }
            if (salaryAnalysisModal && salaryAnalysisModal.classList.contains('active')) {
                closeSalaryAnalysisModal();
            }
            if (dashboardAnalysisModal && dashboardAnalysisModal.classList.contains('active')) {
                closeDashboardAnalysisModal();
            }
            if (document.getElementById('exportModal') && document.getElementById('exportModal').classList.contains('active')) {
                closeExportModal();
            }
        }
    });

    // Export functionality event listeners
    const exportMenuBtn = document.getElementById('exportMenuBtn');
    const exportModal = document.getElementById('exportModal');
    const closeExportModalBtn = document.getElementById('closeExportModal');
    const exportCSVBtn = document.getElementById('exportCSV');
    const exportPDFBtn = document.getElementById('exportPDF');
    const selectAllColumnsBtn = document.getElementById('selectAllColumns');
    const clearAllColumnsBtn = document.getElementById('clearAllColumns');

    if (exportMenuBtn) {
        exportMenuBtn.addEventListener('click', showExportModal);
    }
    if (closeExportModalBtn) {
        closeExportModalBtn.addEventListener('click', closeExportModal);
    }
    if (exportCSVBtn) {
        exportCSVBtn.addEventListener('click', exportToCSV);
    }
    if (exportPDFBtn) {
        exportPDFBtn.addEventListener('click', exportToPDF);
    }
    if (selectAllColumnsBtn) {
        selectAllColumnsBtn.addEventListener('click', selectAllColumns);
    }
    if (clearAllColumnsBtn) {
        clearAllColumnsBtn.addEventListener('click', clearAllColumns);
    }
    
    // Close export modal when clicking outside
    if (exportModal) {
        exportModal.addEventListener('click', (e) => {
            if (e.target === exportModal) {
                closeExportModal();
            }
        });
    }
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
    const records = parseCSVRecords(csvText);
    if (records.length === 0) return [];
    
    const headers = records[0];
    const data = [];
    
    for (let i = 1; i < records.length; i++) {
        const values = records[i];
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

// Parse CSV records handling multi-line quoted fields
function parseCSVRecords(csvText) {
    const records = [];
    let current = '';
    let inQuotes = false;
    let record = [];
    let field = '';
    
    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            record.push(field);
            field = '';
        } else if (char === '\n' && !inQuotes) {
            record.push(field);
            if (record.length > 0 && record.some(f => f.trim() !== '')) {
                records.push(record);
            }
            record = [];
            field = '';
        } else {
            field += char;
        }
    }
    
    // Add the last record if it exists
    if (field || record.length > 0) {
        record.push(field);
        if (record.length > 0 && record.some(f => f.trim() !== '')) {
            records.push(record);
        }
    }
    
    return records;
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
                empCount: 0,
                totalAllowances: 0,
                totalDeductions: 0,
                totalNet: 0,
                employees: new Set()
            };
        }
        summaryData[key].employees.add(row['EMP No']);
        summaryData[key].totalAllowances += row['Gross Salary'];
        summaryData[key].totalDeductions += row['Total Deductions'];
        summaryData[key].totalNet += row['Net Salary'];
    });
    
    // Convert employee sets to counts
    Object.values(summaryData).forEach(summary => {
        summary.empCount = summary.employees.size;
        delete summary.employees;
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
            <td class="clickable-cell" onclick="showSummaryModal('${summary.year}', '${summary.month}')">
                <span class="month-btn ${getMonthClass(summary.month)}">${summary.month}</span>
            </td>
            <td>${summary.year}</td>
            <td>${summary.empCount}</td>
            <td>₹${formatIndianNumber(summary.totalAllowances)}</td>
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
        const totalAllowances = row['Gross Salary'];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="clickable-cell" onclick="showEmployeeModal('${row['EMP No']}', '${row.Year}', '${row.Month}')">
                <span class="month-btn ${getMonthClass(row.Month)}">${row.Month}</span>
            </td>
            <td>${row.Year}</td>
            <td>₹${formatIndianNumber(totalAllowances)}</td>
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
    document.getElementById('modalIR').textContent = `₹${formatIndianNumber(monthData.reduce((sum, row) => sum + row['IR'], 0))}`;
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
    
    // Add monthly comparison details
    addMonthlyComparisonDetails(year, month, true);
    
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
    document.getElementById('modalIR').textContent = `₹${formatIndianNumber(employeeData['IR'])}`;
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
    
    // Add monthly comparison details for employee
    addMonthlyComparisonDetails(year, month, false, empNo);
    
    salaryModal.classList.add('active');
}

// Close modal
function closeModal() {
    salaryModal.classList.remove('active');
}

// Get month number for sorting
function getMonthNumber(monthName) {
    const months = {
        'January': 1, 'February': 2, 'Feburary': 2, 'March': 3, 'April': 4,
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
        'Feburary': 'month-february', // Handle misspelled February
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

// Show salary analysis modal
function showSalaryAnalysis() {
    if (!currentEmployee) return;
    
    const employeeData = salaryData.filter(row => row['EMP No'] === currentEmployee['EMP No']);
    if (employeeData.length < 2) {
        alert('Need at least 2 months of data to generate analysis.');
        return;
    }
    
    const analysis = generateSalaryAnalysis(employeeData);
    document.getElementById('analysisEmployeeName').textContent = currentEmployee.Name;
    document.getElementById('analysisContent').innerHTML = analysis;
    salaryAnalysisModal.classList.add('active');
}

// Generate salary analysis
function generateSalaryAnalysis(employeeData) {
    // Sort data chronologically
    const sortedData = employeeData.sort((a, b) => {
        if (a.Year !== b.Year) {
            return a.Year - b.Year;
        }
        return getMonthNumber(a.Month) - getMonthNumber(b.Month);
    });
    
    let analysisHTML = '<div class="analysis-summary">';
    analysisHTML += `<h4>📊 Salary Analysis Summary (${sortedData.length} months)</h4>`;
    
    // Overall summary and 6-month period analysis
    const firstMonth = sortedData[0];
    const lastMonth = sortedData[sortedData.length - 1];
    
    // Add 6-month period analysis if enough data
    if (sortedData.length >= 6) {
        analysisHTML += '<h5>📊 6-Month Period Analysis</h5>';
        const sixMonthPeriods = getSixMonthPeriods(sortedData);
        sixMonthPeriods.forEach((period, index) => {
            analysisHTML += generatePeriodAnalysis(period, index);
        });
    }
    
    const basicChange = lastMonth['Basic'] - firstMonth['Basic'];
    const grossChange = lastMonth['Gross Salary'] - firstMonth['Gross Salary'];
    const netChange = lastMonth['Net Salary'] - firstMonth['Net Salary'];
    const deductionsChange = lastMonth['Total Deductions'] - firstMonth['Total Deductions'];
    
    // Calculate DA and HRA percentage changes
    const daPercentageFirst = firstMonth['Basic'] > 0 ? (firstMonth['DA'] / firstMonth['Basic']) * 100 : 0;
    const daPercentageLast = lastMonth['Basic'] > 0 ? (lastMonth['DA'] / lastMonth['Basic']) * 100 : 0;
    const hraPercentageFirst = firstMonth['Basic'] > 0 ? (firstMonth['HRA'] / firstMonth['Basic']) * 100 : 0;
    const hraPercentageLast = lastMonth['Basic'] > 0 ? (lastMonth['HRA'] / lastMonth['Basic']) * 100 : 0;
    
    analysisHTML += '<div class="analysis-points">';
    
    // Period information
    analysisHTML += `<div class="analysis-point period">`;
    analysisHTML += `<span class="point-icon">📅</span>`;
    analysisHTML += `<strong>Analysis Period:</strong> ${firstMonth.Month} ${firstMonth.Year} to ${lastMonth.Month} ${lastMonth.Year}`;
    analysisHTML += `</div>`;
    
    // Basic salary analysis
    if (basicChange !== 0) {
        const basicPercentage = ((basicChange / firstMonth['Basic']) * 100).toFixed(2);
        analysisHTML += `<div class="analysis-point ${basicChange > 0 ? 'positive' : 'negative'}">`;
        analysisHTML += `<span class="point-icon">${basicChange > 0 ? '📈' : '📉'}</span>`;
        analysisHTML += `<strong>Basic Salary:</strong> ${basicChange > 0 ? 'Increased' : 'Decreased'} by ₹${formatIndianNumber(Math.abs(basicChange))} (${Math.abs(basicPercentage)}%)`;
        analysisHTML += `<br><small>From ₹${formatIndianNumber(firstMonth['Basic'])} to ₹${formatIndianNumber(lastMonth['Basic'])}</small>`;
        analysisHTML += `</div>`;
    } else {
        analysisHTML += `<div class="analysis-point neutral">`;
        analysisHTML += `<span class="point-icon">➖</span>`;
        analysisHTML += `<strong>Basic Salary:</strong> Remained constant at ₹${formatIndianNumber(firstMonth['Basic'])}`;
        analysisHTML += `</div>`;
    }
    
    // Gross salary analysis
    if (grossChange !== 0) {
        const grossPercentage = ((grossChange / firstMonth['Gross Salary']) * 100).toFixed(2);
        analysisHTML += `<div class="analysis-point ${grossChange > 0 ? 'positive' : 'negative'}">`;
        analysisHTML += `<span class="point-icon">${grossChange > 0 ? '💰' : '💸'}</span>`;
        analysisHTML += `<strong>Gross Salary:</strong> ${grossChange > 0 ? 'Increased' : 'Decreased'} by ₹${formatIndianNumber(Math.abs(grossChange))} (${Math.abs(grossPercentage)}%)`;
        analysisHTML += `<br><small>From ₹${formatIndianNumber(firstMonth['Gross Salary'])} to ₹${formatIndianNumber(lastMonth['Gross Salary'])}</small>`;
        analysisHTML += `</div>`;
    } else {
        analysisHTML += `<div class="analysis-point neutral">`;
        analysisHTML += `<span class="point-icon">💰</span>`;
        analysisHTML += `<strong>Gross Salary:</strong> Remained constant at ₹${formatIndianNumber(firstMonth['Gross Salary'])}`;
        analysisHTML += `</div>`;
    }
    
    // Net salary analysis
    if (netChange !== 0) {
        const netPercentage = ((netChange / firstMonth['Net Salary']) * 100).toFixed(2);
        analysisHTML += `<div class="analysis-point ${netChange > 0 ? 'positive' : 'negative'}">`;
        analysisHTML += `<span class="point-icon">${netChange > 0 ? '✅' : '❌'}</span>`;
        analysisHTML += `<strong>Net Salary:</strong> ${netChange > 0 ? 'Increased' : 'Decreased'} by ₹${formatIndianNumber(Math.abs(netChange))} (${Math.abs(netPercentage)}%)`;
        analysisHTML += `<br><small>From ₹${formatIndianNumber(firstMonth['Net Salary'])} to ₹${formatIndianNumber(lastMonth['Net Salary'])}</small>`;
        analysisHTML += `</div>`;
    } else {
        analysisHTML += `<div class="analysis-point neutral">`;
        analysisHTML += `<span class="point-icon">✅</span>`;
        analysisHTML += `<strong>Net Salary:</strong> Remained constant at ₹${formatIndianNumber(firstMonth['Net Salary'])}`;
        analysisHTML += `</div>`;
    }
    
    // DA percentage analysis
    const daPercentageChange = daPercentageLast - daPercentageFirst;
    if (Math.abs(daPercentageChange) > 0.1) {
        analysisHTML += `<div class="analysis-point ${daPercentageChange > 0 ? 'positive' : 'negative'}">`;
        analysisHTML += `<span class="point-icon">🏦</span>`;
        analysisHTML += `<strong>DA Percentage:</strong> ${daPercentageChange > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(daPercentageChange).toFixed(2)}%`;
        analysisHTML += `<br><small>From ${daPercentageFirst.toFixed(2)}% to ${daPercentageLast.toFixed(2)}% of Basic</small>`;
        analysisHTML += `</div>`;
    } else {
        analysisHTML += `<div class="analysis-point neutral">`;
        analysisHTML += `<span class="point-icon">🏦</span>`;
        analysisHTML += `<strong>DA Percentage:</strong> Remained stable at approximately ${daPercentageFirst.toFixed(2)}% of Basic`;
        analysisHTML += `</div>`;
    }
    
    // HRA percentage analysis
    const hraPercentageChange = hraPercentageLast - hraPercentageFirst;
    if (Math.abs(hraPercentageChange) > 0.1) {
        analysisHTML += `<div class="analysis-point ${hraPercentageChange > 0 ? 'positive' : 'negative'}">`;
        analysisHTML += `<span class="point-icon">🏠</span>`;
        analysisHTML += `<strong>HRA Percentage:</strong> ${hraPercentageChange > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(hraPercentageChange).toFixed(2)}%`;
        analysisHTML += `<br><small>From ${hraPercentageFirst.toFixed(2)}% to ${hraPercentageLast.toFixed(2)}% of Basic</small>`;
        analysisHTML += `</div>`;
    } else {
        analysisHTML += `<div class="analysis-point neutral">`;
        analysisHTML += `<span class="point-icon">🏠</span>`;
        analysisHTML += `<strong>HRA Percentage:</strong> Remained stable at approximately ${hraPercentageFirst.toFixed(2)}% of Basic`;
        analysisHTML += `</div>`;
    }
    
    // Deductions analysis
    if (deductionsChange !== 0) {
        const deductionsPercentage = ((deductionsChange / firstMonth['Total Deductions']) * 100).toFixed(2);
        analysisHTML += `<div class="analysis-point ${deductionsChange > 0 ? 'negative' : 'positive'}">`;
        analysisHTML += `<span class="point-icon">${deductionsChange > 0 ? '⬆️' : '⬇️'}</span>`;
        analysisHTML += `<strong>Total Deductions:</strong> ${deductionsChange > 0 ? 'Increased' : 'Decreased'} by ₹${formatIndianNumber(Math.abs(deductionsChange))} (${Math.abs(deductionsPercentage)}%)`;
        analysisHTML += `<br><small>From ₹${formatIndianNumber(firstMonth['Total Deductions'])} to ₹${formatIndianNumber(lastMonth['Total Deductions'])}</small>`;
        analysisHTML += `</div>`;
    } else {
        analysisHTML += `<div class="analysis-point neutral">`;
        analysisHTML += `<span class="point-icon">⬜</span>`;
        analysisHTML += `<strong>Total Deductions:</strong> Remained constant at ₹${formatIndianNumber(firstMonth['Total Deductions'])}`;
        analysisHTML += `</div>`;
    }
    
    // Month-to-month analysis if more than 2 months
    if (sortedData.length > 2) {
        analysisHTML += `<div class="analysis-point info">`;
        analysisHTML += `<span class="point-icon">📋</span>`;
        analysisHTML += `<strong>Consistency:</strong> `;
        
        let hasVariations = false;
        for (let i = 1; i < sortedData.length; i++) {
            if (sortedData[i]['Basic'] !== sortedData[i-1]['Basic']) {
                hasVariations = true;
                break;
            }
        }
        
        if (hasVariations) {
            analysisHTML += `Multiple salary adjustments observed during the period`;
        } else {
            analysisHTML += `Salary structure remained consistent throughout the period`;
        }
        analysisHTML += `</div>`;
    }
    
    analysisHTML += '</div></div>';
    return analysisHTML;
}

// Get 6-month periods for analysis
function getSixMonthPeriods(sortedData) {
    const periods = [];
    for (let i = 0; i < sortedData.length; i += 6) {
        const period = sortedData.slice(i, Math.min(i + 6, sortedData.length));
        if (period.length >= 3) { // Minimum 3 months for a meaningful period
            periods.push(period);
        }
    }
    return periods;
}

// Generate analysis for a 6-month period
function generatePeriodAnalysis(period, index) {
    const startMonth = period[0];
    const endMonth = period[period.length - 1];
    
    const basicChange = endMonth['Basic'] - startMonth['Basic'];
    const grossChange = endMonth['Gross Salary'] - startMonth['Gross Salary'];
    const netChange = endMonth['Net Salary'] - startMonth['Net Salary'];
    
    let periodHTML = `<div class="analysis-point period">`;
    periodHTML += `<span class="point-icon">📅</span>`;
    periodHTML += `<strong>Period ${index + 1}:</strong> ${startMonth.Month} ${startMonth.Year} to ${endMonth.Month} ${endMonth.Year} (${period.length} months)`;
    
    if (basicChange !== 0) {
        const basicPercentage = ((basicChange / startMonth['Basic']) * 100).toFixed(2);
        periodHTML += `<br><small>Basic: ${basicChange > 0 ? '+' : ''}₹${formatIndianNumber(basicChange)} (${basicPercentage > 0 ? '+' : ''}${basicPercentage}%)</small>`;
    }
    
    periodHTML += `</div>`;
    return periodHTML;
}

// Show dashboard analysis modal
function showDashboardAnalysis() {
    const analysis = generateDashboardAnalysis();
    document.getElementById('dashboardAnalysisContent').innerHTML = analysis;
    dashboardAnalysisModal.classList.add('active');
}

// Generate dashboard analysis
function generateDashboardAnalysis() {
    if (filteredData.length === 0) {
        return '<div class="analysis-summary"><h4>No data available for analysis</h4></div>';
    }
    
    // Group data by year-month for dashboard analysis
    const monthlyData = {};
    filteredData.forEach(row => {
        const key = `${row.Year}-${row.Month}`;
        if (!monthlyData[key]) {
            monthlyData[key] = {
                year: row.Year,
                month: row.Month,
                empCount: new Set(),
                totalGross: 0,
                totalDeductions: 0,
                totalNet: 0
            };
        }
        monthlyData[key].empCount.add(row['EMP No']);
        monthlyData[key].totalGross += row['Gross Salary'];
        monthlyData[key].totalDeductions += row['Total Deductions'];
        monthlyData[key].totalNet += row['Net Salary'];
    });
    
    // Convert to array and calculate employee counts
    const sortedMonthly = Object.values(monthlyData).map(month => ({
        ...month,
        empCount: month.empCount.size
    })).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return getMonthNumber(a.month) - getMonthNumber(b.month);
    });
    
    if (sortedMonthly.length < 2) {
        return '<div class="analysis-summary"><h4>Need at least 2 months of data for analysis</h4></div>';
    }
    
    const firstMonth = sortedMonthly[0];
    const lastMonth = sortedMonthly[sortedMonthly.length - 1];
    
    let analysisHTML = '<div class="analysis-summary">';
    analysisHTML += `<h4>📊 Dashboard Analysis (${sortedMonthly.length} months)</h4>`;
    analysisHTML += '<div class="analysis-points">';
    
    // Period information
    analysisHTML += `<div class="analysis-point period">`;
    analysisHTML += `<span class="point-icon">📅</span>`;
    analysisHTML += `<strong>Analysis Period:</strong> ${firstMonth.month} ${firstMonth.year} to ${lastMonth.month} ${lastMonth.year}`;
    analysisHTML += `</div>`;
    
    // Employee count analysis
    const empCountChange = lastMonth.empCount - firstMonth.empCount;
    if (empCountChange !== 0) {
        const empCountPercentage = ((empCountChange / firstMonth.empCount) * 100).toFixed(2);
        analysisHTML += `<div class="analysis-point ${empCountChange > 0 ? 'positive' : 'negative'}">`;
        analysisHTML += `<span class="point-icon">${empCountChange > 0 ? '👥' : '👤'}</span>`;
        analysisHTML += `<strong>Employee Count:</strong> ${empCountChange > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(empCountChange)} employees (${Math.abs(empCountPercentage)}%)`;
        analysisHTML += `<br><small>From ${firstMonth.empCount} to ${lastMonth.empCount} employees</small>`;
        analysisHTML += `</div>`;
    } else {
        analysisHTML += `<div class="analysis-point neutral">`;
        analysisHTML += `<span class="point-icon">👥</span>`;
        analysisHTML += `<strong>Employee Count:</strong> Remained stable at ${firstMonth.empCount} employees`;
        analysisHTML += `</div>`;
    }
    
    // Gross salary analysis
    const grossChange = lastMonth.totalGross - firstMonth.totalGross;
    if (grossChange !== 0) {
        const grossPercentage = ((grossChange / firstMonth.totalGross) * 100).toFixed(2);
        analysisHTML += `<div class="analysis-point ${grossChange > 0 ? 'positive' : 'negative'}">`;
        analysisHTML += `<span class="point-icon">${grossChange > 0 ? '💰' : '💸'}</span>`;
        analysisHTML += `<strong>Total Gross Salary:</strong> ${grossChange > 0 ? 'Increased' : 'Decreased'} by ₹${formatIndianNumber(Math.abs(grossChange))} (${Math.abs(grossPercentage)}%)`;
        analysisHTML += `<br><small>From ₹${formatIndianNumber(firstMonth.totalGross)} to ₹${formatIndianNumber(lastMonth.totalGross)}</small>`;
        analysisHTML += `</div>`;
    } else {
        analysisHTML += `<div class="analysis-point neutral">`;
        analysisHTML += `<span class="point-icon">💰</span>`;
        analysisHTML += `<strong>Total Gross Salary:</strong> Remained constant at ₹${formatIndianNumber(firstMonth.totalGross)}`;
        analysisHTML += `</div>`;
    }
    
    // Deductions analysis
    const deductionsChange = lastMonth.totalDeductions - firstMonth.totalDeductions;
    if (deductionsChange !== 0) {
        const deductionsPercentage = ((deductionsChange / firstMonth.totalDeductions) * 100).toFixed(2);
        analysisHTML += `<div class="analysis-point ${deductionsChange > 0 ? 'negative' : 'positive'}">`;
        analysisHTML += `<span class="point-icon">${deductionsChange > 0 ? '⬆️' : '⬇️'}</span>`;
        analysisHTML += `<strong>Total Deductions:</strong> ${deductionsChange > 0 ? 'Increased' : 'Decreased'} by ₹${formatIndianNumber(Math.abs(deductionsChange))} (${Math.abs(deductionsPercentage)}%)`;
        analysisHTML += `<br><small>From ₹${formatIndianNumber(firstMonth.totalDeductions)} to ₹${formatIndianNumber(lastMonth.totalDeductions)}</small>`;
        analysisHTML += `</div>`;
    } else {
        analysisHTML += `<div class="analysis-point neutral">`;
        analysisHTML += `<span class="point-icon">⬜</span>`;
        analysisHTML += `<strong>Total Deductions:</strong> Remained constant at ₹${formatIndianNumber(firstMonth.totalDeductions)}`;
        analysisHTML += `</div>`;
    }
    
    // Net salary analysis
    const netChange = lastMonth.totalNet - firstMonth.totalNet;
    if (netChange !== 0) {
        const netPercentage = ((netChange / firstMonth.totalNet) * 100).toFixed(2);
        analysisHTML += `<div class="analysis-point ${netChange > 0 ? 'positive' : 'negative'}">`;
        analysisHTML += `<span class="point-icon">${netChange > 0 ? '✅' : '❌'}</span>`;
        analysisHTML += `<strong>Total Net Salary:</strong> ${netChange > 0 ? 'Increased' : 'Decreased'} by ₹${formatIndianNumber(Math.abs(netChange))} (${Math.abs(netPercentage)}%)`;
        analysisHTML += `<br><small>From ₹${formatIndianNumber(firstMonth.totalNet)} to ₹${formatIndianNumber(lastMonth.totalNet)}</small>`;
        analysisHTML += `</div>`;
    } else {
        analysisHTML += `<div class="analysis-point neutral">`;
        analysisHTML += `<span class="point-icon">✅</span>`;
        analysisHTML += `<strong>Total Net Salary:</strong> Remained constant at ₹${formatIndianNumber(firstMonth.totalNet)}`;
        analysisHTML += `</div>`;
    }
    
    analysisHTML += '</div></div>';
    return analysisHTML;
}

// Add monthly comparison details to the modal
function addMonthlyComparisonDetails(currentYear, currentMonth, isDashboard, empNo = null) {
    const comparisonDiv = document.getElementById('monthlyComparison');
    if (!comparisonDiv) return;
    
    // Find previous month data
    const currentMonthNumber = getMonthNumber(currentMonth);
    let previousMonth, previousYear;
    
    if (currentMonthNumber === 1) {
        previousMonth = 'December';
        previousYear = (parseInt(currentYear) - 1).toString();
    } else {
        const prevMonthNumber = currentMonthNumber - 1;
        previousMonth = Object.keys({
            'January': 1, 'February': 2, 'March': 3, 'April': 4,
            'May': 5, 'June': 6, 'July': 7, 'August': 8,
            'September': 9, 'October': 10, 'November': 11, 'December': 12
        }).find(key => getMonthNumber(key) === prevMonthNumber);
        previousYear = currentYear;
    }
    
    let comparisonHTML = '<div class="comparison-section">';
    comparisonHTML += '<h4>📊 Monthly Comparison</h4>';
    
    if (isDashboard) {
        // Dashboard comparison
        const currentData = salaryData.filter(row => row.Year === currentYear && row.Month === currentMonth);
        const previousData = salaryData.filter(row => row.Year === previousYear && row.Month === previousMonth);
        
        if (previousData.length === 0) {
            comparisonHTML += '<p class="no-comparison">No previous month data available for comparison.</p>';
        } else {
            const currentGross = currentData.reduce((sum, row) => sum + row['Gross Salary'], 0);
            const previousGross = previousData.reduce((sum, row) => sum + row['Gross Salary'], 0);
            const currentDeductions = currentData.reduce((sum, row) => sum + row['Total Deductions'], 0);
            const previousDeductions = previousData.reduce((sum, row) => sum + row['Total Deductions'], 0);
            const currentNet = currentData.reduce((sum, row) => sum + row['Net Salary'], 0);
            const previousNet = previousData.reduce((sum, row) => sum + row['Net Salary'], 0);
            const currentEmpCount = new Set(currentData.map(row => row['EMP No'])).size;
            const previousEmpCount = new Set(previousData.map(row => row['EMP No'])).size;
            
            comparisonHTML += generateComparisonRow('Employee Count', currentEmpCount, previousEmpCount, '', false);
            comparisonHTML += generateComparisonRow('Total Gross', currentGross, previousGross, '₹');
            comparisonHTML += generateComparisonRow('Total Deductions', currentDeductions, previousDeductions, '₹', true);
            comparisonHTML += generateComparisonRow('Total Net', currentNet, previousNet, '₹');
        }
    } else {
        // Employee comparison
        const currentData = salaryData.find(row => row['EMP No'] === empNo && row.Year === currentYear && row.Month === currentMonth);
        const previousData = salaryData.find(row => row['EMP No'] === empNo && row.Year === previousYear && row.Month === previousMonth);
        
        if (!previousData) {
            comparisonHTML += '<p class="no-comparison">No previous month data available for comparison.</p>';
        } else {
            comparisonHTML += generateComparisonRow('Basic Salary', currentData['Basic'], previousData['Basic'], '₹');
            comparisonHTML += generateComparisonRow('Gross Salary', currentData['Gross Salary'], previousData['Gross Salary'], '₹');
            comparisonHTML += generateComparisonRow('Total Deductions', currentData['Total Deductions'], previousData['Total Deductions'], '₹', true);
            comparisonHTML += generateComparisonRow('Net Salary', currentData['Net Salary'], previousData['Net Salary'], '₹');
        }
    }
    
    comparisonHTML += '</div>';
    comparisonDiv.innerHTML = comparisonHTML;
}

// Generate comparison row for monthly details
function generateComparisonRow(label, currentValue, previousValue, currency = '', isDeduction = false) {
    const difference = currentValue - previousValue;
    const percentageChange = previousValue !== 0 ? ((difference / previousValue) * 100).toFixed(2) : 0;
    
    let rowClass = 'neutral';
    let icon = '➖';
    let changeText = 'No change';
    
    if (difference !== 0) {
        if (isDeduction) {
            // For deductions, decrease is positive (good), increase is negative (bad)
            rowClass = difference < 0 ? 'positive' : 'negative';
            icon = difference < 0 ? '⬇️' : '⬆️';
        } else {
            // For other values, increase is positive, decrease is negative
            rowClass = difference > 0 ? 'positive' : 'negative';
            icon = difference > 0 ? '⬆️' : '⬇️';
        }
        
        changeText = `${difference > 0 ? '+' : ''}${currency}${formatIndianNumber(Math.abs(difference))} (${difference > 0 ? '+' : ''}${percentageChange}%)`;
    }
    
    return `
        <div class="comparison-row ${rowClass}">
            <div class="comparison-label">
                <span class="comparison-icon">${icon}</span>
                <strong>${label}:</strong>
            </div>
            <div class="comparison-values">
                <span class="current-value">${currency}${formatIndianNumber(currentValue)}</span>
                <span class="change-value">${changeText}</span>
            </div>
        </div>
    `;
}

// Close dashboard analysis modal
function closeDashboardAnalysisModal() {
    dashboardAnalysisModal.classList.remove('active');
}

// Close salary analysis modal
function closeSalaryAnalysisModal() {
    salaryAnalysisModal.classList.remove('active');
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

// Export Modal Functions
function showExportModal() {
    const exportModal = document.getElementById('exportModal');
    if (exportModal) {
        populateExportFilters();
        exportModal.classList.add('active');
    }
}

function closeExportModal() {
    const exportModal = document.getElementById('exportModal');
    if (exportModal) {
        exportModal.classList.remove('active');
    }
}

function populateExportFilters() {
    const exportYearFilter = document.getElementById('exportYearFilter');
    const exportMonthFilter = document.getElementById('exportMonthFilter');
    
    if (exportYearFilter && exportMonthFilter) {
        // Clear existing options except the first one
        exportYearFilter.innerHTML = '<option value="">All Years</option>';
        exportMonthFilter.innerHTML = '<option value="">All Months</option>';
        
        // Get unique years and months from data
        const years = [...new Set(salaryData.map(item => item.Year))].sort((a, b) => b - a);
        const months = [...new Set(salaryData.map(item => item.Month))];
        
        years.forEach(year => {
            exportYearFilter.innerHTML += `<option value="${year}">${year}</option>`;
        });
        
        months.forEach(month => {
            exportMonthFilter.innerHTML += `<option value="${month}">${month}</option>`;
        });
    }
}

function selectAllColumns() {
    const checkboxes = document.querySelectorAll('#exportModal .column-checkboxes input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

function clearAllColumns() {
    const checkboxes = document.querySelectorAll('#exportModal .column-checkboxes input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function getSelectedColumns() {
    const checkboxes = document.querySelectorAll('#exportModal .column-checkboxes input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.id.replace('col-', ''));
}

function getFilteredExportData() {
    const exportYearFilter = document.getElementById('exportYearFilter').value;
    const exportMonthFilter = document.getElementById('exportMonthFilter').value;
    
    let filteredData = [...salaryData];
    
    if (exportYearFilter) {
        filteredData = filteredData.filter(item => item.Year === exportYearFilter);
    }
    
    if (exportMonthFilter) {
        filteredData = filteredData.filter(item => item.Month === exportMonthFilter);
    }
    
    return filteredData;
}

function exportToCSV() {
    const selectedColumns = getSelectedColumns();
    if (selectedColumns.length === 0) {
        alert('Please select at least one column to export.');
        return;
    }
    
    const filteredData = getFilteredExportData();
    if (filteredData.length === 0) {
        alert('No data available for the selected filters.');
        return;
    }
    
    const columnMapping = {
        'employee': ['Name', 'EMP No', 'Designation', 'Group'],
        'month': ['Month'],
        'year': ['Year'],
        'basic': ['Basic'],
        'da': ['DA'],
        'hra': ['HRA'],
        'ir': ['IR'],
        'sfn': ['SFN'],
        'spay': ['SPAY-TYPIST'],
        'p': ['P'],
        'gross': ['Gross Salary'],
        'it': ['IT'],
        'pt': ['PT'],
        'gslic': ['GSLIC'],
        'lic': ['LIC'],
        'fbf': ['FBF'],
        'deductions': ['Total Deductions'],
        'net': ['Net Salary'],
        'bank': ['Bank A/C Number'],
        'increment': ['Next Increment Date']
    };
    
    // Build headers array
    let headers = [];
    selectedColumns.forEach(col => {
        if (columnMapping[col]) {
            headers.push(...columnMapping[col]);
        }
    });
    
    // Build CSV content
    let csvContent = headers.join(',') + '\n';
    
    filteredData.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            // Escape commas and quotes in CSV
            return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvContent += values.join(',') + '\n';
    });
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const filename = `salary_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`CSV exported successfully as ${filename}`);
}

function exportToPDF() {
    const selectedColumns = getSelectedColumns();
    if (selectedColumns.length === 0) {
        alert('Please select at least one column to export.');
        return;
    }
    
    const filteredData = getFilteredExportData();
    if (filteredData.length === 0) {
        alert('No data available for the selected filters.');
        return;
    }
    
    // Load jsPDF library if not already loaded
    if (typeof window.jsPDF === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            setTimeout(() => {
                generatePDF(selectedColumns, filteredData);
            }, 100);
        };
        script.onerror = () => {
            alert('Failed to load PDF library. Please try again.');
        };
        document.head.appendChild(script);
    } else {
        generatePDF(selectedColumns, filteredData);
    }
}

function generatePDF(selectedColumns, filteredData) {
    try {
        const { jsPDF } = window.jsPDF || window;
        
        if (!jsPDF) {
            alert('PDF library not loaded. Please try again.');
            return;
        }
        
        const columnMapping = {
            'employee': ['Name', 'EMP No', 'Designation', 'Group'],
            'month': ['Month'],
            'year': ['Year'],
            'basic': ['Basic'],
            'da': ['DA'],
            'hra': ['HRA'],
            'ir': ['IR'],
            'sfn': ['SFN'],
            'spay': ['SPAY-TYPIST'],
            'p': ['P'],
            'gross': ['Gross Salary'],
            'it': ['IT'],
            'pt': ['PT'],
            'gslic': ['GSLIC'],
            'lic': ['LIC'],
            'fbf': ['FBF'],
            'deductions': ['Total Deductions'],
            'net': ['Net Salary'],
            'bank': ['Bank A/C Number'],
            'increment': ['Next Increment Date']
        };
        
        // Build headers array
        let headers = [];
        selectedColumns.forEach(col => {
            if (columnMapping[col]) {
                headers.push(...columnMapping[col]);
            }
        });
        
        // Determine orientation based on number of columns
        const orientation = headers.length > 8 ? 'landscape' : 'portrait';
        const pdf = new jsPDF({
            orientation: orientation,
            unit: 'pt',
            format: 'a4'
        });
        
        // PDF configuration
        const pageWidth = orientation === 'landscape' ? 842 : 595;
        const pageHeight = orientation === 'landscape' ? 595 : 842;
        const margin = 40;
        const tableWidth = pageWidth - 2 * margin;
        
        // Add title
        pdf.setFontSize(16);
        pdf.text('SMP Salary Board - Export Report', margin, margin + 20);
        pdf.setFontSize(12);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, margin + 45);
        
        // Calculate column widths
        const columnWidth = Math.max(50, tableWidth / headers.length);
        
        // Add table
        let yPosition = margin + 80;
        const rowHeight = 20;
        const headerHeight = 25;
        
        // Draw header
        pdf.setFillColor(124, 141, 181);
        pdf.rect(margin, yPosition, tableWidth, headerHeight, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(orientation === 'landscape' ? 7 : 9);
        
        headers.forEach((header, index) => {
            const xPosition = margin + index * columnWidth;
            const text = header.length > 12 ? header.substring(0, 12) + '...' : header;
            pdf.text(text, xPosition + 3, yPosition + headerHeight / 2 + 3);
        });
        
        yPosition += headerHeight;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(orientation === 'landscape' ? 6 : 8);
        
        // Draw data rows
        filteredData.forEach((row, rowIndex) => {
            if (yPosition + rowHeight > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin + 20;
            }
            
            // Alternate row colors
            if (rowIndex % 2 === 0) {
                pdf.setFillColor(248, 249, 250);
                pdf.rect(margin, yPosition, tableWidth, rowHeight, 'F');
            }
            
            headers.forEach((header, cellIndex) => {
                const xPosition = margin + cellIndex * columnWidth;
                const cellValue = row[header] || '';
                const text = cellValue.toString();
                const truncatedText = text.length > 15 ? text.substring(0, 15) + '...' : text;
                pdf.text(truncatedText, xPosition + 3, yPosition + rowHeight / 2 + 3);
            });
            
            yPosition += rowHeight;
        });
        
        // Save PDF
        const filename = `salary_data_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);
        
        alert(`PDF exported successfully as ${filename}`);
    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please try again.');
    }
}