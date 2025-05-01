from .database import get_db, init_db
from sqlalchemy.ext.declarative import declarative_base
from .user import User
from .patient_records import PatientRecord
from .emergency_contact import EmergencyContact  # Add this line to import EmergencyContact
