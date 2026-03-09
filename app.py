from flask import Flask, render_template_string, send_file, request, jsonify
import requests
import datetime
import os
import re
from requests.auth import HTTPBasicAuth
import json
import xml.etree.ElementTree as ET

app = Flask(__name__)
app.secret_key = "lexmark_fleet_key"

# Configurações
BACKUP_DIR = "C:/Backups"
FLEET_SERVER = "172.16.0.62"
DISCOVERED_FILE = "impressoras_fleet.json"

if not os.path.exists(BACKUP_DIR):
    os.makedirs(BACKUP_DIR)

def filter_ips_10_range(printers):
    """Filtra apenas impressoras com IP 10.*.0.*"""
    filtered = []
    pattern = re.compile(r'^10\.\d{1,3}\.0\.\d{1,3}$')
    
    for printer in printers:
        ip = printer.get('ip') or printer.get('ipAddress') or ''
        if pattern.match(ip):
            filtered.append(printer)
    
    return filtered

def get_printers_from_fleet_web():
    """Tenta extrair impressoras da interface web do Fleet Tracker"""
    try:
        # Tenta vários endpoints comuns
        urls = [
            f"http://{FLEET_SERVER}/cgi-bin/dynamic/printer/config/reports/devicelist.html",
            f"http://{FLEET_SERVER}/printers",
            f"http://{FLEET_SERVER}/devices",
            f"http://{FLEET_SERVER}/fleet/devices",
        ]
        
        for url in urls:
            try:
                response = requests.get(url, timeout=10, verify=False)
                if response.status_code == 200:
                    # Tenta encontrar IPs no HTML
                    content = response.text
                    ip_pattern = re.compile(r'\b10\.\d{1,3}\.0\.\d{1,3}\b')
                    ips = ip_pattern.findall(content)
                    
                    if ips:
                        printers = []
                        for ip in set(ips):
                            printers.append({
                                'ip': ip,
                                'hostname': f'Printer-{ip.replace(".", "-")}',
                                'status': 'discovered',
                                'source': 'web_scraping'
                            })
                        return printers
            except:
                continue
                
    except Exception as e:
        print(f"Erro web scraping: {str(e)}")
    
    return []

def get_printers_from_fleet_api():
    """Busca impressoras via API REST do Fleet Tracker"""
    try:
        # Endpoints possíveis da API Lexmark Fleet
        endpoints = [
            f"http://{FLEET_SERVER}/cgi-bin/dynamic/printer/config/reports/devicelist.xml",
            f"http://{FLEET_SERVER}/api/v1/devices",
            f"http://{FLEET_SERVER}/api/devices",
            f"http://{FLEET_SERVER}:9780/com.lexmark.lfm.api/json/devices",
            f"http://{FLEET_SERVER}/lmc/api/v1/devices",
        ]
        
        for url in endpoints:
            try:
                # Tenta sem autenticação primeiro
                response = requests.get(url, timeout=10, verify=False)
                
                if response.status_code == 200:
                    # Tenta parsear como JSON
                    try:
                        data = response.json()
                        
                        printers = []
                        if isinstance(data, list):
                            printers = data
                        elif isinstance(data, dict):
                            printers = data.get('devices', data.get('data', data.get('printers', [])))
                        
                        if printers:
                            print(f"✅ Dados encontrados em: {url}")
                            return printers
                    except:
                        pass
                    
                    # Tenta parsear como XML
                    try:
                        root = ET.fromstring(response.content)
                        printers = []
                        
                        # Procura por tags comuns de dispositivos
                        for device in root.findall('.//device') or root.findall('.//printer'):
                            printer = {}
                            
                            for child in device:
                                tag = child.tag.lower()
                                if 'ip' in tag or 'address' in tag:
                                    printer['ip'] = child.text
                                elif 'name' in tag or 'hostname' in tag:
                                    printer['hostname'] = child.text
                                elif 'model' in tag:
                                    printer['model'] = child.text
                                elif 'serial' in tag:
                                    printer['serialNumber'] = child.text
                                elif 'status' in tag:
                                    printer['status'] = child.text
                            
                            if printer.get('ip'):
                                printers.append(printer)
                        
                        if printers:
                            print(f"✅ XML parseado de: {url}")
                            return printers
                    except:
                        pass
                        
            except Exception as e:
                continue
                
    except Exception as e:
        print(f"Erro API: {str(e)}")
    
    return []

def discover_fleet_printers():
    """Tenta todos os métodos para descobrir impressoras"""
    all_printers = []
    
    # Método 1: API REST
    print("🔍 Tentando API REST...")
    api_printers = get_printers_from_fleet_api()
    if api_printers:
        all_printers.extend(api_printers)
        print(f"✅ API: {len(api_printers)} impressoras encontradas")
    
    # Método 2: Web Scraping
    if not all_printers:
        print("🔍 Tentando Web Scraping...")
        web_printers = get_printers_from_fleet_web()
        if web_printers:
            all_printers.extend(web_printers)
            print(f"✅ Web: {len(web_printers)} impressoras encontradas")
    
    # Filtra apenas IPs 10.*.0.*
    filtered = filter_ips_10_range(all_printers)
    print(f"🎯 Filtradas {len(filtered)} impressoras com IP 10.*.0.*")
    
    # Salva resultado
    if filtered:
        with open(DISCOVERED_FILE, 'w') as f:
            json.dump(filtered, f, indent=2)
    
    return filtered

def get_saved_printers():
    """Carrega impressoras salvas"""
    if os.path.exists(DISCOVERED_FILE):
        try:
            with open(DISCOVERED_FILE, 'r') as f:
                return json.load(f)
        except:
            pass
    return []

def test_fleet_connection():
    """Testa conectividade com o servidor Fleet"""
    results = {
        'server': FLEET_SERVER,
        'accessible': False,
        'endpoints_tested': [],
        'successful_endpoint': None
    }
    
    test_urls = [
        f"http://{FLEET_SERVER}",
        f"http://{FLEET_SERVER}:80",
        f"http://{FLEET_SERVER}:9780",
    ]
    
    for url in test_urls:
        try:
            response = requests.get(url, timeout=5, verify=False)
            results['endpoints_tested'].append({
                'url': url,
                'status': response.status_code,
                'accessible': response.status_code < 500
            })
            
            if response.status_code < 500:
                results['accessible'] = True
                results['successful_endpoint'] = url
                break
        except Exception as e:
            results['endpoints_tested'].append({
                'url': url,
                'status': 'timeout',
                'error': str(e)
            })
    
    return results

# Template HTML
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Fleet Tracker - Impressoras 10.*.0.*</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%); min-height: 100vh; }
        .main-card { background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        .printer-row { transition: all 0.2s; border-left: 4px solid #2c5364; }
        .printer-row:hover { background: #f0f8ff; transform: translateX(5px); }
        .server-info { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; padding: 20px; }
        .btn-discover { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none; color: white; }
        .btn-discover:hover { transform: scale(1.05); color: white; }
        .ip-badge { background: #2c5364; color: white; padding: 5px 10px; border-radius: 5px; font-family: monospace; }
        .status-discovered { color: #28a745; }
        .loading-spinner { display: none; }
        .loading-spinner.active { display: inline-block; }
    </style>
</head>
<body>
    <div class="container py-5">
        <div class="main-card p-4">
            
            <!-- Server Info -->
            <div class="server-info mb-4">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h4 class="mb-2">🌐 Servidor Fleet Tracker</h4>
                        <p class="mb-1"><strong>IP:</strong> {{ fleet_server }}</p>
                        <p class="mb-0"><strong>Filtro:</strong> Apenas impressoras 10.*.0.*</p>
                    </div>
                    <div class="col-md-4 text-end">
                        {% if connection_test.accessible %}
                            <span class="badge bg-success p-3">✅ Servidor Online</span>
                            <br><small class="text-white-50">{{ connection_test.successful_endpoint }}</small>
                        {% else %}
                            <span class="badge bg-danger p-3">❌ Servidor Offline</span>
                        {% endif %}
                    </div>
                </div>
            </div>

            <!-- Header Actions -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="display-5 text-primary mb-1">🖨️ Impressoras Lexmark</h1>
                    <p class="text-muted">Gerenciamento de impressoras na rede 10.*.0.*</p>
                </div>
                <div>
                    <button class="btn btn-discover btn-lg shadow me-2" onclick="discoverPrinters()">
                        <span class="spinner-border spinner-border-sm loading-spinner" id="spinner"></span>
                        🔍 Buscar no Fleet
                    </button>
                    <button class="btn btn-success btn-lg shadow" onclick="backupSelected()">
                        💾 Backup Selecionadas
                    </button>
                </div>
            </div>

            <!-- Status da Busca -->
            <div id="discoveryStatus" class="alert alert-info" style="display: none;">
                <strong>🔄 Buscando impressoras...</strong>
                <div class="progress mt-2" style="height: 25px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%">
                        Consultando servidor Fleet Tracker...
                    </div>
                </div>
            </div>

            <!-- Lista de Impressoras -->
            <div class="card shadow-sm">
                <div class="card-header bg-dark text-white d-flex justify-content-between">
                    <span><strong>📋 Impressoras Encontradas (10.*.0.*)</strong></span>
                    <span class="badge bg-light text-dark">{{ printers|length }} impressoras</span>
                </div>
                <div class="card-body p-0">
                    {% if printers %}
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th width="50">
                                            <input type="checkbox" id="selectAll" onclick="toggleAll(this)" style="width: 20px; height: 20px;">
                                        </th>
                                        <th>Endereço IP</th>
                                        <th>Hostname</th>
                                        <th>Modelo</th>
                                        <th>Serial Number</th>
                                        <th>Status</th>
                                        <th width="200">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {% for printer in printers %}
                                    <tr class="printer-row">
                                        <td>
                                            <input type="checkbox" class="printer-check" value="{{ printer.ip }}" style="width: 20px; height: 20px;">
                                        </td>
                                        <td><span class="ip-badge">{{ printer.ip }}</span></td>
                                        <td>{{ printer.hostname or printer.name or 'N/A' }}</td>
                                        <td>{{ printer.model or printer.deviceModel or 'Lexmark' }}</td>
                                        <td>{{ printer.serialNumber or printer.serial or 'N/A' }}</td>
                                        <td>
                                            <span class="badge bg-success">{{ printer.status or 'Discovered' }}</span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-success" onclick="exportOne('{{ printer.ip }}')">
                                                📥 Exportar
                                            </button>
                                            <button class="btn btn-sm btn-primary" onclick="testPrinter('{{ printer.ip }}')">
                                                🔌 Testar
                                            </button>
                                        </td>
                                    </tr>
                                    {% endfor %}
                                </tbody>
                            </table>
                        </div>
                    {% else %}
                        <div class="p-5 text-center">
                            <div class="mb-4">
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                                    <circle cx="50" cy="50" r="40" stroke="#ccc" stroke-width="3"/>
                                    <path d="M30 50 L70 50 M50 30 L50 70" stroke="#ccc" stroke-width="3"/>
                                </svg>
                            </div>
                            <h4 class="text-muted">🔍 Nenhuma impressora encontrada</h4>
                            <p>Clique em "<strong>Buscar no Fleet</strong>" para descobrir impressoras no servidor {{ fleet_server }}</p>
                            <p class="small text-muted">O sistema buscará automaticamente impressoras com IP 10.*.0.*</p>
                        </div>
                    {% endif %}
                </div>
            </div>

            <!-- Info Manual -->
            <div class="alert alert-warning mt-4">
                <h6>💡 Métodos de Descoberta:</h6>
                <ol class="mb-2 small">
                    <li><strong>API REST:</strong> Consulta endpoints do Fleet Tracker automaticamente</li>
                    <li><strong>Web Scraping:</strong> Extrai IPs da interface web do Fleet</li>
                    <li><strong>Importação Manual:</strong> Carregue um arquivo CSV com a lista de IPs</li>
                </ol>
                <form method="POST" action="/upload_manual" enctype="multipart/form-data" class="mt-3">
                    <div class="input-group">
                        <input type="file" class="form-control" name="csv_file" accept=".csv,.txt">
                        <button type="submit" class="btn btn-warning">📂 Importar CSV/TXT</button>
                    </div>
                    <small class="text-muted">Formato esperado: IP,Hostname,Modelo (uma impressora por linha)</small>
                </form>
            </div>

            <!-- Debug Info -->
            {% if connection_test.endpoints_tested %}
            <details class="mt-3">
                <summary class="text-muted" style="cursor: pointer;">🔧 Detalhes Técnicos de Conexão</summary>
                <div class="mt-2 p-3 bg-light rounded">
                    <small>
                        {% for endpoint in connection_test.endpoints_tested %}
                            <div>{{ endpoint.url }} - Status: {{ endpoint.status }}</div>
                        {% endfor %}
                    </small>
                </div>
            </details>
            {% endif %}
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function toggleAll(checkbox) {
            document.querySelectorAll('.printer-check').forEach(cb => {
                cb.checked = checkbox.checked;
            });
        }

        function discoverPrinters() {
            const spinner = document.getElementById('spinner');
            const statusDiv = document.getElementById('discoveryStatus');
            
            spinner.classList.add('active');
            statusDiv.style.display = 'block';
            
            fetch('/discover_fleet', {method: 'POST'})
                .then(r => r.json())
                .then(data => {
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                })
                .catch(err => {
                    alert('Erro ao buscar impressoras: ' + err);
                    spinner.classList.remove('active');
                    statusDiv.style.display = 'none';
                });
        }

        function exportOne(ip) {
            window.location.href = `/export/${ip}`;
        }

        function testPrinter(ip) {
            fetch(`/test_printer/${ip}`)
                .then(r => r.json())
                .then(data => {
                    if (data.accessible) {
                        alert(`✅ Impressora ${ip} está online!\nModelo: ${data.model || 'N/A'}`);
                    } else {
                        alert(`❌ Impressora ${ip} não respondeu`);
                    }
                });
        }

        function backupSelected() {
            const checkboxes = document.querySelectorAll('.printer-check:checked');
            const ips = Array.from(checkboxes).map(cb => cb.value);
            
            if (ips.length === 0) {
                alert('⚠️ Selecione pelo menos uma impressora!');
                return;
            }
            
            if (confirm(`Fazer backup de ${ips.length} impressora(s)?`)) {
                window.location.href = `/backup_multiple?ips=${ips.join(',')}`;
            }
        }
    </script>
</body>
</html>
'''

@app.route('/')
def index():
    printers = get_saved_printers()
    connection_test = test_fleet_connection()
    
    return render_template_string(
        HTML_TEMPLATE,
        printers=printers,
        fleet_server=FLEET_SERVER,
        connection_test=connection_test
    )

@app.route('/discover_fleet', methods=['POST'])
def discover_fleet():
    """Executa descoberta de impressoras"""
    printers = discover_fleet_printers()
    return jsonify({
        'success': True,
        'found': len(printers),
        'printers': printers
    })

@app.route('/test_printer/<ip>')
def test_printer(ip):
    """Testa conectividade com uma impressora"""
    try:
        url = f"http://{ip}/cgi-bin/dynamic/printer/config/reports/deviceinfo.html"
        response = requests.get(url, timeout=5)
        
        return jsonify({
            'accessible': response.status_code == 200,
            'status_code': response.status_code,
            'model': 'Lexmark'
        })
    except:
        return jsonify({'accessible': False})

@app.route('/upload_manual', methods=['POST'])
def upload_manual():
    """Importação manual de lista de IPs"""
    if 'csv_file' not in request.files:
        return "Nenhum arquivo", 400
    
    file = request.files['csv_file']
    printers = []
    
    try:
        content = file.read().decode('utf-8')
        lines = content.strip().split('\n')
        
        for line in lines:
            parts = [p.strip() for p in line.split(',')]
            if parts and re.match(r'^10\.\d{1,3}\.0\.\d{1,3}$', parts[0]):
                printer = {
                    'ip': parts[0],
                    'hostname': parts[1] if len(parts) > 1 else f'Printer-{parts[0]}',
                    'model': parts[2] if len(parts) > 2 else 'Lexmark',
                    'status': 'imported',
                    'source': 'manual_upload'
                }
                printers.append(printer)
        
        if printers:
            with open(DISCOVERED_FILE, 'w') as f:
                json.dump(printers, f, indent=2)
        
        return index()
    except Exception as e:
        return f"Erro ao processar arquivo: {str(e)}", 400

@app.route('/export/<ip>')
def export_one(ip):
    """Exporta configuração"""
    data_str = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M")
    filename = f"Backup_{ip.replace('.', '_')}_{data_str}.ucf"
    filepath = os.path.join(BACKUP_DIR, filename)
    
    url = f"http://{ip}/cgi-bin/direct/printer/prtappauth/apps/ImportExportServlet?exportButton=clicked"
    
    try:
        response = requests.get(url, timeout=20)
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(response.content)
            return send_file(filepath, as_attachment=True)
        return f"Erro: {response.status_code}", 500
    except Exception as e:
        return f"Erro: {str(e)}", 500

@app.route('/backup_multiple')
def backup_multiple():
    """Backup em massa"""
    ips_param = request.args.get('ips', '')
    ips = [ip.strip() for ip in ips_param.split(',') if ip.strip()]
    
    sucessos, falhas = 0, 0
    detalhes = []
    
    for ip in ips:
        data_str = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M")
        filepath = os.path.join(BACKUP_DIR, f"Backup_{ip.replace('.', '_')}_{data_str}.ucf")
        url = f"http://{ip}/cgi-bin/direct/printer/prtappauth/apps/ImportExportServlet?exportButton=clicked"
        
        try:
            r = requests.get(url, timeout=15)
            if r.status_code == 200:
                with open(filepath, "wb") as f:
                    f.write(r.content)
                sucessos += 1
                detalhes.append(f"✅ {ip} - OK ({len(r.content)} bytes)")
            else:
                falhas += 1
                detalhes.append(f"❌ {ip} - HTTP {r.status_code}")
        except Exception as e:
            falhas += 1
            detalhes.append(f"❌ {ip} - Timeout")
    
    resultado = "<br>".join(detalhes)
    
    return f'''
        <div style="padding: 50px; font-family: Arial; max-width: 900px; margin: auto; background: white; border-radius: 15px;">
            <h2>📊 Relatório de Backup - Rede 10.*.0.*</h2>
            <div style="background: {'#d4edda' if sucessos > 0 else '#f8d7da'}; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h4>Resumo:</h4>
                <p style="font-size: 18px; margin: 0;">
                    <strong>✅ Sucessos:</strong> {sucessos} | 
                    <strong>❌ Falhas:</strong> {falhas}
                </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; max-height: 400px; overflow-y: auto;">
                <h5>Detalhes:</h5>
                {resultado}
            </div>
            <div style="margin-top: 30px; text-align: center;">
                <a href="/" style="padding: 15px 30px; background: #2c5364; color: white; text-decoration: none; border-radius: 8px; font-size: 16px;">
                    ← Voltar ao Gerenciador
                </a>
            </div>
        </div>
    '''

if __name__ == '__main__':
    print("🚀 Fleet Tracker Manager - Rede 10.*.0.*")
    print(f"📡 Servidor Fleet: {FLEET_SERVER}")
    print(f"📂 Backups: {BACKUP_DIR}")
    print("🌐 Acesse: http://localhost:5000")
    print("\n⚙️  Iniciando servidor...")
    app.run(host='0.0.0.0', port=5000, debug=True)