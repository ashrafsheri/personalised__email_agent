from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import asyncio
import uuid
from datetime import datetime
import json
import os
from .crew import ResearchCrew
from .main import run as run_crew

# Pydantic models for request/response
class ResearchRequest(BaseModel):
    topic: str
    current_year: Optional[str] = None

class ResearchResponse(BaseModel):
    task_id: str
    status: str
    message: str

class TaskStatus(BaseModel):
    task_id: str
    status: str
    result: Optional[str] = None
    error: Optional[str] = None
    created_at: str
    completed_at: Optional[str] = None

# New model for instant email response
class EmailResponse(BaseModel):
    topic: str
    current_year: str
    email_content: str
    research_summary: str
    generated_at: str
    processing_time_seconds: float

# In-memory storage for tasks (in production, use Redis or database)
tasks_storage: Dict[str, Dict[str, Any]] = {}

app = FastAPI(
    title="ResearchCrew API",
    description="API for running ResearchCrew AI agents",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def run_research_task(task_id: str, topic: str, current_year: str):
    """Background task to run the research crew"""
    try:
        # Update task status to running
        tasks_storage[task_id]["status"] = "running"
        
        # Prepare inputs
        inputs = {
            'topic': topic,
            'current_year': current_year
        }
        
        # Run the crew (this might take a while)
        crew = ResearchCrew()
        result = crew.crew().kickoff(inputs=inputs)
        
        # Update task with results
        tasks_storage[task_id].update({
            "status": "completed",
            "result": str(result),
            "completed_at": datetime.now().isoformat()
        })
        
    except Exception as e:
        # Update task with error
        tasks_storage[task_id].update({
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.now().isoformat()
        })

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "ResearchCrew API is running", "version": "1.0.0"}

@app.post("/research", response_model=ResearchResponse)
async def start_research(request: ResearchRequest, background_tasks: BackgroundTasks):
    """Start a new research task"""
    try:
        # Generate unique task ID
        task_id = str(uuid.uuid4())
        
        # Set default current year if not provided
        current_year = request.current_year or str(datetime.now().year)
        
        # Store task info
        tasks_storage[task_id] = {
            "task_id": task_id,
            "status": "pending",
            "topic": request.topic,
            "current_year": current_year,
            "created_at": datetime.now().isoformat(),
            "result": None,
            "error": None,
            "completed_at": None
        }
        
        # Add background task
        background_tasks.add_task(run_research_task, task_id, request.topic, current_year)
        
        return ResearchResponse(
            task_id=task_id,
            status="pending",
            message=f"Research task started for topic: {request.topic}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start research task: {str(e)}")

@app.post("/research/instant", response_model=EmailResponse)
async def instant_research_and_email(request: ResearchRequest):
    """
    Run research and email generation synchronously and return the email immediately.
    This will block until completion and may take several minutes due to rate limiting.
    """
    start_time = datetime.now()
    
    try:
        # Set default current year if not provided
        current_year = request.current_year or str(datetime.now().year)
        
        # Prepare inputs
        inputs = {
            'topic': request.topic,
            'current_year': current_year
        }
        
        # Run the crew synchronously
        crew = ResearchCrew()
        result = crew.crew().kickoff(inputs=inputs)
        
        # Try to read the generated email file
        email_content = "Email file not found"
        email_file_path = "email.md"
        if os.path.exists(email_file_path):
            with open(email_file_path, 'r', encoding='utf-8') as f:
                email_content = f.read()
        
        # Calculate processing time
        end_time = datetime.now()
        processing_time = (end_time - start_time).total_seconds()
        
        return EmailResponse(
            topic=request.topic,
            current_year=current_year,
            email_content=email_content,
            research_summary=str(result),
            generated_at=end_time.isoformat(),
            processing_time_seconds=processing_time
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to generate email for topic '{request.topic}': {str(e)}"
        )

@app.get("/research/{task_id}", response_model=TaskStatus)
async def get_task_status(task_id: str):
    """Get the status of a research task"""
    if task_id not in tasks_storage:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_info = tasks_storage[task_id]
    return TaskStatus(**task_info)

@app.get("/research/{task_id}/result")
async def get_task_result(task_id: str):
    """Get the result of a completed research task"""
    if task_id not in tasks_storage:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_info = tasks_storage[task_id]
    
    if task_info["status"] == "pending":
        raise HTTPException(status_code=202, detail="Task is still pending")
    elif task_info["status"] == "running":
        raise HTTPException(status_code=202, detail="Task is still running")
    elif task_info["status"] == "failed":
        raise HTTPException(status_code=500, detail=f"Task failed: {task_info['error']}")
    
    # Try to read the email file if it exists
    email_content = None
    email_file_path = "email.md"
    if os.path.exists(email_file_path):
        with open(email_file_path, 'r', encoding='utf-8') as f:
            email_content = f.read()
    
    return {
        "task_id": task_id,
        "status": task_info["status"],
        "result": task_info["result"],
        "email_content": email_content,
        "completed_at": task_info["completed_at"]
    }

@app.get("/tasks")
async def list_tasks():
    """List all tasks"""
    return {"tasks": list(tasks_storage.values())}

@app.delete("/research/{task_id}")
async def delete_task(task_id: str):
    """Delete a task"""
    if task_id not in tasks_storage:
        raise HTTPException(status_code=404, detail="Task not found")
    
    del tasks_storage[task_id]
    return {"message": f"Task {task_id} deleted successfully"}

def main():
    """Main function to run the API server"""
    import uvicorn
    uvicorn.run(
        "research_crew.api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()