@echo off
if "%TEMP%"=="" set "TEMP=C:\Windows\Temp"
if "%TMP%"==""  set "TMP=C:\Windows\Temp"
setlocal enabledelayedexpansion

:: Muda para a pasta onde o script está localizado
cd /d "%~dp0"

:: =========================================
:: CONFIGURAÇÕES GERAIS
:: =========================================
set ARQUIVO_IPS=Listagem Impressora IP'S.txt
set PASTA_BACKUP=C:\Backups\Impressoras
set LOG_FILE=C:\Backups\Impressoras\backup_log.txt

echo.
echo Pasta do script: %~dp0
echo Procurando arquivo: %ARQUIVO_IPS%
echo.

:: Verifica se o arquivo de IPs existe
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
    echo 2. OU renomeie seu arquivo para: Listagem Impressora IP'S.txt
    echo ============================================================
    echo.
    pause
    exit /b 1
)

echo Arquivo encontrado! Continuando...
echo.

:: Credenciais Brother para tentar (separadas por espaço)
set "CRED_BROTHER=admin:access admin:initpass admin:brother admin: root:access root:brother"

:: Credenciais Ricoh para tentar (separadas por espaço) - Ordem otimizada
set "CRED_RICOH=admin: admin: admin:admin admin:password admin: admin admin:12345678 admin:ricoh copymaq:copymaq supervisor:supervisor admin:copymaq copymaq:admin"

:: Cria pastas de backup se não existirem
if not exist "%PASTA_BACKUP%\Lexmark" mkdir "%PASTA_BACKUP%\Lexmark"
if not exist "%PASTA_BACKUP%\Brother" mkdir "%PASTA_BACKUP%\Brother"
if not exist "%PASTA_BACKUP%\Ricoh" mkdir "%PASTA_BACKUP%\Ricoh"
if not exist "%PASTA_BACKUP%\Desconhecido" mkdir "%PASTA_BACKUP%\Desconhecido"

:: Obtém data e hora atual
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd'"') do set DATA=%%i
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format 'HH-mm-ss'"') do set HORA=%%i

:: Inicia log
echo ============================================================ > "%LOG_FILE%"
echo BACKUP UNIFICADO - LEXMARK, BROTHER E RICOH >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"
echo Iniciado em: %DATA% %HORA% >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"

echo.
echo ============================================================
echo   BACKUP AUTOMATIZADO - LEXMARK, BROTHER E RICOH
echo ============================================================
echo.

:: Contadores
set /a TOTAL=0
set /a SUCESSO_LEXMARK=0
set /a SUCESSO_BROTHER=0
set /a SUCESSO_RICOH=0
set /a OFFLINE=0
set /a FALHA=0
set /a DESCONHECIDO=0

:: =========================================
:: PROCESSA CADA IMPRESSORA
:: =========================================
echo Lendo arquivo: %ARQUIVO_IPS%
echo Total de linhas no arquivo:
type "%ARQUIVO_IPS%" | find /c /v "" 
echo.

for /f "skip=1 tokens=1,*" %%a in ('type "%ARQUIVO_IPS%"') do (
    set NOME_IMPRESSORA=%%a
    set LINHA_COMPLETA=%%b
    
    :: Extrai apenas o IP da linha (remove tudo antes do último espaço)
    set IP_IMPRESSORA=!LINHA_COMPLETA!
    
    :: Percorre a linha para pegar o último token (que deve ser o IP)
    for %%I in (!LINHA_COMPLETA!) do set IP_IMPRESSORA=%%I
    
    :: Remove possível caminho UNC
    set IP_IMPRESSORA=!IP_IMPRESSORA:\\=!
    
    :: Verifica se é um IP válido (padrão 10.x.x.x)
    echo !IP_IMPRESSORA! | findstr /r "^10\.[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*" >nul
    if !errorlevel! equ 0 (
        set /a TOTAL+=1
        echo.
        echo ========== [!TOTAL!] ==========
        echo Impressora: !NOME_IMPRESSORA!
        echo IP: !IP_IMPRESSORA!
        echo.
        
        :: Identifica o modelo da impressora
        call :IDENTIFICAR_MODELO !IP_IMPRESSORA! MODELO
        
        if "!MODELO!"=="OFFLINE" (
            echo Impressora: OFFLINE - Pulando...
            echo [OFFLINE] !NOME_IMPRESSORA! - !IP_IMPRESSORA! >> "%LOG_FILE%"
            set /a OFFLINE+=1
        ) else if "!MODELO!"=="LEXMARK" (
            echo Modelo detectado: LEXMARK
            call :BACKUP_LEXMARK !NOME_IMPRESSORA! !IP_IMPRESSORA!
        ) else if "!MODELO!"=="BROTHER" (
            echo Modelo detectado: BROTHER
            call :BACKUP_BROTHER !NOME_IMPRESSORA! !IP_IMPRESSORA!
        ) else if "!MODELO!"=="RICOH" (
            echo Modelo detectado: RICOH
            call :BACKUP_RICOH !NOME_IMPRESSORA! !IP_IMPRESSORA!
        ) else (
            echo Modelo: DESCONHECIDO - Tentando todos os metodos...
            call :BACKUP_LEXMARK !NOME_IMPRESSORA! !IP_IMPRESSORA!
            if !errorlevel! neq 0 (
                call :BACKUP_BROTHER !NOME_IMPRESSORA! !IP_IMPRESSORA!
                if !errorlevel! neq 0 (
                    call :BACKUP_RICOH !NOME_IMPRESSORA! !IP_IMPRESSORA!
                )
            )
        )
    )
)

:: =========================================
:: RESUMO FINAL
:: =========================================
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
echo   - Lexmark: %PASTA_BACKUP%\Lexmark\
echo   - Brother: %PASTA_BACKUP%\Brother\
echo   - Ricoh: %PASTA_BACKUP%\Ricoh\
echo.
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

pause
goto :EOF

:: =========================================
:: FUNÇÃO: IDENTIFICAR MODELO
:: =========================================
:IDENTIFICAR_MODELO
set IP_TEMP=%~1
set MODELO_RESULTADO=DESCONHECIDO

:: Verifica se está online primeiro
ping -n 1 -w 500 %IP_TEMP% >nul 2>&1
if !errorlevel! neq 0 (
    set MODELO_RESULTADO=OFFLINE
    goto :IDENTIFICAR_FIM
)

:: Tenta detectar Lexmark - múltiplos endpoints
curl -s -m 3 "http://%IP_TEMP%/cgi-bin/dynamic/printer/config/reports/deviceinfo.html" 2>nul | findstr /i "Lexmark" >nul
if !errorlevel! equ 0 (
    set MODELO_RESULTADO=LEXMARK
    goto :IDENTIFICAR_FIM
)

curl -s -m 3 "http://%IP_TEMP%/" 2>nul | findstr /i "Lexmark" >nul
if !errorlevel! equ 0 (
    set MODELO_RESULTADO=LEXMARK
    goto :IDENTIFICAR_FIM
)

:: Tenta detectar Brother - múltiplos endpoints
curl -s -m 3 "http://%IP_TEMP%/general/status.html" 2>nul | findstr /i "Brother" >nul
if !errorlevel! equ 0 (
    set MODELO_RESULTADO=BROTHER
    goto :IDENTIFICAR_FIM
)

curl -s -m 3 "http://%IP_TEMP%/" 2>nul | findstr /i "Brother" >nul
if !errorlevel! equ 0 (
    set MODELO_RESULTADO=BROTHER
    goto :IDENTIFICAR_FIM
)

curl -s -m 3 "http://%IP_TEMP%/general/information.html" 2>nul | findstr /i "Brother" >nul
if !errorlevel! equ 0 (
    set MODELO_RESULTADO=BROTHER
    goto :IDENTIFICAR_FIM
)

:: Tenta acessar página específica da Brother (se retornar 401/200, provavelmente é Brother)
curl -s -o nul -w "%%{http_code}" -m 3 "http://%IP_TEMP%/general/status.html" 2>nul | findstr "200 401" >nul
if !errorlevel! equ 0 (
    set MODELO_RESULTADO=BROTHER
    goto :IDENTIFICAR_FIM
)

:: Tenta detectar Ricoh - múltiplos endpoints
curl -s -m 3 "http://%IP_TEMP%/web/guest/pt/websys/webArch/mainFrame.cgi" 2>nul | findstr /i "Ricoh" >nul
if !errorlevel! equ 0 (
    set MODELO_RESULTADO=RICOH
    goto :IDENTIFICAR_FIM
)

curl -s -m 3 "http://%IP_TEMP%/" 2>nul | findstr /i "Ricoh" >nul
if !errorlevel! equ 0 (
    set MODELO_RESULTADO=RICOH
    goto :IDENTIFICAR_FIM
)

:: Tenta acessar página específica da Ricoh
curl -s -o nul -w "%%{http_code}" -m 3 "http://%IP_TEMP%/web/guest/pt/websys/webArch/mainFrame.cgi" 2>nul | findstr "200 401" >nul
if !errorlevel! equ 0 (
    set MODELO_RESULTADO=RICOH
    goto :IDENTIFICAR_FIM
)

:IDENTIFICAR_FIM
set %~2=!MODELO_RESULTADO!
exit /b 0

:: =========================================
:: FUNÇÃO: BACKUP LEXMARK
:: =========================================
:BACKUP_LEXMARK
set NOME=%~1
set IP=%~2

echo Tentando backup LEXMARK...

:: Verifica se a impressora está online primeiro
echo   Verificando conectividade...
ping -n 1 -w 1000 %IP% >nul 2>&1
if !errorlevel! neq 0 (
    echo [OFFLINE] Impressora nao responde ao ping
    echo [OFFLINE-LEXMARK] %NOME% - %IP% - Sem resposta >> "%LOG_FILE%"
    set /a OFFLINE+=1
    exit /b 1
)

echo   Impressora online, baixando backup...

curl -L -k -m 30 "http://%IP%/cgi-bin/direct/printer/prtappauth/apps/ImportExportServlet?exportButton=clicked" ^
     -H "Referer: http://%IP%/" ^
     -o "%PASTA_BACKUP%\Lexmark\%NOME%_%DATA%.ucf" 2>nul

:: Verifica sucesso
if exist "%PASTA_BACKUP%\Lexmark\%NOME%_%DATA%.ucf" (
    for %%F in ("%PASTA_BACKUP%\Lexmark\%NOME%_%DATA%.ucf") do set TAMANHO=%%~zF
    if !TAMANHO! gtr 1000 (
        echo [OK] Backup LEXMARK realizado - !TAMANHO! bytes
        echo [OK-LEXMARK] %NOME% - %IP% - !TAMANHO! bytes >> "%LOG_FILE%"
        set /a SUCESSO_LEXMARK+=1
        exit /b 0
    ) else (
        echo [FALHA] Arquivo muito pequeno
        del "%PASTA_BACKUP%\Lexmark\%NOME%_%DATA%.ucf" 2>nul
        echo [FALHA-LEXMARK] %NOME% - %IP% - Arquivo invalido >> "%LOG_FILE%"
        set /a FALHA+=1
        exit /b 1
    )
) else (
    echo [FALHA] Sem resposta da impressora
    echo [FALHA-LEXMARK] %NOME% - %IP% - Sem resposta >> "%LOG_FILE%"
    set /a FALHA+=1
    exit /b 1
)

:: =========================================
:: FUNÇÃO: BACKUP BROTHER
:: =========================================
:BACKUP_BROTHER
set NOME=%~1
set IP=%~2

echo Tentando backup BROTHER...

:: Verifica se a impressora está online primeiro
echo   Verificando conectividade...
ping -n 1 -w 1000 %IP% >nul 2>&1
if !errorlevel! neq 0 (
    echo [OFFLINE] Impressora nao responde ao ping
    echo [OFFLINE-BROTHER] %NOME% - %IP% - Sem resposta >> "%LOG_FILE%"
    set /a FALHA+=1
    exit /b 1
)

echo   Impressora online, testando credenciais...

:: Tenta múltiplas credenciais
set CREDENCIAL_OK=0

for %%C in (%CRED_BROTHER%) do (
    if !CREDENCIAL_OK! equ 0 (
        set CREDENCIAL=%%C
        
        echo   Testando credencial: !CREDENCIAL!
        
        :: Backup do arquivo de configuração principal
        curl -L -k -m 20 "http://%IP%/common/exportconfig.html" ^
             --data "pageid=0&Submit=Export" ^
             -u "!CREDENCIAL!" ^
             -o "%PASTA_BACKUP%\Brother\%NOME%_config_%DATA%.dat" 2>nul
        
        :: Backup do catálogo de endereços (scanner)
        curl -L -k -m 20 "http://%IP%/general/address_list.csv" ^
             -u "!CREDENCIAL!" ^
             -o "%PASTA_BACKUP%\Brother\%NOME%_addressbook_%DATA%.csv" 2>nul
        
        :: Verifica se conseguiu pelo menos um arquivo válido
        set ARQUIVO_OK=0
        
        if exist "%PASTA_BACKUP%\Brother\%NOME%_config_%DATA%.dat" (
            for %%F in ("%PASTA_BACKUP%\Brother\%NOME%_config_%DATA%.dat") do set TAM=%%~zF
            if !TAM! gtr 100 set ARQUIVO_OK=1
        )
        
        if exist "%PASTA_BACKUP%\Brother\%NOME%_addressbook_%DATA%.csv" (
            for %%F in ("%PASTA_BACKUP%\Brother\%NOME%_addressbook_%DATA%.csv") do set TAM=%%~zF
            if !TAM! gtr 50 set ARQUIVO_OK=1
        )
        
        if !ARQUIVO_OK! equ 1 (
            echo [OK] Backup BROTHER realizado - Credencial: !CREDENCIAL!
            echo [OK-BROTHER] %NOME% - %IP% - Credencial: !CREDENCIAL! >> "%LOG_FILE%"
            set /a SUCESSO_BROTHER+=1
            set CREDENCIAL_OK=1
        ) else (
            :: Remove arquivos vazios
            del "%PASTA_BACKUP%\Brother\%NOME%_*_%DATA%.*" 2>nul
        )
    )
)

if !CREDENCIAL_OK! equ 0 (
    echo [FALHA] Nenhuma credencial funcionou
    echo [FALHA-BROTHER] %NOME% - %IP% - Autenticacao falhou >> "%LOG_FILE%"
    set /a FALHA+=1
    exit /b 1
) else (
    exit /b 0
)

:: =========================================
:: FUNÇÃO: BACKUP RICOH - VERSÃO OTIMIZADA
:: =========================================
:BACKUP_RICOH
set NOME=%~1
set IP=%~2

echo Tentando backup RICOH...

:: Limpa nome para evitar problemas
set NOME_LIMPO=%NOME%
set NOME_LIMPO=%NOME_LIMPO: =_%
set NOME_LIMPO=%NOME_LIMPO:/=_%
set NOME_LIMPO=%NOME_LIMPO:\=_%
set NOME_LIMPO=%NOME_LIMPO::=_%
set NOME_LIMPO=%NOME_LIMPO:?=_%
set NOME_LIMPO=%NOME_LIMPO:>=_%
set NOME_LIMPO=%NOME_LIMPO:<=_%
set NOME_LIMPO=%NOME_LIMPO:|=_%

:: Verifica se a impressora está online primeiro
echo   Verificando conectividade...
ping -n 1 -w 1000 %IP% >nul 2>&1
if !errorlevel! neq 0 (
    echo [OFFLINE] Impressora nao responde ao ping
    echo [OFFLINE-RICOH] %NOME% - %IP% - Sem resposta >> "%LOG_FILE%"
    set /a OFFLINE+=1
    exit /b 1
)

echo   Impressora online, testando credenciais...

:: Lista otimizada de credenciais - admin: (senha em branco) primeiro
set "CRED_RICOH_UPDATED=admin: admin:admin admin:password admin:12345678"

:: Tenta múltiplas credenciais
set CREDENCIAL_OK=0

for %%C in (%CRED_RICOH_UPDATED%) do (
    if !CREDENCIAL_OK! equ 0 (
        set CREDENCIAL=%%C
        
        echo   Testando credencial: "!CREDENCIAL!"
        
        :: =========================================
        :: MÉTODO 1: Tenta obter cookie primeiro
        :: =========================================
        echo     Obtendo cookie de sessao...
        
        :: Primeiro acessa a página principal para obter cookie
        curl -L -k -m 10 -c "%TEMP%\ricoh_cookie.txt" "http://%IP%/web/guest/pt/websys/webArch/mainFrame.cgi" ^
             -u "!CREDENCIAL!" ^
             -o "%TEMP%\ricoh_test.html" 2>nul
        
        :: Verifica se conseguiu acesso
        if exist "%TEMP%\ricoh_test.html" (
            for %%F in ("%TEMP%\ricoh_test.html") do set TAM=%%~zF
            if !TAM! gtr 1000 (
                
                :: =========================================
                :: MÉTODO 1A: Tenta exportar address book como CSV
                :: =========================================
                echo     Tentando exportar CSV do address book...
                
                curl -L -k -m 30 -b "%TEMP%\ricoh_cookie.txt" ^
                     "http://%IP%/web/entry/pt/address/adrsListCsv.cgi" ^
                     -u "!CREDENCIAL!" ^
                     -o "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_addressbook_%DATA%.csv" 2>nul
                
                :: Verifica se é um CSV válido
                if exist "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_addressbook_%DATA%.csv" (
                    for %%F in ("%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_addressbook_%DATA%.csv") do set TAM_CSV=%%~zF
                    
                    :: Verifica se não é HTML disfarçado
                    findstr /C:"<html>" /C:"<!DOCTYPE" /C:"<head>" /C:"<body>" "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_addressbook_%DATA%.csv" >nul 2>&1
                    if !errorlevel! neq 0 (
                        if !TAM_CSV! gtr 50 (
                            echo       [OK] CSV baixado: !TAM_CSV! bytes
                            set CREDENCIAL_OK=1
                        )
                    ) else (
                        echo       [INFO] CSV é HTML - apagando...
                        del "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_addressbook_%DATA%.csv" 2>nul
                    )
                )
                
                :: =========================================
                :: MÉTODO 1B: Tenta UDF via POST com parâmetros corretos
                :: =========================================
                if !CREDENCIAL_OK! equ 0 (
                    echo     Tentando backup UDF via POST...
                    
                    :: Primeiro precisa navegar para a página de export
                    curl -L -k -m 10 -b "%TEMP%\ricoh_cookie.txt" ^
                         "http://%IP%/web/entry/pt/address/export.cgi" ^
                         -u "!CREDENCIAL!" ^
                         -o "%TEMP%\ricoh_export_page.html" 2>nul
                    
                    :: Agora tenta fazer o download
                    echo     Fazendo download UDF...
                    curl -L -k -m 30 -b "%TEMP%\ricoh_cookie.txt" ^
                         "http://%IP%/web/entry/pt/address/exportAddress.cgi" ^
                         -X POST ^
                         --data "target=all&fileType=0&export=Exportar" ^
                         -u "!CREDENCIAL!" ^
                         -H "Content-Type: application/x-www-form-urlencoded" ^
                         -H "Referer: http://%IP%/web/entry/pt/address/export.cgi" ^
                         -o "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_backup_%DATA%.udf" 2>nul
                    
                    if exist "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_backup_%DATA%.udf" (
                        for %%F in ("%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_backup_%DATA%.udf") do set TAM_UDF=%%~zF
                        
                        :: Verifica se é UDF válido (começa com #UCS)
                        findstr /B /C:"#UCS" "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_backup_%DATA%.udf" >nul 2>&1
                        if !errorlevel! equ 0 (
                            if !TAM_UDF! gtr 100 (
                                echo       [OK] UDF baixado: !TAM_UDF! bytes
                                set CREDENCIAL_OK=1
                            )
                        ) else (
                            :: Verifica se é HTML
                            findstr /C:"<html>" /C:"<!DOCTYPE" "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_backup_%DATA%.udf" >nul 2>&1
                            if !errorlevel! equ 0 (
                                echo       [INFO] UDF é HTML - apagando...
                                del "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_backup_%DATA%.udf" 2>nul
                            )
                        )
                    )
                )
                
                :: =========================================
                :: MÉTODO 1C: Tenta endpoint alternativo
                :: =========================================
                if !CREDENCIAL_OK! equ 0 (
                    echo     Tentando metodo alternativo...
                    
                    curl -L -k -m 30 -b "%TEMP%\ricoh_cookie.txt" ^
                         "http://%IP%/web/guest/pt/websys/status/configuration.cgi" ^
                         -u "!CREDENCIAL!" ^
                         -o "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_config_%DATA%.html" 2>nul
                    
                    if exist "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_config_%DATA%.html" (
                        for %%F in ("%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_config_%DATA%.html") do set TAM_CFG=%%~zF
                        if !TAM_CFG! gtr 5000 (
                            echo       [OK] Configuracoes salvas: !TAM_CFG! bytes
                            set CREDENCIAL_OK=1
                        )
                    )
                )
                
                :: Limpa arquivos temporários
                del "%TEMP%\ricoh_test.html" 2>nul
                del "%TEMP%\ricoh_cookie.txt" 2>nul
                del "%TEMP%\ricoh_export_page.html" 2>nul 2>nul
            )
        )
        
        :: =========================================
        :: MÉTODO 2: Tenta método direto (sem cookie)
        :: =========================================
        if !CREDENCIAL_OK! equ 0 (
            echo     Tentando metodo direto...
            
            :: Tenta endpoints comuns diretamente
            for %%E in (
                "/net/netConfig.cgi"
                "/net/lpd/config.cgi"
                "/web/guest/pt/websys/webArch/getMachineConfiguration.cgi"
            ) do (
                if !CREDENCIAL_OK! equ 0 (
                    curl -L -k -m 20 "http://%IP%%%E" ^
                         -u "!CREDENCIAL!" ^
                         -o "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_direct_%DATA%.bin" 2>nul
                    
                    if exist "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_direct_%DATA%.bin" (
                        for %%F in ("%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_direct_%DATA%.bin") do set TAM_DIR=%%~zF
                        if !TAM_DIR! gtr 100 (
                            echo       [OK] Arquivo direto baixado: !TAM_DIR! bytes
                            set CREDENCIAL_OK=1
                        ) else (
                            del "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_direct_%DATA%.bin" 2>nul
                        )
                    )
                )
            )
        )
        
        if !CREDENCIAL_OK! equ 1 (
            echo [OK] Backup RICOH realizado - Credencial: "!CREDENCIAL!"
            echo [OK-RICOH] %NOME% - %IP% - Credencial: "!CREDENCIAL!" >> "%LOG_FILE%"
            set /a SUCESSO_RICOH+=1
        )
    )
)

if !CREDENCIAL_OK! equ 0 (
    echo [AVISO] Nenhum metodo completo funcionou, salvando pagina principal...
    
    :: Como último recurso, salva a página principal
    curl -L -k -m 20 "http://%IP%/web/guest/pt/websys/webArch/mainFrame.cgi" ^
         -u "admin:" ^
         -o "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_mainpage_%DATA%.html" 2>nul
    
    if exist "%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_mainpage_%DATA%.html" (
        for %%F in ("%PASTA_BACKUP%\Ricoh\%NOME_LIMPO%_mainpage_%DATA%.html") do set TAM_MAIN=%%~zF
        if !TAM_MAIN! gtr 1000 (
            echo [INFO] Pagina principal salva: !TAM_MAIN! bytes
            echo [INFO-RICOH] %NOME% - %IP% - Pagina principal salva >> "%LOG_FILE%"
            set /a SUCESSO_RICOH+=1
            exit /b 0
        )
    )
    
    echo [FALHA] Nenhum metodo funcionou
    echo [FALHA-RICOH] %NOME% - %IP% - Todos metodos falharam >> "%LOG_FILE%"
    set /a FALHA+=1
    exit /b 1
) else (
    exit /b 0
)
:: =========================================
:: FUNÇÃO: LIMPAR NOME ARQUIVO
:: Remove caracteres inválidos para nomes de arquivo
:: =========================================
:LIMPAR_NOME_ARQUIVO
set "NOME_ORIGINAL=%~1"
set "NOME_LIMPO="

:: Converte para ASCII simples (remove acentos e caracteres especiais)
for /f "delims=" %%C in ('cmd /u /c echo !NOME_ORIGINAL! ^| find /v ""') do (
    set "CHAR=%%C"
    set "NOME_LIMPO=!NOME_LIMPO!!CHAR!"
)

:: Remove caracteres inválidos para Windows
set NOME_LIMPO=!NOME_LIMPO:\=!
set NOME_LIMPO=!NOME_LIMPO:/=!
set NOME_LIMPO=!NOME_LIMPO::=!
set NOME_LIMPO=!NOME_LIMPO:?=!
set NOME_LIMPO=!NOME_LIMPO:"=!
set NOME_LIMPO=!NOME_LIMPO:<=!
set NOME_LIMPO=!NOME_LIMPO:>=!
set NOME_LIMPO=!NOME_LIMPO:|=!
set NOME_LIMPO=!NOME_LIMPO:*=!
set NOME_LIMPO=!NOME_LIMPO:?=!

:: Substitui espaços por underline
set NOME_LIMPO=!NOME_LIMPO: =_!

:: Remove múltiplos underlines consecutivos
:REMOVE_DUPLICATE_UNDERSCORES
if "!NOME_LIMPO:__=!" neq "!NOME_LIMPO!" (
    set NOME_LIMPO=!NOME_LIMPO:__=_!
    goto REMOVE_DUPLICATE_UNDERSCORES
)

:: Limita o tamanho do nome (máximo 50 caracteres)
if "!NOME_LIMPO:~50!" neq "" (
    set NOME_LIMPO=!NOME_LIMPO:~0,50!
)

set %~2=!NOME_LIMPO!
exit /b 0
:EOF