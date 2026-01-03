Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
ScriptPath = FSO.GetParentFolderName(WScript.ScriptFullName)
WshShell.Run chr(34) & ScriptPath & "\run_server_silent.bat" & chr(34), 0
Set WshShell = Nothing
