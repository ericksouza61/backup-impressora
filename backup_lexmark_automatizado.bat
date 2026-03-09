@echo off
setlocal enabledelayedexpansion

:: Configurações
set ARQUIVO_IPS=Listagem Impressora IP'S.txt
set PASTA_BACKUP=C:\Backups\Lexmark
set LOG_FILE=C:\Backups\Lexmark\backup_log.txt

:: Cria pasta de backup se não existir
if not exist "%PASTA_BACKUP%" mkdir "%PASTA_BACKUP%"

:: Obtém data atual
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd'"') do set DATA=%%i
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format 'HH-mm-ss'"') do set HORA=%%i

echo ========================================= >> "%LOG_FILE%"
echo Backup iniciado em: %DATA% %HORA% >> "%LOG_FILE%"
echo ========================================= >> "%LOG_FILE%"
echo.
echo Iniciando backup automatizado das impressoras Lexmark X656de...
echo.

:: Contador de backups
set /a TOTAL=0
set /a SUCESSO=0
set /a FALHA=0

:: Lê o arquivo linha por linha e extrai os IPs
for /f "tokens=1,2" %%a in ('type "%ARQUIVO_IPS%" ^| findstr /r "^PV"') do (
    set NOME_IMPRESSORA=%%a
    set IP_IMPRESSORA=%%b
    
    :: Remove possível caminho UNC (caso tenha \\)
    set IP_IMPRESSORA=!IP_IMPRESSORA:\\=!
    
    :: Verifica se é um IP válido (começa com 10.)
    echo !IP_IMPRESSORA! | findstr /r "^10\.[0-9]" >nul
    if !errorlevel! equ 0 (
        set /a TOTAL+=1
        echo [!TOTAL!] Processando: !NOME_IMPRESSORA! - IP: !IP_IMPRESSORA!
        
        :: Tenta fazer o backup
        curl -L -k -m 30 "http://!IP_IMPRESSORA!/cgi-bin/direct/printer/prtappauth/apps/ImportExportServlet?exportButton=clicked" ^
             -H "Referer: http://!IP_IMPRESSORA!/" ^
             -o "%PASTA_BACKUP%\!NOME_IMPRESSORA!_!DATA!.ucf" 2>nul
        
        :: Verifica se o arquivo foi criado e tem tamanho > 0
        if exist "%PASTA_BACKUP%\!NOME_IMPRESSORA!_!DATA!.ucf" (
            for %%F in ("%PASTA_BACKUP%\!NOME_IMPRESSORA!_!DATA!.ucf") do set TAMANHO=%%~zF
            if !TAMANHO! gtr 1000 (
                echo    [OK] Backup realizado com sucesso - Tamanho: !TAMANHO! bytes
                echo [OK] !NOME_IMPRESSORA! - !IP_IMPRESSORA! - !TAMANHO! bytes >> "%LOG_FILE%"
                set /a SUCESSO+=1
            ) else (
                echo    [FALHA] Arquivo muito pequeno - possível erro
                echo [FALHA] !NOME_IMPRESSORA! - !IP_IMPRESSORA! - Arquivo pequeno >> "%LOG_FILE%"
                del "%PASTA_BACKUP%\!NOME_IMPRESSORA!_!DATA!.ucf" 2>nul
                set /a FALHA+=1
            )
        ) else (
            echo    [FALHA] Não foi possível conectar ou baixar
            echo [FALHA] !NOME_IMPRESSORA! - !IP_IMPRESSORA! - Sem resposta >> "%LOG_FILE%"
            set /a FALHA+=1
        )
        echo.
    )
)

:: Resumo final
echo =========================================
echo RESUMO DO BACKUP
echo =========================================
echo Total de impressoras processadas: %TOTAL%
echo Backups realizados com sucesso: %SUCESSO%
echo Falhas: %FALHA%
echo =========================================
echo.
echo Arquivos salvos em: %PASTA_BACKUP%
echo Log completo em: %LOG_FILE%
echo.

echo ========================================= >> "%LOG_FILE%"
echo RESUMO: Total=%TOTAL% Sucesso=%SUCESSO% Falha=%FALHA% >> "%LOG_FILE%"
echo ========================================= >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"

pause