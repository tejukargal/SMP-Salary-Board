# SMP Salary Board

A modern web application for managing and viewing salary information with CSV data integration. Built with vanilla HTML, CSS, and JavaScript.

## Features

### 🏢 Dashboard
- **Year & Month-wise Consolidated Summary** - View salary summaries organized by year and month
- **Interactive Statistics Cards** - Real-time statistics showing total employees, gross salary, deductions, and net salary
- **Advanced Filtering** - Filter data by year and month with easy-to-use dropdown menus
- **Indian Number Formatting** - All amounts displayed in Indian format (12,34,567 instead of 1,234,567)

### 👨‍💼 Employee Features
- **Employee Login** - Secure login using Employee ID
- **Personal Salary History** - View complete salary history with month-wise breakdown
- **Detailed Salary Information** - Access to all salary components, allowances, and deductions

### 🔧 Admin Features
- **Admin Login** - Secure admin access with keyword authentication
- **Employee Directory** - Complete list of all employees with search functionality
- **Comprehensive Employee Management** - View detailed information for any employee

### 📱 Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support** - Toggle between light and dark themes
- **Sticky Headers** - Easy navigation with sticky table headers
- **Interactive Modals** - Detailed pop-up windows for salary information
- **Pastel Color Scheme** - Modern, professional appearance with solid pastel colors

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Icons**: Material Design Icons
- **Fonts**: Inter (Google Fonts)
- **Data Format**: CSV (Comma-Separated Values)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tejukargal/SMP-Salary-Board.git
   cd SMP-Salary-Board
   ```

2. **Add your salary data**
   - Place your CSV file named `Salary.csv` in the root directory
   - Ensure the CSV has the following columns:
     - `Sl No`, `Month`, `Year`, `Name`, `EMP No`, `Designation`
     - `Next Increment Date`, `Group`, `Bank A/C Number`
     - `Basic`, `DA`, `HRA`, `IR`, `SFN`, `SPAY-TYPIST`, `P`
     - `Gross Salary`, `IT`, `PT`, `GSLIC`, `LIC`, `FBF`
     - `Total Deductions`, `Net Salary`

3. **Start a local server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`

## Usage

### For Employees
1. Click on "Employee Login" in the navigation
2. Enter your Employee ID
3. View your complete salary history and details

### For Administrators
1. Click on "Employee Login" in the navigation
2. Click on "Admin Login" button
3. Enter the admin password: 
4. Access the complete employee directory and manage salary information

### Features Usage
- **Filtering**: Use the year and month filters to narrow down the data
- **Dark Mode**: Click the theme toggle button in the header
- **Detailed View**: Click on any month cell in tables to view detailed salary breakdown
- **Search**: Use the search functionality in the admin panel to find specific employees

## CSV Data Format

The application expects a CSV file with the following structure:

```csv
Sl No,Month,Year,Name,EMP No,Designation,Next Increment Date,Group,Bank A/C Number,Basic,DA,HRA,IR,SFN,SPAY-TYPIST,P,Gross Salary,IT,PT,GSLIC,LIC,FBF,Total Deductions,Net Salary
1,May,2024,EMPLOYEE NAME,100156106,DESIGNATION,Jan-25,B,64049893660,50150,21314,4012,8526,0,0,0,84002,12000,200,40,5591,10,17841,66161
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security Features

- **Admin Authentication**: Secure admin access with password protection
- **Data Privacy**: All data processing happens client-side
- **No Server Dependencies**: Static files only, no server-side processing required

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Teju Kargal**
- GitHub: [@tejukargal](https://github.com/tejukargal)

## Acknowledgments

- Material Design Icons for the beautiful iconography
- Inter font family for the clean typography
- The open-source community for inspiration and tools

---

**Note**: This application is designed for internal salary management and should be deployed in a secure environment with appropriate access controls.
