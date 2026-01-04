import json
import logging
from typing import Dict, Any
from fastapi import HTTPException
from agents import Runner
from network_agents.network_manager import network_manager
from network_agents.input_converter import converter_agent
from models.models import OutreachResponse

logger = logging.getLogger(__name__)

class OutreachService:
    """Service class for handling outreach generation logic"""
    
    def __init__(self):
        self.converter_agent = converter_agent
        self.network_manager = network_manager
    
    async def generate_outreach(self, user_input: Dict[str, Any]) -> OutreachResponse:
        logger.info(f"Received user input: {user_input}")
        
        try:
            logger.info("Step 1: Converting user input to detailed outreach request...")
            converter_input_str = json.dumps(user_input, ensure_ascii=False)
            
            converter_result = await Runner.run(self.converter_agent, converter_input_str)
            logger.info(f"Converter result: {converter_result}")
            
            if not hasattr(converter_result, 'final_output') or not converter_result.final_output:
                raise ValueError("Converter agent did not return valid output")
            
            outreach_request_data = self._parse_agent_output(converter_result.final_output)
            logger.info(f"Converted outreach request: {outreach_request_data}")
            
            logger.info("Step 2: Generating outreach using network manager...")
            network_input_str = json.dumps(outreach_request_data, ensure_ascii=False)
            
            network_result = await Runner.run(self.network_manager, network_input_str)
            logger.info(f"Network manager result: {network_result}")
            
            if not hasattr(network_result, 'final_output') or not network_result.final_output:
                raise ValueError("Network manager did not return valid output")
            
            response_data = self._parse_agent_output(network_result.final_output)
            logger.info(f"Final response data: {response_data}")
            
            # Handle potential error text from agents (e.g. if tool call failed)
            if isinstance(response_data, dict) and "error" in response_data:
                error_msg = response_data["error"]
                logger.error(f"Agent returned error: {error_msg}")
                raise HTTPException(status_code=400, detail=f"Agent Error: {error_msg}")

            # Auto-fix: Calculate length_chars if missing but message exists
            if "message" in response_data and "length_chars" not in response_data:
                 response_data["length_chars"] = len(response_data["message"])
                 logger.info(f"Auto-filled missing length_chars: {response_data['length_chars']}")

            response = OutreachResponse(**response_data)
            logger.info(f"Response created successfully: {response}")
            return response
            
        except Exception as e:
            logger.error(f"Error in generate_outreach: {str(e)}", exc_info=True)
            raise
    
    def _parse_agent_output(self, output: str) -> Dict[str, Any]:
        """
        Parse agent output, handling markdown code blocks if present.
        
        Args:
            output: Raw output from agent (string)
            
        Returns:
            Dict: Parsed JSON data
        """
        if isinstance(output, str):
            if output.strip().startswith('```json'):
                lines = output.strip().split('\n')
                json_lines = []
                in_json = False
                for line in lines:
                    if line.strip() == '```json':
                        in_json = True
                        continue
                    elif line.strip() == '```':
                        break
                    elif in_json:
                        json_lines.append(line)
                output = '\n'.join(json_lines)
                logger.info(f"Extracted JSON from markdown: {output}")
            
            try:
                return json.loads(output)
            except json.JSONDecodeError:
                # Fallback: Fuzzy extraction (find first '{' and last '}')
                try:
                    start = output.find('{')
                    end = output.rfind('}')
                    if start != -1 and end != -1:
                        json_str = output[start : end + 1]
                        logger.info(f"Fuzzy extracted JSON: {json_str}")
                        return json.loads(json_str)
                except Exception:
                     pass # Fallback failed, proceed to raise original error
                
                logger.error(f"Failed to parse JSON. Raw output: {repr(output)}")
                raise ValueError(f"Invalid JSON response from agent")
        
        return output

outreach_service = OutreachService()
