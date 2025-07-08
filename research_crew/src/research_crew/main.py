#!/usr/bin/env python
import sys
import warnings
import time

from datetime import datetime
from research_crew.crew import ResearchCrew

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def run():
    """
    Run the crew with proper rate limiting for Anthropic free tier.
    """
    inputs = {
        'topic': "COLAB Pakistan",
        'current_year': str(datetime.now().year)
    }
    
    try:
        print("Starting crew execution with Anthropic free tier rate limiting...")
        print("This may take several minutes due to rate limits (5 requests/minute)")
        
        # Add initial delay
        print("Initial delay: 10 seconds...")
        time.sleep(10)
        
        result = ResearchCrew().crew().kickoff(inputs=inputs)
        
        print("Crew execution completed successfully!")
        return result
        
    except Exception as e:
        if "rate_limit" in str(e).lower() or "429" in str(e):
            print("Rate limit hit. Please wait a few minutes before trying again.")
            print("Consider upgrading to Anthropic Pro for higher limits.")
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "RSpace coworking space",
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
        "topic": "AI LLMs",
        "current_year": str(datetime.now().year)
    }
    
    try:
        ResearchCrew().crew().test(n_iterations=int(sys.argv[1]), eval_llm=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")
