// Color modes
const THEME_COLORS = [
    ['#2c3e50', '#34495e'], // Professional Blue
    ['#1976d2', '#1e88e5'], // Bright Blue
    ['#E64A6F', '#FF8DA1'], // Pink
    ['#d32f2f', '#e53935'], // Red
    ['#388e3c', '#43a047'], // Green
    ['#512da8', '#5e35b1'], // Purple
];

let loadedSystemPrompt = "";

// All Doms
document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const themeSwitcher = document.getElementById('theme-switcher');
    const creditsBtn = document.getElementById('credits-btn');
    const themeColorButton = document.getElementById('theme-color-button');
    const themeColorPreview = document.getElementById('theme-color-preview');
    const colorPalettePopup = document.getElementById('color-palette-popup');
    const colorPalette = document.getElementById('color-palette');
    const colorPickerWrapper = document.querySelector('.color-picker-wrapper');

    // Input Elements
    const apiKeyInput = document.getElementById('api-key');
    const modelSelect = document.getElementById('model-select');
    const imageUploader = document.getElementById('image-uploader');
    const pdfFileInput = document.getElementById('pdf-file-input');
    const jobDescInput = document.getElementById('job-description');
    const enhanceBtn = document.getElementById('enhance-btn');

    // State
    let pdfFileBase64 = null;
    let pdfFileName = '';

    async function init() {
        // Load Prompt
        try {
            const response = await fetch('systemPrompt.txt');
            if (!response.ok) throw new Error('Could not load systemPrompt.txt');
            loadedSystemPrompt = await response.text();
            console.log("System Prompt loaded successfully.");
        } catch (error) {
            console.error("Error loading system prompt:", error);
            alert("Error: Could not load systemPrompt.txt. Ensure you are running this on a local server.");
        }

        //  UI Setup
        updateModelOptions();
        loadTheme();
        loadAccentColor();
        setupColorPicker();

        //Reset Button State
        enhanceBtn.innerHTML = `<i class="fas fa-magic"></i> Enhance Resume`;
    }

    function updateModelOptions() {
        modelSelect.innerHTML = `
            <option value="gemini-3-pro-preview">Gemini 3.0 Pro Preview</option>
            <option value="gemini-3-flash-preview">Gemini 3.0 Flash Preview</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
        `;
    }

    function loadTheme() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        document.body.classList.toggle('dark-mode', isDarkMode);
        themeSwitcher.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    function toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        themeSwitcher.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    function loadAccentColor() {
        const savedBase = localStorage.getItem('accentColor') || THEME_COLORS[0][0];
        const savedHover = localStorage.getItem('accentHoverColor') || THEME_COLORS[0][1];
        applyAccentColor(savedBase, savedHover);
    }

    function setupColorPicker() {
        colorPalette.innerHTML = '';
        THEME_COLORS.forEach(([baseColor, hoverColor]) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = baseColor;
            swatch.addEventListener('click', () => {
                applyAccentColor(baseColor, hoverColor);
                localStorage.setItem('accentColor', baseColor);
                localStorage.setItem('accentHoverColor', hoverColor);
                colorPalettePopup.classList.add('hidden');
            });
            colorPalette.appendChild(swatch);
        });
    }

    function applyAccentColor(base, hover) {
        document.documentElement.style.setProperty('--accent-color', base);
        document.documentElement.style.setProperty('--accent-hover', hover);
        themeColorPreview.style.backgroundColor = base;
    }

    // Handle the file
    function handleFile(file) {
        if (!file) return;

        if (file.type === 'application/pdf') {
            if (file.size > 5 * 1024 * 1024) {
                alert("PDF is too large. Please keep it under 5MB.");
                return;
            }

            pdfFileName = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                pdfFileBase64 = e.target.result.split(',')[1];
                imageUploader.classList.add('has-file');
                imageUploader.innerHTML = `
                    <i class="fas fa-check-circle fa-3x" style="color: var(--accent-color); margin-bottom: 10px;"></i>
                    <p style="font-weight: bold; color: var(--primary-text);">${file.name}</p>
                    <span style="font-size: 0.8rem; opacity: 0.6;">Click to change</span>
                `;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid PDF file.");
        }
    }

    // API
    async function handleEnhance() {
        //Validation
        const apiKey = apiKeyInput.value.trim();
        const model = modelSelect.value;
        const jobDesc = jobDescInput.value.trim();

        if (!apiKey) { alert("Please enter your Gemini API Key."); return; }
        if (!pdfFileBase64) { alert("Please upload your Resume PDF."); return; }
        if (!jobDesc) { alert("Please enter the Job Description."); return; }
        if (!loadedSystemPrompt) { alert("System prompt is not loaded. Please refresh the page."); return; }

        const resultWindow = window.open("", "_blank");

        if (!resultWindow) {
            alert("Pop-up blocked! Please allow pop-ups for this site to view your resume.");
            return;
        }

        resultWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Enhancing Resume...</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f4f4f9;
                        margin: 0;
                        color: #333;
                    }
                    .loading-card {
                        background: white;
                        padding: 40px;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        text-align: center;
                        max-width: 400px;
                    }
                    h2 { margin-top: 0; color: #2c3e50; font-size: 24px; }
                    p { color: #666; margin-bottom: 25px; }
                    
                    /* SPINNER ANIMATION */
                    .spinner {
                        border: 4px solid #f3f3f3; /* Light grey */
                        border-top: 4px solid #2c3e50; /* Dark Blue */
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        animation: spin 1s linear infinite;
                        margin: 0 auto;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div class="loading-card">
                    <h2>AI is working...</h2>
                    <p>Analyzing your resume and matching it to the job description.</p>
                    <div class="spinner"></div>
                    <p style="font-size: 0.8rem; margin-top: 20px; opacity: 0.7;">This may take up to 30 seconds.</p>
                </div>
            </body>
            </html>
        `);

        // UI Loading State (Main Page)
        enhanceBtn.disabled = true;
        enhanceBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;

        try {
            const fullUserPrompt = `
            TARGET JOB DESCRIPTION:
            ${jobDesc}
            
            INSTRUCTION:
            Using the System Prompt rules provided, rewrite the attached PDF resume into the HTML format.
            `;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: loadedSystemPrompt }] },
                    contents: [{
                        role: "user",
                        parts: [
                            { text: fullUserPrompt },
                            { inline_data: { mime_type: "application/pdf", data: pdfFileBase64 } }
                        ]
                    }],
                    generation_config: {
                        temperature: 0.7,
                        maxOutputTokens: 8192
                    }
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || `API Error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.candidates || data.candidates.length === 0) {
                throw new Error("AI returned no results. The prompt might have been blocked by safety filters.");
            }

            let generatedHTML = data.candidates[0].content.parts[0].text;

            // Cleanup Markdown
            generatedHTML = generatedHTML.replace(/```html/g, '').replace(/```/g, '').trim();
            if (!resultWindow.closed) {
                resultWindow.document.open();
                resultWindow.document.write(generatedHTML);
                resultWindow.document.close();
            } else {
                alert("The result window was closed before the resume finished generating.");
            }

        } catch (error) {
            console.error(error);
            if (resultWindow && !resultWindow.closed) {
                resultWindow.document.body.innerHTML = `
                    <div style="color: #d9534f; padding: 20px; text-align: center; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
                        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                            <h3 style="margin-top:0;">Generation Failed</h3>
                            <p>${error.message}</p>
                            <button onclick="window.close()" style="padding: 10px 20px; cursor: pointer; background: #333; color: white; border: none; border-radius: 4px;">Close Window</button>
                        </div>
                    </div>
                `;
            } else {
                alert(`Error: ${error.message}`);
            }
        } finally {
            enhanceBtn.disabled = false;
            enhanceBtn.innerHTML = `<i class="fas fa-magic"></i> Enhance Resume`;
        }
    }

    themeSwitcher.addEventListener('click', toggleTheme);
    creditsBtn.addEventListener('click', () => alert('Resume Enhancer AI\n©2025 Joshua Z. All Rights Reserved.'));


    themeColorButton.addEventListener('click', (e) => {
        e.stopPropagation();
        colorPalettePopup.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
        if (!colorPickerWrapper.contains(e.target)) colorPalettePopup.classList.add('hidden');
    });

    // File Input Events
    pdfFileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    // Drag & Drop Events
    imageUploader.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploader.classList.add('dragover');
    });
    imageUploader.addEventListener('dragleave', () => {
        imageUploader.classList.remove('dragover');
    });
    imageUploader.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploader.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });

    enhanceBtn.addEventListener('click', handleEnhance);

    //Starto
    init();
});