from models import db, Prescription
from flask import Blueprint, request, jsonify
from flask_jwt_extended import  jwt_required, get_jwt_identity

prescription_bp = Blueprint("prescription_bp", __name__)


@prescription_bp.route('/prescriptions', methods=['POST'])
@jwt_required()
def create_prescription():
    data = request.get_json()
    prescription = Prescription(
        patient_id=data['patient_id'],
        doctor_id=get_jwt_identity(),
        medication_name=data['medication_name'],
        dosage=data['dosage']
    )
    db.session.add(prescription)
    db.session.commit()
    return jsonify({'message': 'Prescription created successfully'}), 201

@prescription_bp.route('/prescriptions/<int:prescription_id>', methods=['GET'])
@jwt_required()
def get_prescription(prescription_id):
    prescription = Prescription.query.get_or_404(prescription_id)
    return jsonify({
        'medication_name': prescription.medication_name,
        'dosage': prescription.dosage,
        'date_prescribed': prescription.date_prescribed.isoformat()
    })


# Update
@prescription_bp.route('/prescriptions/<int:prescription_id>', methods=['PUT'])
@jwt_required()
def update_prescription(prescription_id):
    data = request.get_json()
    prescription = Prescription.query.get_or_404(prescription_id)
    prescription.medication_name = data.get('medication_name', prescription.medication_name)
    prescription.dosage = data.get('dosage', prescription.dosage)
    db.session.commit()
    return jsonify({'success': 'Prescription updated successfully'})


# delete
@prescription_bp.route('/prescriptions/<int:prescription_id>', methods=['DELETE'])
@jwt_required()
def delete_prescription(prescription_id):
    prescription = Prescription.query.get_or_404(prescription_id)
    db.session.delete(prescription)
    db.session.commit()
    return jsonify({'success': 'Prescription deleted successfully'})
