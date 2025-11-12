# RC Filter Simulator

A full-stack web application for analyzing Low-Pass and High-Pass RC filter characteristics with real-time calculations and interactive frequency response graphs.

## 🚀 Features

### Dual Filter Modes
- **Low-Pass Filter**: Attenuates high frequencies, passes low frequencies
- **High-Pass Filter**: Attenuates low frequencies, passes high frequencies

### Interactive Analysis
- Real-time calculation of filter response for any input frequency
- Visual SVG circuit diagrams for each filter type
- Interactive frequency response plots with logarithmic scale
- -3dB cutoff frequency reference line

### Calculations Provided
- **Magnitude |H(f)|**: Transfer function magnitude
- **Gain (dB)**: 20 × log₁₀(|H|)
- **Output Voltage (Vout)**: Vin × |H|

## 🔧 Technical Specifications

### Constants
- **Resistance (R)**: 10 kΩ
- **Capacitance (C)**: 0.01 µF (1×10⁻⁸ F)
- **Input Voltage (Vin)**: 10 V

### Filter Formulas

#### Low-Pass Filter
```
|H(f)| = 1 / √(1 + (ωRC)²)
where ω = 2πf
```

#### High-Pass Filter
```
|H(f)| = (ωRC) / √(1 + (ωRC)²)
where ω = 2πf
```

#### Cutoff Frequency
```
fc = 1 / (2πRC) ≈ 1591.55 Hz
```

## 🏗️ Project Structure

```
/app/
├── backend/
│   ├── server.py          # FastAPI backend with filter calculations
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Styling
│   │   └── components/   # Shadcn UI components
│   ├── package.json      # Node dependencies
│   └── .env             # Frontend environment variables
│
└── README.md            # This file
```

## 🔌 API Endpoints

### POST `/api/rc-gain`
Calculate filter response for a single frequency.

**Request Body:**
```json
{
  "frequency": 1000,
  "filter_type": "low-pass"
}
```

**Response:**
```json
{
  "frequency": 1000,
  "magnitude": 0.846733,
  "gain_db": -1.45,
  "vout": 8.4673,
  "filter_type": "low-pass"
}
```

### POST `/api/sweep`
Generate frequency sweep data for plotting (1 Hz to 100 kHz).

**Request Body:**
```json
{
  "frequency": 1000,
  "filter_type": "high-pass"
}
```

**Response:**
```json
{
  "frequencies": [1, 1.26, 1.58, ..., 100000],
  "gains_db": [-60.03, -58.01, -56.04, ..., -40.00],
  "filter_type": "high-pass"
}
```

## 💻 Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (via Motor async driver)
- **Math**: Python `math` library for calculations

### Frontend
- **Framework**: React 19
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Styling**: Tailwind CSS + Custom CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Fonts**: Space Grotesk, Inter

## 🎨 Design Features

- **Modern Dark Theme**: Deep blacks with blue-green accents
- **Glass-morphism**: Frosted glass effects with backdrop blur
- **Smooth Animations**: Fade-in, slide-in, and hover transitions
- **Responsive Layout**: Mobile-first design with adaptive grid
- **Custom SVG Circuits**: Hand-crafted circuit diagrams
- **Interactive Charts**: Hover tooltips and smooth curves

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB
- Yarn package manager

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
yarn install
```

### Environment Variables

**Backend (.env)**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
```

**Frontend (.env)**
```env
REACT_APP_BACKEND_URL=https://your-domain.com
```

### Running Locally
```bash
# Backend (via supervisor)
sudo supervisorctl restart backend

# Frontend (via supervisor)
sudo supervisorctl restart frontend
```

## 🧮 Example Calculations

### Low-Pass Filter at 1 kHz
- **Frequency**: 1000 Hz
- **Magnitude**: 0.847
- **Gain**: -1.45 dB
- **Vout**: 8.47 V

### High-Pass Filter at 1 kHz
- **Frequency**: 1000 Hz
- **Magnitude**: 0.532
- **Gain**: -5.48 dB
- **Vout**: 5.32 V

### At Cutoff Frequency (≈1592 Hz)
- **Both filters**: -3 dB gain
- **Magnitude**: 0.707 (1/√2)
- **Vout**: 7.07 V

## 📊 Frequency Response Characteristics

### Low-Pass Filter
- **Passband**: DC to ~1.6 kHz (gain ≈ 0 dB)
- **Cutoff**: -3 dB at fc ≈ 1592 Hz
- **Stopband**: >1.6 kHz (gain decreases at -20 dB/decade)
- **Roll-off**: 6 dB per octave

### High-Pass Filter
- **Stopband**: DC to ~1.6 kHz (gain decreases)
- **Cutoff**: -3 dB at fc ≈ 1592 Hz
- **Passband**: >1.6 kHz (gain ≈ 0 dB)
- **Roll-off**: +6 dB per octave below fc

## 🎯 Use Cases

- **Educational**: Learn RC filter behavior and frequency response
- **Circuit Design**: Analyze filter characteristics before building
- **Signal Processing**: Understand frequency domain filtering
- **Electronics Lab**: Virtual lab tool for filter experiments

## 🔍 Key Insights

1. **Cutoff Frequency Independence**: fc depends only on R and C values, not on input frequency
2. **Complementary Behavior**: Low-pass and high-pass filters are complementary at all frequencies
3. **-3dB Point**: At fc, output power is half the input power (50% power transfer)
4. **Phase Shift**: Not shown in this app, but RC filters also introduce phase shifts

## 📝 Notes

- All calculations use double-precision floating-point arithmetic
- Frequency sweep uses logarithmic spacing for better visualization
- Charts use logarithmic x-axis to show wide frequency range (1 Hz - 100 kHz)
- Backend calculations are stateless and don't require database storage

## 🚀 Future Enhancements

- [ ] Phase response plots
- [ ] Custom R and C value inputs
- [ ] Multiple pole filters (2nd, 3rd order)
- [ ] Impedance calculations
- [ ] Export data as CSV
- [ ] Bode plot with phase
- [ ] Transient response simulation
- [ ] Component tolerance analysis

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

---

**Last Updated**: January 2025
