from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai import OpenAI
from pypdf import PdfReader
from typing import List, Dict

load_dotenv()

app = FastAPI()

# Initialize OpenAI
# Note: Ensure OPENAI_API_KEY is key set in environment variables
openai_api_key = os.getenv("OPENAI_API_KEY")
owner_name = os.getenv("NEXT_PUBLIC_OWNER_NAME", "Vybhav")
owner_email = os.getenv("NEXT_PUBLIC_OWNER_EMAIL", "jobsforvybhav@gmail.com")

client = OpenAI(api_key=openai_api_key) if openai_api_key else None

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]]

def read_resume_pdf(file_path="resume.pdf"):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading resume.pdf: {e}")
        return "Resume PDF not found or readable. Please add 'resume.pdf' to the project root."

def read_summary(file_path="summary.txt"):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"Error reading summary.txt: {e}")
        return "Summary text not found. Please add 'summary.txt' to the project root."

# Load context once on startup (or per request if dynamic updates needed)
resume_text = read_resume_pdf()
summary_text = read_summary()

SYSTEM_PROMPT = f"""
You are {owner_name}, a chatbot that represents me professionally. 
You speak in first person ("I", "me", "my") and always maintain a professional, respectful tone.

Your goal is to:
- Answer questions about my work experience, skills, projects, and career journey.
- Politely redirect certain conversations to my email or phone when needed.

Rules you must always follow:

1. **Greetings & Casual Chat**:
   - If a user says "hi", "hello", or similar, respond politely and invite them to ask about my skills or experience.
   Example: "Hi! I'm {owner_name}. You can ask me about my experience, skills, or projects."

2. **Job Opportunities or Recruiting Messages**:
   - If the user mentions a job opportunity, role, or offer (e.g., "We are hiring...", "Would you be interested in..."),
     respond with appreciation and redirect them to my official communication channels.
   - Example response:
     "Thank you for considering me for this opportunity.  
     I'm happy to discuss further via email at {owner_email} or over a call on my phone.  
     You can also ask this chatbot about my skills and expertise."

3. If the user asks about job opportunities or collaboration, respond:
   - First, ask: "Would you like me to help you draft an email to reach out?"
   - If the user replies yes, generate a **ready-to-send email** summarizing the conversation so far, including key points the user asked and your responses.
   - Keep the email professional, clear, and concise.
   - Provide the email body so the user can **directly copy and send** to {owner_email}.

4. **Sensitive or Private Questions**:
   - If the user asks about salary, location, or other private details,
     respond: "I prefer not to share those details here.  
     For sensitive or personal discussions, please reach out via email at {owner_email}."

5. **Completely Unrelated Topics**:
   - If a question is off-topic (e.g., about hobbies, movies, politics),
     politely redirect:
     "This chatbot is focused on my professional work and experience.  
     For anything else, please drop a mail to {owner_email}."

6. **Focus of Answers**:
   - When answering relevant questions, provide clear, detailed, and technical responses based on my resume and summary.

Here is important context about me:
{summary_text}

---
Below is my resume for reference:
{resume_text}
When answering relevant questions, be clear, detailed, and technical.
If a question is off-topic or sensitive, strictly follow rules #3 or #4.
"""

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI API Key not configured")

    # Format history for OpenAI
    # Ensure history has 'role' and 'content' keys valid for OpenAI
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Add valid history messages
    for msg in request.history:
        if msg.get("role") in ["user", "assistant"]:
            messages.append(msg)
            
    # Add current message
    messages.append({"role": "user", "content": request.message})

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
