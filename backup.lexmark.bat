@echo off
set IP_IMPRESSORA=10.8.0.34

if not exist "C:\Backups" mkdir "C:\Backups"

for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd'"') do set DATA=%%i

echo Iniciando backup da Lexmark X656de (%IP_IMPRESSORA%)...

:: Tentativa com o caminho padrão de modelos X600
curl -L -k "http://%IP_IMPRESSORA%/cgi-bin/direct/printer/prtappauth/apps/ImportExportServlet?exportButton=clicked" ^
     -H "Referer: http://%IP_IMPRESSORA%/" ^
     -o "C:\Backups\Config_Lexmark_%DATA%.ucf"

echo.
echo Verifique se o arquivo em C:\Backups tem o tamanho correto.
pause