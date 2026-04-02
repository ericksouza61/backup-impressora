$bat = "C:\Desenvolvemento\backupteste.bat"
if (-not (Test-Path $bat)) {
  Write-Host "Arquivo nao encontrado: $bat"
  exit 1
}
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "`"$bat`"" -WorkingDirectory "C:\Desenvolvemento"
