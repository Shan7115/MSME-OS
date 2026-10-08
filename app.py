import os
import sys
import uvicorn

if __name__ == "__main__":
    # Ensure current directory is on PYTHONPATH
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)

    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")
    print(f"==================================================")
    print(f"  MSMEOS2 — Intelligent Decision Support System   ")
    print(f"  Server starting at: http://{host}:{port}        ")
    print(f"  API Docs available at: http://{host}:{port}/docs")
    print(f"==================================================")
    uvicorn.run("backend.main:app", host=host, port=port, reload=False)
