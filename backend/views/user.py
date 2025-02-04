from models import db, User, TokenBlocklist
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

user_bp = Blueprint("user_bp", __name__)

# POST: Create a new doctor
@user_bp.route('/doctors', methods=['POST'])
def create_doctor():
    data = request.get_json()
    if not data or not all(field in data for field in ['name', 'email', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400

    new_user = User(
        name=data['name'], 
        email=data['email'], 
        password=generate_password_hash(data['password']), 
        is_doctor=True
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'success': 'Doctor created successfully'}), 201


# Add patient by doctor
@user_bp.route('/patient', methods=['POST'])
@jwt_required()
def create_patient():
    data = request.get_json()
    if not data or not all(field in data for field in ['name', 'email']):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400

    new_user = User(
        name=data['name'], 
        email=data['email'], 
        is_patient=True
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'success': 'Patient registered successfully'}), 201




#  Retrieve all patients 
@user_bp.route('/patients', methods=['GET'])
def get_patients():
    users = User.query.filter(User.is_patient == True).all()

    patients = []
    for user in users:
        # For each user, fetch their prescriptions with doctor's name
        prescriptions = []
        for pres in user.prescriptions:
            doctor = User.query.get(pres.doctor_id)  # Get the doctor by ID
            prescriptions.append({
                "prescription_id": pres.prescription_id,
                "medication_name": pres.medication_name,
                "dosage": pres.dosage,
                "date_prescribed": pres.date_prescribed,
                "doctor_name": doctor.name if doctor else "Unknown"  # Add doctor's name
            })

        patients.append({
            "id": user.id,
            'name': user.name,
            'email': user.email,
            'prescriptions': prescriptions  # Include prescriptions with doctor names
        })

    return jsonify(patients)





# Update a patient by ID
@user_bp.route('/patient/<int:user_id>', methods=['PUT'])
def update_patient(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)

    # Update fields with the provided data, keep current data if not provided
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)

    db.session.commit()
    return jsonify({'success': 'Patient updated successfully'})



# Delete a user by ID
@user_bp.route('/patient/<int:patient_id>', methods=['DELETE'])
@jwt_required()
def delete_user(patient_id):
    user = User.query.get_or_404(patient_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'success': 'User deleted successfully'})
