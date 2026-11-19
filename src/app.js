/**
 * SHAE Browser Drawing - Production Drawing Application
 */

(function() {
  'use strict';

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const State = {
    // Canvas
    canvas: null,
    ctx: null,
    dpr: window.devicePixelRatio || 1,
    
    // Current tool
    tool: 'brush',
    
    // Brush settings
    brush: {
      size: 8,
      opacity: 1.0,
      hardness: 0.5,
      smoothing: true,
      color: '#191712'
    },
    
    // Colors
    strokeColor: '#191712',
    fillColor: '#B3341B',
    
    // Layers
    layers: [],
    activeLayerIndex: 0,
    
    // History
    history: [],
    historyIndex: -1,
    maxHistory: 50,
    
    // Drawing state
    isDrawing: false,
    lastPoint: null,
    strokePoints: [],
    
    // Text input
    isTextMode: false,
    textPosition: null,
    
    // UI
    sidebar: null
  };

  // ============================================================================
  // CANVAS INITIALIZATION
  // ============================================================================
  function initCanvas() {
    State.canvas = document.getElementById('drawCanvas');
    State.ctx = State.canvas.getContext('2d');
    State.sidebar = document.querySelector('.sidebar');
    
    resizeCanvas();
    initLayers();
    saveState();
    bindEvents();
    
    window.addEventListener('resize', debounce(resizeCanvas, 100));
  }

  function resizeCanvas() {
    const wrapper = document.querySelector('.canvas-wrapper');
    const rect = wrapper.getBoundingClientRect();
    const sidebarWidth = State.sidebar ? State.sidebar.offsetWidth : 280;
    const availableWidth = rect.width - sidebarWidth;
    const availableHeight = rect.height;
    
    // Maintain aspect ratio, max 1200x800
    const maxW = Math.min(1200, availableWidth - 32);
    const maxH = Math.min(800, availableHeight - 32);
    const ratio = maxW / maxH;
    
    let width, height;
    if (1200 / 800 > ratio) {
      width = maxW;
      height = width / ratio;
    } else {
      height = maxH;
      width = height * ratio;
    }
    
    State.canvas.width = width * State.dpr;
    State.canvas.height = height * State.dpr;
    State.canvas.style.width = width + 'px';
    State.canvas.style.height = height + 'px';
    State.ctx.scale(State.dpr, State.dpr);
    
    // Redraw all layers
    redrawAllLayers();
  }

  // ============================================================================
  // LAYER MANAGEMENT
  // ============================================================================
  function initLayers() {
    // Create background layer
    State.layers = [
      { name: 'Background', canvas: createLayerCanvas(), visible: true, opacity: 1 }
    ];
    State.activeLayerIndex = 0;
    renderLayerList();
  }

  function createLayerCanvas() {
    const c = document.createElement('canvas');
    c.width = State.canvas.width;
    c.height = State.canvas.height;
    return c;
  }

  function addLayer() {
    const layer = { name: `Layer ${State.layers.length}`, canvas: createLayerCanvas(), visible: true, opacity: 1 };
    State.layers.push(layer);
    State.activeLayerIndex = State.layers.length - 1;
    renderLayerList();
    saveState();
  }

  function deleteLayer() {
    if (State.layers.length <= 1) return; // Keep at least background
    State.layers.splice(State.activeLayerIndex, 1);
    State.activeLayerIndex = Math.min(State.activeLayerIndex, State.layers.length - 1);
    renderLayerList();
    redrawAllLayers();
    saveState();
  }

  function setActiveLayer(index) {
    State.activeLayerIndex = index;
    renderLayerList();
  }

  function toggleLayerVisibility(index) {
    State.layers[index].visible = !State.layers[index].visible;
    renderLayerList();
    redrawAllLayers();
  }

  function renderLayerList() {
    const container = document.getElementById('layerList');
    container.innerHTML = State.layers.map((layer, i) => `
      <div class="layer-item ${i === State.activeLayerIndex ? 'active' : ''}" data-index="${i}">
        <input type="checkbox" ${layer.visible ? 'checked' : ''} onchange="toggleLayerVisibility(${i})" aria-label="Toggle ${layer.name} visibility">
        <span class="layer-name">${escapeHtml(layer.name)}</span>
      </div>
    `).join('');
  }

  // Make toggleLayerVisibility global for inline onclick
  window.toggleLayerVisibility = toggleLayerVisibility;

  // ============================================================================
  // DRAWING OPERATIONS
  // ============================================================================
  function getActiveLayerCtx() {
    const layer = State.layers[State.activeLayerIndex];
    if (!layer || !layer.visible) return null;
    const ctx = layer.canvas.getContext('2d');
    ctx.globalAlpha = layer.opacity;
    return ctx;
  }

  function getBrushSettings() {
    const size = State.brush.size;
    const hardness = State.brush.hardness;
    return {
      size,
      opacity: State.brush.opacity,
      hardness,
      smoothing: State.brush.smoothing
    };
  }

  function drawBrushStroke(ctx, points, settings) {
    if (points.length < 2) return;
    
    ctx.strokeStyle = State.strokeColor;
    ctx.globalAlpha = settings.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = settings.size;
    
    // Apply smoothing using quadratic curves
    if (settings.smoothing && points.length > 2) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.quadraticCurveTo(
        points[points.length - 1].x, points[points.length - 1].y,
        points[points.length - 1].x, points[points.length - 1].y
      );
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }
  }

  function drawEraserStroke(ctx, points, settings) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = settings.size * 2;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawShape(ctx, shape, start, end, settings) {
    ctx.strokeStyle = State.strokeColor;
    ctx.fillStyle = State.fillColor;
    ctx.globalAlpha = settings.opacity;
    ctx.lineWidth = settings.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const x = start.x;
    const y = start.y;
    const w = end.x - start.x;
    const h = end.y - start.y;
    
    switch (shape) {
      case 'rect':
        ctx.strokeRect(x, y, w, h);
        if (State.fillColor !== 'transparent') ctx.fillRect(x, y, w, h);
        break;
      case 'circle':
        const radius = Math.sqrt(w * w + h * h);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        if (State.fillColor !== 'transparent') ctx.fill();
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;
    }
  }

  // ============================================================================
  // INPUT HANDLING
  // ============================================================================
  function getCanvasPoint(e) {
    const rect = State.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * State.dpr,
      y: (clientY - rect.top) * State.dpr
    };
  }

  function onPointerDown(e) {
    if (State.isTextMode) return;
    
    const point = getCanvasPoint(e);
    State.isDrawing = true;
    State.lastPoint = point;
    State.strokePoints = [point];
    
    // Preview cursor
    showCursorPreview(point);
    
    // For shapes, just store start point
    if (['rect', 'circle', 'line'].includes(State.tool)) {
      State.strokePoints = [point];
    }
  }

  function onPointerMove(e) {
    if (!State.isDrawing) {
      // Update cursor preview
      const point = getCanvasPoint(e);
      showCursorPreview(point);
      return;
    }
    
    const point = getCanvasPoint(e);
    State.strokePoints.push(point);
    
    const ctx = getActiveLayerCtx();
    if (!ctx) return;
    
    const settings = getBrushSettings();
    
    if (State.tool === 'brush') {
      drawBrushStroke(ctx, State.strokePoints.slice(-10), settings);
    } else if (State.tool === 'eraser') {
      drawEraserStroke(ctx, State.strokePoints.slice(-10), settings);
    } else if (['rect', 'circle', 'line'].includes(State.tool)) {
      // Redraw shape preview on temp canvas
      redrawAllLayers();
      drawShape(ctx, State.tool, State.strokePoints[0], point, settings);
    }
    
    State.lastPoint = point;
  }

  function onPointerUp(e) {
    if (!State.isDrawing) return;
    State.isDrawing = false;
    hideCursorPreview();
    
    // For shapes, finalize on layer
    if (['rect', 'circle', 'line'].includes(State.tool)) {
      const ctx = getActiveLayerCtx();
      if (ctx) {
        const settings = getBrushSettings();
        drawShape(ctx, State.tool, State.strokePoints[0], getCanvasPoint(e), settings);
        saveState();
      }
    } else if (State.strokePoints.length > 1) {
      saveState();
    }
    
    State.strokePoints = [];
    State.lastPoint = null;
  }

  function showCursorPreview(point) {
    const preview = document.getElementById('cursorPreview');
    const rect = State.canvas.getBoundingClientRect();
    preview.style.width = (State.brush.size * 2) + 'px';
    preview.style.height = (State.brush.size * 2) + 'px';
    preview.style.left = (rect.left + point.x / State.dpr) + 'px';
    preview.style.top = (rect.top + point.y / State.dpr) + 'px';
    preview.style.display = 'block';
  }

  function hideCursorPreview() {
    const preview = document.getElementById('cursorPreview');
    preview.style.display = 'none';
  }

  // ============================================================================
  // RENDERING
  // ============================================================================
  function redrawAllLayers() {
    State.ctx.clearRect(0, 0, State.canvas.width, State.canvas.height);
    
    // Draw background
    State.ctx.fillStyle = '#FFFFFF';
    State.ctx.fillRect(0, 0, State.canvas.width, State.canvas.height);
    
    // Draw each layer
    for (const layer of State.layers) {
      if (layer.visible) {
        State.ctx.globalAlpha = layer.opacity;
        State.ctx.drawImage(layer.canvas, 0, 0);
      }
    }
    State.ctx.globalAlpha = 1;
  }

  // ============================================================================
  // HISTORY MANAGEMENT
  // ============================================================================
  function saveState() {
    // Clone current layers
    const layersSnapshot = State.layers.map(layer => {
      const c = createLayerCanvas();
      c.getContext('2d').drawImage(layer.canvas, 0, 0);
      return { ...layer, canvas: c };
    });
    
    // Trim future history
    State.history = State.history.slice(0, State.historyIndex + 1);
    
    // Add new state
    State.history.push({
      layers: layersSnapshot,
      activeLayerIndex: State.activeLayerIndex,
      tool: State.tool,
      brush: { ...State.brush },
      strokeColor: State.strokeColor,
      fillColor: State.fillColor
    });
    
    State.historyIndex = State.history.length - 1;
    
    // Limit history
    if (State.history.length > State.maxHistory) {
      State.history.shift();
      State.historyIndex--;
    }
    
    renderHistoryList();
    updateUndoRedoButtons();
  }

  function undo() {
    if (State.historyIndex <= 0) return;
    State.historyIndex--;
    restoreState(State.history[State.historyIndex]);
    updateUndoRedoButtons();
  }

  function redo() {
    if (State.historyIndex >= State.history.length - 1) return;
    State.historyIndex++;
    restoreState(State.history[State.historyIndex]);
    updateUndoRedoButtons();
  }

  function restoreState(snapshot) {
    State.layers = snapshot.layers.map(layer => {
      const c = createLayerCanvas();
      c.getContext('2d').drawImage(layer.canvas, 0, 0);
      return { ...layer, canvas: c };
    });
    State.activeLayerIndex = snapshot.activeLayerIndex;
    State.tool = snapshot.tool;
    State.brush = { ...snapshot.brush };
    State.strokeColor = snapshot.strokeColor;
    State.fillColor = snapshot.fillColor;
    
    // Update UI
    document.getElementById('brushSize').value = State.brush.size;
    document.getElementById('brushSizeValue').textContent = State.brush.size;
    document.getElementById('brushOpacity').value = Math.round(State.brush.opacity * 100);
    document.getElementById('brushOpacityValue').textContent = Math.round(State.brush.opacity * 100);
    document.getElementById('brushHardness').value = Math.round(State.brush.hardness * 100);
    document.getElementById('brushHardnessValue').textContent = Math.round(State.brush.hardness * 100);
    document.getElementById('brushSmoothing').checked = State.brush.smoothing;
    document.getElementById('strokeColor').value = State.strokeColor;
    document.getElementById('fillColor').value = State.fillColor;
    
    setTool(State.tool);
    renderLayerList();
    redrawAllLayers();
  }

  function renderHistoryList() {
    const container = document.getElementById('historyList');
    if (State.history.length === 0) {
      container.innerHTML = '<div class="empty">No history yet</div>';
      return;
    }
    container.innerHTML = State.history.map((s, i) => `
      <div class="history-entry ${i === State.historyIndex ? 'current' : ''}" data-index="${i}">
        <span>${s.tool} - Layer ${s.activeLayerIndex}</span>
      </div>
    `).join('');
  }

  function updateUndoRedoButtons() {
    document.getElementById('undoBtn').disabled = State.historyIndex <= 0;
    document.getElementById('redoBtn').disabled = State.historyIndex >= State.history.length - 1;
  }

  // ============================================================================
  // TOOL MANAGEMENT
  // ============================================================================
  function setTool(tool) {
    State.tool = tool;
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });
    State.isTextMode = tool === 'text';
  }

  // ============================================================================
  // EXPORT
  // ============================================================================
  function exportPNG() {
    const link = document.createElement('a');
    link.download = `shae-drawing-${Date.now()}.png`;
    link.href = State.canvas.toDataURL('image/png');
    link.click();
  }

  // ============================================================================
  // EVENT BINDING
  // ============================================================================
  function bindEvents() {
    // Canvas events
    State.canvas.addEventListener('mousedown', onPointerDown);
    State.canvas.addEventListener('mousemove', onPointerMove);
    State.canvas.addEventListener('mouseup', onPointerUp);
    State.canvas.addEventListener('mouseleave', onPointerUp);
    State.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); onPointerDown(e); }, { passive: false });
    State.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); onPointerMove(e); }, { passive: false });
    State.canvas.addEventListener('touchend', onPointerUp);
    
    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => setTool(btn.dataset.tool));
    });
    
    // Color pickers
    document.getElementById('strokeColor').addEventListener('input', (e) => {
      State.strokeColor = e.target.value;
    });
    document.getElementById('fillColor').addEventListener('input', (e) => {
      State.fillColor = e.target.value;
    });
    
    // Brush settings
    ['brushSize', 'brushOpacity', 'brushHardness'].forEach(id => {
      const el = document.getElementById(id);
      const valEl = document.getElementById(id + 'Value');
      el.addEventListener('input', () => {
        const val = parseFloat(el.value);
        State.brush[id.replace('brush', '').toLowerCase()] = id === 'brushOpacity' ? val / 100 : (id === 'brushHardness' ? val / 100 : val);
        valEl.textContent = el.value;
      });
    });
    
    document.getElementById('brushSmoothing').addEventListener('change', (e) => {
      State.brush.smoothing = e.target.checked;
    });
    
    // Layer buttons
    document.getElementById('addLayerBtn').addEventListener('click', addLayer);
    document.getElementById('deleteLayerBtn').addEventListener('click', deleteLayer);
    
    // History buttons
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('redoBtn').addEventListener('click', redo);
    
    // Clear/Export
    document.getElementById('clearBtn').addEventListener('click', () => {
      if (confirm('Clear entire canvas? This cannot be undone.')) {
        State.layers.forEach(layer => {
          layer.canvas.getContext('2d').clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        });
        redrawAllLayers();
        saveState();
      }
    });
    
    document.getElementById('exportBtn').addEventListener('click', exportPNG);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      } else if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        redo();
      } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        exportPNG();
      } else if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        document.getElementById('clearBtn').click();
      }
      
      // Tool shortcuts
      const tools = { 'b': 'brush', 'e': 'eraser', 'r': 'rect', 'c': 'circle', 'l': 'line', 't': 'text' };
      if (tools[e.key.toLowerCase()]) {
        e.preventDefault();
        setTool(tools[e.key.toLowerCase()]);
      }
    });
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  // ============================================================================
  // INIT
  // ============================================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCanvas);
  } else {
    initCanvas();
  }
})();
