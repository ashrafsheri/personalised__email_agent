# Python Environment Specifications

## Python Version
- Python >=3.12

## Package Manager
- UV (https://docs.astral.sh/uv/)

## Installation Commands
```bash
# Install uv
pip install uv

# Install dependencies
uv sync

# Or install from requirements.txt
pip install -r requirements.txt
```

## API Server
- Framework: FastAPI
- Default port: 8000
- Start command: `python -m research_crew.api`

## Environment Variables Required
- ANTHROPIC_API_KEY
- SERPER_API_KEY (for search functionality)

## Production Considerations
- Use `uvicorn research_crew.api:app --host 0.0.0.0 --port 8000`
- Consider using a process manager like supervisor or systemd
- Set up proper logging and monitoring