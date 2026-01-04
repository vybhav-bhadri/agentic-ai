import logging
from dotenv import load_dotenv
from fastapi import FastAPI
import os
import agents

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Configure OpenAI Client (OpenRouter / Gemini / Custom) ---
agents.set_tracing_disabled(True) # Disable tracing export warning since we don't have OPENAI_API_KEY for it
# Import views AFTER loading environment variables
# This ensures agents instantiated in views/services pick up the configured env vars
from views import router

app = FastAPI(title="Network Bot API", version="0.1.0")
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
