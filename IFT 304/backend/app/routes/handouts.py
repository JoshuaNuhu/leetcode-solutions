from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Handout, Mastery, Question
from app.utils.pdf import extract_text_from_pdf
from app.utils.storage import upload_pdf_to_supabase
from app.utils.ai import generate_study_questions

handouts_bp = Blueprint('handouts', __name__)

@handouts_bp.route('', methods=['POST'])
@jwt_required()
def upload_handout():
    # Get the ID of the user making the request from the JWT token
    user_id = int(get_jwt_identity())
    
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['file']
    course_name = request.form.get('course_name', 'General Course')

    if file.filename == '' or not file.filename.endswith('.pdf'):
        return jsonify({"error": "File must be a PDF"}), 400

    # Read into memory once
    file_bytes = file.read()

    try:
        # 1. Extract Text
        extracted_text = extract_text_from_pdf(file_bytes)
        
        # 2. Upload PDF to Supabase Storage
        file_url = upload_pdf_to_supabase(file_bytes, file.filename, user_id)
        
        # 3. Save Handout record to database
        handout = Handout(
            user_id=user_id,
            course_name=course_name,
            extracted_text=extracted_text,
            file_url=file_url
        )
        db.session.add(handout)
        db.session.flush() # Flushes to get the handout.id before committing

        # 4. Generate AI Questions
        questions_data = generate_study_questions(extracted_text, num_questions=5)
        
        for q_data in questions_data:
            question = Question(
                handout_id=handout.id,
                question_text=q_data.get('question_text'),
                correct_answer=q_data.get('correct_answer'),
                topic_tag=q_data.get('topic_tag', 'General')
            )
            db.session.add(question)
            
        # 5. Initialize Mastery Tracking
        mastery = Mastery(user_id=user_id, handout_id=handout.id, score=0.0)
        db.session.add(mastery)
        
        # Commit all database changes together
        db.session.commit()

        return jsonify({
            "message": "Handout processed and AI questions generated successfully",
            "handout_id": handout.id,
            "file_url": handout.file_url
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@handouts_bp.route('', methods=['GET'])
@jwt_required()
def list_handouts():
    user_id = int(get_jwt_identity())
    handouts = Handout.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        "id": h.id,
        "course_name": h.course_name,
        "file_url": h.file_url,
        "created_at": h.created_at.isoformat()
    } for h in handouts]), 200
@handouts_bp.route('/<int:handout_id>', methods=['GET'])
@jwt_required()
def get_handout(handout_id):
    user_id = int(get_jwt_identity())

    handout = Handout.query.filter_by(id=handout_id, user_id=user_id).first()

    if not handout:
        return jsonify({"error": "Handout not found"}), 404

    return jsonify({
        "id": handout.id,
        "course_name": handout.course_name,
        "file_url": handout.file_url,
        "created_at": handout.created_at.isoformat(),
        "questions": [{
            "id": q.id,
            "question_text": q.question_text,
            "correct_answer": q.correct_answer,
            "topic_tag": q.topic_tag
        } for q in handout.questions]
    }), 200