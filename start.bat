@echo off
setlocal EnableExtensions
rem MSMEOS one-click launcher for Windows.
rem Creates the Python virtual environment, installs dependencies, builds the
rem frontend and starts the app at http://127.0.0.1:8000

cd /d "%~dp0"
title MSMEOS

rem ---- Python 3.11+ ----
set "PY="
py -3 --version >nul 2>&1 && set "PY=py -3"
if not defined PY (
  python --version >nul 2>&1 && set "PY=python"
)
if not defined PY (
  echo [error] Python 3.11 or newer was not found.
  echo         Install it from https://www.python.org/downloads/ and tick "Add python.exe to PATH".
  goto :fail
)
%PY% -c "import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)" >nul 2>&1
if errorlevel 1 (
  echo [error] Python 3.11 or newer is required. Found:
  %PY% --version
  goto :fail
)

rem ---- Node.js 18+ ----
where npm >nul 2>&1
if errorlevel 1 (
  echo [error] Node.js 18 or newer was not found.
  echo         Install it from https://nodejs.org/ and run this file again.
  goto :fail
)

rem ---- Virtual environment ----
if not exist "venv\Scripts\activate.bat" (
  echo [1/4] Creating virtual environment...
  %PY% -m venv venv
  if errorlevel 1 goto :fail
)
call "venv\Scripts\activate.bat"
if errorlevel 1 goto :fail

echo [2/4] Installing Python dependencies...
python -m pip install --disable-pip-version-check -q -r requirements.txt
if errorlevel 1 (
  echo [error] Could not install Python dependencies. Check your internet connection.
  goto :fail
)

rem ---- Frontend ----
pushd frontend
if not exist "node_modules" (
  echo [3/4] Installing frontend dependencies...
  call npm install --no-audit --no-fund
  if errorlevel 1 ( popd & goto :fail )
) else (
  echo [3/4] Frontend dependencies already installed.
)
echo       Building frontend...
call npm run build
if errorlevel 1 ( popd & goto :fail )
popd

rem ---- Run ----
set "HOST=127.0.0.1"
if not defined PORT set "PORT=8000"
echo [4/4] Starting MSMEOS at http://%HOST%:%PORT%  (press Ctrl+C to stop)
start "" "http://%HOST%:%PORT%"
python app.py
goto :end

:fail
echo.
echo MSMEOS could not start. See the message above.
pause
exit /b 1

:end
endlocal
