document.addEventListener('DOMContentLoaded', () => {
    // 초기 로드시 상태 확인
    checkToolStatus();
});

// 주기적으로 상태 확인 (예: 10초마다)
setInterval(checkToolStatus, 10000);

async function checkToolStatus() {
    const badge = document.getElementById('status-badge');
    
    try {
        const response = await fetch('/api/tool/status');
        if (response.ok) {
            const data = await response.json();
            badge.textContent = `${data.toolName} v${data.version} - ${data.status}`;
            badge.className = 'badge online';
        } else {
            throw new Error('Status fetch failed');
        }
    } catch (error) {
        badge.textContent = 'Tool Offline / Unreachable';
        badge.className = 'badge offline';
        addLog('Failed to fetch tool status: ' + error.message, 'error');
    }
}

async function sendCommand(command) {
    addLog(`Sending command: [${command}]...`);
    
    try {
        const response = await fetch('/api/tool/command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ command: command })
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
            addLog(`Success: ${data.message}`);
        } else {
            addLog(`Error: ${data.message || 'Unknown error occurred'}`, 'error');
        }
        
        // 상태를 다시 한번 확인
        setTimeout(checkToolStatus, 500);
        
    } catch (error) {
        addLog(`Request failed: ${error.message}`, 'error');
    }
}

function addLog(message, type = 'info') {
    const logOutput = document.getElementById('log-output');
    const logEntry = document.createElement('p');
    
    const timeString = new Date().toLocaleTimeString();
    const timeSpan = document.createElement('span');
    timeSpan.className = 'log-time';
    timeSpan.textContent = `[${timeString}]`;
    
    logEntry.appendChild(timeSpan);
    
    const textNode = document.createTextNode(` ${message}`);
    logEntry.appendChild(textNode);
    
    if (type === 'error') {
        logEntry.style.color = '#e57373';
    }
    
    logOutput.appendChild(logEntry);
    
    // Auto-scroll to bottom
    logOutput.scrollTop = logOutput.scrollHeight;
}
