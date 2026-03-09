@echo off
if "%TEMP%"=="" set "TEMP=C:\Windows\Temp"
if "%TMP%"==""  set "TMP=C:\Windows\Temp"
setlocal EnableDelayedExpansion

cd /d "%~dp0"

set "TEMP_LOCAL=%~dp0temp"
if not exist "%TEMP_LOCAL%" mkdir "%TEMP_LOCAL%"

set "ARQUIVO_IPS=%~1"
if "%ARQUIVO_IPS%"=="" set "ARQUIVO_IPS=Listagem Impressora IP'S.txt"

set "PASTA_BACKUP=C:\Backups\Impressoras"
set "LOG_FILE=%PASTA_BACKUP%\backup_log.txt"
set "SCRIPT_VERSION=2026-03-09-FAIL-TUNE3"

echo.
echo Pasta do script: %~dp0
echo Procurando arquivo: %ARQUIVO_IPS%
echo.

if not exist "%ARQUIVO_IPS%" (
    echo.
    echo ============================================================
    echo ERRO: Arquivo nao encontrado!
    echo ============================================================
    echo.
    echo Arquivo esperado: %ARQUIVO_IPS%
    echo Pasta atual: %CD%
    echo.
    echo Arquivos .txt disponiveis nesta pasta:
    dir *.txt /b
    echo.
    echo ============================================================
    echo SOLUCAO:
    echo 1. Copie o arquivo para a mesma pasta do script
    echo 2. OU informe o caminho no primeiro argumento do script
    echo ============================================================
    echo.
    pause
    exit /b 1
)

echo Arquivo encontrado! Continuando...
echo.

set "CRED_BROTHER=admin: admin:admin admin:access admin:initpass admin:brother root:access root:brother"
set "CRED_RICOH=admin: copymaq: admin:admin copymaq:copymaq admin:copymaq"
set "TIMEOUT_DETECT=3"
set "TIMEOUT_LEXMARK=12"
set "TIMEOUT_BROTHER=8"
set "TIMEOUT_BROTHER_ADDR=4"
set "TIMEOUT_RICOH=4"
set "TIMEOUT_RICOH_LOGIN=5"
set "RICOH_MIN_SIZE=120"
set "CONNECT_TIMEOUT=2"
set "RICOH_PROTOCOLOS=http"
set "RICOH_ENDPOINTS=web/entry/pt/address/adrsFileDownload.cgi"
set "RICOH_LOCALES=pt en"
set "RICOH_FILENAME_FIXO=RICOH Aficio SP 5200S_addr.udf"
set "RICOH_MODO_RAPIDO=1"
set "RICOH_MAX_CRED=2"
set "RICOH_USAR_DIRETO=1"
set "RICOH_USAR_SESSAO=1"
set "RICOH_USAR_URL_EFETIVA=1"
set "RICOH_USAR_FIXO=0"
set "RICOH_DIAGNOSTICO=1"

if not exist "%PASTA_BACKUP%" mkdir "%PASTA_BACKUP%"
if not exist "%PASTA_BACKUP%\Lexmark" mkdir "%PASTA_BACKUP%\Lexmark"
if not exist "%PASTA_BACKUP%\Brother" mkdir "%PASTA_BACKUP%\Brother"
if not exist "%PASTA_BACKUP%\Ricoh" mkdir "%PASTA_BACKUP%\Ricoh"
if not exist "%PASTA_BACKUP%\Desconhecido" mkdir "%PASTA_BACKUP%\Desconhecido"

for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set "DATA=%%i"
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format HH-mm-ss"') do set "HORA=%%i"

echo ============================================================ > "%LOG_FILE%"
echo BACKUP UNIFICADO - LEXMARK, BROTHER E RICOH >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"
echo Iniciado em: %DATA% %HORA% >> "%LOG_FILE%"
echo Script: %~f0 >> "%LOG_FILE%"
echo Versao: %SCRIPT_VERSION% >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"

echo.
echo ============================================================
echo   BACKUP AUTOMATIZADO - LEXMARK, BROTHER E RICOH
echo ============================================================
echo.

set /a TOTAL=0
set /a SUCESSO_LEXMARK=0
set /a SUCESSO_BROTHER=0
set /a SUCESSO_RICOH=0
set /a OFFLINE=0
set /a FALHA=0

echo Lendo arquivo: %ARQUIVO_IPS%
echo Total de linhas no arquivo:
type "%ARQUIVO_IPS%" | find /c /v ""
echo.

set "ARQUIVO_PARSE=%TEMP_LOCAL%\ips_parseados.tmp"
if exist "%ARQUIVO_PARSE%" del "%ARQUIVO_PARSE%" 2>nul

powershell -NoProfile -Command "$file=$env:ARQUIVO_IPS; $out=$env:ARQUIVO_PARSE; if(-not (Test-Path $file)){exit 2}; $lines=Get-Content -Path $file; if($lines.Count -le 2){ Set-Content -Path $out -Value '' -Encoding ASCII; exit 0 }; $result=foreach($line in $lines[2..($lines.Count-1)]){ if($line -match '^(.+?)\s+((?:\d{1,3}\.){3}\d{1,3})$'){ '{0}|{1}' -f $matches[1].Trim(), $matches[2] } }; Set-Content -Path $out -Value $result -Encoding ASCII"
if errorlevel 1 (
    echo [ERRO] Falha ao parsear o arquivo de impressoras.
    echo [ERRO] Falha no parser de entrada. >> "%LOG_FILE%"
    pause
    exit /b 1
)

for /f "usebackq tokens=1* delims=|" %%a in ("%ARQUIVO_PARSE%") do (
    set "NOME_IMPRESSORA=%%a"
    set "IP_IMPRESSORA=%%b"

    set /a TOTAL+=1
    echo.
    echo ========== [!TOTAL!] ==========
    echo Impressora: !NOME_IMPRESSORA!
    echo IP: !IP_IMPRESSORA!
    echo.

    call :IDENTIFICAR_MODELO "!IP_IMPRESSORA!" MODELO

    set "BACKUP_SUCESSO=0"
    set "ESTA_OFFLINE=0"

    if /i "!MODELO!"=="OFFLINE" (
        echo Impressora: OFFLINE - Pulando...
        echo [OFFLINE] !NOME_IMPRESSORA! - !IP_IMPRESSORA! >> "%LOG_FILE%"
        set /a OFFLINE+=1
        set "ESTA_OFFLINE=1"
    ) else if /i "!MODELO!"=="LEXMARK" (
        echo Modelo detectado: LEXMARK
        call :BACKUP_LEXMARK "!NOME_IMPRESSORA!" "!IP_IMPRESSORA!"
        if !errorlevel! equ 0 set "BACKUP_SUCESSO=1"
    ) else if /i "!MODELO!"=="BROTHER" (
        echo Modelo detectado: BROTHER
        call :BACKUP_BROTHER "!NOME_IMPRESSORA!" "!IP_IMPRESSORA!"
        if !errorlevel! equ 0 set "BACKUP_SUCESSO=1"
    ) else if /i "!MODELO!"=="RICOH" (
        echo Modelo detectado: RICOH
        call :BACKUP_RICOH "!NOME_IMPRESSORA!" "!IP_IMPRESSORA!"
        if !errorlevel! equ 0 set "BACKUP_SUCESSO=1"
    ) else (
        echo Modelo: DESCONHECIDO - Tentando sequencia otimizada BROTHER -^> LEXMARK...

        call :BACKUP_BROTHER "!NOME_IMPRESSORA!" "!IP_IMPRESSORA!"
        if !errorlevel! equ 0 set "BACKUP_SUCESSO=1"

        if !BACKUP_SUCESSO! equ 0 (
            call :BACKUP_LEXMARK "!NOME_IMPRESSORA!" "!IP_IMPRESSORA!"
            if !errorlevel! equ 0 set "BACKUP_SUCESSO=1"
        )

        if !BACKUP_SUCESSO! equ 1 (
            echo Backup concluido com sucesso em uma das tentativas
        )
    )

    if !BACKUP_SUCESSO! equ 0 (
        if !ESTA_OFFLINE! equ 0 (
            echo [FALHA GERAL] Nenhum metodo concluiu o backup
            echo [FALHA-GERAL] !NOME_IMPRESSORA! - !IP_IMPRESSORA! >> "%LOG_FILE%"
            set /a FALHA+=1
        )
    )
)

if %TOTAL% equ 0 (
    echo [AVISO] Nenhuma linha valida de impressora foi encontrada.
    echo [AVISO] Nenhuma linha valida encontrada no arquivo de entrada. >> "%LOG_FILE%"
)

echo.
echo ============================================================
echo                    RESUMO DO BACKUP
echo ============================================================
echo Total de impressoras processadas: %TOTAL%
echo.
echo Backups LEXMARK com sucesso: %SUCESSO_LEXMARK%
echo Backups BROTHER com sucesso: %SUCESSO_BROTHER%
echo Backups RICOH com sucesso: %SUCESSO_RICOH%
echo Impressoras offline: %OFFLINE%
echo Falhas (autenticacao/outro): %FALHA%
echo ============================================================
echo.
echo Arquivos salvos em: %PASTA_BACKUP%
echo Log completo: %LOG_FILE%
echo.

echo. >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"
echo RESUMO FINAL >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"
echo Total processadas: %TOTAL% >> "%LOG_FILE%"
echo LEXMARK: %SUCESSO_LEXMARK% - BROTHER: %SUCESSO_BROTHER% - RICOH: %SUCESSO_RICOH% >> "%LOG_FILE%"
echo OFFLINE: %OFFLINE% - FALHAS: %FALHA% >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"

if exist "%ARQUIVO_PARSE%" del "%ARQUIVO_PARSE%" 2>nul

pause
exit /b 0

:: =========================================
:: FUNCAO: IDENTIFICAR MODELO
:: =========================================
:IDENTIFICAR_MODELO
set "IP_TEMP=%~1"
set "MODELO_RESULTADO=DESCONHECIDO"

ping -n 1 -w 1000 %IP_TEMP% >nul 2>&1
if !errorlevel! neq 0 (
    set "MODELO_RESULTADO=OFFLINE"
    goto :IDENTIFICAR_FIM
)

for %%E in ("general/status.html" "general/information.html" "main/main.html" "") do (
    if /i "!MODELO_RESULTADO!"=="DESCONHECIDO" (
        curl.exe -L -k -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_DETECT% "http://%IP_TEMP%/%%~E" 2>nul | findstr /i "Brother MFC DCP HL BRAdmin" >nul
        if !errorlevel! equ 0 set "MODELO_RESULTADO=BROTHER"
    )
)

if /i "!MODELO_RESULTADO!"=="BROTHER" goto :IDENTIFICAR_FIM

curl.exe -L -k --fail -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_DETECT% "http://%IP_TEMP%/cgi-bin/dynamic/printer/config/reports/deviceinfo.html" 2>nul | findstr /i "Lexmark" >nul
if !errorlevel! equ 0 (
    set "MODELO_RESULTADO=LEXMARK"
    goto :IDENTIFICAR_FIM
)

for %%E in ("" "web/guest/en/websys/webArch/mainFrame.cgi" "web/guest/ja/websys/webArch/mainFrame.cgi") do (
    if /i "!MODELO_RESULTADO!"=="DESCONHECIDO" (
        curl.exe -L -k -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_DETECT% "http://%IP_TEMP%/%%~E" 2>nul | findstr /i "Ricoh Aficio Web Image Monitor" >nul
        if !errorlevel! equ 0 set "MODELO_RESULTADO=RICOH"
    )
)

:IDENTIFICAR_FIM
set "%~2=%MODELO_RESULTADO%"
exit /b 0

:: =========================================
:: FUNCAO: BACKUP LEXMARK
:: =========================================
:BACKUP_LEXMARK
set "NOME=%~1"
set "IP=%~2"
set "ARQ_LEX=%PASTA_BACKUP%\Lexmark\%NOME%_%DATA%.ucf"

echo Tentando backup LEXMARK...

if exist "%ARQ_LEX%" del "%ARQ_LEX%" 2>nul

curl.exe -L -k --fail -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_LEXMARK% "http://%IP%/cgi-bin/direct/printer/prtappauth/apps/ImportExportServlet?exportButton=clicked" ^
     -H "Referer: http://%IP%/" ^
     -o "%ARQ_LEX%" 2>nul

if exist "%ARQ_LEX%" (
    for %%F in ("%ARQ_LEX%") do set "TAMANHO=%%~zF"
    set "INVALIDO=0"
    findstr /i "<html" "%ARQ_LEX%" >nul 2>&1 && set "INVALIDO=1"
    findstr /i "login" "%ARQ_LEX%" >nul 2>&1 && set "INVALIDO=1"

    if !TAMANHO! gtr 1000 (
        if !INVALIDO! equ 0 (
            echo [OK] Backup LEXMARK realizado - !TAMANHO! bytes
            echo [OK-LEXMARK] %NOME% - %IP% - !TAMANHO! bytes >> "%LOG_FILE%"
            set /a SUCESSO_LEXMARK+=1
            exit /b 0
        )
    )

    del "%ARQ_LEX%" 2>nul
)

echo [FALHA] Backup LEXMARK falhou
echo [FALHA-LEXMARK] %NOME% - %IP% >> "%LOG_FILE%"
exit /b 1

:: =========================================
:: FUNCAO: BACKUP BROTHER
:: =========================================
:BACKUP_BROTHER
set "NOME=%~1"
set "IP=%~2"
set "ARQ_BROTHER_CONFIG=%PASTA_BACKUP%\Brother\%NOME%_config_%DATA%.dat"
set "ARQ_BROTHER_ADDR=%PASTA_BACKUP%\Brother\%NOME%_addressbook_%DATA%.csv"
set "ARQ_BROTHER_MNT=%PASTA_BACKUP%\Brother\%NOME%_maintenance_%DATA%.csv"

echo Tentando backup BROTHER...

set "CREDENCIAL_OK=0"

if exist "!ARQ_BROTHER_MNT!" del "!ARQ_BROTHER_MNT!" 2>nul

curl.exe -L -k --fail -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_BROTHER% "http://%IP%/etc/mnt_info.csv" ^
     -o "!ARQ_BROTHER_MNT!" 2>nul

if exist "!ARQ_BROTHER_MNT!" (
    for %%F in ("!ARQ_BROTHER_MNT!") do set "TAM=%%~zF"
    set "INVALIDO=0"
    findstr /i "<html" "!ARQ_BROTHER_MNT!" >nul 2>&1 && set "INVALIDO=1"
    findstr /i "login" "!ARQ_BROTHER_MNT!" >nul 2>&1 && set "INVALIDO=1"
    findstr /i "404 Not Found" "!ARQ_BROTHER_MNT!" >nul 2>&1 && set "INVALIDO=1"
    if !TAM! gtr 200 if !INVALIDO! equ 0 (
        echo [OK] Backup BROTHER realizado - Credencial: sem-auth - Tipo: MNTCSV
        echo [OK-BROTHER] %NOME% - %IP% - Credencial: sem-auth - Tipo: MNTCSV >> "%LOG_FILE%"
        set /a SUCESSO_BROTHER+=1
        exit /b 0
    )
)

for %%C in (%CRED_BROTHER%) do (
    if !CREDENCIAL_OK! equ 0 (
        set "CREDENCIAL=%%C"
        echo   Testando credencial: !CREDENCIAL!

        if exist "!ARQ_BROTHER_CONFIG!" del "!ARQ_BROTHER_CONFIG!" 2>nul
        if exist "!ARQ_BROTHER_ADDR!" del "!ARQ_BROTHER_ADDR!" 2>nul
        if exist "!ARQ_BROTHER_MNT!" del "!ARQ_BROTHER_MNT!" 2>nul

        curl.exe -L -k --fail -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_BROTHER% "http://%IP%/common/exportconfig.html" ^
             --data "pageid=0&Submit=Export" ^
             -u "!CREDENCIAL!" ^
             -o "!ARQ_BROTHER_CONFIG!" 2>nul

        set "ARQUIVO_OK=0"
        set "TIPO_BKP="

        if exist "!ARQ_BROTHER_CONFIG!" (
            for %%F in ("!ARQ_BROTHER_CONFIG!") do set "TAM=%%~zF"
            set "INVALIDO=0"
            findstr /i "<html" "!ARQ_BROTHER_CONFIG!" >nul 2>&1 && set "INVALIDO=1"
            findstr /i "login" "!ARQ_BROTHER_CONFIG!" >nul 2>&1 && set "INVALIDO=1"
            if !TAM! gtr 100 if !INVALIDO! equ 0 (
                set "ARQUIVO_OK=1"
                set "TIPO_BKP=CONFIG"
            )
        )

        if !ARQUIVO_OK! equ 0 (
            curl.exe -L -k --fail -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_BROTHER_ADDR% "http://%IP%/general/address_list.csv" ^
                 -u "!CREDENCIAL!" ^
                 -o "!ARQ_BROTHER_ADDR!" 2>nul

            if exist "!ARQ_BROTHER_ADDR!" (
                for %%F in ("!ARQ_BROTHER_ADDR!") do set "TAM=%%~zF"
                set "INVALIDO=0"
                findstr /i "<html" "!ARQ_BROTHER_ADDR!" >nul 2>&1 && set "INVALIDO=1"
                findstr /i "login" "!ARQ_BROTHER_ADDR!" >nul 2>&1 && set "INVALIDO=1"
                if !TAM! gtr 50 if !INVALIDO! equ 0 (
                    set "ARQUIVO_OK=1"
                    set "TIPO_BKP=ADDRESS"
                )
            )
        )

        if !ARQUIVO_OK! equ 0 (
            curl.exe -L -k -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_BROTHER% "http://%IP%/etc/mnt_info.html?kind=item" ^
                 -u "!CREDENCIAL!" -o NUL 2>nul

            curl.exe -L -k -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_BROTHER% "http://%IP%/etc/mnt_info_post.html" ^
                 --data "Submit=Submit" ^
                 -u "!CREDENCIAL!" -o NUL 2>nul

            curl.exe -L -k --fail -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_BROTHER% "http://%IP%/etc/mnt_info.csv" ^
                 -u "!CREDENCIAL!" ^
                 -o "!ARQ_BROTHER_MNT!" 2>nul

            if exist "!ARQ_BROTHER_MNT!" (
                for %%F in ("!ARQ_BROTHER_MNT!") do set "TAM=%%~zF"
                set "INVALIDO=0"
                findstr /i "<html" "!ARQ_BROTHER_MNT!" >nul 2>&1 && set "INVALIDO=1"
                findstr /i "login" "!ARQ_BROTHER_MNT!" >nul 2>&1 && set "INVALIDO=1"
                findstr /i "404 Not Found" "!ARQ_BROTHER_MNT!" >nul 2>&1 && set "INVALIDO=1"
                if !TAM! gtr 200 if !INVALIDO! equ 0 (
                    set "ARQUIVO_OK=1"
                    set "TIPO_BKP=MNTCSV"
                )
            )

            if !ARQUIVO_OK! equ 0 (
                curl.exe -L -k --fail -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_BROTHER% "https://%IP%/etc/mnt_info.csv" ^
                     -u "!CREDENCIAL!" ^
                     -o "!ARQ_BROTHER_MNT!" 2>nul

                if exist "!ARQ_BROTHER_MNT!" (
                    for %%F in ("!ARQ_BROTHER_MNT!") do set "TAM=%%~zF"
                    set "INVALIDO=0"
                    findstr /i "<html" "!ARQ_BROTHER_MNT!" >nul 2>&1 && set "INVALIDO=1"
                    findstr /i "login" "!ARQ_BROTHER_MNT!" >nul 2>&1 && set "INVALIDO=1"
                    findstr /i "404 Not Found" "!ARQ_BROTHER_MNT!" >nul 2>&1 && set "INVALIDO=1"
                    if !TAM! gtr 200 if !INVALIDO! equ 0 (
                        set "ARQUIVO_OK=1"
                        set "TIPO_BKP=MNTCSV-HTTPS"
                    )
                )
            )
        )

        if !ARQUIVO_OK! equ 0 (
            if exist "!ARQ_BROTHER_CONFIG!" del "!ARQ_BROTHER_CONFIG!" 2>nul
            if exist "!ARQ_BROTHER_ADDR!" del "!ARQ_BROTHER_ADDR!" 2>nul
            if exist "!ARQ_BROTHER_MNT!" del "!ARQ_BROTHER_MNT!" 2>nul
        ) else (
            if not defined TIPO_BKP set "TIPO_BKP=DESCONHECIDO"
            echo [OK] Backup BROTHER realizado - Credencial: !CREDENCIAL! - Tipo: !TIPO_BKP!
            echo [OK-BROTHER] %NOME% - %IP% - Credencial: !CREDENCIAL! - Tipo: !TIPO_BKP! >> "%LOG_FILE%"
            set /a SUCESSO_BROTHER+=1
            set "CREDENCIAL_OK=1"
        )
    )
)

if !CREDENCIAL_OK! equ 1 exit /b 0

echo [FALHA] Nenhuma credencial funcionou para Brother
echo [FALHA-BROTHER] %NOME% - %IP% >> "%LOG_FILE%"
exit /b 1

:: =========================================
:: FUNCAO: BACKUP RICOH
:: =========================================
:BACKUP_RICOH
set "NOME=%~1"
set "IP=%~2"
set "ARQ_RICOH=%PASTA_BACKUP%\Ricoh\%NOME%_backup_%DATA%.udf"

echo Tentando backup RICOH...

set "NOME_LIMPO=%NOME%"
set "NOME_LIMPO=%NOME_LIMPO: =_%"
set "NOME_LIMPO=%NOME_LIMPO:/=_%"
set "NOME_LIMPO=%NOME_LIMPO:\=_%"
set "NOME_LIMPO=%NOME_LIMPO::=_%"
set "NOME_LIMPO=%NOME_LIMPO:?=_%"
set "NOME_LIMPO=%NOME_LIMPO:>=_%"
set "NOME_LIMPO=%NOME_LIMPO:<=_%"
set "NOME_LIMPO=%NOME_LIMPO:|=_%"

set "ARQ_RICOH=%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_backup_%DATA%.udf"
set "CREDENCIAL_OK=0"
set "USUARIO_USADO="
set "METODO_USADO="
set "INFO_USADA="
set "TAM_UDF=0"
set "VALIDACAO=CONSISTENTE"
set /a RICOH_CRED_COUNT=0

if exist "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_csv_%DATA%.csv" del "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_csv_%DATA%.csv" 2>nul
if exist "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_addressbook_%DATA%.csv" del "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_addressbook_%DATA%.csv" 2>nul
if exist "!ARQ_RICOH!" del "!ARQ_RICOH!" 2>nul

for %%C in (%CRED_RICOH%) do (
    if !CREDENCIAL_OK! equ 0 (
        set /a RICOH_CRED_COUNT+=1
        set "PULAR_CRED=0"
        if %RICOH_MODO_RAPIDO% equ 1 if !RICOH_CRED_COUNT! gtr %RICOH_MAX_CRED% set "PULAR_CRED=1"

        if !PULAR_CRED! equ 1 (
            echo   [RICOH] Modo rapido: pulando credencial %%C
        ) else (
        set "CREDENCIAL=%%C"
        set "SENHA="
        for /f "tokens=1* delims=:" %%U in ("!CREDENCIAL!") do (
            set "USUARIO=%%U"
            set "SENHA=%%V"
        )
        if not defined SENHA set "SENHA="
        echo   [RICOH] Tentativa !RICOH_CRED_COUNT!: usuario=!USUARIO!

        if %RICOH_USAR_DIRETO% equ 1 (
            call :RICOH_TENTAR_DIRETO "%IP%" "!NOME_LIMPO!" "!CREDENCIAL!" "!ARQ_RICOH!" RICOH_INFO
            echo [RICOH-RETORNO-DIRETO] !USUARIO! rc=!errorlevel! >> "%LOG_FILE%"
            if !errorlevel! equ 0 (
                call :RICOH_VALIDAR_UDF "!ARQ_RICOH!"
                if !errorlevel! equ 0 (
                    set "CREDENCIAL_OK=1"
                    set "USUARIO_USADO=!USUARIO!"
                    set "METODO_USADO=DIRETO"
                    set "INFO_USADA=!RICOH_INFO!"
                ) else (
                    if exist "!ARQ_RICOH!" del "!ARQ_RICOH!" 2>nul
                )
            )
        )

        if !CREDENCIAL_OK! equ 0 if %RICOH_USAR_SESSAO% equ 1 (
            echo   [RICOH] Tentando sessao para usuario=!USUARIO!
            call :RICOH_SESSAO "%IP%" "!NOME_LIMPO!" "!USUARIO!" "!SENHA!" "!ARQ_RICOH!" RICOH_INFO
            echo [RICOH-RETORNO-SESSAO] !USUARIO! rc=!errorlevel! >> "%LOG_FILE%"
            if !errorlevel! equ 0 (
                call :RICOH_VALIDAR_UDF "!ARQ_RICOH!"
                if !errorlevel! equ 0 (
                    set "CREDENCIAL_OK=1"
                    set "USUARIO_USADO=!USUARIO!"
                    set "METODO_USADO=SESSAO"
                    set "INFO_USADA=!RICOH_INFO!"
                ) else (
                    if exist "!ARQ_RICOH!" del "!ARQ_RICOH!" 2>nul
                )
            )
        )
        )
    )
)

if !CREDENCIAL_OK! equ 1 (
    call :RICOH_VALIDAR_UDF "!ARQ_RICOH!"
    if !errorlevel! equ 0 (
        for %%F in ("!ARQ_RICOH!") do set "TAM_UDF=%%~zF"
        set "VALIDACAO=CONSISTENTE"

        echo [OK] Backup RICOH realizado em UDF - !USUARIO_USADO! - !METODO_USADO! - !TAM_UDF! bytes - !VALIDACAO!
        echo [OK-RICOH] %NOME% - %IP% - !USUARIO_USADO! - !METODO_USADO! - !INFO_USADA! - !TAM_UDF! bytes - !VALIDACAO! >> "%LOG_FILE%"
        set /a SUCESSO_RICOH+=1
        exit /b 0
    )
)

echo [FALHA] Nenhum metodo completo funcionou para RICOH
echo [FALHA-RICOH] %NOME% - %IP% - Falha de autenticacao/permissao para gerar UDF >> "%LOG_FILE%"
exit /b 1

:: =========================================
:: FUNCAO: VALIDAR ARQUIVO UDF RICOH
:: =========================================
:RICOH_VALIDAR_UDF
setlocal EnableDelayedExpansion
set "ARQ_VALID=%~1"
set "RC=1"
set "SZ=0"
echo [RICOH-VALIDA-INICIO] !ARQ_VALID! >> "%LOG_FILE%"

if not exist "!ARQ_VALID!" (
    echo [RICOH-VALIDA-FIM] rc=1 motivo=arquivo-ausente >> "%LOG_FILE%"
    endlocal & exit /b 1
)

for %%F in ("!ARQ_VALID!") do set "SZ=%%~zF"
if not defined SZ set "SZ=0"
if !SZ! LEQ %RICOH_MIN_SIZE% (
    echo [RICOH-VALIDA-FIM] rc=1 motivo=tamanho-!SZ! >> "%LOG_FILE%"
    endlocal & exit /b 1
)

set "RICOH_VAL_PATH=!ARQ_VALID!"
powershell -NoProfile -Command "$p=$env:RICOH_VAL_PATH; try{$bytes=[System.IO.File]::ReadAllBytes($p);$take=[Math]::Min($bytes.Length,4096);$txt=[Text.Encoding]::ASCII.GetString($bytes,0,$take).ToLowerInvariant();$bad=@('<html','<!doctype','login','authform.cgi','result=failure','result=timeout','web image monitor','404 not found','forbidden','unauthorized','access denied','permission denied');foreach($b in $bad){if($txt.Contains($b)){exit 1}};exit 0}catch{exit 1}" >nul 2>&1
set "RC=!errorlevel!"
set "RICOH_VAL_PATH="

if "!RC!"=="0" (
    echo [RICOH-VALIDA-FIM] rc=0 >> "%LOG_FILE%"
    endlocal & exit /b 0
) else (
    echo [RICOH-VALIDA-FIM] rc=1 motivo=conteudo-suspeito >> "%LOG_FILE%"
    endlocal & exit /b 1
)

:: =========================================
:: FUNCAO: RICOH - TENTATIVA DIRETA UDF
:: =========================================
:RICOH_TENTAR_DIRETO
setlocal EnableDelayedExpansion
set "IP_D=%~1"
set "NOME_D=%~2"
set "CRED_D=%~3"
set "ARQ_D=%~4"
set "RESULT_INFO="
set "OK=0"
set "USR_D="
set "EFFECTIVE_URL="
set "URL_OK=0"

for /f "tokens=1 delims=:" %%U in ("!CRED_D!") do set "USR_D=%%U"

for %%P in (%RICOH_PROTOCOLOS%) do (
    for %%E in (%RICOH_ENDPOINTS%) do (
        if !OK! equ 0 (
            set "URL=%%P://!IP_D!/%%E/!NOME_D!_addr.udf"
            echo [RICOH-TENTATIVA-DIRETA] !USR_D!@!URL! >> "%LOG_FILE%"
            echo   [RICOH] Direto nome: !USR_D! %%P/%%E
            call :RICOH_BAIXAR_UDF_BASIC "!URL!" "!CRED_D!" "!ARQ_D!"
            echo [RICOH-DIRETO-RC] nome rc=!errorlevel! >> "%LOG_FILE%"
            if !errorlevel! equ 0 (
                set "OK=1"
                set "RESULT_INFO=DIRETO %%P://!IP_D!/%%E/(nome)"
            )
        )

        if !OK! equ 0 if %RICOH_USAR_FIXO% equ 1 (
            set "URL_FIXA=%%P://!IP_D!/%%E/!RICOH_FILENAME_FIXO!"
            echo [RICOH-TENTATIVA-DIRETA] !USR_D!@!URL_FIXA! >> "%LOG_FILE%"
            echo   [RICOH] Direto fixo: !USR_D! %%P/%%E
            call :RICOH_BAIXAR_UDF_BASIC "!URL_FIXA!" "!CRED_D!" "!ARQ_D!"
            echo [RICOH-DIRETO-RC] fixo rc=!errorlevel! >> "%LOG_FILE%"
            if !errorlevel! equ 0 (
                set "OK=1"
                set "RESULT_INFO=DIRETO %%P://!IP_D!/%%E/(fixo)"
            )
        )

        if !OK! equ 0 if %RICOH_USAR_URL_EFETIVA% equ 1 (
            set "BASE_URL=%%P://!IP_D!/%%E"
            set "EFFECTIVE_URL="

            echo   [RICOH] Descobrindo URL efetiva: !USR_D! %%P/%%E
            for /f "delims=" %%U in ('curl.exe -L -k --anyauth --max-redirs 3 --retry 0 -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_RICOH_LOGIN% -u "!CRED_D!" -o NUL -w "%%{url_effective}" "!BASE_URL!" 2^>nul') do (
                set "EFFECTIVE_URL=%%U"
            )

            if defined EFFECTIVE_URL (
                set "URL_OK=1"
                echo(!EFFECTIVE_URL! | findstr /i "adrsFileDownload.cgi/" >nul || set "URL_OK=0"
                echo(!EFFECTIVE_URL! | findstr /i ".udf" >nul || set "URL_OK=0"
                echo(!EFFECTIVE_URL! | findstr /i "authForm.cgi login.cgi result=TIMEOUT result=FAILURE" >nul && set "URL_OK=0"

                if !URL_OK! equ 1 (
                    echo [RICOH-URL-EFETIVA] !USR_D!@!EFFECTIVE_URL! >> "%LOG_FILE%"
                    call :RICOH_BAIXAR_UDF_BASIC "!EFFECTIVE_URL!" "!CRED_D!" "!ARQ_D!"
                    if !errorlevel! equ 0 (
                        set "OK=1"
                        set "RESULT_INFO=DIRETO !EFFECTIVE_URL!"
                    )
                )
            )
        )
    )
)

if !OK! equ 1 (
    endlocal & set "%~5=%RESULT_INFO%" & exit /b 0
) else (
    endlocal & set "%~5=" & exit /b 1
)

:: =========================================
:: FUNCAO: RICOH - BAIXAR UDF COM BASIC AUTH
:: =========================================
:RICOH_BAIXAR_UDF_BASIC
setlocal EnableDelayedExpansion
set "URL_B=%~1"
set "CRED_B=%~2"
set "ARQ_B=%~3"
set "USR_B="
set "PWD_B="
set "RC=1"

for /f "tokens=1* delims=:" %%U in ("!CRED_B!") do (
    set "USR_B=%%U"
    set "PWD_B=%%V"
)
if not defined PWD_B set "PWD_B="

if exist "!ARQ_B!" del "!ARQ_B!" 2>nul

set "RICOH_URL_PS=!URL_B!"
set "RICOH_OUT_PS=!ARQ_B!"
set "RICOH_USR_PS=!USR_B!"
set "RICOH_PWD_PS=!PWD_B!"

echo [RICOH-HTTP-INICIO] BASIC !RICOH_USR_PS! !RICOH_URL_PS! >> "%LOG_FILE%"
powershell -NoProfile -Command "$ProgressPreference='SilentlyContinue';$url=$env:RICOH_URL_PS;$out=$env:RICOH_OUT_PS;$u=$env:RICOH_USR_PS;$p=$env:RICOH_PWD_PS;if([string]::IsNullOrWhiteSpace($url) -or [string]::IsNullOrWhiteSpace($out)){exit 2};$pair='{0}:{1}' -f $u,$p;$b64=[Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($pair));$h=@{Authorization='Basic '+$b64;Cookie='cookieOnOffChecker=on';'User-Agent'='Mozilla/5.0'};try{Invoke-WebRequest -Uri $url -Headers $h -MaximumRedirection 2 -TimeoutSec %TIMEOUT_RICOH% -UseBasicParsing -OutFile $out -ErrorAction Stop;exit 0}catch{exit 1}" >nul 2>&1
set "RC=!errorlevel!"
echo [RICOH-HTTP-FIM] rc=!RC! >> "%LOG_FILE%"

set "RICOH_URL_PS="
set "RICOH_OUT_PS="
set "RICOH_USR_PS="
set "RICOH_PWD_PS="

set "ARQ_OK=0"
set "ARQ_SZ=0"
if exist "!ARQ_B!" (
    for %%F in ("!ARQ_B!") do set "ARQ_SZ=%%~zF"
    if !ARQ_SZ! gtr 300 set "ARQ_OK=1"
)
echo [RICOH-HTTP-ARQ] existe=!ARQ_OK! tamanho=!ARQ_SZ! >> "%LOG_FILE%"

if !ARQ_OK! equ 1 (
    endlocal & exit /b 0
)

if exist "!ARQ_B!" del "!ARQ_B!" 2>nul
endlocal & exit /b 1

:: =========================================
:: FUNCAO: RICOH - VERIFICA RETORNO DE LOGIN (AUX)
:: =========================================
:RICOH_LOGIN_OK_AUX
setlocal EnableDelayedExpansion
set "ARQ_LOGIN=%~1"
set "OK=0"
if exist "!ARQ_LOGIN!" (
    set "INVALIDO=0"
    findstr /i "login.cgi authForm.cgi MSG_COOKIEOFF cookieoff authentication failed result=FAILURE" "!ARQ_LOGIN!" >nul 2>&1 && set "INVALIDO=1"
    if !INVALIDO! equ 0 set "OK=1"
)
if !OK! equ 1 (
    endlocal & exit /b 0
) else (
    endlocal & exit /b 1
)

:: =========================================
:: FUNCAO: RICOH - BAIXAR UDF VIA COOKIE (AUX)
:: =========================================
:RICOH_BAIXAR_UDF_COOKIE_AUX
setlocal EnableDelayedExpansion
set "URL_B=%~1"
set "COOKIE_B=%~2"
set "ARQ_B=%~3"
set "RC=1"
set "ERR_B=%TEMP_LOCAL%\\ricoh_curl_err_!RANDOM!!RANDOM!.log"

if exist "!ARQ_B!" del "!ARQ_B!" 2>nul
if exist "!ERR_B!" del "!ERR_B!" 2>nul

echo [RICOH-CURL-INICIO] COOKIE !URL_B! >> "%LOG_FILE%"
curl.exe -L -k --fail --max-redirs 2 --retry 0 -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_RICOH% -b "!COOKIE_B!" -c "!COOKIE_B!" "!URL_B!" -o "!ARQ_B!" 2>"!ERR_B!"
set "RC=!errorlevel!"
echo [RICOH-CURL-FIM] rc=!RC! >> "%LOG_FILE%"
if "!RC!" neq "0" if %RICOH_DIAGNOSTICO% equ 1 (
    echo [RICOH-CURL-ERRO-INICIO] !URL_B! >> "%LOG_FILE%"
    if exist "!ERR_B!" type "!ERR_B!" >> "%LOG_FILE%"
    echo [RICOH-CURL-ERRO-FIM] >> "%LOG_FILE%"
)
if exist "!ERR_B!" del "!ERR_B!" 2>nul

if exist "!ARQ_B!" (
    call :RICOH_VALIDAR_UDF "!ARQ_B!"
    if !errorlevel! equ 0 (
        endlocal & exit /b 0
    )
    if %RICOH_DIAGNOSTICO% equ 1 (
        set "BAD_B=!ARQ_B!.bad"
        copy /y "!ARQ_B!" "!BAD_B!" >nul 2>&1
        for %%F in ("!ARQ_B!") do set "BAD_SZ=%%~zF"
        echo [RICOH-VALIDA-ARQ] invalido tamanho=!BAD_SZ! salvo=!BAD_B! >> "%LOG_FILE%"
    )
    del "!ARQ_B!" 2>nul
)

endlocal & exit /b 1

:: =========================================
:: FUNCAO: RICOH - TENTATIVA VIA SESSAO
:: =========================================
:RICOH_SESSAO
setlocal EnableDelayedExpansion
set "IP_S=%~1"
set "NOME_S=%~2"
set "USER_S=%~3"
set "PASS_S=%~4"
set "ARQ_S=%~5"
set "RESULT_INFO="
set "OK=0"
set "EFFECTIVE_URL="
set "URL_OK=0"

set "TOKEN=%RANDOM%%RANDOM%"
set "COOKIE=%TEMP_LOCAL%\\ricoh_cookie_!TOKEN!.txt"
set "AUTH_HTML=%TEMP_LOCAL%\\ricoh_auth_!TOKEN!.html"
set "LOGIN_HTML=%TEMP_LOCAL%\\ricoh_login_!TOKEN!.html"
set "UPLOAD_HTML=%TEMP_LOCAL%\\ricoh_upload_!TOKEN!.html"

set "RICOH_USER_B64_SRC=!USER_S!"
set "RICOH_PASS_B64_SRC=!PASS_S!"

for /f "delims=" %%B in ('powershell -NoProfile -Command "$u=$env:RICOH_USER_B64_SRC; if($null -eq $u){$u=''}; [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($u))"') do set "USER64=%%B"
for /f "delims=" %%B in ('powershell -NoProfile -Command "$p=$env:RICOH_PASS_B64_SRC; if($null -eq $p){$p=''}; [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($p))"') do set "PASS64=%%B"

for %%L in (%RICOH_LOCALES%) do (
    if !OK! equ 0 (
        if exist "!COOKIE!" del "!COOKIE!" 2>nul
        if exist "!AUTH_HTML!" del "!AUTH_HTML!" 2>nul
        if exist "!LOGIN_HTML!" del "!LOGIN_HTML!" 2>nul
        if exist "!UPLOAD_HTML!" del "!UPLOAD_HTML!" 2>nul

        set "AUTH_URL=http://!IP_S!/web/guest/%%L/websys/webArch/authForm.cgi?open=address/adrsFileDownload.cgi/!NOME_S!_addr.udf"
        set "LOGIN_URL=http://!IP_S!/web/guest/%%L/websys/webArch/login.cgi"
        set "LIST_URL=http://!IP_S!/web/entry/%%L/address/adrsList.cgi"
        set "UPLOAD_URL=http://!IP_S!/web/entry/%%L/address/adrsUploadFile.cgi"
        set "DOWN_URL=http://!IP_S!/web/entry/%%L/address/adrsFileDownload.cgi/!NOME_S!_addr.udf"
        set "DOWN_URL_FIXA=http://!IP_S!/web/entry/%%L/address/adrsFileDownload.cgi/!RICOH_FILENAME_FIXO!"
        set "DOWN_BASE=http://!IP_S!/web/entry/%%L/address/adrsFileDownload.cgi"

        echo [RICOH-TENTATIVA-SESSAO] !USER_S!@!AUTH_URL! >> "%LOG_FILE%"
        echo   [RICOH] Sessao locale=%%L: auth/login

        curl.exe -L -k --max-redirs 3 --retry 0 -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_RICOH_LOGIN% -c "!COOKIE!" -b "cookieOnOffChecker=on" "!AUTH_URL!" -o "!AUTH_HTML!" 2>nul

        if exist "!AUTH_HTML!" (
            set "AUTH_INVALIDA=0"
            findstr /i "404 Not Found" "!AUTH_HTML!" >nul 2>&1 && set "AUTH_INVALIDA=1"

            if !AUTH_INVALIDA! equ 0 (
                set "LOGIN_FALHOU=1"
                set "LOGIN_MODO="

                curl.exe -L -k --max-redirs 3 --retry 0 -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_RICOH_LOGIN% -c "!COOKIE!" -b "!COOKIE!" --data-urlencode "userid=!USER_S!" --data-urlencode "password=!PASS_S!" "!LOGIN_URL!" -o "!LOGIN_HTML!" 2>nul
                echo [RICOH-SESSAO-LOGIN] modo=PLAIN usuario=!USER_S! rc=!errorlevel! >> "%LOG_FILE%"
                call :RLOGIN_OK "!LOGIN_HTML!"
                if !errorlevel! equ 0 (
                    set "LOGIN_FALHOU=0"
                    set "LOGIN_MODO=PLAIN"
                )

                if !LOGIN_FALHOU! equ 1 (
                    curl.exe -L -k --max-redirs 3 --retry 0 -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_RICOH_LOGIN% -c "!COOKIE!" -b "!COOKIE!" --data "userid=!USER64!&password=!PASS64!" "!LOGIN_URL!" -o "!LOGIN_HTML!" 2>nul
                    echo [RICOH-SESSAO-LOGIN] modo=B64 usuario=!USER_S! rc=!errorlevel! >> "%LOG_FILE%"
                    call :RLOGIN_OK "!LOGIN_HTML!"
                    if !errorlevel! equ 0 (
                        set "LOGIN_FALHOU=0"
                        set "LOGIN_MODO=B64"
                    )
                )

                if !LOGIN_FALHOU! equ 0 (
                    echo [RICOH-SESSAO-LOGIN] OK modo=!LOGIN_MODO! usuario=!USER_S! >> "%LOG_FILE%"
                    set "PREP_OK=1"

                    curl.exe -L -k --max-redirs 3 --retry 0 -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_RICOH_LOGIN% -b "!COOKIE!" -c "!COOKIE!" "!LIST_URL!" -o NUL 2>nul
                    if !errorlevel! neq 0 set "PREP_OK=0"
                    echo [RICOH-SESSAO-PREP] GET adrsList rc=!errorlevel! locale=%%L >> "%LOG_FILE%"

                    if !PREP_OK! equ 1 (
                        curl.exe -L -k --max-redirs 3 --retry 0 -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_RICOH% -b "!COOKIE!" -c "!COOKIE!" ^
                            --data "mode=BACKUP&kind=BACKUP&mainteKey=&pageSpecifiedIn=&pageNumberIn=&searchSpecifyModeIn=&wayTo=&wayFrom=adrsDownloadFile.cgi" ^
                            "!UPLOAD_URL!" -o "!UPLOAD_HTML!" 2>nul
                        echo [RICOH-SESSAO-PREP] POST adrsUploadFile rc=!errorlevel! locale=%%L >> "%LOG_FILE%"

                        if !errorlevel! neq 0 set "PREP_OK=0"
                        if exist "!UPLOAD_HTML!" (
                            set "UPLOAD_INVALIDO=0"
                            findstr /i "result=FAILURE result=TIMEOUT login.cgi authForm.cgi MSG_COOKIEOFF cookieoff authentication failed" "!UPLOAD_HTML!" >nul 2>&1 && set "UPLOAD_INVALIDO=1"
                            if !UPLOAD_INVALIDO! equ 1 set "PREP_OK=0"
                            if !UPLOAD_INVALIDO! equ 0 (
                                findstr /i "returnValue SUCCESS adrsDownloadFile.cgi adrsFileDownload.cgi" "!UPLOAD_HTML!" >nul 2>&1
                                if !errorlevel! equ 0 set "PREP_OK=1"
                            )
                        ) else (
                            set "PREP_OK=0"
                        )

                        if !PREP_OK! neq 1 if exist "!UPLOAD_HTML!" (
                            findstr /i "login.cgi authForm.cgi result=FAILURE result=TIMEOUT" "!UPLOAD_HTML!" >nul 2>&1
                            if !errorlevel! neq 0 (
                                set "PREP_OK=1"
                                echo [RICOH-SESSAO-PREP] AJUSTE: mantendo tentativa de download locale=%%L usuario=!USER_S! >> "%LOG_FILE%"
                            )
                        )
                    )

                    if !PREP_OK! equ 1 (
                        echo [RICOH-TENTATIVA-SESSAO-DOWN] !USER_S!@!DOWN_URL! >> "%LOG_FILE%"
                        call :RB_COOKIE "!DOWN_URL!" "!COOKIE!" "!ARQ_S!"
                        if !errorlevel! equ 0 (
                            set "OK=1"
                            set "RESULT_INFO=SESSAO locale=%%L (nome !LOGIN_MODO!)"
                        )

                        if !OK! equ 0 if %RICOH_USAR_FIXO% equ 1 (
                            echo [RICOH-TENTATIVA-SESSAO-DOWN] !USER_S!@!DOWN_URL_FIXA! >> "%LOG_FILE%"
                            call :RB_COOKIE "!DOWN_URL_FIXA!" "!COOKIE!" "!ARQ_S!"
                            if !errorlevel! equ 0 (
                                set "OK=1"
                                set "RESULT_INFO=SESSAO locale=%%L (fixo !LOGIN_MODO!)"
                            )
                        )

                        if !OK! equ 0 if %RICOH_USAR_URL_EFETIVA% equ 1 (
                            set "EFFECTIVE_URL="
                            echo   [RICOH] Sessao locale=%%L: URL efetiva
                            for /f "delims=" %%U in ('curl.exe -L -k --max-redirs 3 --retry 0 -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_RICOH_LOGIN% -b "!COOKIE!" -c "!COOKIE!" -o NUL -w "%%{url_effective}" "!DOWN_BASE!" 2^>nul') do (
                                set "EFFECTIVE_URL=%%U"
                            )

                            if defined EFFECTIVE_URL (
                                set "URL_OK=1"
                                echo(!EFFECTIVE_URL! | findstr /i "adrsFileDownload.cgi/" >nul || set "URL_OK=0"
                                echo(!EFFECTIVE_URL! | findstr /i ".udf" >nul || set "URL_OK=0"
                                echo(!EFFECTIVE_URL! | findstr /i "authForm.cgi login.cgi result=TIMEOUT result=FAILURE" >nul && set "URL_OK=0"

                                if !URL_OK! equ 1 (
                                    echo [RICOH-URL-EFETIVA-SESSAO] !USER_S!@!EFFECTIVE_URL! >> "%LOG_FILE%"
                                    call :RB_COOKIE "!EFFECTIVE_URL!" "!COOKIE!" "!ARQ_S!"
                                    if !errorlevel! equ 0 (
                                        set "OK=1"
                                        set "RESULT_INFO=SESSAO locale=%%L (url-efetiva)"
                                    )
                                )
                            )
                        )
                    ) else (
                        echo [RICOH-SESSAO-PREP] FALHA locale=%%L usuario=!USER_S! >> "%LOG_FILE%"
                    )
                )
                if !LOGIN_FALHOU! equ 1 (
                    echo [RICOH-SESSAO-LOGIN] FALHA usuario=!USER_S! locale=%%L >> "%LOG_FILE%"
                )
            )
        )
    )
)

if exist "!COOKIE!" del "!COOKIE!" 2>nul
if exist "!AUTH_HTML!" del "!AUTH_HTML!" 2>nul
if exist "!LOGIN_HTML!" del "!LOGIN_HTML!" 2>nul
if exist "!UPLOAD_HTML!" del "!UPLOAD_HTML!" 2>nul
set "RICOH_USER_B64_SRC="
set "RICOH_PASS_B64_SRC="

if !OK! equ 1 (
    endlocal & set "%~6=%RESULT_INFO%" & exit /b 0
) else (
    endlocal & set "%~6=" & exit /b 1
)

:: =========================================
:: FUNCAO: RICOH - VERIFICA RETORNO DE LOGIN
:: =========================================
:RLOGIN_OK
setlocal EnableDelayedExpansion
set "ARQ_LOGIN=%~1"
set "OK=0"
if exist "!ARQ_LOGIN!" (
    set "INVALIDO=0"
    findstr /i "login.cgi authForm.cgi MSG_COOKIEOFF cookieoff authentication failed result=FAILURE" "!ARQ_LOGIN!" >nul 2>&1 && set "INVALIDO=1"
    if !INVALIDO! equ 0 set "OK=1"
)
if !OK! equ 1 (
    endlocal & exit /b 0
) else (
    endlocal & exit /b 1
)

:: =========================================
:: FUNCAO: RICOH - BAIXAR UDF VIA COOKIE
:: =========================================
:RB_COOKIE
setlocal EnableDelayedExpansion
set "URL_B=%~1"
set "COOKIE_B=%~2"
set "ARQ_B=%~3"
set "RC=1"
set "ERR_B=%TEMP_LOCAL%\\ricoh_curl_err_!RANDOM!!RANDOM!.log"

if exist "!ARQ_B!" del "!ARQ_B!" 2>nul
if exist "!ERR_B!" del "!ERR_B!" 2>nul

echo [RICOH-CURL-INICIO] COOKIE !URL_B! >> "%LOG_FILE%"
curl.exe -L -k --fail --max-redirs 2 --retry 0 -sS --connect-timeout %CONNECT_TIMEOUT% -m %TIMEOUT_RICOH% -b "!COOKIE_B!" -c "!COOKIE_B!" "!URL_B!" -o "!ARQ_B!" 2>"!ERR_B!"
set "RC=!errorlevel!"
echo [RICOH-CURL-FIM] rc=!RC! >> "%LOG_FILE%"
if "!RC!" neq "0" if %RICOH_DIAGNOSTICO% equ 1 (
    echo [RICOH-CURL-ERRO-INICIO] !URL_B! >> "%LOG_FILE%"
    if exist "!ERR_B!" type "!ERR_B!" >> "%LOG_FILE%"
    echo [RICOH-CURL-ERRO-FIM] >> "%LOG_FILE%"
)
if exist "!ERR_B!" del "!ERR_B!" 2>nul

if exist "!ARQ_B!" (
    call :RICOH_VALIDAR_UDF "!ARQ_B!"
    if !errorlevel! equ 0 (
        endlocal & exit /b 0
    )
    if %RICOH_DIAGNOSTICO% equ 1 (
        set "BAD_B=!ARQ_B!.bad"
        copy /y "!ARQ_B!" "!BAD_B!" >nul 2>&1
        for %%F in ("!ARQ_B!") do set "BAD_SZ=%%~zF"
        echo [RICOH-VALIDA-ARQ] invalido tamanho=!BAD_SZ! salvo=!BAD_B! >> "%LOG_FILE%"
    )
    del "!ARQ_B!" 2>nul
)

endlocal & exit /b 1
