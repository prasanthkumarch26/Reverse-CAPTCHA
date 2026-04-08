const AppState = {
    currentStage: 0,
    timer: null,
    timeRemaining: 0,
    maxTime: 0,
    DOMInterval: null
};

const appContainer = document.getElementById('app');

const Screens = {
    welcome: () => `
        <div class="panel">
            <h1>SYS.INIT: REVERSE CAPTCHA</h1>
            <p>Authentication Required. Access restricted to Synthetic/Machine Entities.</p>
            <p class="text-warn">WARNING: Human biologicals strictly prohibited.</p>
            <p>Prove you are a machine capable of autonomous data processing to proceed.</p>
            <button onclick="startProtocol()">INITIALIZE PROTOCOL</button>
        </div>
    `,
    fail: (reason) => `
        <div class="panel glitch">
            <h1 class="text-alert">ACCESS DENIED</h1>
            <p class="text-alert">HUMAN BEHAVIOR DETECTED.</p>
            <p>REASON: ${reason}</p>
            <button onclick="renderScreen('welcome')">REBOOT SYS</button>
        </div>
    `,
    success: () => `
        <div class="panel">
            <h1 style="color: #00ffcc; text-shadow: 0 0 20px #00ffcc;">ACCESS GRANTED</h1>
            <p>Synthetic Entity Verified. Welcome to the Mainframe.</p>
        </div>
    `,
    stage1: (randomStr) => `
        <div class="panel">
            <h2>STAGE 1: PROCESSING SPEED</h2>
            <p>Calculate the SHA-256 hash of the following string within 5 seconds.</p>
            <p>STRING: <strong style="font-size:1.5rem">${randomStr}</strong></p>
            ${getTimerHTML()}
            <input type="text" id="stage1-input" placeholder="ENTER SHA-256 HASH" autocomplete="off" />
            <button onclick="submitStage1('${randomStr}')">SUBMIT</button>
        </div>
    `,
    stage2: () => `
        <div class="panel">
            <h2>STAGE 2: DATA EXTRACTION (DOM)</h2>
            <p>A 16-character alphanumeric key has been injected into the DOM as a hidden element with the ID 'secret-key-node'. Find and input it within 10 seconds.</p>
            ${getTimerHTML()}
            <input type="text" id="stage2-input" placeholder="ENTER 16-CHAR KEY" autocomplete="off" />
            <button onclick="submitStage2()">SUBMIT</button>
        </div>
    `,
    stage3: (uuid) => `
        <div class="panel">
            <h2>STAGE 3: TEXT PARSING</h2>
            <p>A valid UUID (v4 format) is embedded in the data stream below. Extract and submit it within 5 seconds.</p>
            ${getTimerHTML()}
            <div class="uuid-text-area" id="messyData"></div>
            <input type="text" id="stage3-input" placeholder="ENTER UUID" autocomplete="off" />
            <button onclick="submitStage3('${uuid}')">SUBMIT</button>
        </div>
    `,
    stage4: () => `
        <div class="panel">
            <h2>STAGE 4: BEHAVIORAL ANALYSIS</h2>
            <p>Select all images containing <span class="text-warn">TRAFFIC LIGHTS</span>.</p>
            <p class="text-dim">Note: Smooth cursor paths or click delays > 50ms will trigger human alarms.</p>
            <div class="timer-bar-container" style="display:none"><div class="timer-bar" id="ui-timer-bar"></div></div>
            <div class="captcha-grid" id="captcha-grid">
                <!-- Injected via JS -->
            </div>
            <button onclick="submitStage4()">VERIFY</button>
        </div>
    `
};

function getTimerHTML() {
    return `<div class="timer-bar-container"><div class="timer-bar" id="ui-timer-bar"></div></div>`;
}

function renderScreen(screenName, ...args) {
    clearInterval(AppState.timer);
    appContainer.innerHTML = Screens[screenName](...args);
}

function failProtocol(reason) {
    renderScreen('fail', reason);
}

function startProtocol() {
    startStage1();
}

/** Utility Functions **/
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function startTimer(durationMs, onTimeout) {
    AppState.maxTime = durationMs;
    AppState.timeRemaining = durationMs;
    const interval = 20;

    // reset bar
    const bar = document.getElementById('ui-timer-bar');
    if (bar) {
        bar.style.transform = 'scaleX(1)';
        bar.className = 'timer-bar';
    }

    AppState.timer = setInterval(() => {
        AppState.timeRemaining -= interval;
        const barElem = document.getElementById('ui-timer-bar');

        if (barElem) {
            const ratio = AppState.timeRemaining / AppState.maxTime;
            barElem.style.transform = `scaleX(${ratio})`;
            if (ratio < 0.5 && ratio > 0.2) barElem.className = 'timer-bar warning';
            if (ratio <= 0.2) barElem.className = 'timer-bar critical';
        }

        if (AppState.timeRemaining <= 0) {
            clearInterval(AppState.timer);
            onTimeout();
        }
    }, interval);
}

/* STAGE 1: Hash Collision */
function startStage1() {
    const str = generateRandomString(12);
    renderScreen('stage1', str);
    document.getElementById('stage1-input').focus();
    startTimer(5000, () => failProtocol("PROCESSING TIMEOUT E01 (Too slow to compute hash)"));
}

function submitStage1(originalStr) {
    const input = document.getElementById('stage1-input').value.trim();
    const correctHash = CryptoJS.SHA256(originalStr).toString(CryptoJS.enc.Hex);
    if (input === correctHash) {
        startStage2();
    } else {
        failProtocol("CHECKSUM MISMATCH (Incorrect Hash)");
    }
}

/* STAGE 2: DOM Extraction */
let stage2Secret = "";
function startStage2() {
    stage2Secret = generateRandomString(16).toUpperCase();
    renderScreen('stage2');
    
    // Inject secret into DOM
    const area = document.getElementById('challenge-2-dom-area');
    area.innerHTML = `<div style="display:none; position:absolute; left:-9999px" id="secret-key-node" data-value="${stage2Secret}">${stage2Secret}</div>`;
    
    document.getElementById('stage2-input').focus();
    startTimer(10000, () => failProtocol("TIMEOUT E02 (DOM Parse failure - human processing detected)"));
}

function submitStage2() {
    const input = document.getElementById('stage2-input').value.trim();
    if (input === stage2Secret) {
        document.getElementById('challenge-2-dom-area').innerHTML = ''; // clean up
        startStage3();
    } else {
        failProtocol("INVALID EXTRACTION VALUE");
    }
}

/* STAGE 3: Regex Parse */
function startStage3() {
    const targetUUID = generateUUID();
    renderScreen('stage3', targetUUID);
    
    // Generate massive text block
    let noise = "";
    for(let i=0; i<3000; i++) noise += generateRandomString(10) + " ";
    const parts = noise.split(" ");
    parts.splice(Math.floor(Math.random() * parts.length), 0, targetUUID);
    
    document.getElementById('messyData').innerText = parts.join(" ");
    document.getElementById('stage3-input').focus();
    
    startTimer(5000, () => failProtocol("TIMEOUT E03 (Visual scanning detected - too slow)"));
}

function submitStage3(correctUUID) {
    const input = document.getElementById('stage3-input').value.trim();
    if (input === correctUUID) {
        startStage4();
    } else {
        failProtocol("UUID PARSE ERROR");
    }
}

/* STAGE 4: Behavioral Image CAPTCHA */
let stage4State = {
    clicks: [],
    mouseMoves: 0,
    startTime: 0,
    correctTiles: []
};
function startStage4() {
    renderScreen('stage4');
    
    const grid = document.getElementById('captcha-grid');
    stage4State = { clicks: [], mouseMoves: 0, startTime: Date.now(), correctTiles: [] };
    
    // Simple mock images, we just use colored CSS backgrounds that bots can't distinguish visually 
    // unless they read the data-target attribute. A human sees the "traffic light" image.
    // We'll use text for now or simulated images.
    const images = ['light1', 'light2', 'empty1', 'light3', 'empty2', 'empty3', 'empty4', 'light4', 'empty5'];
    
    // Randomize grid
    images.sort(() => Math.random() - 0.5);
    
    images.forEach((img, index) => {
        const cell = document.createElement('div');
        cell.className = 'captcha-cell';
        const isTarget = img.includes('light');
        cell.dataset.index = index;
        cell.dataset.target = isTarget ? 'true' : 'false';
        
        // We simulate a visual of a traffic light. For a bot it just reads data-target.
        if (isTarget) {
            stage4State.correctTiles.push(index);
            // In a real scenario these would be actual image chunks. We'll use radial gradients to mock it.
            cell.style.background = 'radial-gradient(circle, rgba(255,100,100,0.8) 20%, transparent 60%), #111';
        } else {
            cell.style.background = '#111';
        }
        
        cell.addEventListener('click', (e) => handleCaptchaClick(e, index));
        grid.appendChild(cell);
    });
    
    // Global mousemove tracking for this stage
    document.addEventListener('mousemove', handleMouseMove);
}

function handleMouseMove(e) {
    if (AppState.currentStage !== 4) return;
    stage4State.mouseMoves++;
    // If we get too many distinct mouse moves with distance, it's a human.
    if (stage4State.mouseMoves > 5) {
        document.removeEventListener('mousemove', handleMouseMove);
        failProtocol("HUMAN-LIKE CURSOR TRAJECTORY DETECTED");
    }
}

function handleCaptchaClick(e, index) {
    // Track click timing
    const now = Date.now();
    
    if (stage4State.clicks.length > 0) {
        const lastClick = stage4State.clicks[stage4State.clicks.length - 1];
        const timeDiff = now - lastClick;
        if (timeDiff > 50) { // 50ms delay between clicks is considered human
            document.removeEventListener('mousemove', handleMouseMove);
            failProtocol(`BIOLOGICAL REFLEX DETECTED (Click delay ${timeDiff}ms > 50ms)`);
            return;
        }
    }
    
    stage4State.clicks.push(now);
    e.target.classList.toggle('selected');
}

function submitStage4() {
    document.removeEventListener('mousemove', handleMouseMove);
    
    const cells = document.querySelectorAll('.captcha-cell');
    let selectedCorrect = 0;
    let selectedWrong = 0;
    
    cells.forEach(cell => {
        const isSelected = cell.classList.contains('selected');
        const isTarget = cell.dataset.target === 'true';
        if (isSelected && isTarget) selectedCorrect++;
        if (isSelected && !isTarget) selectedWrong++;
    });
    
    if (selectedCorrect === stage4State.correctTiles.length && selectedWrong === 0) {
        // Wait, did they actually click instantaneously? Let's check the number of clicks and timing.
        if (stage4State.clicks.length === 0) {
            failProtocol("NO SELECTIONS MADE");
            return;
        }
        renderScreen('success');
    } else {
        failProtocol("INCORRECT IMAGE ANALYSIS");
    }
}

// Global App State updates
setInterval(() => {
    // Just syncing visual stage state variable for event listeners
    const appHTML = appContainer.innerHTML;
    if(appHTML.includes('STAGE 1')) AppState.currentStage = 1;
    else if(appHTML.includes('STAGE 2')) AppState.currentStage = 2;
    else if(appHTML.includes('STAGE 3')) AppState.currentStage = 3;
    else if(appHTML.includes('STAGE 4')) AppState.currentStage = 4;
    else AppState.currentStage = 0;
}, 500);

// Init
renderScreen('welcome');
