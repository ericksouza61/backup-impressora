@echo off
set "BAT=%~dp0backupteste.bat"
if not exist "%BAT%" set "BAT=C:\Desenvolvemento\backupteste.bat"
if not exist "%BAT%" (
  echo Arquivo nao encontrado: backupteste.bat
  echo Esperado em: %~dp0
  echo Ou em: C:\Desenvolvemento
  pause
  exit /b 1
)
start "Backup Impressoras" cmd /k call %BAT%
