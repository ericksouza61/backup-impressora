Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$scriptPath = "C:\Desenvolvemento\backupteste.bat"

function Get-BackupPath {
    param([string]$batPath)
    if (-not (Test-Path $batPath)) { return $null }
    $line = Get-Content $batPath | Where-Object { $_ -match '^\s*set\s+"PASTA_BACKUP=' } | Select-Object -First 1
    if (-not $line) { return $null }
    $value = $line -replace '^\s*set\s+"PASTA_BACKUP=', ''
    $value = $value.Trim()
    $value = $value.Trim('"')
    return $value
}

function Get-BatVar {
    param([string]$batPath, [string]$varName)
    if (-not (Test-Path $batPath)) { return $null }
    $pattern = '^\s*set\s+"{0}=(.*)"' -f [regex]::Escape($varName)
    $line = Get-Content $batPath | Where-Object { $_ -match $pattern } | Select-Object -First 1
    if (-not $line) { return $null }
    $val = ($line -replace $pattern, '$1').Trim()
    return $val
}

function Get-LastFailures {
    param([string]$logFile, [int]$maxLines = 20)
    if (-not (Test-Path $logFile)) { return @() }
    $lines = Get-Content -Path $logFile -ErrorAction SilentlyContinue
    if (-not $lines) { return @() }
    $matches = $lines | Where-Object {
        $_ -match 'FALHA|ERRO|autentic|RICOH-SESSAO|RICOH-CURL-ERRO' -and $_ -notmatch 'OFFLINE'
    }
    if (-not $matches) { return @() }
    return $matches | Select-Object -Last $maxLines
}

$uncShare = Get-BatVar -batPath $scriptPath -varName "UNC_SHARE"
$uncUser  = Get-BatVar -batPath $scriptPath -varName "UNC_USER"
$uncPass  = Get-BatVar -batPath $scriptPath -varName "UNC_PASS"
$uncReady = $false

function Ensure-UNC {
    param([string]$backupPath)
    if ($uncReady) { return $true }
    if (-not $uncShare) { $uncReady = $true; return $true }
    try {
        $args = "/c net use `"$uncShare`" /user:$uncUser $uncPass >nul 2>&1"
        Start-Process -FilePath "cmd.exe" -ArgumentList $args -WindowStyle Hidden -Wait | Out-Null
    } catch {
    }
    if ($backupPath -and (Test-Path $backupPath)) { $uncReady = $true }
    return $uncReady
}

$backupPath = Get-BackupPath -batPath $scriptPath
$logPath = if ($backupPath) { Join-Path $backupPath "backup_log.txt" } else { $null }
$script:guiOutPath = $null
$script:runMarker = $null
$script:isRunning = $false
$script:totalFromOutput = 0
$script:backupProc = $null

$form = New-Object System.Windows.Forms.Form
$form.Text = "Backup Impressoras - Desenvolvido por Erick Souza"
$form.StartPosition = "CenterScreen"
$form.Size = New-Object System.Drawing.Size(620, 360)
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.MinimizeBox = $false

$font = New-Object System.Drawing.Font("Segoe UI", 10)
$form.Font = $font

$lblTitle = New-Object System.Windows.Forms.Label
$lblTitle.Text = "Executar e consultar o backup das impressoras"
$lblTitle.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$lblTitle.AutoSize = $true
$lblTitle.Location = New-Object System.Drawing.Point(20, 15)
$form.Controls.Add($lblTitle)

$lblScript = New-Object System.Windows.Forms.Label
$lblScript.Text = "Script: $scriptPath"
$lblScript.AutoSize = $true
$lblScript.Location = New-Object System.Drawing.Point(20, 45)
$form.Controls.Add($lblScript)

$lblBackup = New-Object System.Windows.Forms.Label
$lblBackup.Text = "Pasta: " + ($(if ($backupPath) { $backupPath } else { "nao encontrada" }))
$lblBackup.AutoSize = $true
$lblBackup.Location = New-Object System.Drawing.Point(20, 70)
$form.Controls.Add($lblBackup)

$btnRun = New-Object System.Windows.Forms.Button
$btnRun.Text = "Executar Backup"
$btnRun.Size = New-Object System.Drawing.Size(120, 35)
$btnRun.Location = New-Object System.Drawing.Point(40, 105)
$btnRun.Add_Click({
    if (-not (Test-Path $scriptPath)) {
        [System.Windows.Forms.MessageBox]::Show("Arquivo nao encontrado:`n$scriptPath", "Erro", "OK", "Error") | Out-Null
        return
    }
    $path = Get-BackupPath -batPath $scriptPath
    if (-not $path) {
        [System.Windows.Forms.MessageBox]::Show("Nao foi possivel identificar a pasta de backup.", "Aviso", "OK", "Warning") | Out-Null
        return
    }
    if (-not (Ensure-UNC -backupPath $path)) {
        [System.Windows.Forms.MessageBox]::Show("Sem acesso ao caminho de backup.`n$path", "Aviso", "OK", "Warning") | Out-Null
        return
    }
    $log = Join-Path $path "backup_log.txt"
    if (-not (Test-Path $log)) {
        New-Item -Path $log -ItemType File -Force | Out-Null
    }
    $script:runMarker = "=== GUI RUN START " + (Get-Date).ToString("yyyy-MM-dd HH:mm:ss") + " ==="
    Add-Content -Path $log -Value $script:runMarker -ErrorAction SilentlyContinue
    $script:isRunning = $true
    $lblStatus.Text = "Status: backup iniciado em " + (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
    $progressBar.Value = 0
    $lblProgress.Text = "Progresso: 0/0 (0%)"
    $lblCurrent.Text = "Atual: -"
    $script:totalFromOutput = 0
    try {
        $script:guiOutPath = Join-Path $env:TEMP ("backupteste_gui_output_" + (Get-Date).ToString("yyyyMMdd_HHmmss") + ".log")
        $dir = Split-Path $script:guiOutPath
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        Set-Content -Path $script:guiOutPath -Value "" -Encoding ASCII
    } catch { }
    $cmdArgs = "/c call `"$scriptPath`" > `"$script:guiOutPath`" 2>&1"
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "cmd.exe"
    $psi.Arguments = $cmdArgs
    $psi.WorkingDirectory = (Split-Path $scriptPath)
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
    $script:backupProc = [System.Diagnostics.Process]::Start($psi)
    $btnRun.Enabled = $false
    $btnCancel.Enabled = $true
})
$form.Controls.Add($btnRun)

$btnCancel = New-Object System.Windows.Forms.Button
$btnCancel.Text = "Cancelar Backup"
$btnCancel.Size = New-Object System.Drawing.Size(120, 35)
$btnCancel.Location = New-Object System.Drawing.Point(180, 105)
$btnCancel.Enabled = $false
$btnCancel.Add_Click({
    if ($script:backupProc -and -not $script:backupProc.HasExited) {
        try {
            Start-Process -FilePath "taskkill.exe" -ArgumentList "/T", "/F", "/PID", $script:backupProc.Id -WindowStyle Hidden -Wait | Out-Null
        } catch {
            try { $script:backupProc.Kill() } catch { }
        }
    }
    $script:isRunning = $false
    $lblStatus.Text = "Status: backup cancelado em " + (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
    $btnRun.Enabled = $true
    $btnCancel.Enabled = $false
})
$form.Controls.Add($btnCancel)

$btnOpenFolder = New-Object System.Windows.Forms.Button
$btnOpenFolder.Text = "Abrir Pasta"
$btnOpenFolder.Size = New-Object System.Drawing.Size(120, 35)
$btnOpenFolder.Location = New-Object System.Drawing.Point(320, 105)
$btnOpenFolder.Add_Click({
    $path = Get-BackupPath -batPath $scriptPath
    if (-not $path) {
        [System.Windows.Forms.MessageBox]::Show("Nao foi possivel identificar a pasta de backup.", "Aviso", "OK", "Warning") | Out-Null
        return
    }
    if (-not (Ensure-UNC -backupPath $path)) {
        [System.Windows.Forms.MessageBox]::Show("Sem acesso ao caminho de backup.`n$path", "Aviso", "OK", "Warning") | Out-Null
        return
    }
    Start-Process -FilePath "explorer.exe" -ArgumentList "`"$path`""
})
$form.Controls.Add($btnOpenFolder)

$btnOpenLog = New-Object System.Windows.Forms.Button
$btnOpenLog.Text = "Abrir Log"
$btnOpenLog.Size = New-Object System.Drawing.Size(120, 35)
$btnOpenLog.Location = New-Object System.Drawing.Point(460, 105)
$btnOpenLog.Add_Click({
    $path = Get-BackupPath -batPath $scriptPath
    if (-not $path) {
        [System.Windows.Forms.MessageBox]::Show("Nao foi possivel identificar o log.", "Aviso", "OK", "Warning") | Out-Null
        return
    }
    if (-not (Ensure-UNC -backupPath $path)) {
        [System.Windows.Forms.MessageBox]::Show("Sem acesso ao caminho de backup.`n$path", "Aviso", "OK", "Warning") | Out-Null
        return
    }
    $log = Join-Path $path "backup_log.txt"
    if (-not (Test-Path $log)) {
        [System.Windows.Forms.MessageBox]::Show("Log nao encontrado:`n$log", "Aviso", "OK", "Warning") | Out-Null
        return
    }
    Start-Process -FilePath "notepad.exe" -ArgumentList "`"$log`""
})
$form.Controls.Add($btnOpenLog)

$btnRefresh = New-Object System.Windows.Forms.Button
$btnRefresh.Text = "Atualizar"
$btnRefresh.Size = New-Object System.Drawing.Size(110, 30)
$btnRefresh.Location = New-Object System.Drawing.Point(100, 150)
$btnRefresh.Add_Click({
    $backupPath = Get-BackupPath -batPath $scriptPath
    $lblBackup.Text = "Pasta: " + ($(if ($backupPath) { $backupPath } else { "nao encontrada" }))
})
$form.Controls.Add($btnRefresh)

$btnFailures = New-Object System.Windows.Forms.Button
$btnFailures.Text = "Ver Falhas"
$btnFailures.Size = New-Object System.Drawing.Size(120, 30)
$btnFailures.Location = New-Object System.Drawing.Point(230, 150)
$btnFailures.Add_Click({
    $path = Get-BackupPath -batPath $scriptPath
    if (-not $path) {
        [System.Windows.Forms.MessageBox]::Show("Nao foi possivel identificar o log.", "Aviso", "OK", "Warning") | Out-Null
        return
    }
    $log = Join-Path $path "backup_log.txt"
    if (-not (Test-Path $log)) {
        [System.Windows.Forms.MessageBox]::Show("Log nao encontrado:`n$log", "Aviso", "OK", "Warning") | Out-Null
        return
    }
    $last = Get-LastFailures -logFile $log -maxLines 20
    if (-not $last -or $last.Count -eq 0) {
        [System.Windows.Forms.MessageBox]::Show("Nenhuma falha encontrada no log.", "Ultimas falhas", "OK", "Information") | Out-Null
        return
    }
    $msg = ($last -join "`r`n")
    [System.Windows.Forms.MessageBox]::Show($msg, "Ultimas falhas (20)", "OK", "Information") | Out-Null
})
$form.Controls.Add($btnFailures)

$btnClose = New-Object System.Windows.Forms.Button
$btnClose.Text = "Sair"
$btnClose.Size = New-Object System.Drawing.Size(100, 30)
$btnClose.Location = New-Object System.Drawing.Point(360, 150)
$btnClose.Add_Click({ $form.Close() })
$form.Controls.Add($btnClose)

$progressBar = New-Object System.Windows.Forms.ProgressBar
$progressBar.Location = New-Object System.Drawing.Point(20, 190)
$progressBar.Size = New-Object System.Drawing.Size(460, 18)
$progressBar.Minimum = 0
$progressBar.Maximum = 100
$progressBar.Value = 0
$form.Controls.Add($progressBar)

$lblProgress = New-Object System.Windows.Forms.Label
$lblProgress.Text = "Progresso: 0/0 (0%)"
$lblProgress.AutoSize = $true
$lblProgress.Location = New-Object System.Drawing.Point(20, 215)
$form.Controls.Add($lblProgress)

$lblCurrent = New-Object System.Windows.Forms.Label
$lblCurrent.Text = "Atual: -"
$lblCurrent.AutoSize = $true
$lblCurrent.Location = New-Object System.Drawing.Point(20, 235)
$form.Controls.Add($lblCurrent)

$lblStatus = New-Object System.Windows.Forms.Label
$lblStatus.Text = "Status: pronto"
$lblStatus.AutoSize = $true
$lblStatus.Location = New-Object System.Drawing.Point(20, 255)
$form.Controls.Add($lblStatus)

$lblFooter = New-Object System.Windows.Forms.Label
$lblFooter.Text = "Desenvolvido por Erick Souza"
$lblFooter.AutoSize = $true
$lblFooter.ForeColor = [System.Drawing.Color]::FromArgb(96,96,96)
$lblFooter.Location = New-Object System.Drawing.Point(20, 280)
$form.Controls.Add($lblFooter)

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 2000
$timer.Add_Tick({
    if (-not $script:isRunning) { return }
    if (-not (Test-Path $script:guiOutPath)) { return }
    $lines = Get-Content -Path $script:guiOutPath -ErrorAction SilentlyContinue
    if (-not $lines) { return }

    $recent = $lines
    $maxIndex = 0
    foreach ($line in $recent) {
        if ($line -match '=\s*\[(\d+)\]\s*=') {
            $n = [int]$matches[1]
            if ($n -gt $maxIndex) { $maxIndex = $n }
        }
    }
    if ($script:totalFromOutput -eq 0) {
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match '^Total de linhas no arquivo') {
                for ($j = $i + 1; $j -lt $lines.Count; $j++) {
                    if ($lines[$j] -match '^\s*(\d+)\s*$') {
                        $count = [int]$matches[1]
                        if ($count -gt 2) { $script:totalFromOutput = $count - 2 }
                        break
                    }
                }
                if ($script:totalFromOutput -gt 0) { break }
            }
        }
    }
    $total = $script:totalFromOutput
    $pct = 0
    if ($total -gt 0) {
        $pct = [math]::Min([math]::Floor(($maxIndex * 100) / $total), 100)
    }
    $lblProgress.Text = "Progresso: " + $maxIndex + "/" + $total + " (" + $pct + "%)"
    if ($total -gt 0) {
        $progressBar.Value = $pct
    }

    $currentName = $null
    $currentIP = $null
    for ($i = $recent.Count - 1; $i -ge 0; $i--) {
        if (-not $currentIP -and $recent[$i] -match '^IP:\s*(\d{1,3}\.){3}\d{1,3}') {
            $currentIP = ($recent[$i] -replace '^IP:\s*', '').Trim()
        }
        if (-not $currentName -and $recent[$i] -match '^Impressora:\s*') {
            $currentName = ($recent[$i] -replace '^Impressora:\s*', '').Trim()
        }
        if ($currentIP -and $currentName) { break }
    }
    if ($currentName -or $currentIP) {
        if (-not $currentName) { $currentName = "-" }
        if (-not $currentIP) { $currentIP = "-" }
        $lblCurrent.Text = "Atual: " + $currentName + " (" + $currentIP + ")"
    }

    $done = $recent | Where-Object { $_ -match 'RESUMO DO BACKUP|Total de impressoras processadas' }
    if ($done -and $done.Count -gt 0) {
        $finalTotal = $null
        for ($i = $recent.Count - 1; $i -ge 0; $i--) {
            if ($recent[$i] -match 'Total de impressoras processadas:\s*(\d+)') {
                $finalTotal = [int]$matches[1]
                break
            }
        }
        if ($finalTotal -and $finalTotal -gt 0) {
            $script:totalFromOutput = $finalTotal
            $lblProgress.Text = "Progresso: " + $finalTotal + "/" + $finalTotal + " (100%)"
            $progressBar.Value = 100
        }
        $script:isRunning = $false
        $lblStatus.Text = "Status: backup concluido em " + (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
        $btnRun.Enabled = $true
        $btnCancel.Enabled = $false
    }
})
$timer.Start()

[void]$form.ShowDialog()
