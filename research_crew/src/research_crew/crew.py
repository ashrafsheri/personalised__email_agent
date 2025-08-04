from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List, Dict, Any
from crewai_tools import SerperDevTool
import os, time, re
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from .tools import ExecutiveLookupTool

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

@CrewBase
class ResearchCrew():
    """Crew to perform executive lookup, research, and craft a personalized sales email"""

    agents: List[BaseAgent]
    tasks: List[Task]

    def __init__(self):
        super().__init__()
        # Shared context for passing values between tasks
        self.shared_context: Dict[str, Any] = {"cto_name": "there"}
        # Configure OpenAI LLM
        self.openai_llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0.7,
            max_tokens=800,
            api_key=api_key,
            request_timeout=120,
        )

    @agent
    def executive_finder(self) -> Agent:
        return Agent(
            config=self.agents_config['executive_finder'],
            verbose=True,
            tools=[ExecutiveLookupTool()],
            llm=self.openai_llm,
            max_retry_attempts=1,
            retry_wait_time=120,
            max_execution_time=600,
            max_iter=2,
        )

    def _on_lookup(self, lookup_output):
        """
        Callback after executive lookup: extract and store the CTO's name
        """
        # Optional processing delay
        time.sleep(15)
        # Unwrap TaskOutput if needed
        if hasattr(lookup_output, 'output'):
            text = lookup_output.output
        else:
            text = str(lookup_output)
        # Extract the bolded name before dash
        m = re.search(r"\*\*(?P<name>[^–\n]+)", text)
        self.shared_context['cto_name'] = m.group('name').strip() if m else 'there'
        print(f"CTO name extracted: {self.shared_context['cto_name']}")

    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config['researcher'],
            verbose=True,
            tools=[SerperDevTool()],
            llm=self.openai_llm,
            max_retry_attempts=1,
            retry_wait_time=120,
            max_execution_time=600,
            max_iter=2,
        )

    @agent
    def email_writer(self) -> Agent:
        # Provide CTO name from shared_context as initial input
        return Agent(
            config=self.agents_config['email_writer'],
            verbose=True,
            llm=self.openai_llm,
            inputs={"cto_name": self.shared_context['cto_name']},
            max_retry_attempts=1,
            retry_wait_time=120,
            max_execution_time=600,
            max_iter=2,
        )

    @task
    def executive_lookup_task(self) -> Task:
        return Task(
            config=self.tasks_config['executive_lookup_task'],
            callback=self._on_lookup
        )

    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config['research_task'],
            callback=lambda _: time.sleep(15)
        )

    @task
    def email_task(self) -> Task:
        return Task(
            config=self.tasks_config['email_task'],
            output_file='email.md',
            callback=lambda _: time.sleep(15)
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=[
                self.executive_finder(),  # lookup CTO first
                self.researcher(),        # then gather research
                self.email_writer()       # finally write the email
            ],
            tasks=[
                self.executive_lookup_task(),
                self.research_task(),
                self.email_task()
            ],
            process=Process.sequential,
            verbose=True,
            max_execution_time=1200,
        )
