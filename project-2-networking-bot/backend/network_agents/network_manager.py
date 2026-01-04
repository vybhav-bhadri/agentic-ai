from .twitter_agent import twitter_agent as TWITTER_AGENT
from .instagram_agent import instagram_agent as INSTAGRAM_AGENT
from .linkedin_agent import linkedin_agent as LINKEDIN_AGENT
from agents import Agent
from llm_config import get_model

NETWORK_INSTRUCTIONS = """
You are NetworkManager. Your job is to select the correct platform tool (twitter_agent, instagram_agent, linkedin_agent)
based on the user's input, call that tool, and return exactly the JSON the tool returns. Do NOT invent the message yourself.
If the chosen tool fails, return a JSON object with {"error": "<brief explanation>"}.
"""

_tool_description = "Generate platform-specific outreach (do not write messages yourself)."


tool_twitter = TWITTER_AGENT.as_tool(tool_name="twitter_agent", tool_description=_tool_description)
tool_instagram = INSTAGRAM_AGENT.as_tool(tool_name="instagram_agent", tool_description=_tool_description)
tool_linkedin = LINKEDIN_AGENT.as_tool(tool_name="linkedin_agent", tool_description=_tool_description)

tools = [tool_twitter, tool_instagram, tool_linkedin]

network_manager = Agent(name="NetworkManager", instructions= NETWORK_INSTRUCTIONS, tools = tools, model=get_model(default_model="gpt-4o-mini"))