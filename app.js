(function () {
  'use strict';
  const config = window.ZONE_CONFIG;
  const canvas = document.getElementById('newsCanvas');
  const ctx = canvas.getContext('2d');
  const state = { category: 'sport', variation: 'editorial', image: null, imageName: '', logo: null, logoName: '', logoVisible: true, logoPreset: 'top-right', logoX: 90, logoY: 8, logoSize: 90, logoOpacity: 100, imageZoom: 100, imagePosition: 'center', fontSize: 64, lineHeight: 1.15, contrast: 66, badgePosition: 'top', textVertical: 'center', textHorizontal: 'right', textY: 50, textX: 85, shadowOpacity: 66, shadowCoverage: 75, shadowDirection: 'bottom-top', shadowBlur: 60, previewZoom: 74 };
  const $ = id => document.getElementById(id);
  const headline = $('headline'), story = $('story'), category = $('category');

  function init() {
    $('todayDate').textContent = new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    config.categories.forEach(item => { const option = document.createElement('option'); option.value = item.id; option.textContent = item.label; category.appendChild(option); });
    category.value = state.category;
    Object.keys(config.variations).forEach(key => { const variation = config.variations[key]; const button = document.createElement('button'); button.type = 'button'; button.className = 'variation-card' + (key === state.variation ? ' active' : ''); button.dataset.variation = key; button.innerHTML = '<strong>' + variation.label + '</strong><small>' + variation.description + '</small>'; button.addEventListener('click', () => { state.variation = key; document.querySelectorAll('.variation-card').forEach(card => card.classList.toggle('active', card === button)); render(); }); $('variationGrid').appendChild(button); });
    bindControls(); render(); updateSavedCount();
  }
  function bindControls() {
    [headline, story, category, $('fontSize'), $('lineHeight'), $('contrast'), $('badgePosition'), $('imageZoom'), $('imagePosition'), $('textVertical'), $('textHorizontal'), $('textY'), $('textX'), $('logoX'), $('logoY'), $('logoSize'), $('logoOpacity'), $('shadowOpacity'), $('shadowCoverage'), $('shadowDirection'), $('shadowBlur')].forEach(control => control.addEventListener('input', handleControl));
    [$('textVertical'), $('textHorizontal'), $('shadowDirection')].forEach(control => control.addEventListener('change', handleControl));
    $('logoPreset').addEventListener('change', handleControl); $('logoVisible').addEventListener('input', handleControl);
    $('logoPreset').addEventListener('change', () => { const presets = { 'top-right': [90, 8], 'top-left': [10, 8], 'bottom-right': [90, 92], 'bottom-left': [10, 92] }; [state.logoX, state.logoY] = presets[$('logoPreset').value]; $('logoX').value = state.logoX; $('logoY').value = state.logoY; updateLabels(); render(); });
    story.addEventListener('input', () => $('charCount').textContent = story.value.length);
    $('classifyBtn').addEventListener('click', () => { const result = classify(headline.value + ' ' + story.value); category.value = result; state.category = result; showToast('تم اختيار قالب ' + config.templates[result].label); render(); });
    $('imageInput').addEventListener('change', event => loadImage(event.target.files[0]));
    $('logoInput').addEventListener('change', event => loadLogo(event.target.files[0]));
    $('removeImage').addEventListener('click', () => { state.image = null; state.imageName = ''; $('imageTools').classList.add('hidden'); $('dropZone').classList.remove('hidden'); render(); });
    ['dragenter', 'dragover'].forEach(name => $('dropZone').addEventListener(name, event => { event.preventDefault(); $('dropZone').classList.add('dragover'); }));
    ['dragleave', 'drop'].forEach(name => $('dropZone').addEventListener(name, event => { event.preventDefault(); $('dropZone').classList.remove('dragover'); }));
    $('dropZone').addEventListener('drop', event => loadImage(event.dataTransfer.files[0]));
    $('exportBtn').addEventListener('click', exportPng); $('saveBtn').addEventListener('click', saveDesign); $('savedBtn').addEventListener('click', openSaved); $('closeModal').addEventListener('click', closeSaved); $('savedModal').addEventListener('click', event => { if (event.target === $('savedModal')) closeSaved(); });
    $('previewZoomIn').addEventListener('click', () => changePreviewZoom(5)); $('previewZoomOut').addEventListener('click', () => changePreviewZoom(-5));
  }
  function handleControl(event) { const id = event.target.id; if (id === 'category') state.category = category.value; if (id === 'fontSize') state.fontSize = Number(event.target.value); if (id === 'lineHeight') state.lineHeight = Number(event.target.value); if (id === 'contrast') state.contrast = Number(event.target.value); if (id === 'badgePosition') state.badgePosition = event.target.value; if (id === 'imageZoom') state.imageZoom = Number(event.target.value); if (id === 'imagePosition') state.imagePosition = event.target.value; if (id === 'textVertical') state.textVertical = event.target.value; if (id === 'textHorizontal') state.textHorizontal = event.target.value; if (id === 'textY') state.textY = Number(event.target.value); if (id === 'textX') state.textX = Number(event.target.value); if (id === 'logoX') state.logoX = Number(event.target.value); if (id === 'logoY') state.logoY = Number(event.target.value); if (id === 'logoSize') state.logoSize = Number(event.target.value); if (id === 'logoOpacity') state.logoOpacity = Number(event.target.value); if (id === 'logoPreset') state.logoPreset = event.target.value; if (id === 'logoVisible') state.logoVisible = event.target.checked; if (id === 'shadowOpacity') state.shadowOpacity = Number(event.target.value); if (id === 'shadowCoverage') state.shadowCoverage = Number(event.target.value); if (id === 'shadowDirection') state.shadowDirection = event.target.value; if (id === 'shadowBlur') state.shadowBlur = Number(event.target.value); updateLabels(); render(); }
  function updateLabels() { $('fontSizeValue').textContent = state.fontSize; $('lineHeightValue').textContent = state.lineHeight.toFixed(2); $('contrastValue').textContent = state.contrast + '%'; $('textYValue').textContent = state.textY + '%'; $('textXValue').textContent = state.textX + '%'; $('logoXValue').textContent = state.logoX + '%'; $('logoYValue').textContent = state.logoY + '%'; $('logoSizeValue').textContent = state.logoSize + 'px'; $('logoOpacityValue').textContent = state.logoOpacity + '%'; $('shadowOpacityValue').textContent = state.shadowOpacity + '%'; $('shadowCoverageValue').textContent = state.shadowCoverage + '%'; $('shadowBlurValue').textContent = state.shadowBlur + '%'; }
  function classify(text) { const normalized = text.toLowerCase(); let winner = 'sport', score = 0; Object.keys(config.keywords).forEach(template => { const hits = config.keywords[template].filter(word => normalized.includes(word.toLowerCase())).length; if (hits > score) { score = hits; winner = template; } }); return config.templates[winner] ? winner : 'sport'; }
  function loadImage(file) { if (!file || !/^image\/(png|jpeg|webp)$/.test(file.type)) { showToast('يرجى اختيار PNG أو JPG أو WEBP'); return; } const reader = new FileReader(); reader.onload = event => { const image = new Image(); image.onload = () => { state.image = image; state.imageName = file.name; $('fileName').textContent = file.name; $('imageTools').classList.remove('hidden'); $('dropZone').classList.add('hidden'); render(); showToast('تمت إضافة الصورة'); }; image.src = event.target.result; }; reader.readAsDataURL(file); }
  function loadLogo(file) { if (!file || !/^image\/(png|svg\+xml)$/.test(file.type)) { showToast('يرجى اختيار شعار PNG أو SVG'); return; } const reader = new FileReader(); reader.onload = event => { const logo = new Image(); logo.onload = () => { state.logo = logo; state.logoName = file.name; $('logoName').textContent = file.name; render(); showToast('تم تحديث الشعار'); }; logo.src = event.target.result; }; reader.readAsDataURL(file); }
  function drawBackground(template, variation) { ctx.fillStyle = config.brand.colors.navy; ctx.fillRect(0, 0, canvas.width, canvas.height); if (state.image) { const image = state.image, scale = Math.max(canvas.width / image.width, canvas.height / image.height) * state.imageZoom / 100, width = image.width * scale, height = image.height * scale; const positions = { center: [.5, .5], top: [.5, .18], bottom: [.5, .82], left: [.18, .5], right: [.82, .5] }; const position = positions[state.imagePosition] || positions.center; ctx.drawImage(image, canvas.width * position[0] - width * position[0], canvas.height * position[1] - height * position[1], width, height); } else { const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); gradient.addColorStop(0, '#1C2541'); gradient.addColorStop(.52, '#0A1128'); gradient.addColorStop(1, '#050914'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.save(); ctx.globalAlpha = variation.pattern; ctx.strokeStyle = template.accent; ctx.lineWidth = 3; for (let x = -canvas.height; x < canvas.width; x += 55) { ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+canvas.height,canvas.height);ctx.stroke(); } ctx.globalAlpha = .12;ctx.font = '900 280px Arial';ctx.fillStyle = '#fff';ctx.fillText('Z', 65, 365);ctx.restore(); } const overlay = ctx.createLinearGradient(0, 0, 0, canvas.height); overlay.addColorStop(0, 'rgba(5,9,20,' + (variation.overlay - .08) + ')'); overlay.addColorStop(.45, 'rgba(5,9,20,' + variation.overlay + ')'); overlay.addColorStop(1, 'rgba(5,9,20,.96)'); ctx.fillStyle = overlay;ctx.fillRect(0, 0, canvas.width, canvas.height); }
  function fitTitle(text, maxWidth, maxLines, startSize) { let size = startSize, lines = []; while (size >= 30) { ctx.font = '800 ' + size + 'px Tajawal, Arial'; lines = wrapText(text || 'عنوان الخبر الرياضي', maxWidth); if (lines.length <= maxLines) return { size, lines }; size -= 2; } return { size, lines: lines.slice(0, maxLines) }; }
  function wrapText(text, maxWidth) { const words = text.trim().split(/\s+/); const lines = []; let line = ''; words.forEach(word => { const test = line ? line + ' ' + word : word; if (ctx.measureText(test).width > maxWidth && line) { lines.push(line);line = word; } else line = test; }); if (line) lines.push(line); return lines; }
  function drawBadge(template) { const atTop = state.badgePosition !== 'bottom'; const x = state.badgePosition === 'left' ? 78 : canvas.width - 78; const y = atTop ? 112 : canvas.height - 134; ctx.save();ctx.fillStyle = template.accent;ctx.beginPath();ctx.arc(x, y, 35, 0, Math.PI * 2);ctx.fill();ctx.fillStyle = '#081027';ctx.font = '700 27px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(template.symbol, x, y+1);ctx.restore(); }
  function render() { const template = config.templates[state.category] || config.templates.sport, variation = config.variations[state.variation]; drawBackground(template, variation); drawBadge(template); ctx.save();ctx.direction='rtl';ctx.textAlign='right'; const right = 930; ctx.fillStyle = template.accent;ctx.font = '700 22px Tajawal, Arial';ctx.fillText(template.kicker, right, 175); ctx.fillStyle = '#fff';ctx.fillRect(right - 100, 195, 100, 4); const title = fitTitle(headline.value, 825, 5, state.fontSize); ctx.font = '800 ' + title.size + 'px Tajawal, Arial';ctx.fillStyle='#fff'; let y = 310; title.lines.forEach(line => { ctx.fillText(line, right, y); y += title.size * state.lineHeight; }); if (story.value.trim()) { ctx.fillStyle = 'rgba(232,236,245,.78)';ctx.font='400 25px Tajawal, Arial';wrapText(story.value, 775).slice(0,3).forEach(line => { ctx.fillText(line, right, y + 40); y += 38; }); } ctx.fillStyle = template.accent;ctx.font='900 25px Arial';ctx.textAlign='left';ctx.direction='ltr';ctx.fillText('ZONE SPORT', 78, canvas.height - 90);ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='500 16px Tajawal, Arial';ctx.textAlign='right';ctx.direction='rtl';ctx.fillText('نبض الرياضة.. في قلب الحدث', right, canvas.height - 90);ctx.restore(); updateLabels(); }
  function changePreviewZoom(amount) { state.previewZoom = Math.max(55, Math.min(100, state.previewZoom + amount)); $('previewZoomValue').textContent = state.previewZoom + '%'; $('canvasFrame')?.style.setProperty('transform', 'scale(' + state.previewZoom / 74 + ')'); document.querySelector('.canvas-frame').style.transform = 'scale(' + state.previewZoom / 74 + ')'; }
  function getSaved() { try { return JSON.parse(localStorage.getItem('zoneSportDesigns') || '[]'); } catch (error) { return []; } }
  function saveDesign() { const designs = getSaved(); designs.unshift({ id: Date.now(), title: headline.value || 'تصميم بدون عنوان', category: state.category, variation: state.variation, story: story.value, settings: { ...state, image: null }, imageData: state.image ? state.image.src : null, date: new Date().toLocaleDateString('ar-EG') }); localStorage.setItem('zoneSportDesigns', JSON.stringify(designs.slice(0, 12))); updateSavedCount(); showToast('تم حفظ التصميم محليًا'); }
  function updateSavedCount() { $('savedCount').textContent = getSaved().length; }
  function openSaved() { const list = $('savedList'); list.innerHTML = ''; const designs = getSaved(); if (!designs.length) list.innerHTML = '<div class="empty-state">لا توجد تصاميم محفوظة بعد</div>'; designs.forEach(design => { const item = document.createElement('div');item.className='saved-item';item.innerHTML='<div><strong>'+escapeHtml(design.title)+'</strong><small>'+design.date+' · '+config.templates[design.category].label+'</small></div><button type="button">فتح</button>';item.querySelector('button').addEventListener('click', () => loadSaved(design));list.appendChild(item); }); $('savedModal').classList.remove('hidden'); }
  function loadSaved(design) { headline.value=design.title;story.value=design.story||'';category.value=design.category;state.category=design.category;state.variation=design.variation;Object.assign(state,design.settings||{});if(design.imageData){const image=new Image();image.onload=()=>{state.image=image;$('dropZone').classList.add('hidden');$('imageTools').classList.remove('hidden');render();};image.src=design.imageData;}else{state.image=null;$('dropZone').classList.remove('hidden');$('imageTools').classList.add('hidden');render();}document.querySelectorAll('.variation-card').forEach(card=>card.classList.toggle('active',card.dataset.variation===state.variation));$('charCount').textContent=story.value.length;closeSaved();showToast('تم فتح التصميم'); }
  function closeSaved() { $('savedModal').classList.add('hidden'); }
  function escapeHtml(value) { const div=document.createElement('div');div.textContent=value;return div.innerHTML; }
  function exportPng() { render(); const link=document.createElement('a');link.download='zone-sport-news-' + Date.now() + '.png';link.href=canvas.toDataURL('image/png');link.click();showToast('تم تصدير الصورة بجودة عالية'); }
  function showToast(message) { const toast=$('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2200); }
  function drawAdaptiveBackground(template, variation, focusY) {
    ctx.fillStyle = config.brand.colors.navy;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (state.image) {
      const image = state.image;
      const scale = Math.max(canvas.width / image.width, canvas.height / image.height) * state.imageZoom / 100;
      const width = image.width * scale;
      const height = image.height * scale;
      const positions = { center: [.5, .5], top: [.5, .18], bottom: [.5, .82], left: [.18, .5], right: [.82, .5] };
      const position = positions[state.imagePosition] || positions.center;
      ctx.drawImage(image, canvas.width * position[0] - width * position[0], canvas.height * position[1] - height * position[1], width, height);
    } else {
      const pattern = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      pattern.addColorStop(0, '#1C2541'); pattern.addColorStop(.52, '#0A1128'); pattern.addColorStop(1, '#050914');
      ctx.fillStyle = pattern; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save(); ctx.globalAlpha = variation.pattern; ctx.strokeStyle = template.accent; ctx.lineWidth = 3;
      for (let x = -canvas.height; x < canvas.width; x += 55) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + canvas.height, canvas.height); ctx.stroke(); }
      ctx.globalAlpha = .12; ctx.font = '900 280px Arial'; ctx.fillStyle = '#fff'; ctx.fillText('Z', 65, 365); ctx.restore();
    }
    const focus = Math.max(0, Math.min(1, focusY));
    const vignette = ctx.createRadialGradient(canvas.width * .5, canvas.height * focus, 100, canvas.width * .5, canvas.height * focus, canvas.height * .8);
    const darkness = state.contrast / 100;
    vignette.addColorStop(0, 'rgba(5,9,20,' + Math.max(.48, darkness - .12) + ')'); vignette.addColorStop(.58, 'rgba(5,9,20,' + darkness + ')'); vignette.addColorStop(1, 'rgba(5,9,20,.97)');
    ctx.fillStyle = vignette; ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  function render() {
    const template = config.templates[state.category] || config.templates.sport;
    const variation = config.variations[state.variation];
    const title = fitTitle(headline.value, 825, 5, state.fontSize);
    const bodyLines = story.value.trim() ? wrapText(story.value, 775).slice(0, 3) : [];
    const titleHeight = title.size * state.lineHeight * title.lines.length;
    const bodyHeight = bodyLines.length ? bodyLines.length * 38 + 40 : 0;
    const blockHeight = 115 + titleHeight + bodyHeight;
    const anchorY = canvas.height * state.textY / 100;
    let blockTop = state.textVertical === 'top' ? anchorY : state.textVertical === 'bottom' ? anchorY - blockHeight : anchorY - blockHeight / 2;
    blockTop = Math.max(55, Math.min(canvas.height - blockHeight - 55, blockTop));
    drawAdaptiveBackground(template, variation, (blockTop + blockHeight / 2) / canvas.height);
    drawBadge(template);
    ctx.save(); ctx.direction = 'rtl'; ctx.textAlign = state.textHorizontal;
    const textX = canvas.width * state.textX / 100;
    let y = blockTop + 28;
    ctx.fillStyle = template.accent; ctx.font = '700 22px Tajawal, Arial'; ctx.fillText(template.kicker, textX, y); y += 25;
    ctx.fillStyle = '#fff'; const lineStart = state.textHorizontal === 'right' ? textX - 100 : state.textHorizontal === 'left' ? textX : textX - 50; ctx.fillRect(lineStart, y, 100, 4); y += 85;
    ctx.font = '800 ' + title.size + 'px Tajawal, Arial'; ctx.fillStyle = '#fff'; title.lines.forEach(line => { ctx.fillText(line, textX, y); y += title.size * state.lineHeight; });
    if (bodyLines.length) { y += 40; ctx.fillStyle = 'rgba(232,236,245,.78)'; ctx.font = '400 25px Tajawal, Arial'; bodyLines.forEach(line => { ctx.fillText(line, textX, y); y += 38; }); }
    ctx.fillStyle = template.accent; ctx.font = '900 25px Arial'; ctx.textAlign = 'left'; ctx.direction = 'ltr'; ctx.fillText('ZONE SPORT', 78, canvas.height - 90);
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '500 16px Tajawal, Arial'; ctx.textAlign = 'right'; ctx.direction = 'rtl'; ctx.fillText('نبض الرياضة.. في قلب الحدث', 930, canvas.height - 90); ctx.restore(); updateLabels();
  }
  function drawControlledOverlay(focusY) {
    const opacity = state.shadowOpacity / 100;
    if (!opacity) return;
    const coverage = Math.max(.1, state.shadowCoverage / 100);
    const softness = Math.max(.08, state.shadowBlur / 100);
    let gradient;
    if (state.shadowDirection === 'radial') {
      gradient = ctx.createRadialGradient(canvas.width * .5, canvas.height * focusY, 30, canvas.width * .5, canvas.height * focusY, canvas.height * (0.45 + softness * .4));
      gradient.addColorStop(0, 'rgba(5,9,20,' + opacity + ')'); gradient.addColorStop(Math.min(.95, softness + .25), 'rgba(5,9,20,' + opacity * .55 + ')'); gradient.addColorStop(1, 'rgba(5,9,20,0)');
    } else if (state.shadowDirection === 'lateral') {
      gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, 'rgba(5,9,20,' + opacity + ')'); gradient.addColorStop(Math.max(.15, 1 - softness), 'rgba(5,9,20,' + opacity * .55 + ')'); gradient.addColorStop(1, 'rgba(5,9,20,0)');
    } else {
      const fromBottom = state.shadowDirection === 'bottom-top';
      gradient = ctx.createLinearGradient(0, fromBottom ? canvas.height : 0, 0, fromBottom ? canvas.height * (1 - coverage) : canvas.height * coverage);
      gradient.addColorStop(0, 'rgba(5,9,20,' + opacity + ')'); gradient.addColorStop(Math.max(.1, 1 - softness), 'rgba(5,9,20,' + opacity * .58 + ')'); gradient.addColorStop(1, 'rgba(5,9,20,0)');
    }
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  function drawLogo() {
    if (!state.logoVisible) return;
    const size = state.logoSize, x = canvas.width * state.logoX / 100, y = canvas.height * state.logoY / 100;
    ctx.save(); ctx.globalAlpha = state.logoOpacity / 100; ctx.textBaseline = 'middle';
    if (state.logo) { const scale = Math.min(size / state.logo.width, size / state.logo.height); const width = state.logo.width * scale, height = state.logo.height * scale; ctx.drawImage(state.logo, x - width / 2, y - height / 2, width, height); }
    else { ctx.fillStyle = '#D4AF37'; ctx.font = '900 ' + Math.max(20, size * .23) + 'px Arial'; ctx.textAlign = 'center'; ctx.fillText('ZONE SPORT', x, y); }
    ctx.restore();
  }
  function drawBase(template, variation) {
    ctx.fillStyle = config.brand.colors.navy; ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (state.image) { const image = state.image, scale = Math.max(canvas.width / image.width, canvas.height / image.height) * state.imageZoom / 100, width = image.width * scale, height = image.height * scale; const positions = { center: [.5, .5], top: [.5, .18], bottom: [.5, .82], left: [.18, .5], right: [.82, .5] }; const position = positions[state.imagePosition] || positions.center; ctx.drawImage(image, canvas.width * position[0] - width * position[0], canvas.height * position[1] - height * position[1], width, height); }
    else { const pattern = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); pattern.addColorStop(0, '#1C2541'); pattern.addColorStop(.52, '#0A1128'); pattern.addColorStop(1, '#050914'); ctx.fillStyle = pattern; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.save(); ctx.globalAlpha = variation.pattern; ctx.strokeStyle = template.accent; ctx.lineWidth = 3; for (let x = -canvas.height; x < canvas.width; x += 55) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + canvas.height, canvas.height); ctx.stroke(); } ctx.globalAlpha = .12; ctx.font = '900 280px Arial'; ctx.fillStyle = '#fff'; ctx.fillText('Z', 65, 365); ctx.restore(); }
  }
  function render() {
    const template = config.templates[state.category] || config.templates.sport, variation = config.variations[state.variation];
    const title = fitTitle(headline.value, 825, 5, state.fontSize), bodyLines = story.value.trim() ? wrapText(story.value, 775).slice(0, 3) : [];
    const titleHeight = title.size * state.lineHeight * title.lines.length, bodyHeight = bodyLines.length ? bodyLines.length * 38 + 40 : 0, blockHeight = 115 + titleHeight + bodyHeight;
    const anchorY = canvas.height * state.textY / 100; let blockTop = state.textVertical === 'top' ? anchorY : state.textVertical === 'bottom' ? anchorY - blockHeight : anchorY - blockHeight / 2; blockTop = Math.max(55, Math.min(canvas.height - blockHeight - 55, blockTop));
    drawBase(template, variation); drawControlledOverlay((blockTop + blockHeight / 2) / canvas.height); drawBadge(template); drawLogo();
    ctx.save(); ctx.direction = 'rtl'; ctx.textAlign = state.textHorizontal; const textX = canvas.width * state.textX / 100; let y = blockTop + 28;
    ctx.fillStyle = template.accent; ctx.font = '700 22px Tajawal, Arial'; ctx.fillText(template.kicker, textX, y); y += 25; ctx.fillStyle = '#fff'; const lineStart = state.textHorizontal === 'right' ? textX - 100 : state.textHorizontal === 'left' ? textX : textX - 50; ctx.fillRect(lineStart, y, 100, 4); y += 85;
    ctx.font = '800 ' + title.size + 'px Tajawal, Arial'; ctx.fillStyle = '#fff'; title.lines.forEach(line => { ctx.fillText(line, textX, y); y += title.size * state.lineHeight; });
    if (bodyLines.length) { y += 40; ctx.fillStyle = 'rgba(232,236,245,.78)'; ctx.font = '400 25px Tajawal, Arial'; bodyLines.forEach(line => { ctx.fillText(line, textX, y); y += 38; }); }
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '500 16px Tajawal, Arial'; ctx.textAlign = 'right'; ctx.fillText('نبض الرياضة.. في قلب الحدث', 930, canvas.height - 90); ctx.restore(); updateLabels();
  }
  init();
})();