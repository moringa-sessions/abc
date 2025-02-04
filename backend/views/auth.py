from flask import jsonify, request, Blueprint
from models import db, User, TokenBlocklist
from werkzeug.security import check_password_hash
from datetime import datetime
from datetime import timedelta
from datetime import timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

auth_bp= Blueprint("auth_bp", __name__)


# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password ) :
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token}), 200

    else:
        return jsonify({"error": "Either email/password is incorrect"}), 404


# current user
@auth_bp.route("/currentUser", methods=["GET"])
@jwt_required()
def current_user():
    current_user_id  = str(get_jwt_identity())
    print("cuurent user id",current_user_id)
    user =  User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user_data = {
            'id':user.id,
            'email':user.email,
            'is_doctor': user.is_doctor,
            'name':user.name
        }

    return jsonify(user_data)



# Logout
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"success":"Logged out successfully"})