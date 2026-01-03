@echo off
set "SCRIPT_DIR=%~dp0"
set "SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\PolicyReminderServer.lnk"

echo ---------------------------------------------------
echo Installing Policy Reminder Server to Startup...
echo ---------------------------------------------------
echo Target: %SCRIPT_DIR%launch_invisible.vbs
echo Destination: %SHORTCUT_PATH%
echo.

powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut('%SHORTCUT_PATH%');$s.TargetPath='%SCRIPT_DIR%launch_invisible.vbs';$s.WorkingDirectory='%SCRIPT_DIR%';$s.Save()"

echo.
echo SUCCESS!
echo The server will now run automatically in the background when you log in.
echo To verify, you can restart your computer or just run 'launch_invisible.vbs' now.
echo.
pause
