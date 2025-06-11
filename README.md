# LEONI QMS Defect Gauge

A real-time production line defect monitoring dashboard for LEONI Wiring Systems, specifically designed for the VOLVO project.

## Features

- 🎯 **Real-time Gauge**: Interactive semicircular gauge showing defect rates
- 📊 **Status Indicators**: Color-coded status levels (Low, Medium, High)
- 🔄 **Auto-rotation**: Automatically cycles through different production lines
- 📈 **Metrics Dashboard**: Top 3 production lines by defect count
- 💡 **Interactive Tooltips**: Detailed information on hover
- 🎨 **Professional UI**: Clean, modern design matching LEONI branding

## Demo

Visit the live demo: [LEONI QMS Defect Gauge](https://marouane-elgoumiri.github.io/leoni-qms-gauge/)

## Technology Stack

- **D3.js** - Data visualization and gauge rendering
- **HTML5/CSS3** - Modern web standards
- **JavaScript ES6+** - Interactive functionality
- **SVG** - Scalable vector graphics for the gauge

## Project Structure

```
├── index.html          # Main HTML file
├── gauge.js            # Gauge visualization logic
├── mockData.js         # Sample production data
├── styles.css          # Styling and layout
└── README.md          # Project documentation
```

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/leoni-qms-gauge.git
   cd leoni-qms-gauge
   ```

2. Open `index.html` in your browser or serve with a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. Navigate to `http://localhost:8000`

## Configuration

The gauge can be customized by modifying the `config` object in `gauge.js`:

- `minValue/maxValue`: Value range (default: 0-100)
- `thresholds`: Status levels and colors
- `autoRotateInterval`: Time between automatic updates
- `transitionDuration`: Animation speed

## Data Format

The gauge expects data in the following format:

```javascript
{
  id: 1,
  status: "low",
  value: 15,
  details: {
    totalInspected: 500,
    totalDefects: 75,
    defectRate: "15%",
    productionLine: "VOLVO MDEP",
    project: "VOLVO",
    shiftInfo: "Morning Shift",
    date: "2025-06-05"
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is part of LEONI Wiring Systems QMS and is proprietary software.

## Contact

For questions or support, please contact the LEONI QMS development team.
