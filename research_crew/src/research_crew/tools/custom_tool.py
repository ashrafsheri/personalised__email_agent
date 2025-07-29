from crewai_tools import SerperDevTool
from typing import Type
from pydantic import BaseModel, Field

class ExecutiveLookupInput(BaseModel):
    """Input schema for ExecutiveLookupTool."""
    query: str = Field(..., description="Search query for finding executives")

class ExecutiveLookupTool(SerperDevTool):
    """Tool for searching executives at a specific company for a given role."""
    name: str = "executive_lookup"
    description: str = "Search for executives at a specific company for a given role using enhanced search queries"
    args_schema: Type[BaseModel] = ExecutiveLookupInput
    
    def _run(self, query: str) -> str:
        """Run the tool with the query enhanced for executive search."""
        enhanced_query = f"{query} site:linkedin.com OR site:crunchbase.com OR site:forbes.com"
        return super()._run(enhanced_query)
