from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "Email already exists"}), 400
        
    new_user = User(
        name=data.get('name'), 
        email=data.get('email')
    )
    new_user.set_password(data.get('password'))
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    # Verify user and password
    if user and user.check_password(data.get('password')):
        # Generate a token identifying this specific user ID
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"access_token": access_token}), 200
        
    return jsonify({"error": "Invalid credentials"}), 401