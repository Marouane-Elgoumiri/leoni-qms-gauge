# AQL Archives System

## Overview
The AQL Archives System provides comprehensive access to historical quality audit data for LEONI's Quality Management System. This system is specifically designed for AQL (Agent Quality Ligne) agents to access, view, and export audit reports for client presentations and quality reviews.

## Features

### 🔍 Advanced Search & Filtering
- **Audit Type Filtering**: 5S, AFP, TRAM, QK audits
- **Date Range Selection**: Custom date ranges for targeted searches
- **Production Line Filtering**: Filter by specific production lines
- **Auditor Search**: Search by auditor name
- **Status Filtering**: Filter by completion status

### 📊 Archive Statistics
- Real-time statistics for last 30 days
- Visual overview of audit types and counts
- Quick access to recent audits

### 📄 Comprehensive Audit Details
- **5S Audits**: Workplace organization assessments
- **AFP Audits**: Fabrication process audits
- **TRAM Reports**: Quality metrics and PPM calculations
- **QK Audits**: Product quality verification for wire harnesses

### 🖨️ Print & Export Options
- **Multiple Print Formats**:
  - Summary Report: Key metrics only
  - Detailed Report: Complete audit data
  - Client Presentation: Formatted for client audits
- **Export Capabilities**:
  - Individual audit export (JSON)
  - Bulk export of selected audits
  - Complete archive package for clients

### ⚡ Quick Access Features
- Last 7 days reports
- Monthly audit summaries
- High priority/critical issues filter
- Client audit package creation

## File Structure
```
AQL-Archives/
├── aql-archives.html          # Main archive interface
├── aql-archives.css           # Advanced styling
├── aql-archives.js            # Core functionality
├── sample-data.js             # Sample audit data
└── README.md                  # This documentation
```

## Usage Guide

### Accessing Archives
1. Navigate to AQL Dashboard
2. Click "Quality Archives" card
3. Use search filters to find specific audits
4. View, print, or export as needed

### Search & Filter
1. **Select Audit Type**: Choose from 5S, AFP, TRAM, or QK
2. **Set Date Range**: Use date pickers for specific periods
3. **Choose Production Line**: Filter by production line
4. **Enter Auditor Name**: Search by auditor
5. **Select Status**: Filter by completion status
6. **Click Search**: Results will display in the table

### Viewing Audit Details
1. Click "View" button on any audit row
2. Modal window opens with detailed information
3. Review audit-specific data and metrics
4. Use "Print" or "Export" from modal if needed

### Printing Reports
1. Click "Print" button for any audit
2. Select print format:
   - **Summary**: Basic information only
   - **Detailed**: Complete audit data
   - **Client**: Professional client presentation
3. Confirm print to generate report

### Bulk Operations
1. Select multiple audits using checkboxes
2. Use bulk action buttons:
   - **View Selected**: Open first selected audit
   - **Print Selected**: Print multiple audits
   - **Export Selected**: Export selection as package

### Quick Access
- **Last 7 Days**: Recent audit reports
- **This Month**: Monthly audit summary
- **High Priority**: Critical issues and low scores
- **Export Package**: Complete client audit package

## Technical Details

### Data Structure
Each audit record contains:
- **Basic Info**: ID, date, auditor, production line
- **Audit-Specific Data**: Varies by audit type
- **Scores/Metrics**: Performance indicators
- **Status**: Completion and validation status

### Print Formats
- **Summary**: Essential information for quick reference
- **Detailed**: Complete audit data with all metrics
- **Client**: Professional format with LEONI branding

### Export Formats
- **JSON**: Machine-readable format for integration
- **Package**: Complete client presentation package
- **Bulk**: Multiple audits in single export

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Responsive Design
- Desktop: Full feature set with optimal layout
- Tablet: Adapted interface with touch-friendly controls
- Mobile: Simplified interface for essential functions

## Security Features
- Role-based access (AQL agents only)
- Audit trail for all exports
- Data validation and sanitization
- Client-ready professional formatting

## Client Audit Support
The system is specifically designed to support client audits with:
- Professional report formatting
- Comprehensive data packages
- Export capabilities for presentations
- Historical trend analysis
- Compliance documentation

## Future Enhancements
- Integration with live audit systems
- Automated report generation
- Advanced analytics and trending
- Multi-language support
- Digital signatures for reports

---

**Note**: This system contains sample data for demonstration. In production, it would connect to the actual LEONI quality database for real-time archive access.
