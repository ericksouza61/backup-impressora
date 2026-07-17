@echo off
setlocal

cd /d "%~dp0"

if "%TEMP%"=="" set "TEMP=C:\Windows\Temp"
if "%TMP%"==""  set "TMP=C:\Windows\Temp"

set "TEMP_LOCAL=%~dp0temp"
if not exist "%TEMP_LOCAL%" mkdir "%TEMP_LOCAL%" >nul 2>&1

set "LOG_AGENDADO=%TEMP_LOCAL%\execucao_agendada.log"
set "BAT=%~dp0backupteste.bat"
if not exist "%BAT%" set "BAT=C:\Desenvolvemento\backupteste.bat"
set "PASTA_BACKUP_OVERRIDE=\\ap29dtc\Usuarios\Informatica\Suporte\Impressoras\Backup\Lojas e Matriz"

call :LOG_AGENDADO "INICIO" "launcher=%~f0 script=%BAT% pasta_backup=%PASTA_BACKUP_OVERRIDE%"

if not exist "%BAT%" (
    call :LOG_AGENDADO "ERRO" "Arquivo principal nao encontrado: %BAT%"
    exit /b 1
)

set "AUTO_RUN=1"
call "%BAT%" %*
set "RC=%ERRORLEVEL%"

if "%RC%"=="0" (
    call :LOG_AGENDADO "FIM" "status=SUCESSO codigo=%RC% script=%BAT%"
) else (
    call :LOG_AGENDADO "FIM" "status=ERRO codigo=%RC% script=%BAT%"
)

exit /b %RC%

:LOG_AGENDADO
setlocal DisableDelayedExpansion
set "LOG_STATUS=%~1"
set "LOG_DETAIL=%~2"
set "LOG_TS="
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format \"yyyy-MM-dd HH:mm:ss\""') do set "LOG_TS=%%i"
if not defined LOG_TS set "LOG_TS=%DATE% %TIME%"
if not exist "%TEMP_LOCAL%" mkdir "%TEMP_LOCAL%" >nul 2>&1
>> "%LOG_AGENDADO%" echo [%LOG_TS%] [%LOG_STATUS%] launcher=%~nx0 usuario=%USERNAME% maquina=%COMPUTERNAME%
if not "%LOG_DETAIL%"=="" >> "%LOG_AGENDADO%" echo     %LOG_DETAIL%
endlocal & exit /b 0
