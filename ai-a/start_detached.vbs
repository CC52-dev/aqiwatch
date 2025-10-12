Set WshShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the script's directory
strScriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Change to the script directory and run monitor.py hidden
WshShell.CurrentDirectory = strScriptPath
WshShell.Run "python monitor.py", 0, False

' Show confirmation message
WScript.Echo "AQI Server Monitor started successfully!" & vbCrLf & _
             "The server is now running in the background." & vbCrLf & _
             "Logs will be saved to: " & strScriptPath & "\logs"

