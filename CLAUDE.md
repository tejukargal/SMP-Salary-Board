# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static web application for managing and viewing salary information with CSV data integration. Built with vanilla HTML, CSS, and JavaScript, it provides a secure employee salary management system with both employee and admin access.

## Architecture

The application follows a simple client-side architecture:

- **index.html**: Single-page application entry point with all views and modals
- **script.js**: Main application logic handling data processing, UI interactions, and CSV parsing
- **styles.css**: CSS styling with CSS variables for theming (light/dark mode support)
- **Salary.csv**: Data source containing employee salary records

### Data Flow
- CSV data is loaded and parsed client-side on application initialization
- All data processing happens in memory using JavaScript arrays and objects
- No server-side dependencies - purely static files

### Key Features
- **Multi-view interface**: Dashboard, Employee Login, Admin Panel, Employee Details
- **CSV data processing**: Custom CSV parser handles quoted values and numeric conversions
- **Indian number formatting**: Custom formatting function for lakhs/crores display
- **Theme system**: Light/dark mode with CSS variables
- **Modal system**: Detailed salary breakdowns in popup modals
- **Filtering**: Year/month filters for dashboard data
- **Search**: Employee search functionality in admin panel

## Development Setup

This is a static web application with no build process. To run locally:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP  
php -S localhost:8000
```

Then access at `http://localhost:8000`

## Code Structure

### JavaScript Architecture (script.js)
- **Global state**: `salaryData`, `filteredData`, `currentEmployee`
- **CSV parsing**: `parseCSV()` and `parseCSVLine()` handle data import
- **View management**: `showView()` controls single-page app navigation
- **Data processing**: Aggregation functions for statistics and summaries
- **UI updates**: Functions update DOM based on filtered/processed data

### Styling System (styles.css)
- **CSS Variables**: Root-level variables for colors, spacing, shadows
- **Theme support**: `[data-theme="dark"]` overrides for dark mode
- **Component-based**: Styles organized by UI components (cards, tables, modals)
- **Responsive design**: Mobile-first approach with breakpoints

### Authentication
- **Employee login**: Uses Employee ID from CSV data
- **Admin access**: Hardcoded password `teju2015` in `script.js:89`

## Data Format

CSV file must contain these columns:
- Employee info: `Sl No`, `Month`, `Year`, `Name`, `EMP No`, `Designation`, `Group`
- Salary components: `Basic`, `DA`, `HRA`, `IR`, `SFN`, `SPAY-TYPIST`, `P`
- Totals: `Gross Salary`, `Total Deductions`, `Net Salary`
- Deductions: `IT`, `PT`, `GSLIC`, `LIC`, `FBF`
- Other: `Next Increment Date`, `Bank A/C Number`

## Key Functions

### Core Data Processing
- `formatIndianNumber()`: Converts numbers to Indian format (12,34,567)
- `parseCSV()`: Handles CSV parsing with quoted value support
- `filterData()`: Applies year/month filters to dataset

### View Controllers
- `updateDashboard()`: Refreshes statistics and summary table
- `viewEmployee()`: Loads employee details view
- `showSummaryModal()` / `showEmployeeModal()`: Display detailed breakdowns

### UI State Management
- `showView()`: Controls which view is visible
- Theme management through `toggleTheme()` and localStorage
- Modal controls for salary detail popups