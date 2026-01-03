@echo off
set "BACKUP_DIR=C:\Users\kapis\OneDrive\Desktop\Policy\Backups"
set "TIMESTAMP=%date:~-4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"

echo Starting Backup to %BACKUP_DIR%\%TIMESTAMP%...
mkdir "%BACKUP_DIR%\%TIMESTAMP%"

rem Use mongodump if installed, otherwise copy the data folder (if simple single file DB)
rem Assuming standard MongoDB local install, mongodump is best.
rem If mongodump is not in PATH, we might need user specific path.
rem Fallback: If this is a file-based JSON system (as per original prompt "JSON files"), wait...
rem Analyzing user's code: It uses Mongoose. It's a REAL MongoDB.
rem Copying raw data files is risky while DB is running.
rem Best effort: Suggest mongodump.

mongodump --db insurance_db --out "%BACKUP_DIR%\%TIMESTAMP%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [WARNING] 'mongodump' command failed or not found.
    echo Please insure MongoDB Tools are installed and in your PATH.
    echo.
    pause
    exit /b
)

echo.
echo Backup Complete!
echo Location: %BACKUP_DIR%\%TIMESTAMP%
echo.
timeout /t 5
