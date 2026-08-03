# app/utils/storage.py
import uuid
from supabase import create_client, Client
from flask import current_app

def upload_pdf_to_supabase(file_bytes: bytes, filename: str, user_id: int) -> str:
    """Uploads a PDF to Supabase Storage and returns the public URL."""
    url = current_app.config.get("SUPABASE_URL")
    key = current_app.config.get("SUPABASE_KEY")
    
    if not url or not key:
        raise ValueError("Supabase URL or Key is missing from configuration.")
        
    supabase: Client = create_client(url, key)

    # Generate a unique path: e.g., "1/random-uuid_handout.pdf"
    # This keeps user files organized and prevents overwriting
    safe_filename = filename.replace(' ', '_')
    unique_filename = f"{user_id}/{uuid.uuid4()}_{safe_filename}"

    # Upload to the 'handouts' bucket
    supabase.storage.from_("handouts").upload(
        file=file_bytes,
        path=unique_filename,
        file_options={"content-type": "application/pdf"}
    )

    # Retrieve and return the public URL
    public_url = supabase.storage.from_("handouts").get_public_url(unique_filename)
    return public_url