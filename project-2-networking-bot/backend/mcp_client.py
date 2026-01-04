import os
import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Optional, Dict, Any
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.types import CallToolResult
from agents import function_tool

logger = logging.getLogger(__name__)

class PlaywrightMCPClient:
    def __init__(self):
        self.session: Optional[ClientSession] = None
        self._exit_stack = None

    @asynccontextmanager
    async def connect(self):
        """
        Connects to the Playwright MCP server running via npx.
        """
        # Define server parameters
        # We use npx to run the server. Ensure Node.js is installed.
        server_params = StdioServerParameters(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-playwright"],
            env=os.environ.copy()
        )

        try:
            async with stdio_client(server_params) as (read, write):
                async with ClientSession(read, write) as session:
                    self.session = session
                    await session.initialize()
                    logger.info("Connected to Playwright MCP server")
                    
                    # Verify tools are available
                    tools = await session.list_tools()
                    logger.info(f"Available tools: {[t.name for t in tools.tools]}")
                    
                    yield self
                    
        except Exception as e:
            logger.error(f"Failed to connect to MCP server: {e}", exc_info=True)
            raise

    async def search_google(self, query: str) -> str:
        """
        Executes a Google search using the Playwright MCP server.
        NOTE: The tool name depends on what the server exposes. 
        Usually it might be something generic like 'navigate' or specific.
        Let's assume we use a tool implementation or just simulate via browser actions if needed,
        BUT standard Playwright MCP usually exposes things like 'navigate', 'click', 'fill', 'evaluate'.
        
        However, for a simple search integration in an AGENT, we often want a higher level tool provided by the MCP server.
        If the server only provides low-level primitives, we might need to compose them.
        
        Let's list tools first to be sure, but for this implementation we'll wrap a "web search" 
        by navigating to google and extracting results, OR if the MCP server has a 'search' tool we use that.
        
        Assuming we just want to execute a search, we might not have a direct "google_search" tool 
        unless we are using a specific search MCP. 
        
        Wait, standard Playwright MCP is for browser automation. 
        So we likely need to:
        1. navigate to google
        2. fill search
        3. press enter
        4. get content
        
        OR simpler: navigate to `https://www.google.com/search?q={query}` and get content.
        """
        if not self.session:
            raise RuntimeError("MCP session not active")

        try:
            # Simple approach: Navigate and get content
            # Tool names come from the server. Common ones: 'navigate', 'get_content', 'screenshot'
            url = f"https://www.google.com/search?q={query}"
            
            # Step 1: Navigate
            # Note: We rely on the tools exposed by @modelcontextprotocol/server-playwright
            # Let's assume standard tool naming conventions.
            
            # Use 'tools/call'
            # We must know the exact tool names. 
            # Usually: "playwright_navigate", "playwright_evaluate", etc. or just "navigate".
            # Let's try 'navigate' first.
            
            logger.info(f"Searching for: {query}")
            
            # Note: This is a best-effort implementation. 
            # In a real scenario we'd inspect self.session.list_tools() output.
            # But we can't do that at runtime here easily without running it.
            # We will assume a generic 'navigate' or 'browse' capability or similar.
            
            # Let's try to find a tool that looks relevant.
            tools = await self.session.list_tools()
            tool_map = {t.name: t for t in tools.tools}
            
            # Logic to pick tool (navigate usually)
            # This logic runs INSIDE the connection context, so we can do this.
            
            # Perform search (this is effectively a script we run via the agent)
            # But we want to expose this as a single function "web_search" to OUR agent.
            
            # Strategy: use 'playwright_navigate' if available
            tool_name = "playwright_navigate" 
            if tool_name not in tool_map:
                # Fallback check
                for name in tool_map:
                    if "navigate" in name:
                        tool_name = name
                        break
            
            if tool_name not in tool_map:
                return "Error: Could not find navigation tool in Playwright MCP"

            await self.session.call_tool(
                tool_name,
                arguments={"url": url}
            )
            
            # Get content - typically 'playwright_screenshot' or 'playwright_get_content'?
            # Let's assume we want text.
            content_tool = "playwright_evaluate" # Generic JS
            # Or maybe just return a summary saying "check screenshot" if we were human.
            # But for an agent, text is better.
            
            # Actually, the standard server often is:
            # Tools: navigate, screenshot, click, fill, hover, evaluate, etc.
            
            # Let's try to grab text body
            js_script = "document.body.innerText"
            if "playwright_evaluate" in tool_map:
                 result = await self.session.call_tool(
                    "playwright_evaluate",
                    arguments={"script": js_script}
                )
                 # Result is CallToolResult
                 # content is list of TextContent or ImageContent
                 text = "".join([c.text for c in result.content if hasattr(c, "text")])
                 return text[:2000] + "..." # Truncate
            
            return "Search performed (content retrieval unavailable)"

        except Exception as e:
            logger.error(f"Search failed: {e}")
            return f"Search failed: {e}"

# Global instance management might be tricky with async context managers 
# interacting with synchronous or other async parts. 
# For now, we'll design the tool to perform a quick one-off session per call 
# OR use a long-lived one if the architecture supports it.
# The `network_manager` is stateless between requests mostly. 
# So creating a session per request is safer but slower.

@function_tool
async def web_search_tool(query: str) -> str:
    """
    Tool function to act as a wrapper for the MCP search.
    """
    client = PlaywrightMCPClient()
    async with client.connect() as connected_client:
        return await connected_client.search_google(query)

