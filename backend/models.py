from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from datetime import datetime

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

# User model
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=True)
    is_doctor = db.Column(db.Boolean, default=False)
    is_patient = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=True)
    # Relationships
    health_records = db.relationship('HealthRecord', backref='patient', foreign_keys='HealthRecord.patient_id', lazy=True)
    created_records = db.relationship('HealthRecord', backref='doctor', foreign_keys='HealthRecord.doctor_id', lazy=True)

    prescriptions = db.relationship('Prescription', backref='patient', foreign_keys='Prescription.patient_id', lazy=True)
    prescribed_by = db.relationship('Prescription', backref='doctor', foreign_keys='Prescription.doctor_id', lazy=True)

    patient_appointments = db.relationship('Appointment', backref='patient', foreign_keys='Appointment.patient_id', lazy=True)
    doctor_appointments = db.relationship('Appointment', backref='doctor', foreign_keys='Appointment.doctor_id', lazy=True)

# HealthRecord model
class HealthRecord(db.Model):
    __tablename__ = 'health_record'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    record_details = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

# Prescription model
class Prescription(db.Model):
    __tablename__ = 'prescription'
    prescription_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    medication_name = db.Column(db.String(100), nullable=False)
    dosage = db.Column(db.String(100), nullable=False)
    date_prescribed = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

# Appointment model
class Appointment(db.Model):
    __tablename__ = 'appointment'
    appointment_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(10), nullable=False)
    status = db.Column(db.String(20), default='Scheduled')  # Scheduled, Completed, Cancelled
class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False)