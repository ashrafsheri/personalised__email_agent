from typing import Type
from pydantic import BaseModel, Field
from crewai.tools import BaseTool
from crewai_tools import SerperDevTool


class ExecutiveLookupInput(BaseModel):
    """Input schema for ExecutiveLookupTool."""
    query: str = Field(
        ..., description="Search query for finding executives, e.g., 'Express News Pakistan CTO'"
    )


class ExecutiveLookupTool(BaseTool):
    """
    Tool for searching executives at a specific company and role.
    Usage: tool.run({'query': 'Company Name Role Title'})
    """
    name: str = "executive_lookup"
    description: str = (
        "Search for executives at a specific company for a given role "
        "using enhanced site-restricted queries"
    )
    args_schema: Type[BaseModel] = ExecutiveLookupInput

    def __init__(self):
        super().__init__()
        # Initialize the Serper search tool
        self._serper: SerperDevTool = SerperDevTool()

    def _run(self, query: str) -> str:
        # Build a site-restricted query across LinkedIn, Crunchbase, and Forbes
        enhanced = (
            f"{query} "
            "site:linkedin.com/in OR site:crunchbase.com OR site:forbes.com"
        )
        # Invoke Serper with the correct parameter names
        raw = self._serper.run(search_query=enhanced, search_type="search")

        # Parse out the top organic result if available
        if isinstance(raw, dict) and raw.get("organic"):
            top = raw["organic"][0]
            title = top.get("title", "<no title>")
            link = top.get("link", "<no link>")
            snippet = top.get("snippet", "")
            return f"**{title}**\n{link}\n\n{snippet}"

        # Fallback: return the raw Serper response
        return str(raw)

    async def _arun(self, query: str) -> str:
        # Async support, using same parameters
        enhanced = (
            f"{query} "
            "site:linkedin.com/in OR site:crunchbase.com OR site:forbes.com"
        )
        raw = await self._serper.arun(search_query=enhanced, search_type="web")
        if isinstance(raw, dict) and raw.get("organic"):
            top = raw["organic"][0]
            title = top.get("title", "<no title>")
            link = top.get("link", "<no link>")
            snippet = top.get("snippet", "")
            return f"**{title}**\n{link}\n\n{snippet}"
        return str(raw)
