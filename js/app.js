// Global variables
const customFunctions = [];
const templates = {
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{PROJECT_NAME}}</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    {{LIBRARIES}}
  </head>
  <body>
    {{CUSTOM_SCRIPTS}}
    <script src="sketch.js"></script>
  </body>
</html>`,

  js: `function setup() {
  {{CANVAS_CREATE}}
}

function draw() {
  background({{BACKGROUND_COLOR}});
}`,

  css: `html, body {
  margin: 0;
  padding: 0;
}

canvas {
  display: block;
}`
};

// Template code snippets
const templateSnippets = {
  empty: {
    js: `function setup() {
  {{CANVAS_CREATE}}
}

function draw() {
  background({{BACKGROUND_COLOR}});
}`
  },
  particles: {
    js: `let particles = [];

function setup() {
  {{CANVAS_CREATE}}
}

function draw() {
  background({{BACKGROUND_COLOR}});
  
  // Create new particles
  if (frameCount % 5 === 0) {
    particles.push(new Particle(random(width), random(height)));
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    
    // Remove dead particles
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);
    this.size = random(5, 15);
    this.color = color(random(255), random(255), random(255));
    this.lifespan = 255;
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 2;
  }
  
  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.lifespan);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
  
  isDead() {
    return this.lifespan <= 0;
  }
}`
  },
  game: {
    js: `let player;
let obstacles = [];
let score = 0;

function setup() {
  {{CANVAS_CREATE}}
  player = new Player();
  
  // Create initial obstacles
  for (let i = 0; i < 5; i++) {
    obstacles.push(new Obstacle());
  }
}

function draw() {
  background({{BACKGROUND_COLOR}});
  
  // Display score
  fill(255);
  textSize(24);
  text('Score: ' + score, 20, 30);
  
  // Update and display player
  player.update();
  player.display();
  
  // Update and display obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].display();
    
    // Check for collision
    if (player.collidesWith(obstacles[i])) {
      gameOver();
    }
    
    // Remove obstacles that have gone off screen
    if (obstacles[i].isOffScreen()) {
      obstacles.splice(i, 1);
      score++;
      obstacles.push(new Obstacle());
    }
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    player.jump();
  }
}

function gameOver() {
  noLoop();
  fill(255, 0, 0);
  textSize(48);
  textAlign(CENTER, CENTER);
  text('GAME OVER', width/2, height/2);
  textSize(24);
  text('Score: ' + score, width/2, height/2 + 40);
  text('Press F5 to restart', width/2, height/2 + 80);
}

class Player {
  constructor() {
    this.pos = createVector(width * 0.2, height * 0.5);
    this.size = 30;
    this.velocity = 0;
    this.gravity = 0.6;
  }
  
  update() {
    this.velocity += this.gravity;
    this.pos.y += this.velocity;
    
    // Keep player on screen
    if (this.pos.y > height - this.size/2) {
      this.pos.y = height - this.size/2;
      this.velocity = 0;
    }
  }
  
  display() {
    fill(0, 255, 255);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
  
  jump() {
    if (this.pos.y >= height - this.size/2 - 5) {
      this.velocity = -15;
    }
  }
  
  collidesWith(obstacle) {
    let d = dist(this.pos.x, this.pos.y, obstacle.pos.x, obstacle.pos.y);
    return d < (this.size/2 + obstacle.size/2);
  }
}

class Obstacle {
  constructor() {
    this.pos = createVector(width + random(100), random(height * 0.3, height - 50));
    this.size = random(20, 40);
    this.speed = random(3, 7);
  }
  
  update() {
    this.pos.x -= this.speed;
  }
  
  display() {
    fill(255, 0, 0);
    rect(this.pos.x - this.size/2, this.pos.y - this.size/2, this.size, this.size);
  }
  
  isOffScreen() {
    return this.pos.x < -this.size;
  }
}`
  },
  visualization: {
    js: `let data = [];
let maxValue;

function setup() {
  {{CANVAS_CREATE}}
  
  // Generate random data
  for (let i = 0; i < 20; i++) {
    data.push(random(10, 100));
  }
  
  maxValue = max(data);
}

function draw() {
  background({{BACKGROUND_COLOR}});
  
  // Draw title
  fill(0);
  textSize(24);
  textAlign(CENTER);
  text('Data Visualization', width/2, 40);
  
  // Draw bars
  let barWidth = width / data.length;
  for (let i = 0; i < data.length; i++) {
    let barHeight = map(data[i], 0, maxValue, 0, height - 100);
    
    // Calculate color based on value
    let barColor = color(map(data[i], 0, maxValue, 50, 255), 100, 200);
    
    fill(barColor);
    rect(i * barWidth, height - barHeight - 50, barWidth - 2, barHeight);
    
    // Draw value
    fill(0);
    textSize(12);
    textAlign(CENTER);
    text(int(data[i]), i * barWidth + barWidth/2, height - barHeight - 55);
  }
  
  // Draw x-axis
  stroke(0);
  line(0, height - 50, width, height - 50);
}

// Regenerate data on mouse click
function mousePressed() {
  data = [];
  for (let i = 0; i < 20; i++) {
    data.push(random(10, 100));
  }
  maxValue = max(data);
}`
  }
};

// Library CDN URLs
const libraryUrls = {
  'p5': 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js',
  'p5-sound': 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min.js',
  'p5-gui': 'https://cdn.jsdelivr.net/npm/p5.gui@0.3.0/libraries/p5.gui.min.js',
  'p5-scenemanager': 'https://cdn.jsdelivr.net/npm/p5.scenemanager@1.1.0/lib/scenemanager.min.js',
  'p5-play': 'https://cdn.jsdelivr.net/npm/p5.play@3.5.5/p5play.js',
  'matter': 'https://cdn.jsdelivr.net/npm/matter-js@0.18.0/build/matter.min.js',
  'p5-particle': 'https://cdn.jsdelivr.net/npm/p5.particle-system@1.0.8/p5.particle.min.js',
  'p5-func': 'https://cdn.jsdelivr.net/npm/p5.func@0.1.0/p5.func.min.js',
  'p5-speech': 'https://cdn.jsdelivr.net/npm/p5.speech@0.0.3/lib/p5.speech.min.js',
  'ml5': 'https://cdn.jsdelivr.net/npm/ml5@0.12.2/dist/ml5.min.js',
  'p5-accessibility': 'https://cdn.jsdelivr.net/npm/p5-accessibility@0.1.1/dist/p5-accessibility.min.js',
  'p5-d3': 'https://cdn.jsdelivr.net/npm/p5.d3@0.1.1/p5.d3.min.js',
  'p5-chart': 'https://cdn.jsdelivr.net/npm/p5.js-svg@1.3.1/dist/p5.svg.min.js',
  'p5-graph': 'https://cdn.jsdelivr.net/npm/graphlib@2.1.8/dist/graphlib.min.js',
  'p5-3d': 'https://cdn.jsdelivr.net/npm/p5.3D@0.0.1/p5.3D.min.js',
  'p5-shader': 'https://cdn.jsdelivr.net/npm/p5.glitch@0.1.0/p5.glitch.min.js',
  'p5-easycam': 'https://cdn.jsdelivr.net/npm/p5.easycam@1.2.1/p5.easycam.min.js',
  'p5-touchgui': 'https://cdn.jsdelivr.net/npm/p5.touchgui@0.5.2/lib/p5.touchgui.min.js',
  'p5-serial': 'https://cdn.jsdelivr.net/npm/p5.serialserver@0.0.29/client/p5.serialport.js',
  'p5-midi': 'https://cdn.jsdelivr.net/npm/webmidi@2.5.3/webmidi.min.js',
  'p5-capture': 'https://cdn.jsdelivr.net/gh/tapioca24/p5.capture@1.0.0/dist/p5.capture.umd.min.js'
};

// DOM Elements
const projectNameInput = document.getElementById('project-name');
const canvasWidthInput = document.getElementById('canvas-width');
const canvasHeightInput = document.getElementById('canvas-height');
const canvasModeSelect = document.getElementById('canvas-mode');
const backgroundColorInput = document.getElementById('background-color');
const functionListContainer = document.getElementById('function-list');
const addFunctionBtn = document.getElementById('add-function');
const generateBtn = document.getElementById('generate-btn');
const previewLiveBtn = document.getElementById('preview-live-btn');
const openTemplateBtn = document.getElementById('open-template-btn');
const previewHtml = document.getElementById('preview-html');
const previewJs = document.getElementById('preview-js');
const previewCss = document.getElementById('preview-css');
const previewIframe = document.getElementById('preview-iframe');
const functionModal = document.getElementById('function-modal');
const templateModal = document.getElementById('template-modal');
const closeModalBtns = document.querySelectorAll('.close');
const saveFunctionBtn = document.getElementById('save-function');
const functionNameInput = document.getElementById('function-name');
const functionUrlInput = document.getElementById('function-url');
const functionCodeInput = document.getElementById('function-code');
const sourceTypeRadios = document.getElementsByName('source-type');
const tabButtons = document.querySelectorAll('.tab-btn');
const mainTabButtons = document.querySelectorAll('[data-main-tab]');
const templateCards = document.querySelectorAll('.template-card');
const selectTemplateBtn = document.getElementById('select-template');

// Current template
let currentTemplate = 'empty';

// Event Listeners
document.addEventListener('DOMContentLoaded', init);
addFunctionBtn.addEventListener('click', openFunctionModal);
closeModalBtns.forEach(btn => btn.addEventListener('click', closeModals));
saveFunctionBtn.addEventListener('click', saveFunction);
generateBtn.addEventListener('click', generateProject);
previewLiveBtn.addEventListener('click', updateLivePreview);
openTemplateBtn.addEventListener('click', openTemplateModal);
selectTemplateBtn.addEventListener('click', applySelectedTemplate);

// Main tab switching
mainTabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.getAttribute('data-main-tab');
    
    // Update active tab button
    mainTabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update active tab content
    document.querySelectorAll('.main-tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
  });
});

// Code tab switching
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.getAttribute('data-tab');
    
    // Update active tab button
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update active tab content
    document.querySelectorAll('.code-preview').forEach(tab => {
      tab.classList.remove('active');
    });
    document.getElementById(`preview-${tabId}`).classList.add('active');
  });
});

// Template card selection
templateCards.forEach(card => {
  card.addEventListener('click', () => {
    templateCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    currentTemplate = card.getAttribute('data-template');
  });
});

// Input change listeners for live preview
[projectNameInput, canvasWidthInput, canvasHeightInput, 
 canvasModeSelect, backgroundColorInput].forEach(input => {
  input.addEventListener('input', updatePreview);
});

// Library checkbox listeners
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', updatePreview);
});

// Initialize the app
function init() {
  updatePreview();
  
  // Show settings tab by default
  document.getElementById('settings-tab').classList.add('active');
  document.querySelector('[data-main-tab="settings"]').classList.add('active');
}

// Open the function modal
function openFunctionModal() {
  functionModal.style.display = 'block';
  functionNameInput.value = '';
  functionUrlInput.value = '';
  functionCodeInput.value = '';
  document.querySelector('input[name="source-type"][value="cdn"]').checked = true;
}

// Open the template modal
function openTemplateModal() {
  templateModal.style.display = 'block';
}

// Close all modals
function closeModals() {
  functionModal.style.display = 'none';
  templateModal.style.display = 'none';
}

// Apply the selected template
function applySelectedTemplate() {
  if (currentTemplate && templateSnippets[currentTemplate]) {
    updatePreview();
    closeModals();
  }
}

// Save a custom function
function saveFunction() {
  const name = functionNameInput.value.trim();
  const url = functionUrlInput.value.trim();
  const code = functionCodeInput.value.trim();
  const sourceType = document.querySelector('input[name="source-type"]:checked').value;
  
  if (!name) {
    alert('Please enter a function name');
    return;
  }
  
  if (sourceType === 'cdn' && !url) {
    alert('Please enter a CDN URL');
    return;
  }
  
  if (sourceType === 'inline' && !code) {
    alert('Please enter function code');
    return;
  }
  
  // Add to custom functions array
  customFunctions.push({
    name,
    url,
    code,
    sourceType
  });
  
  // Update function list UI
  updateFunctionList();
  
  // Update preview
  updatePreview();
  
  // Close modal
  closeModals();
}

// Update the function list UI
function updateFunctionList() {
  functionListContainer.innerHTML = '';
  
  if (customFunctions.length === 0) {
    functionListContainer.innerHTML = '<p>No custom functions added yet.</p>';
    return;
  }
  
  customFunctions.forEach((func, index) => {
    const item = document.createElement('div');
    item.className = 'function-item';
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = func.name;
    
    const typeSpan = document.createElement('span');
    typeSpan.textContent = func.sourceType === 'cdn' ? 'CDN' : 'Inline';
    
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      customFunctions.splice(index, 1);
      updateFunctionList();
      updatePreview();
    });
    
    item.appendChild(nameSpan);
    item.appendChild(typeSpan);
    item.appendChild(removeBtn);
    
    functionListContainer.appendChild(item);
  });
}

// Get the hex color without the # for p5.js
function getBackgroundColorForP5() {
  const hexColor = backgroundColorInput.value;
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// Update the preview
function updatePreview() {
  const projectName = projectNameInput.value || 'My p5.js Project';
  const canvasWidth = canvasWidthInput.value || 900;
  const canvasHeight = canvasHeightInput.value || 900;
  const canvasMode = canvasModeSelect.value;
  const backgroundColor = getBackgroundColorForP5();
  
  // Generate canvas creation code
  let canvasCreateCode = `createCanvas(${canvasWidth}, ${canvasHeight}`;
  if (canvasMode === 'webgl') {
    canvasCreateCode += ', WEBGL';
  }
  canvasCreateCode += ');';
  
  // Generate libraries HTML
  let librariesHtml = '';
  
  // Process all library checkboxes
  Object.keys(libraryUrls).forEach(key => {
    const elem = document.getElementById(`lib-${key}`);
    if (elem && elem.checked) {
      librariesHtml += `    <script src="${libraryUrls[key]}"></script>\n`;
    }
  });
  
  // Generate custom scripts HTML
  let customScriptsHtml = '';
  customFunctions.forEach(func => {
    if (func.sourceType === 'cdn') {
      customScriptsHtml += `    <script src="${func.url}"></script>\n`;
    } else {
      customScriptsHtml += `    <script>\n${func.code}\n    </script>\n`;
    }
  });
  
  // Update HTML preview
  let htmlPreview = templates.html
    .replace('{{PROJECT_NAME}}', projectName)
    .replace('{{LIBRARIES}}', librariesHtml.trim())
    .replace('{{CUSTOM_SCRIPTS}}', customScriptsHtml.trim());
  
  // Update JS preview based on selected template
  let jsTemplate = currentTemplate && templateSnippets[currentTemplate] ? 
                  templateSnippets[currentTemplate].js : 
                  templates.js;
  
  let jsPreview = jsTemplate
    .replace('{{CANVAS_CREATE}}', canvasCreateCode)
    .replace('{{BACKGROUND_COLOR}}', backgroundColor);
  
  // Update CSS preview
  let cssPreview = templates.css;
  
  // Set preview content with syntax highlighting
  previewHtml.textContent = htmlPreview;
  previewJs.textContent = jsPreview;
  previewCss.textContent = cssPreview;
  
  // Apply syntax highlighting
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block);
  });
}

// Update the live preview iframe
function updateLivePreview() {
  // Switch to the preview tab
  document.querySelector('[data-main-tab="preview"]').click();
  
  const projectName = projectNameInput.value || 'My p5.js Project';
  const canvasWidth = canvasWidthInput.value || 900;
  const canvasHeight = canvasHeightInput.value || 900;
  const canvasMode = canvasModeSelect.value;
  const backgroundColor = getBackgroundColorForP5();
  
  // Generate canvas creation code
  let canvasCreateCode = `createCanvas(${canvasWidth}, ${canvasHeight}`;
  if (canvasMode === 'webgl') {
    canvasCreateCode += ', WEBGL';
  }
  canvasCreateCode += ');';
  
  // Generate libraries HTML
  let librariesHtml = '';
  
  // Add all checked libraries
  Object.keys(libraryUrls).forEach(key => {
    const elem = document.getElementById(`lib-${key}`);
    if (elem && elem.checked) {
      librariesHtml += `<script src="${libraryUrls[key]}"></script>\n`;
    }
  });
  
  // Generate custom scripts HTML
  let customScriptsHtml = '';
  customFunctions.forEach(func => {
    if (func.sourceType === 'cdn') {
      customScriptsHtml += `<script src="${func.url}"></script>\n`;
    } else {
      // For inline functions, we'll create separate JS files
      const filename = `${func.name}.js`;
      zip.file(filename, func.code);
      customScriptsHtml += `<script src="${filename}"></script>\n`;
    }
  });
  
  // Get JS code based on selected template
  let jsTemplate = currentTemplate && templateSnippets[currentTemplate] ? 
                  templateSnippets[currentTemplate].js : 
                  templates.js;
  
  let jsCode = jsTemplate
    .replace('{{CANVAS_CREATE}}', canvasCreateCode)
    .replace('{{BACKGROUND_COLOR}}', backgroundColor);
  
  // Create a complete HTML document for the iframe
  const iframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${projectName} - Preview</title>
        <style>
          body { margin: 0; padding: 0; overflow: hidden; }
          canvas { display: block; }
        </style>
        ${librariesHtml}
        ${customScriptsHtml}
      </head>
      <body>
        <script>
          ${jsCode}
        </script>
      </body>
    </html>
  `;
  
  // Update the iframe content
  const iframe = document.getElementById('preview-iframe');
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(iframeContent);
  iframeDoc.close();
}

// Generate and download the project
function generateProject() {
  const projectName = projectNameInput.value || 'my-p5-project';
  const canvasWidth = canvasWidthInput.value || 900;
  const canvasHeight = canvasHeightInput.value || 900;
  const canvasMode = canvasModeSelect.value;
  const backgroundColor = getBackgroundColorForP5();
  
  // Create a new JSZip instance
  const zip = new JSZip();
  
  // Generate canvas creation code
  let canvasCreateCode = `createCanvas(${canvasWidth}, ${canvasHeight}`;
  if (canvasMode === 'webgl') {
    canvasCreateCode += ', WEBGL';
  }
  canvasCreateCode += ');';
  
  // Generate libraries HTML
  let librariesHtml = '';
  let librariesToFetch = [];
  
  // Process all library checkboxes
  Object.keys(libraryUrls).forEach(key => {
    const elem = document.getElementById(`lib-${key}`);
    if (elem && elem.checked) {
      const filename = `${key}.min.js`;
      librariesHtml += `    <script src="libraries/${filename}"></script>\n`;
      librariesToFetch.push({
        url: libraryUrls[key],
        filename: filename
      });
    }
  });
  
  // Generate custom scripts HTML
  let customScriptsHtml = '';
  customFunctions.forEach(func => {
    if (func.sourceType === 'cdn') {
      customScriptsHtml += `    <script src="${func.url}"></script>\n`;
    } else {
      // For inline functions, we'll create separate JS files
      const filename = `${func.name}.js`;
      zip.file(filename, func.code);
      customScriptsHtml += `    <script src="${filename}"></script>\n`;
    }
  });
  
  // Create HTML file
  const htmlContent = templates.html
    .replace('{{PROJECT_NAME}}', projectName)
    .replace('{{LIBRARIES}}', librariesHtml.trim())
    .replace('{{CUSTOM_SCRIPTS}}', customScriptsHtml.trim());
  
  zip.file('index.html', htmlContent);
  
  // Create JS file based on selected template
  let jsTemplate = currentTemplate && templateSnippets[currentTemplate] ? 
                  templateSnippets[currentTemplate].js : 
                  templates.js;
  
  const jsContent = jsTemplate
    .replace('{{CANVAS_CREATE}}', canvasCreateCode)
    .replace('{{BACKGROUND_COLOR}}', backgroundColor);
  
  zip.file('sketch.js', jsContent);
  
  // Create CSS file
  zip.file('style.css', templates.css);
  
  // Create libraries folder
  const libFolder = zip.folder('libraries');
  
  // Create jsconfig.json for better editor support
  const jsconfigContent = `{
  "include": [
    "*.js",
    "libraries/*.js",
    "node_modules/p5/lib/addons/*.js",
    "node_modules/p5/lib/*.js"
  ]
}`;
  
  zip.file('jsconfig.json', jsconfigContent);
  
  // Create README.md file
  const readmeContent = `# ${projectName}

A p5.js project created with the p5.js Template Generator.

## Libraries Used
${librariesToFetch.map(lib => `- ${lib.filename}`).join('\n')}

## Getting Started
1. Open index.html in your browser to view the project
2. Edit sketch.js to modify the project

## Project Settings
- Canvas Size: ${canvasWidth}x${canvasHeight}
- Canvas Mode: ${canvasMode === 'webgl' ? 'WEBGL' : 'P2D (Default)'}

Created on: ${new Date().toLocaleDateString()}
`;

  zip.file('README.md', readmeContent);
  
  // Fetch all libraries and then generate zip
  Promise.all(librariesToFetch.map(lib => 
    fetch(lib.url)
      .then(response => response.text())
      .then(content => {
        libFolder.file(lib.filename, content);
      })
  ))
  .then(() => {
    // Generate the zip file
    zip.generateAsync({ type: 'blob' })
      .then(content => {
        // Save the zip file
        saveAs(content, `${projectName}.zip`);
      });
  })
  .catch(error => {
    console.error('Error generating project:', error);
    alert('Error generating project. Please try again.');
  });
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  if (event.target === functionModal || event.target === templateModal) {
    closeModals();
  }
};
