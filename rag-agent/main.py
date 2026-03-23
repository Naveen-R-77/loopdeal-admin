import sys
import os

# Add the parent directory of 'app' to sys.path so 'import app.xxx' works
sys.path.append(os.getcwd())

# Run the API
if __name__ == "__main__":
    import uvicorn
    # Use reloader for smoother dev experience
    uvicorn.run("app.api:app", host="0.0.0.0", port=8000, reload=True)
