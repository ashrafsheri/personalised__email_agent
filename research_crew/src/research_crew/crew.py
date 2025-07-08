from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from crewai_tools import SerperDevTool
import os
from dotenv import load_dotenv
import time
from langchain_anthropic import ChatAnthropic

# Load environment variables from .env file
load_dotenv()

# Get API key from environment
api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError("ANTHROPIC_API_KEY environment variable is not set")

@CrewBase
class ResearchCrew():
    """ResearchCrew crew"""

    agents: List[BaseAgent]
    tasks: List[Task]
    
    def __init__(self):
        super().__init__()
        # Configure Anthropic with strict rate limiting for free tier
        self.anthropic_llm = ChatAnthropic(
            model="claude-3-haiku-20240307",  # Fastest, cheapest model
            temperature=0.7,
            max_tokens=800,  # Reduced token limit
            api_key=api_key,
            # Add rate limiting parameters
            request_timeout=120,
        )
    
    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config['researcher'], 
            verbose=True,
            tools=[SerperDevTool()],
            llm=self.anthropic_llm,
            max_retry_attempts=1,  # Only 1 retry to avoid hitting limits
            retry_wait_time=120,   # Wait 2 minutes between retries
            max_execution_time=600, # 10 minutes max
            max_iter=2,  # Maximum 2 iterations only
        )

    @agent
    def email_writer(self) -> Agent:
        return Agent(
            config=self.agents_config['email_writer'],
            verbose=True,
            llm=self.anthropic_llm,
            max_retry_attempts=1,  # Only 1 retry
            retry_wait_time=120,   # Wait 2 minutes between retries
            max_execution_time=600, # 10 minutes max
            max_iter=2,  # Maximum 2 iterations only
        )

    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config['research_task'],
            # Fix: callback should accept the output parameter
            callback=lambda output: time.sleep(15)  # 15 second delay
        )

    @task
    def reporting_task(self) -> Task:
        return Task(
            config=self.tasks_config['email_task'],
            output_file='email.md',
            # Fix: callback should accept the output parameter
            callback=lambda output: time.sleep(15)  # 15 second delay
        )

    @crew
    def crew(self) -> Crew:
        """Creates the ResearchCrew crew with rate limiting"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
            # Add crew-level timeout
            max_execution_time=1200,  # 20 minutes total
        )
