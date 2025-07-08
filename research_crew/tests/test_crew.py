import pytest
from unittest.mock import patch
from research_crew.crew import ResearchCrew

def test_research_crew_creation():
    """Test that the ResearchCrew can be instantiated"""
    crew = ResearchCrew()
    assert crew is not None

@patch('research_crew.crew.Agent')
@patch('research_crew.crew.Crew')
def test_crew_kickoff(mock_crew_class, mock_agent_class, mock_agent, mock_crew):
    """Test that the crew can be kicked off"""
    # Setup
    mock_agent_class.return_value = mock_agent
    mock_crew_class.return_value = mock_crew
    
    # Arrange
    inputs = {"topic": "Test Topic", "current_year": "2025"}
    
    # Act
    crew_instance = ResearchCrew()
    result = crew_instance.crew().kickoff(inputs=inputs)
    
    # Assert
    assert result == "Mocked result"
    mock_crew.kickoff.assert_called_once_with(inputs=inputs)