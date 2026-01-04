import logging
from fastapi import APIRouter, HTTPException
from models.models import UserInput, OutreachResponse
from services import outreach_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Network Bot API is running"}

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@router.get("/test-agent")
async def test_agent():
    """Test endpoint to verify the network manager is working"""
    try:
        logger.info("Testing network manager...")
        from network_agents.network_manager import network_manager
        logger.info(f"Network manager: {network_manager}")
        logger.info(f"Network manager type: {type(network_manager)}")
        return {
            "status": "success",
            "network_manager_type": str(type(network_manager)),
            "network_manager_name": getattr(network_manager, 'name', 'Unknown')
        }
    except Exception as e:
        logger.error(f"Error testing agent: {str(e)}", exc_info=True)
        return {"status": "error", "error": str(e)}

@router.post("/outreach", response_model=OutreachResponse)
async def generate_outreach(user_input: UserInput):
    logger.info(f"Received outreach request: {user_input}")
    
    try:
        user_input_dict = user_input.model_dump()
        response = await outreach_service.generate_outreach(user_input_dict)
        return response     
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in generate_outreach endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error generating outreach: {str(e)}")
