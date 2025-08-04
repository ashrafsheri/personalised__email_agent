#!/usr/bin/env python
import sys
import warnings
import time

from datetime import datetime
from research_crew.crew import ResearchCrew
from research_crew.tools import ExecutiveLookupTool

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def run():
    """
    Run the crew with OpenAI.
    """
    inputs = {
        'topic': "Express News Pakistan",
        'role': "CTO",  # Added role parameter
        'current_year': str(datetime.now().year)
    }
    
    try:
        print("Starting crew execution with OpenAI...")
        print("This may take several minutes to complete...")
        
        # Add initial delay
        print("Initial delay: 10 seconds...")
        time.sleep(10)
        
        result = ResearchCrew().crew().kickoff(inputs=inputs)
        
        print("Crew execution completed successfully!")
        return result
        
    except Exception as e:
        if "rate_limit" in str(e).lower() or "429" in str(e):
            print("Rate limit hit. Please wait a few minutes before trying again.")
        elif "401" in str(e) or "insufficient permissions" in str(e).lower():
            print("API key authentication failed. Please check your OpenAI API key permissions.")
            print("Make sure your API key has the 'model.request' scope and proper project access.")
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "RSpace coworking space",
        "role": "Operations Manager",
        'current_year': str(datetime.now().year)
    }
    try:
        ResearchCrew().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        ResearchCrew().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "OpenAI",
        "role": "CTO",
        "current_year": str(datetime.now().year)
    }
    
    try:
        ResearchCrew().crew().test(n_iterations=int(sys.argv[1]), eval_llm=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")

import sys
from research_crew.tools.custom_tool import ExecutiveLookupTool


def test_tool():
    """
    Test the ExecutiveLookupTool without running the full crew.
    Invoke with: python main.py test-tool
    """
    tool = ExecutiveLookupTool()
    query = "Express News Pakistan CTO"

    print(f"Testing ExecutiveLookupTool with query: {query}")
    print("-" * 50)

    try:
        # Call with keyword so BaseTool unpacks correctly
        result = tool.run(query=query)
        print("Result:\n", result)
        return result
    except Exception as e:
        print(f"Error testing tool: {e}")
        raise

# Update the main execution block
if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "train":
            train()
        elif sys.argv[1] == "replay":
            replay()
        elif sys.argv[1] == "test":
            test()
        elif sys.argv[1] == "test-tool":
            test_tool()
        else:
            run()
    else:
        run()
