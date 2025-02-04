from models import db, Appointment
from flask import Blueprint, request, jsonify
from flask_jwt_extended import  jwt_required, get_jwt_identity

appointment_bp = Blueprint("appointment_bp", __name__)


@appointment_bp.route('/appointments', methods=['POST'])
def create_appointment():
    data = request.get_json()
    appointment = Appointment(
        patient_id=data['patient_id'],
        doctor_id=data['doctor_id'],
        date=data['date'],
        time=data['time'],
        status=data.get('status', 'Scheduled')
    )
    db.session.add(appointment)
    db.session.commit()
    return jsonify({'message': 'Appointment created successfully'}), 201

@appointment_bp.route('/appointments/<int:appointment_id>', methods=['GET'])
def get_appointment(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    return jsonify({
        'date': appointment.date.isoformat(),
        'time': appointment.time,
        'status': appointment.status
    })

@appointment_bp.route('/appointments/<int:appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    data = request.get_json()
    appointment = Appointment.query.get_or_404(appointment_id)
    appointment.status = data.get('status', appointment.status)
    appointment.date = data.get('date', appointment.date)
    appointment.time = data.get('time', appointment.time)
    db.session.commit()
    return jsonify({'message': 'Appointment updated successfully'})

@appointment_bp.route('/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    db.session.delete(appointment)
    db.session.commit()
    return jsonify({'message': 'Appointment deleted successfully'})
