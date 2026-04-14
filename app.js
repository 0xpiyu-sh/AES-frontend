let currentMode = 'encrypt';
const API_URL = 'http://127.0.0.1:5000/api/cipher'; // Ensure this matches your Flask port

function setMode(mode) {
    currentMode = mode;
    const tabEnc = document.getElementById('tab-encrypt');
    const tabDec = document.getElementById('tab-decrypt');
    const btn = document.getElementById('run-btn');
    const btnText = document.getElementById('btn-text');
    
    if (mode === 'encrypt') {
        tabEnc.classList.add('active'); tabDec.classList.remove('active');
        btn.classList.remove('decrypt-mode');
        btnText.textContent = 'Initialize Encryption';
        document.getElementById('text-label').textContent = 'Plaintext Input';
        document.getElementById('text-input').placeholder = 'Enter data packet to secure...';
    } else {
        tabDec.classList.add('active'); tabEnc.classList.remove('active');
        btn.classList.add('decrypt-mode');
        btnText.textContent = 'Execute Decryption';
        document.getElementById('text-label').textContent = 'Ciphertext Input';
        document.getElementById('text-input').placeholder = 'Enter payload to decode...';
    }
    
    document.getElementById('output-box').innerHTML = '<span class="placeholder">// Awaiting server execution...</span>';
}

async function executeCipher() {
    const keyword = document.getElementById('key-input').value;
    const text = document.getElementById('text-input').value;
    const errMsg = document.getElementById('error-msg');
    const outputBox = document.getElementById('output-box');
    const loader = document.getElementById('loader');
    const btnText = document.getElementById('btn-text');

    if (!keyword.trim() || !text.trim()) {
        errMsg.textContent = 'Validation Error: Keyword and text are required.';
        errMsg.style.display = 'block';
        return;
    }
    
    errMsg.style.display = 'none';
    btnText.style.display = 'none';
    loader.style.display = 'inline-block';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, keyword, mode: currentMode })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Server processing failed');
        }

        outputBox.textContent = data.result;
        outputBox.style.color = currentMode === 'encrypt' ? 'var(--primary)' : '#3b82f6';
        
        // Trigger subtle 3D background pulse via global function
        if(window.triggerBackgroundPulse) window.triggerBackgroundPulse(currentMode);

    } catch (error) {
        errMsg.textContent = error.message;
        errMsg.style.display = 'block';
        outputBox.innerHTML = '<span class="placeholder" style="color: var(--danger)">// Execution failed</span>';
    } finally {
        btnText.style.display = 'inline-block';
        loader.style.display = 'none';
    }
}

function copyToClipboard() {
    const txt = document.getElementById('output-box').textContent;
    if (txt.includes('Awaiting server execution') || txt.includes('Execution failed')) return;
    
    navigator.clipboard.writeText(txt).catch(() => {});
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy to Clipboard', 2000);
}