Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "powershell -ExecutionPolicy Bypass -File ""C:\Desenvolvemento\backupteste_gui.ps1""", 0, False
