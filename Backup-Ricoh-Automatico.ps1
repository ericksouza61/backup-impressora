# Backup-Ricoh-Automatico.ps1 - Versão Final e Completa
param(
    [string]$PrinterIP = "10.19.0.34"
)

try {
    Write-Host "=== Backup Automatico Ricoh ===" -ForegroundColor Cyan
    Write-Host "Impressora IP: $PrinterIP" -ForegroundColor Cyan
    
    # Configurar credenciais
    $username = "copymaq"
    $password = "copymaq"
    $credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
    
    # Configurar headers
    $headers = @{
        "Authorization" = "Basic $credentials"
        "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    
    # URL de download
    $downloadUrl = "http://$PrinterIP/web/entry/pt/address/adrsFileDownload.cgi/RICOH%20Aficio%20SP%205200S_addr.udf"
    
    # Criar diretório de saída
    $outputPath = "C:\Backups\Ricoh"
    if (!(Test-Path $outputPath)) {
        New-Item -ItemType Directory -Path $outputPath -Force
    }
    
    # Nome do arquivo
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $outputFile = "RICOH_backup_$PrinterIP_$timestamp.udf"
    $fullPath = Join-Path $outputPath $outputFile
    
    Write-Host "Arquivo de saída: $outputFile" -ForegroundColor Cyan
    
    Write-Host "Acessando URL: $downloadUrl" -ForegroundColor Gray
    Write-Host "Realizando download..." -ForegroundColor Yellow
    
    # Fazer download
    $response = Invoke-WebRequest -Uri $downloadUrl -Headers $headers -TimeoutSec 60 -UseBasicParsing
    
    if ($response.StatusCode -eq 200) {
        # Salvar arquivo
        [System.IO.File]::WriteAllBytes($fullPath, $response.Content)
        
        $fileSize = [math]::Round($response.Content.Length / 1KB, 2)
        Write-Host "✓ Download concluído!" -ForegroundColor Green
        Write-Host "Arquivo salvo: $outputFile" -ForegroundColor White
        Write-Host "Tamanho: ${fileSize} KB" -ForegroundColor White
        Write-Host "Local: $fullPath" -ForegroundColor White
        
        # Validar conteúdo
        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        $firstLine = [System.Text.Encoding]::UTF8.GetString($bytes).TrimStart().Split("`n")[0]
        
        if ($firstLine -match '#UCS address entries Backup') {
            Write-Host "✓ UDF VÁLIDO DETECTADO!" -ForegroundColor Green
        } else {
            Write-Host "⚠ Aviso: Cabeçalho UDF não encontrado" -ForegroundColor Yellow
        }
    } else {
        throw "Erro HTTP: $($response.StatusCode)"
    }
    
} catch {
    Write-Host "✗ ERRO durante o backup:" -ForegroundColor Red
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.InnerException) {
        Write-Host "  Detalhes: $($_.Exception.InnerException.Message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host "=== Processo concluído ===" -ForegroundColor Cyan