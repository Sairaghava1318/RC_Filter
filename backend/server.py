from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel
import math

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Constants
R = 10000  # 10 kΩ in Ohms
C = 1e-8   # 0.01 µF in Farads
VIN = 10   # Input voltage in Volts

# Pydantic models
class FilterRequest(BaseModel):
    frequency: float
    filter_type: str  # "low-pass" or "high-pass"

class FilterResponse(BaseModel):
    frequency: float
    magnitude: float
    gain_db: float
    vout: float
    filter_type: str

class SweepResponse(BaseModel):
    frequencies: list[float]
    gains_db: list[float]
    filter_type: str

def calculate_filter_response(freq: float, filter_type: str) -> tuple:
    """
    Calculate filter response for given frequency
    Returns: (magnitude, gain_db, vout)
    """
    omega = 2 * math.pi * freq
    omega_rc = omega * R * C
    
    if filter_type == "low-pass":
        # Low-Pass: |H| = 1 / sqrt(1 + (ωRC)²)
        magnitude = 1 / math.sqrt(1 + omega_rc**2)
    else:  # high-pass
        # High-Pass: |H| = (ωRC) / sqrt(1 + (ωRC)²)
        magnitude = omega_rc / math.sqrt(1 + omega_rc**2)
    
    # Calculate gain in dB
    gain_db = 20 * math.log10(magnitude) if magnitude > 0 else -float('inf')
    
    # Calculate output voltage
    vout = VIN * magnitude
    
    return magnitude, gain_db, vout

@api_router.post("/rc-gain", response_model=FilterResponse)
async def calculate_gain(request: FilterRequest):
    """
    Calculate gain for a single frequency
    """
    logger.info(f"Received request: frequency={request.frequency}, filter_type={request.filter_type}")
    try:
        magnitude, gain_db, vout = calculate_filter_response(request.frequency, request.filter_type)
        
        response = FilterResponse(
            frequency=request.frequency,
            magnitude=magnitude,
            gain_db=gain_db,
            vout=vout,
            filter_type=request.filter_type
        )
        logger.info(f"Response sent: {response}")
        return response
    except Exception as e:
        logger.error(f"Error in calculate_gain: {str(e)}")
        raise

@api_router.post("/sweep", response_model=SweepResponse)
async def frequency_sweep(request: FilterRequest):
    """
    Generate frequency sweep data for plotting
    Returns gain vs frequency array
    """
    logger.info(f"Sweep request received for filter_type={request.filter_type}")
    try:
        # Generate logarithmically spaced frequencies from 1 Hz to 100 kHz
        frequencies = []
        gains_db = []
        
        # Create logarithmic scale: 1 Hz to 100 kHz
        start_exp = 0  # 10^0 = 1 Hz
        end_exp = 5    # 10^5 = 100 kHz
        num_points = 100
        
        for i in range(num_points):
            exp = start_exp + (end_exp - start_exp) * i / (num_points - 1)
            freq = 10 ** exp
            frequencies.append(freq)
            
            _, gain_db, _ = calculate_filter_response(freq, request.filter_type)
            gains_db.append(gain_db)
        
        response = SweepResponse(
            frequencies=frequencies,
            gains_db=gains_db,
            filter_type=request.filter_type
        )
        logger.info(f"Sweep data generated: {len(frequencies)} points")
        return response
    except Exception as e:
        logger.error(f"Error in frequency_sweep: {str(e)}")
        raise

# Include the router in the main app
app.include_router(api_router)

# Add health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend is running"}

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
