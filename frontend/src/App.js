import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Activity } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// SVG Circuit Diagrams
const LowPassCircuit = () => (
  <svg viewBox="0 0 400 200" className="circuit-svg">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
      </marker>
    </defs>
    
    {/* Input */}
    <text x="10" y="100" className="circuit-label">Vin</text>
    <line x1="40" y1="95" x2="80" y2="95" className="circuit-wire" />
    
    {/* Resistor */}
    <rect x="80" y="85" width="60" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" />
    <line x1="85" y1="90" x2="135" y2="90" stroke="#3b82f6" strokeWidth="2" />
    <line x1="85" y1="100" x2="135" y2="100" stroke="#3b82f6" strokeWidth="2" />
    <text x="100" y="78" className="circuit-label-small">R = 10kΩ</text>
    
    {/* Wire to capacitor junction */}
    <line x1="140" y1="95" x2="200" y2="95" className="circuit-wire" />
    <circle cx="200" cy="95" r="3" fill="#3b82f6" />
    
    {/* Output */}
    <line x1="200" y1="95" x2="250" y2="95" className="circuit-wire" />
    <text x="260" y="100" className="circuit-label">Vout</text>
    
    {/* Capacitor (vertical) */}
    <line x1="200" y1="95" x2="200" y2="130" className="circuit-wire" />
    <line x1="195" y1="130" x2="205" y2="130" stroke="#10b981" strokeWidth="3" />
    <line x1="195" y1="135" x2="205" y2="135" stroke="#10b981" strokeWidth="3" />
    <text x="210" y="138" className="circuit-label-small">C = 0.01µF</text>
    
    {/* Ground */}
    <line x1="200" y1="135" x2="200" y2="155" className="circuit-wire" />
    <line x1="185" y1="155" x2="215" y2="155" stroke="#64748b" strokeWidth="2" />
    <line x1="190" y1="160" x2="210" y2="160" stroke="#64748b" strokeWidth="2" />
    <line x1="195" y1="165" x2="205" y2="165" stroke="#64748b" strokeWidth="2" />
  </svg>
);

const HighPassCircuit = () => (
  <svg viewBox="0 0 400 200" className="circuit-svg">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
      </marker>
    </defs>
    
    {/* Input */}
    <text x="10" y="100" className="circuit-label">Vin</text>
    <line x1="40" y1="95" x2="80" y2="95" className="circuit-wire" />
    
    {/* Capacitor (horizontal) */}
    <line x1="80" y1="90" x2="80" y2="100" stroke="#10b981" strokeWidth="3" />
    <line x1="85" y1="90" x2="85" y2="100" stroke="#10b981" strokeWidth="3" />
    <text x="70" y="78" className="circuit-label-small">C = 0.01µF</text>
    <line x1="85" y1="95" x2="140" y2="95" className="circuit-wire" />
    
    {/* Junction */}
    <circle cx="140" cy="95" r="3" fill="#3b82f6" />
    
    {/* Output */}
    <line x1="140" y1="95" x2="190" y2="95" className="circuit-wire" />
    <text x="200" y="100" className="circuit-label">Vout</text>
    
    {/* Resistor (vertical) */}
    <line x1="140" y1="95" x2="140" y2="120" className="circuit-wire" />
    <rect x="130" y="120" width="20" height="40" fill="none" stroke="#3b82f6" strokeWidth="2" />
    <line x1="135" y1="125" x2="135" y2="155" stroke="#3b82f6" strokeWidth="2" />
    <line x1="145" y1="125" x2="145" y2="155" stroke="#3b82f6" strokeWidth="2" />
    <text x="155" y="145" className="circuit-label-small">R = 10kΩ</text>
    
    {/* Ground */}
    <line x1="140" y1="160" x2="140" y2="175" className="circuit-wire" />
    <line x1="125" y1="175" x2="155" y2="175" stroke="#64748b" strokeWidth="2" />
    <line x1="130" y1="180" x2="150" y2="180" stroke="#64748b" strokeWidth="2" />
    <line x1="135" y1="185" x2="145" y2="185" stroke="#64748b" strokeWidth="2" />
  </svg>
);

function App() {
  const [filterType, setFilterType] = useState("low-pass");
  const [frequency, setFrequency] = useState(1000);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const calculateGain = async () => {
    if (!frequency || frequency <= 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/rc-gain`, {
        frequency: parseFloat(frequency),
        filter_type: filterType,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error calculating gain:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSweepData = async () => {
    try {
      const response = await axios.post(`${API}/sweep`, {
        frequency: 1000,
        filter_type: filterType,
      });
      
      const data = response.data.frequencies.map((freq, idx) => ({
        frequency: freq,
        gain: response.data.gains_db[idx],
      }));
      
      setChartData(data);
    } catch (error) {
      console.error("Error loading sweep data:", error);
    }
  };

  useEffect(() => {
    loadSweepData();
  }, [filterType]);

  const handleTabChange = (value) => {
    setFilterType(value);
    setResult(null);
  };

  return (
    <div className="app-container">
      <div className="background-gradient"></div>
      
      <div className="content-wrapper">
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <Activity className="logo-icon" />
              <h1 className="title">RC Filter Simulator</h1>
            </div>
            <p className="subtitle">Analyze Low-Pass & High-Pass Filter Characteristics</p>
          </div>
        </header>

        <main className="main-content">
          <Tabs value={filterType} onValueChange={handleTabChange} className="tabs-container">
            <TabsList className="tabs-list" data-testid="filter-tabs">
              <TabsTrigger value="low-pass" className="tab-trigger" data-testid="low-pass-tab">
                Low-Pass Filter
              </TabsTrigger>
              <TabsTrigger value="high-pass" className="tab-trigger" data-testid="high-pass-tab">
                High-Pass Filter
              </TabsTrigger>
            </TabsList>

            <TabsContent value="low-pass" className="tab-content">
              <FilterContent
                filterType="low-pass"
                frequency={frequency}
                setFrequency={setFrequency}
                calculateGain={calculateGain}
                result={result}
                chartData={chartData}
                loading={loading}
                CircuitComponent={LowPassCircuit}
              />
            </TabsContent>

            <TabsContent value="high-pass" className="tab-content">
              <FilterContent
                filterType="high-pass"
                frequency={frequency}
                setFrequency={setFrequency}
                calculateGain={calculateGain}
                result={result}
                chartData={chartData}
                loading={loading}
                CircuitComponent={HighPassCircuit}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

const FilterContent = ({
  filterType,
  frequency,
  setFrequency,
  calculateGain,
  result,
  chartData,
  loading,
  CircuitComponent,
}) => {
  return (
    <div className="filter-content">
      <div className="grid-layout">
        {/* Circuit Diagram */}
        <Card className="card circuit-card" data-testid="circuit-diagram-card">
          <CardHeader>
            <CardTitle className="card-title">Circuit Diagram</CardTitle>
            <CardDescription className="card-description">
              {filterType === "low-pass"
                ? "Resistor in series, Capacitor to ground"
                : "Capacitor in series, Resistor to ground"}
            </CardDescription>
          </CardHeader>
          <CardContent className="circuit-content">
            <CircuitComponent />
            <div className="constants-info">
              <div className="constant-item">
                <span className="constant-label">R:</span>
                <span className="constant-value">10 kΩ</span>
              </div>
              <div className="constant-item">
                <span className="constant-label">C:</span>
                <span className="constant-value">0.01 µF</span>
              </div>
              <div className="constant-item">
                <span className="constant-label">Vin:</span>
                <span className="constant-value">10 V</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input and Calculate */}
        <Card className="card input-card" data-testid="input-card">
          <CardHeader>
            <CardTitle className="card-title">Calculate Response</CardTitle>
            <CardDescription className="card-description">
              Enter frequency to analyze filter behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="input-content">
            <div className="input-group">
              <Label htmlFor="frequency" className="input-label">
                Frequency (Hz)
              </Label>
              <Input
                id="frequency"
                type="number"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="Enter frequency"
                className="frequency-input"
                data-testid="frequency-input"
              />
            </div>
            <Button
              onClick={calculateGain}
              className="calculate-button"
              disabled={loading}
              data-testid="calculate-button"
            >
              {loading ? "Calculating..." : "Calculate"}
            </Button>

            {result && (
              <div className="results-display" data-testid="results-display">
                <div className="result-item">
                  <span className="result-label">Magnitude |H(f)|:</span>
                  <span className="result-value" data-testid="magnitude-value">
                    {result.magnitude.toFixed(6)}
                  </span>
                </div>
                <div className="result-item highlight">
                  <span className="result-label">Gain (dB):</span>
                  <span className="result-value gain-value" data-testid="gain-value">
                    {result.gain_db.toFixed(2)} dB
                  </span>
                </div>
                <div className="result-item highlight">
                  <span className="result-label">Output Voltage:</span>
                  <span className="result-value vout-value" data-testid="vout-value">
                    {result.vout.toFixed(4)} V
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Frequency Response Chart */}
      <Card className="card chart-card" data-testid="chart-card">
        <CardHeader>
          <CardTitle className="card-title">Frequency Response</CardTitle>
          <CardDescription className="card-description">
            Gain (dB) vs Frequency - Logarithmic scale
          </CardDescription>
        </CardHeader>
        <CardContent className="chart-content">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="frequency"
                scale="log"
                domain={[1, 100000]}
                tickFormatter={(value) => {
                  if (value >= 1000) return `${value / 1000}k`;
                  return value.toString();
                }}
                label={{ value: "Frequency (Hz)", position: "insideBottom", offset: -5, fill: "#9ca3af" }}
                stroke="#9ca3af"
              />
              <YAxis
                label={{ value: "Gain (dB)", angle: -90, position: "insideLeft", fill: "#9ca3af" }}
                stroke="#9ca3af"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f3f4f6",
                }}
                formatter={(value) => [`${parseFloat(value).toFixed(2)} dB`, "Gain"]}
                labelFormatter={(value) => `Frequency: ${parseFloat(value).toFixed(2)} Hz`}
              />
              <ReferenceLine y={-3} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "-3dB", fill: "#ef4444" }} />
              <Line
                type="monotone"
                dataKey="gain"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
