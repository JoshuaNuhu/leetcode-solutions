from flask import Flask, render_template, request
from utils import load_documents, chunk_text, create_embeddings, search_documents

app = Flask(__name__)

# --- Load the AI Brain once when the server starts ---
print("🚀 Initializing AI System... please wait.")
RAW_DOCS = load_documents()
CHUNKS = chunk_text(RAW_DOCS)
MODEL, EMBEDDINGS = create_embeddings(CHUNKS)
print("✅ AI System Ready!")

@app.route("/", methods=["GET", "POST"])
def index():
    results = []
    if request.method == "POST":
        query = request.form.get("query")
        if query:
            # Use our existing search function from utils.py
            results = search_documents(query, MODEL, EMBEDDINGS, CHUNKS)
    
    return render_template("index.html", results=results)

if __name__ == "__main__":
    # In Flask, we run the app directly with Python
    app.run(debug=True)