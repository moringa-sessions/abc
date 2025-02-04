from models import db, HealthRecord
from flask import Blueprint, request, jsonify
from flask_jwt_extended import  jwt_required, get_jwt_identity

health_record_bp = Blueprint("health_record_bp", __name__)

@health_record_bp.route('/health_records', methods=['POST'])
def create_health_record():
    data = request.get_json()
    new_record = HealthRecord(patient_id=data['patient_id'], doctor_id=data['doctor_id'], record_details=data['record_details'])
    db.session.add(new_record)
    db.session.commit()
    return jsonify({'message': 'Health record created successfully'}), 201

@health_record_bp.route('/health_records/<int:record_id>', methods=['GET'])
def get_health_record(record_id):
    record = HealthRecord.query.get_or_404(record_id)
    return jsonify({'record_details': record.record_details, 'date': record.date.isoformat()})

@health_record_bp.route('/health_records/<int:record_id>', methods=['PUT'])
def update_health_record(record_id):
    data = request.get_json()
    record = HealthRecord.query.get_or_404(record_id)
    record.record_details = data.get('record_details', record.record_details)
    db.session.commit()
    return jsonify({'message': 'Health record updated successfully'})

@health_record_bp.route('/health_records/<int:record_id>', methods=['DELETE'])
def delete_health_record(record_id):
    record = HealthRecord.query.get_or_404(record_id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': 'Health record deleted successfully'})
