import os
from openai import AsyncOpenAI
from agents import OpenAIChatCompletionsModel, Model

def get_model(model_name_env_var: str = "LLM_MODEL", default_model: str = "anthropic/claude-3.5-sonnet") -> Model:
    """
    Creates a configured OpenAIChatCompletionsModel with a custom AsyncOpenAI client.
    Reads API Key and Base URL from environment variables.
    """
    api_key = os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENROUTER_BASE_URL") or os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
    
    # Get model name from env var or default
    model_name = os.getenv(model_name_env_var, default_model)

    if not api_key:
        # Fallback or let it fail later if key is missing
        print("Warning: No API Key found for LLM client.")

    client = AsyncOpenAI(
        api_key=api_key,
        base_url=base_url
    )
    
    return OpenAIChatCompletionsModel(
        model=model_name,
        openai_client=client
    )
