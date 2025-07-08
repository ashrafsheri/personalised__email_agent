import pytest
from unittest.mock import MagicMock

@pytest.fixture
def mock_agent():
    """Mock for a CrewAI Agent"""
    agent_mock = MagicMock()
    return agent_mock

@pytest.fixture
def mock_crew():
    """Mock for a CrewAI Crew"""
    crew_mock = MagicMock()
    crew_mock.kickoff.return_value = "Mocked result"
    return crew_mock