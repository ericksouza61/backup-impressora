param(
    [string]$PrinterIp,
    [string]$PrinterName,
    [string]$OutputPath,
    [string]$LogFile
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($PrinterIp) -or
    [string]::IsNullOrWhiteSpace($PrinterName) -or
    [string]::IsNullOrWhiteSpace($OutputPath)) {
    throw "Uso: Backup-Pantum.ps1 <PrinterIp> <PrinterName> <OutputPath> [LogFile]"
}

try {
    [Net.ServicePointManager]::SecurityProtocol = `
        [Net.SecurityProtocolType]::Tls12 -bor `
        [Net.SecurityProtocolType]::Tls11 -bor `
        [Net.SecurityProtocolType]::Tls
} catch {
}

try {
    [System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
} catch {
}

function Write-LogLine {
    param([string]$Message)

    if ([string]::IsNullOrWhiteSpace($LogFile)) {
        return
    }

    try {
        Add-Content -LiteralPath $LogFile -Value $Message -Encoding UTF8
    } catch {
    }
}

function Decode-PantumBase64 {
    param([string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return ""
    }

    try {
        return [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($Text))
    } catch {
        return ""
    }
}

function Get-Page {
    param([string]$RelativePath)

    $relative = $RelativePath.TrimStart("/")

    foreach ($scheme in @("http", "https")) {
        $url = "{0}://{1}/{2}" -f $scheme, $PrinterIp, $relative

        try {
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 2 -TimeoutSec 8 -ErrorAction Stop
            if ($null -ne $response.Content) {
                return [pscustomobject]@{
                    Url     = $url
                    Scheme  = $scheme
                    Content = [string]$response.Content
                }
            }
        } catch {
        }
    }

    throw "Falha ao consultar $RelativePath em $PrinterIp"
}

function Get-OmValue {
    param(
        [string]$Content,
        [string]$Name
    )

    $pattern = "SN\.DATA\." + [regex]::Escape($Name) + "\s*=\s*new OM\('([^']*)'"
    $match = [regex]::Match($Content, $pattern)
    if (-not $match.Success) {
        return $null
    }

    return Decode-PantumBase64 $match.Groups[1].Value
}

function Get-ModuleItems {
    param([string]$Content)

    $chunks = New-Object System.Collections.Generic.List[string]
    $matches = [regex]::Matches($Content, "DecodeBase64\('([^']*)'\)")

    foreach ($match in $matches) {
        $decoded = Decode-PantumBase64 $match.Groups[1].Value
        if (-not [string]::IsNullOrWhiteSpace($decoded)) {
            $chunks.Add($decoded.Trim())
        }
    }

    if ($chunks.Count -eq 0) {
        return @()
    }

    $json = "[" + ($chunks -join ",") + "]"

    try {
        return @($json | ConvertFrom-Json -ErrorAction Stop)
    } catch {
        return @($chunks)
    }
}

$infoPage = Get-Page "/shtml/omDB.shtml?INFO"
$loginPage = Get-Page "/shtml/omDB.shtml?LOGIN"

$productName = Get-OmValue -Content $infoPage.Content -Name "omProductName"
$serialNumber = Get-OmValue -Content $infoPage.Content -Name "omSerialNumber"
$firmwareVersion = Get-OmValue -Content $infoPage.Content -Name "omFirmVersion"
$productIdText = Get-OmValue -Content $loginPage.Content -Name "omProductID"

if ([string]::IsNullOrWhiteSpace($productName) -or $productName -notmatch "Pantum") {
    throw "Equipamento em $PrinterIp nao foi reconhecido como Pantum"
}

$productId = 0
[void][int]::TryParse($productIdText, [ref]$productId)

$moduleSpecs = @(
    @{ Name = "ADDRBOOK";    Path = "/shtml/omWifiScanDB.shtml?ADDRBOOK" },
    @{ Name = "MAILINFO";    Path = "/shtml/omWifiScanDB.shtml?MAILINFO" },
    @{ Name = "MAILGROUP";   Path = "/shtml/omWifiScanDB.shtml?MAILGROUP" },
    @{ Name = "PHONEINFO";   Path = "/shtml/omWifiScanDB.shtml?PHONEINFO" },
    @{ Name = "PHONEGROUP";  Path = "/shtml/omWifiScanDB.shtml?PHONEGROUP" },
    @{ Name = "SMBINFO";     Path = "/shtml/omWifiScanDB.shtml?SMBINFO" },
    @{ Name = "FTPINFO";     Path = "/shtml/omWifiScanDB.shtml?FTPINFO" },
    @{ Name = "SCANQUICKSET";Path = "/shtml/omWifiScanDB.shtml?SCANQUICKSET" }
)

$modules = [ordered]@{}

foreach ($module in $moduleSpecs) {
    $page = Get-Page $module.Path
    $items = Get-ModuleItems $page.Content

    $modules[$module.Name] = [ordered]@{
        url   = $page.Url
        count = @($items).Count
        items = @($items)
    }
}

$snapshot = [ordered]@{
    captured_at      = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    ip               = $PrinterIp
    printer_name     = $PrinterName
    vendor           = "Pantum"
    product_name     = $productName
    product_id_dec   = $productId
    product_id_hex   = if ($productId -gt 0) { ("0x{0:X}" -f $productId) } else { $null }
    serial_number    = $serialNumber
    firmware_version = $firmwareVersion
    info_url         = $infoPage.Url
    login_url        = $loginPage.Url
    modules          = $modules
}

$outputDir = Split-Path -Path $OutputPath -Parent
if (-not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$json = $snapshot | ConvertTo-Json -Depth 8
Set-Content -LiteralPath $OutputPath -Value $json -Encoding UTF8

$moduleSummary = ($moduleSpecs | ForEach-Object {
    $name = $_.Name
    $count = $modules[$name].count
    "{0}={1}" -f $name, $count
}) -join " "

Write-LogLine ("[PANTUM] {0} - {1} - {2} - ID {3} - {4}" -f $PrinterName, $PrinterIp, $productName, $productIdText, $moduleSummary)
exit 0
