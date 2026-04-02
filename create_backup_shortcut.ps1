$s = New-Object -ComObject WScript.Shell
$lnk = $s.CreateShortcut("C:\Desenvolvemento\Backup Impressoras.lnk")
$lnk.TargetPath = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
$lnk.Arguments = "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"C:\Desenvolvemento\backupteste_gui.ps1`""
$lnk.WorkingDirectory = "C:\Desenvolvemento"
$lnk.Save()
