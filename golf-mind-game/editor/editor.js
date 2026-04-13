// ─── Corporate Golf Story Engine ───

const Editor = {
  data: null,
  selectedNode: null,
  currentView: 'tree',
  dirty: false,

  init() {
    this.data = JSON.parse(JSON.stringify(EDITOR_DATA));
    this.bindToolbar();
    this.renderTree();
    this.updateNpcLineCounts();
    this.setStatus('Loaded: ' + this.data.meta.title);
  },

  // ─── Toolbar ───
  bindToolbar() {
    document.getElementById('btn-save').addEventListener('click', () => this.save());
    document.getElementById('btn-export').addEventListener('click', () => this.exportJS());
    document.getElementById('btn-import').addEventListener('click', () => document.getElementById('file-import').click());
    document.getElementById('file-import').addEventListener('change', (e) => this.importJSON(e));
    document.getElementById('btn-add-hole').addEventListener('click', () => this.addHole());
    document.getElementById('btn-add-npc').addEventListener('click', () => this.addNpc());
    document.getElementById('btn-add-flag').addEventListener('click', () => this.addFlag());
    document.getElementById('btn-view-map').addEventListener('click', () => this.switchView('map'));
    document.getElementById('btn-view-tree').addEventListener('click', () => this.switchView('tree'));
    document.getElementById('btn-view-npcs').addEventListener('click', () => this.switchView('npcs'));
    document.getElementById('btn-view-flags').addEventListener('click', () => this.switchView('flags'));
    document.getElementById('btn-ai-settings').addEventListener('click', () => AiAssist.showSettings());
    document.getElementById('tree-search').addEventListener('input', (e) => this.filterTree(e.target.value));
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeModal();
    });
  },

  switchView(view) {
    this.currentView = view;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    const btnMap = { map: 'btn-view-map', tree: 'btn-view-tree', npcs: 'btn-view-npcs', flags: 'btn-view-flags' };
    document.getElementById(btnMap[view])?.classList.add('active');

    if (view === 'map') this.renderMap();
    else if (view === 'tree') this.renderTree();
    else if (view === 'npcs') this.renderNpcPanel();
    else if (view === 'flags') this.renderFlagPanel();
  },

  setStatus(text) {
    document.getElementById('toolbar-status').textContent = text;
  },

  markDirty() {
    this.dirty = true;
    this.data.meta.lastEdited = new Date().toISOString();
    this.setStatus('Unsaved changes');
  },

  // ─── Story Tree ───
  renderTree() {
    const container = document.getElementById('story-tree');
    container.innerHTML = '';

    const arcNode = this.createTreeNode('🏢', 'THE ANDERSON ACCOUNT', 'arc', 'arc');
    const children = document.createElement('div');
    children.className = 'tree-children';

    for (const hole of this.data.holes) {
      const holeNode = this.createTreeNode('⛳', `Hole ${hole.number}: ${hole.name}`, 'hole', `hole_${hole.number}`);
      const holeChildren = document.createElement('div');
      holeChildren.className = 'tree-children';

      // Intro
      const introStatus = hole.beats.intro?.status || 'empty';
      holeChildren.appendChild(this.createTreeNode(this.statusIcon(introStatus), 'Intro', 'beat', `intro_h${hole.number}`));

      // Tee thoughts
      if (hole.beats.tee_thoughts?.length) {
        const teeNode = this.createTreeNode('🏌️', `Tee Thoughts (${hole.beats.tee_thoughts.length})`, 'thought', `tee_h${hole.number}`);
        const teeChildren = document.createElement('div');
        teeChildren.className = 'tree-children collapsed';
        for (const t of hole.beats.tee_thoughts) {
          teeChildren.appendChild(this.createTreeNode(this.statusIcon(t.status), t.label, 'thought', t.id));
        }
        teeNode.appendChild(teeChildren);
        holeChildren.appendChild(teeNode);
      } else {
        holeChildren.appendChild(this.createTreeNode('⭕', 'Tee Thoughts (empty)', 'thought', `tee_h${hole.number}_empty`));
      }

      // Walking moment
      if (hole.beats.walking_1) {
        holeChildren.appendChild(this.createTreeNode(this.statusIcon(hole.beats.walking_1.status), 'Walking Moment', 'walking', hole.beats.walking_1.id));
      }

      // Approach
      if (hole.beats.approach_thoughts?.length) {
        holeChildren.appendChild(this.createTreeNode('🏌️', `Approach (${hole.beats.approach_thoughts.length})`, 'thought', `approach_h${hole.number}`));
      }

      // Putt
      if (hole.beats.putt_thoughts?.length) {
        holeChildren.appendChild(this.createTreeNode('🏌️', `Putt (${hole.beats.putt_thoughts.length})`, 'thought', `putt_h${hole.number}`));
      }

      // Dialogue tree
      const dNodes = hole.beats.dialogue_tree?.nodes?.length || 0;
      const dStatus = hole.beats.dialogue_tree?.status || 'empty';
      const dTreeNode = this.createTreeNode(this.statusIcon(dStatus), `Dialogue (${dNodes} nodes)`, 'dialogue', hole.beats.dialogue_tree?.id);
      if (hole.beats.dialogue_tree?.nodes?.length) {
        const dChildren = document.createElement('div');
        dChildren.className = 'tree-children collapsed';
        for (const n of hole.beats.dialogue_tree.nodes) {
          const icon = n.speaker === 'dave' ? '👔' : n.speaker === 'narrator' ? '📖' : '💬';
          dChildren.appendChild(this.createTreeNode(icon, `${n.speaker}: ${(n.text || '').slice(0, 30)}...`, 'dialogue', `${hole.beats.dialogue_tree.id}_${n.id}`));
        }
        dTreeNode.appendChild(dChildren);
      }
      holeChildren.appendChild(dTreeNode);

      // Phone
      if (hole.beats.phone) {
        holeChildren.appendChild(this.createTreeNode(this.statusIcon(hole.beats.phone.status), `Phone: ${hole.beats.phone.from}`, 'phone', hole.beats.phone.id));
      }

      holeNode.appendChild(holeChildren);
      children.appendChild(holeNode);
    }

    // Endings
    const endingsNode = this.createTreeNode('🏁', 'ENDINGS', 'arc', 'endings');
    const endChildren = document.createElement('div');
    endChildren.className = 'tree-children';
    for (const e of this.data.endings) {
      endChildren.appendChild(this.createTreeNode(this.statusIcon(e.status), e.name, 'beat', e.id));
    }
    endingsNode.appendChild(endChildren);
    children.appendChild(endingsNode);

    arcNode.appendChild(children);
    container.appendChild(arcNode);
  },

  createTreeNode(icon, label, type, dataId) {
    const div = document.createElement('div');
    div.className = 'tree-node';
    div.dataset.type = type;
    div.dataset.id = dataId || '';

    const hasChildren = false;
    const expanderSpan = document.createElement('span');
    expanderSpan.className = 'tree-expander';
    expanderSpan.textContent = '';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'tree-icon';
    iconSpan.textContent = icon;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'tree-label';
    labelSpan.textContent = label;

    div.appendChild(expanderSpan);
    div.appendChild(iconSpan);
    div.appendChild(labelSpan);

    div.addEventListener('click', (e) => {
      e.stopPropagation();
      // Toggle children
      const childDiv = div.querySelector(':scope > .tree-children');
      if (childDiv) {
        childDiv.classList.toggle('collapsed');
        expanderSpan.textContent = childDiv.classList.contains('collapsed') ? '▸' : '▾';
      }
      this.selectNode(dataId, type);
    });

    // Set expander after children are potentially added
    setTimeout(() => {
      const childDiv = div.querySelector(':scope > .tree-children');
      if (childDiv) {
        expanderSpan.textContent = childDiv.classList.contains('collapsed') ? '▸' : '▾';
      }
    }, 0);

    return div;
  },

  statusIcon(status) {
    const icons = { written: '✅', outline: '📝', empty: '⭕', draft: '✏️' };
    return icons[status] || '⭕';
  },

  selectNode(id, type) {
    if (!id) return;
    document.querySelectorAll('.tree-node.selected').forEach(n => n.classList.remove('selected'));
    const node = document.querySelector(`.tree-node[data-id="${id}"]`);
    if (node) node.classList.add('selected');

    this.selectedNode = { id, type };
    this.renderNodeEditor(id, type);
    this.renderContext(id, type);
  },

  filterTree(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.tree-node').forEach(n => {
      const label = n.querySelector('.tree-label')?.textContent?.toLowerCase() || '';
      n.style.display = !q || label.includes(q) ? '' : 'none';
    });
  },

  // ─── Node Editor ───
  renderNodeEditor(id, type) {
    const area = document.getElementById('editor-area');

    if (type === 'hole') {
      const holeNum = parseInt(id.replace('hole_', ''));
      const hole = this.data.holes.find(h => h.number === holeNum);
      if (hole) { this.renderHoleEditor(hole); return; }
    }

    if (type === 'beat' || type === 'dialogue' || type === 'walking' || type === 'phone' || type === 'thought') {
      const node = this.findNodeById(id);
      if (node) { this.renderGenericEditor(node, id, type); return; }
    }

    if (id === 'arc') { this.renderArcEditor(); return; }
    if (id === 'endings') { this.renderEndingsEditor(); return; }

    // Ending node
    const ending = this.data.endings.find(e => e.id === id);
    if (ending) { this.renderEndingEditor(ending); return; }

    area.innerHTML = '<div class="editor-empty"><div class="editor-empty-sub">Select a node to edit.</div></div>';
  },

  renderHoleEditor(hole) {
    const area = document.getElementById('editor-area');
    const h = hole;
    area.innerHTML = `
      <div class="node-editor">
        <div class="ne-header">
          <span class="ne-type-badge hole">HOLE ${h.number}</span>
          <span class="ne-title">${h.name}</span>
          <span class="ne-id">Par ${h.par} • ${h.yards}yds</span>
        </div>

        <div class="ne-field">
          <div class="ne-field-label">HOLE NAME</div>
          <input class="w95-input" value="${this.esc(h.name)}" data-field="name" />
        </div>

        <div class="ne-field">
          <div class="ne-field-label">THEME</div>
          <input class="w95-input" value="${this.esc(h.theme)}" data-field="theme" />
        </div>

        <div class="ne-field">
          <div class="ne-field-label">ARC BEAT <button class="ne-ai-btn" onclick="AiAssist.enhance('arcBeat', ${h.number})">🤖 AI Enhance</button></div>
          <textarea class="w95-textarea" data-field="arcBeat" rows="3">${this.esc(h.arcBeat)}</textarea>
        </div>

        <div class="ne-field">
          <div class="ne-field-label">INTRO TEXT <button class="ne-ai-btn" onclick="AiAssist.enhance('intro', ${h.number})">🤖 AI Write</button></div>
          <textarea class="w95-textarea" data-field="intro" rows="5">${this.esc(h.beats.intro?.text || '')}</textarea>
          <div class="text-dim mt-8">Status: ${h.beats.intro?.status || 'empty'}</div>
        </div>

        <div class="ne-field">
          <div class="ne-field-label">CONTENT SUMMARY</div>
          <div style="font-size:10px;line-height:1.8">
            Tee Thoughts: <strong>${h.beats.tee_thoughts?.length || 0}</strong> •
            Approach: <strong>${h.beats.approach_thoughts?.length || 0}</strong> •
            Putt: <strong>${h.beats.putt_thoughts?.length || 0}</strong><br>
            Walking Moments: <strong>${h.beats.walking_1 ? 1 : 0}</strong> •
            Dialogue Nodes: <strong>${h.beats.dialogue_tree?.nodes?.length || 0}</strong> •
            Phone Events: <strong>${h.beats.phone ? 1 : 0}</strong>
          </div>
        </div>

        <div class="ne-field">
          <button class="tool-btn" onclick="Editor.addThought(${h.number}, 'tee')">+ Tee Thought</button>
          <button class="tool-btn" onclick="Editor.addThought(${h.number}, 'approach')">+ Approach</button>
          <button class="tool-btn" onclick="Editor.addThought(${h.number}, 'putt')">+ Putt</button>
          <button class="tool-btn" onclick="Editor.addWalking(${h.number})">+ Walking</button>
          <button class="tool-btn" onclick="Editor.addDialogueNode(${h.number})">+ Dialogue Node</button>
          <button class="tool-btn" onclick="Editor.addPhone(${h.number})">+ Phone Event</button>
        </div>
      </div>`;

    area.querySelectorAll('[data-field]').forEach(el => {
      el.addEventListener('input', () => {
        const field = el.dataset.field;
        if (field === 'intro') {
          hole.beats.intro = hole.beats.intro || { id: `intro_h${hole.number}`, text: '', status: 'draft' };
          hole.beats.intro.text = el.value;
          hole.beats.intro.status = el.value ? 'draft' : 'empty';
        } else {
          hole[field] = el.value;
        }
        this.markDirty();
      });
    });
  },

  renderGenericEditor(node, id, type) {
    const area = document.getElementById('editor-area');

    if (node.responses !== undefined && node.responses.length > 0) {
      this.renderDialogueNodeEditor(node, id);
      return;
    }

    if (node.receivedVariants) {
      this.renderResponseEditor(node, id);
      return;
    }

    if (node.choices) {
      this.renderWalkingEditor(node, id);
      return;
    }

    if (node.baseQuality !== undefined) {
      this.renderThoughtEditor(node, id);
      return;
    }

    if (node.fullText !== undefined) {
      this.renderPhoneEditor(node, id);
      return;
    }

    // Generic text editor
    area.innerHTML = `
      <div class="node-editor">
        <div class="ne-header">
          <span class="ne-type-badge ${type}">${type.toUpperCase()}</span>
          <span class="ne-title">${id}</span>
        </div>
        <div class="ne-field">
          <div class="ne-field-label">TEXT <button class="ne-ai-btn" onclick="AiAssist.enhanceField('${id}', 'text')">🤖 AI</button></div>
          <textarea class="w95-textarea" id="generic-text" rows="6">${this.esc(node.text || '')}</textarea>
        </div>
      </div>`;

    document.getElementById('generic-text')?.addEventListener('input', (e) => {
      node.text = e.target.value;
      this.markDirty();
    });
  },

  renderDialogueNodeEditor(node, id) {
    const area = document.getElementById('editor-area');
    let html = `
      <div class="node-editor">
        <div class="ne-header">
          <span class="ne-type-badge dialogue">DIALOGUE NODE</span>
          <span class="ne-title">${node.speaker || 'unknown'}: ${node.id}</span>
          <span class="ne-id">${id}</span>
        </div>

        <div class="ne-row">
          <div class="ne-field">
            <div class="ne-field-label">SPEAKER</div>
            <select class="w95-select" id="dn-speaker">
              ${['narrator', 'dave', 'sharon', 'thought', 'you'].map(s =>
                `<option value="${s}" ${node.speaker === s ? 'selected' : ''}>${s}</option>`
              ).join('')}
            </select>
          </div>
          <div class="ne-field">
            <div class="ne-field-label">NEXT NODE</div>
            <input class="w95-input" id="dn-next" value="${this.esc(node.next || '')}" />
          </div>
        </div>

        <div class="ne-field">
          <div class="ne-field-label">TEXT <button class="ne-ai-btn" onclick="AiAssist.enhanceField('${id}', 'dialogueText')">🤖 AI</button></div>
          <textarea class="w95-textarea" id="dn-text" rows="4">${this.esc(typeof node.text === 'string' ? node.text : (node.dynamicNote || '[DYNAMIC]'))}</textarea>
          ${node.dynamicNote ? `<div class="text-dim mt-8">Dynamic: ${this.esc(node.dynamicNote)}</div>` : ''}
        </div>

        <div class="ne-field">
          <div class="ne-field-label">RESPONSES (${node.responses.length}) <button class="ne-ai-btn" onclick="Editor.addResponse('${id}')">+ Add Response</button></div>
        </div>`;

    for (let i = 0; i < node.responses.length; i++) {
      const r = node.responses[i];
      html += this.renderResponseCardHTML(r, id, i);
    }

    html += '</div>';
    area.innerHTML = html;

    document.getElementById('dn-speaker')?.addEventListener('change', (e) => { node.speaker = e.target.value; this.markDirty(); });
    document.getElementById('dn-next')?.addEventListener('input', (e) => { node.next = e.target.value || null; this.markDirty(); });
    document.getElementById('dn-text')?.addEventListener('input', (e) => { node.text = e.target.value; this.markDirty(); });

    area.querySelectorAll('[data-response-field]').forEach(el => {
      el.addEventListener('input', () => {
        const idx = parseInt(el.dataset.ridx);
        const field = el.dataset.responseField;
        const resp = node.responses[idx];
        if (!resp) return;
        if (field === 'traitEffectsJson') {
          try { resp.traitEffects = JSON.parse(el.value); } catch {}
        } else {
          resp[field] = el.value;
        }
        this.markDirty();
      });
    });

    // Tier editors
    area.querySelectorAll('[data-tier-field]').forEach(el => {
      el.addEventListener('input', () => {
        const idx = parseInt(el.dataset.ridx);
        const tier = el.dataset.tierField;
        const resp = node.responses[idx];
        if (!resp) return;
        resp.receivedVariants = resp.receivedVariants || {};
        resp.receivedVariants[tier] = el.value;
        this.markDirty();
      });
    });
  },

  renderResponseCardHTML(r, parentId, idx) {
    const variants = r.receivedVariants || {};
    const tierLabels = { 1: 'DISASTROUS', 2: 'AWKWARD', 3: 'NORMAL', 4: 'SMOOTH', 5: 'MAGNETIC' };

    let html = `
      <div class="response-card">
        <div class="response-card-header">
          <span class="response-card-label">${this.esc(r.label || 'RESPONSE')}</span>
          <span class="response-card-stat">stat: ${r.statKey || 'swagger'}</span>
          <button class="response-card-delete" onclick="Editor.deleteResponse('${parentId}', ${idx})">✕</button>
        </div>
        <div class="response-card-body">
          <div class="ne-field">
            <div class="ne-field-label">PLAYER'S INTENT (what they pick)</div>
            <textarea class="w95-textarea" data-ridx="${idx}" data-response-field="text" rows="2">${this.esc(r.text || '')}</textarea>
          </div>

          <div class="ne-row">
            <div class="ne-field">
              <div class="ne-field-label">LABEL</div>
              <input class="w95-input" data-ridx="${idx}" data-response-field="label" value="${this.esc(r.label || '')}" />
            </div>
            <div class="ne-field">
              <div class="ne-field-label">STAT KEY</div>
              <select class="w95-select" data-ridx="${idx}" data-response-field="statKey">
                ${['swagger', 'humor', 'knowledge', 'zen', 'focus', 'blend'].map(s =>
                  `<option value="${s}" ${r.statKey === s ? 'selected' : ''}>${s}</option>`
                ).join('')}
              </select>
            </div>
            <div class="ne-field">
              <div class="ne-field-label">NEXT NODE</div>
              <input class="w95-input" data-ridx="${idx}" data-response-field="next" value="${this.esc(r.next || '')}" />
            </div>
          </div>

          <div class="ne-field">
            <div class="ne-field-label">TRAIT EFFECTS (JSON)</div>
            <input class="w95-input" data-ridx="${idx}" data-response-field="traitEffectsJson" value="${this.esc(JSON.stringify(r.traitEffects || {}))}" />
          </div>

          <div class="ne-field">
            <div class="ne-field-label">RECEIVED VARIANTS — How this LANDS based on sender's stat
              <button class="ne-ai-btn" onclick="AiAssist.fillVariants('${parentId}', ${idx})">🤖 AI Fill All</button>
            </div>
            <div class="tier-editor">`;

    for (let t = 1; t <= 5; t++) {
      html += `
              <div class="tier-row">
                <span class="tier-badge t${t}">${t}</span>
                <span class="tier-label">${tierLabels[t]}</span>
                <div class="tier-text">
                  <textarea data-ridx="${idx}" data-tier-field="${t}" rows="2">${this.esc(variants[t] || '')}</textarea>
                </div>
                <div class="tier-ai">
                  <button class="ne-ai-btn" onclick="AiAssist.fillSingleVariant('${parentId}', ${idx}, ${t})">🤖</button>
                </div>
              </div>`;
    }

    html += `</div></div></div></div>`;
    return html;
  },

  renderThoughtEditor(node, id) {
    const area = document.getElementById('editor-area');
    area.innerHTML = `
      <div class="node-editor">
        <div class="ne-header">
          <span class="ne-type-badge thought">SWING THOUGHT</span>
          <span class="ne-title">${node.label || id}</span>
        </div>
        <div class="ne-row">
          <div class="ne-field">
            <div class="ne-field-label">LABEL</div>
            <input class="w95-input" id="st-label" value="${this.esc(node.label || '')}" />
          </div>
          <div class="ne-field">
            <div class="ne-field-label">BASE QUALITY (0=perfect, 6=shank)</div>
            <input class="w95-input" id="st-quality" type="number" min="0" max="6" value="${node.baseQuality}" />
          </div>
        </div>
        <div class="ne-field">
          <div class="ne-field-label">THOUGHT TEXT <button class="ne-ai-btn" onclick="AiAssist.enhanceField('${id}', 'thought')">🤖 AI</button></div>
          <textarea class="w95-textarea" id="st-text" rows="3">${this.esc(node.text || '')}</textarea>
        </div>
        <div class="ne-field">
          <div class="ne-field-label">TRAIT EFFECTS (JSON)</div>
          <input class="w95-input" id="st-traits" value="${this.esc(JSON.stringify(node.traitEffects || {}))}" />
        </div>
        <div class="ne-field">
          <div class="ne-field-label">RESULT — GOOD <button class="ne-ai-btn" onclick="AiAssist.enhanceField('${id}', 'resultGood')">🤖 AI</button></div>
          <textarea class="w95-textarea" id="st-good" rows="3">${this.esc(node.resultGood || '')}</textarea>
        </div>
        <div class="ne-field">
          <div class="ne-field-label">RESULT — BAD <button class="ne-ai-btn" onclick="AiAssist.enhanceField('${id}', 'resultBad')">🤖 AI</button></div>
          <textarea class="w95-textarea" id="st-bad" rows="3">${this.esc(node.resultBad || '')}</textarea>
        </div>
      </div>`;

    const bind = (elId, field) => {
      document.getElementById(elId)?.addEventListener('input', (e) => {
        if (field === 'baseQuality') node[field] = parseInt(e.target.value) || 0;
        else if (field === 'traitEffects') { try { node[field] = JSON.parse(e.target.value); } catch {} }
        else node[field] = e.target.value;
        this.markDirty();
      });
    };
    bind('st-label', 'label');
    bind('st-quality', 'baseQuality');
    bind('st-text', 'text');
    bind('st-traits', 'traitEffects');
    bind('st-good', 'resultGood');
    bind('st-bad', 'resultBad');
  },

  renderPhoneEditor(node, id) {
    const area = document.getElementById('editor-area');
    area.innerHTML = `
      <div class="node-editor">
        <div class="ne-header">
          <span class="ne-type-badge phone">PHONE EVENT</span>
          <span class="ne-title">${node.from || 'unknown'}</span>
          <span class="ne-id">${node.type || 'text'}</span>
        </div>
        <div class="ne-row">
          <div class="ne-field">
            <div class="ne-field-label">FROM</div>
            <select class="w95-select" id="ph-from">
              ${Object.keys(this.data.npcs).map(k =>
                `<option value="${k}" ${node.from === k ? 'selected' : ''}>${this.data.npcs[k].name}</option>`
              ).join('')}
            </select>
          </div>
          <div class="ne-field">
            <div class="ne-field-label">TYPE</div>
            <select class="w95-select" id="ph-type">
              <option value="text" ${node.type === 'text' ? 'selected' : ''}>Text</option>
              <option value="call" ${node.type === 'call' ? 'selected' : ''}>Call</option>
              <option value="email" ${node.type === 'email' ? 'selected' : ''}>Email</option>
            </select>
          </div>
        </div>
        <div class="ne-field">
          <div class="ne-field-label">PREVIEW (notification text)</div>
          <input class="w95-input" id="ph-preview" value="${this.esc(node.preview || '')}" />
        </div>
        <div class="ne-field">
          <div class="ne-field-label">FULL TEXT <button class="ne-ai-btn" onclick="AiAssist.enhanceField('${id}', 'phoneText')">🤖 AI</button></div>
          <textarea class="w95-textarea" id="ph-full" rows="5">${this.esc(node.fullText || '')}</textarea>
        </div>
        <div class="ne-field">
          <div class="ne-field-label">RESPONSES (${node.responses?.length || 0})</div>
          ${(node.responses || []).map((r, i) => `
            <div class="response-card mb-4">
              <div class="response-card-header">
                <span class="response-card-label">${this.esc(r.label)}</span>
              </div>
              <div class="response-card-body">
                <textarea class="w95-textarea" data-ph-resp="${i}" rows="2">${this.esc(r.text || '')}</textarea>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;

    document.getElementById('ph-from')?.addEventListener('change', (e) => { node.from = e.target.value; this.markDirty(); });
    document.getElementById('ph-type')?.addEventListener('change', (e) => { node.type = e.target.value; this.markDirty(); });
    document.getElementById('ph-preview')?.addEventListener('input', (e) => { node.preview = e.target.value; this.markDirty(); });
    document.getElementById('ph-full')?.addEventListener('input', (e) => { node.fullText = e.target.value; this.markDirty(); });
  },

  renderWalkingEditor(node, id) {
    const area = document.getElementById('editor-area');
    area.innerHTML = `
      <div class="node-editor">
        <div class="ne-header">
          <span class="ne-type-badge walking">WALKING MOMENT</span>
          <span class="ne-title">${id}</span>
        </div>
        <div class="ne-field">
          <div class="ne-field-label">NARRATION <button class="ne-ai-btn" onclick="AiAssist.enhanceField('${id}', 'walkingText')">🤖 AI Write</button></div>
          <textarea class="w95-textarea" id="wk-text" rows="4">${this.esc(node.text || '')}</textarea>
        </div>
        <div class="ne-field">
          <div class="ne-field-label">CHOICES (${node.choices?.length || 0}) <button class="ne-ai-btn" onclick="Editor.addWalkingChoice('${id}')">+ Add Choice</button></div>
          ${(node.choices || []).map((c, i) => `
            <div class="response-card mb-4">
              <div class="response-card-header">
                <span class="response-card-label">${this.esc(c.label)}</span>
              </div>
              <div class="response-card-body">
                <div class="ne-field-label">TEXT</div>
                <textarea class="w95-textarea" data-wk-choice="${i}" data-wk-field="text" rows="2">${this.esc(c.text || '')}</textarea>
                <div class="ne-field-label mt-8">NARRATIVE (what happens)</div>
                <textarea class="w95-textarea" data-wk-choice="${i}" data-wk-field="narrative" rows="2">${this.esc(c.narrative || '')}</textarea>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;

    document.getElementById('wk-text')?.addEventListener('input', (e) => { node.text = e.target.value; this.markDirty(); });
    area.querySelectorAll('[data-wk-choice]').forEach(el => {
      el.addEventListener('input', () => {
        const idx = parseInt(el.dataset.wkChoice);
        const field = el.dataset.wkField;
        if (node.choices[idx]) { node.choices[idx][field] = el.value; this.markDirty(); }
      });
    });
  },

  renderArcEditor() {
    const area = document.getElementById('editor-area');
    area.innerHTML = `
      <div class="node-editor">
        <div class="ne-header">
          <span class="ne-type-badge hole">ARC</span>
          <span class="ne-title">${this.data.meta.title}</span>
        </div>
        <div class="ne-field">
          <div class="ne-field-label">TITLE</div>
          <input class="w95-input" id="arc-title" value="${this.esc(this.data.meta.title)}" />
        </div>
        <div class="ne-field">
          <div class="ne-field-label">SUBTITLE</div>
          <input class="w95-input" id="arc-sub" value="${this.esc(this.data.meta.subtitle)}" />
        </div>
        <div class="ne-field">
          <div class="ne-field-label">STORY OVERVIEW</div>
          <div style="font-size:10px;line-height:1.8;padding:8px;background:#fafafa;border:1px solid #ddd">
            <strong>Act 1 (Holes 1-3):</strong> ${this.data.holes.slice(0,3).map(h=>`${h.number}. ${h.name}`).join(' → ')}<br>
            <strong>Act 2 (Holes 4-6):</strong> ${this.data.holes.slice(3,6).map(h=>`${h.number}. ${h.name}`).join(' → ')}<br>
            <strong>Act 3 (Holes 7-9):</strong> ${this.data.holes.slice(6,9).map(h=>`${h.number}. ${h.name}`).join(' → ')}<br>
            <strong>Endings:</strong> ${this.data.endings.map(e=>e.name).join(' • ')}<br>
            <strong>Flags:</strong> ${this.data.flags.length} narrative flags<br>
            <strong>NPCs:</strong> ${Object.keys(this.data.npcs).length}
          </div>
        </div>
      </div>`;
    document.getElementById('arc-title')?.addEventListener('input', (e) => { this.data.meta.title = e.target.value; this.markDirty(); });
    document.getElementById('arc-sub')?.addEventListener('input', (e) => { this.data.meta.subtitle = e.target.value; this.markDirty(); });
  },

  renderEndingsEditor() {
    const area = document.getElementById('editor-area');
    let html = `<div class="node-editor"><div class="ne-header"><span class="ne-type-badge beat">ENDINGS</span><span class="ne-title">${this.data.endings.length} endings</span></div>`;
    for (const e of this.data.endings) {
      html += `
        <div class="response-card mb-8">
          <div class="response-card-header"><span class="response-card-label">${this.esc(e.name)}</span><span class="response-card-stat">${e.status}</span></div>
          <div class="response-card-body">
            <div class="ne-field-label">CONDITIONS</div>
            <input class="w95-input mb-4" value="${this.esc(e.conditions)}" data-ending="${e.id}" data-ef="conditions" />
            <div class="ne-field-label">DESCRIPTION</div>
            <textarea class="w95-textarea" rows="2" data-ending="${e.id}" data-ef="description">${this.esc(e.description)}</textarea>
            <div class="ne-field-label mt-8">FULL TEXT <button class="ne-ai-btn" onclick="AiAssist.enhanceField('${e.id}', 'endingText')">🤖 AI Write</button></div>
            <textarea class="w95-textarea" rows="4" data-ending="${e.id}" data-ef="text">${this.esc(e.text || '')}</textarea>
          </div>
        </div>`;
    }
    html += '</div>';
    area.innerHTML = html;

    area.querySelectorAll('[data-ending]').forEach(el => {
      el.addEventListener('input', () => {
        const ending = this.data.endings.find(e => e.id === el.dataset.ending);
        if (ending) { ending[el.dataset.ef] = el.value; this.markDirty(); }
      });
    });
  },

  renderEndingEditor(ending) {
    this.renderEndingsEditor();
  },

  // ─── Story Map ───
  renderMap() {
    const area = document.getElementById('editor-area');
    let html = '<div class="story-map">';

    for (const hole of this.data.holes) {
      const b = hole.beats;
      const beatList = [
        { icon: '📖', label: 'Intro', status: b.intro?.status, id: `intro_h${hole.number}` },
        { icon: '🏌️', label: `Tee (${b.tee_thoughts?.length || 0})`, status: b.tee_thoughts?.length ? 'written' : 'empty', id: `tee_h${hole.number}` },
        { icon: '🚶', label: 'Walk', status: b.walking_1?.status || 'empty', id: b.walking_1?.id },
        { icon: '🏌️', label: `Approach (${b.approach_thoughts?.length || 0})`, status: b.approach_thoughts?.length ? 'written' : 'empty', id: `approach_h${hole.number}` },
        { icon: '🏌️', label: `Putt (${b.putt_thoughts?.length || 0})`, status: b.putt_thoughts?.length ? 'written' : 'empty', id: `putt_h${hole.number}` },
        { icon: '💬', label: `Dialogue (${b.dialogue_tree?.nodes?.length || 0})`, status: b.dialogue_tree?.status || 'empty', id: b.dialogue_tree?.id },
        { icon: '📱', label: 'Phone', status: b.phone?.status || 'empty', id: b.phone?.id },
      ];

      html += `<div class="map-hole">
        <div class="map-hole-header">HOLE ${hole.number}: ${hole.name.toUpperCase()}</div>
        <div class="map-hole-body">
          <div class="text-dim mb-4" style="font-size:9px">${hole.theme}</div>`;

      for (const beat of beatList) {
        const cls = beat.status === 'empty' ? 'empty' : 'has-content';
        html += `<div class="map-beat ${cls}" data-map-id="${beat.id || ''}" data-map-type="beat">
          <span class="map-beat-icon">${beat.icon}</span>
          ${this.statusIcon(beat.status)} ${beat.label}
        </div>`;
      }
      html += '</div></div>';

      if (hole.number < 9) html += '<div class="map-connector">→</div>';
    }

    html += '</div>';
    area.innerHTML = html;

    area.querySelectorAll('.map-beat[data-map-id]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.mapId;
        if (id) {
          this.switchView('tree');
          this.selectNode(id, 'beat');
        }
      });
    });
  },

  // ─── NPC Panel ───
  renderNpcPanel() {
    const area = document.getElementById('editor-area');
    this.updateNpcLineCounts();
    let html = '<div class="node-editor">';
    for (const [key, npc] of Object.entries(this.data.npcs)) {
      html += `
        <div class="npc-card">
          <div class="npc-header">
            ${npc.icon} ${npc.name}
            <span class="npc-lines-count">${npc.lineCount} lines</span>
          </div>
          <div class="npc-body">
            <div><strong>Role:</strong> ${this.esc(npc.role)}</div>
            <div><strong>Personality:</strong> ${this.esc(npc.personality)}</div>
            ${npc.secret ? `<div class="npc-stat"><strong>Secret:</strong> ${this.esc(npc.secret)}</div>` : ''}
            <div class="mt-8">
              <button class="ne-ai-btn" onclick="AiAssist.generateNpcLines('${key}')">🤖 Generate Lines</button>
            </div>
          </div>
        </div>`;
    }
    html += '</div>';
    area.innerHTML = html;
  },

  // ─── Flag Panel ───
  renderFlagPanel() {
    const area = document.getElementById('editor-area');
    let html = '<div class="node-editor"><div class="ne-header"><span class="ne-type-badge beat">FLAGS</span><span class="ne-title">' + this.data.flags.length + ' narrative flags</span></div>';

    for (const f of this.data.flags) {
      html += `
        <div class="flag-item">
          <span class="flag-name">${this.esc(f.id)}</span>
          <span class="flag-setby">set: ${this.esc(f.setBy)}</span>
          <span class="flag-readby">read: ${(f.readBy || []).join(', ')}</span>
        </div>`;
    }
    html += `<div class="mt-8"><button class="tool-btn" onclick="Editor.addFlag()">+ Add Flag</button></div></div>`;
    area.innerHTML = html;
  },

  // ─── Context Panel ───
  renderContext(id, type) {
    const nodeBody = document.getElementById('ctx-node-body');
    const conBody = document.getElementById('ctx-connections-body');
    const flagBody = document.getElementById('ctx-flags-body');
    const statBody = document.getElementById('ctx-stats-body');

    nodeBody.textContent = `${type}: ${id}`;

    // Find flags related to this node
    const relatedFlags = this.data.flags.filter(f =>
      f.setBy === id || (f.readBy || []).includes(id)
    );
    flagBody.innerHTML = relatedFlags.length
      ? relatedFlags.map(f => `<div class="flag-item"><span class="flag-name">${f.id}</span></div>`).join('')
      : '—';

    conBody.textContent = '—';
    statBody.textContent = '—';
  },

  // ─── Add Operations ───
  addThought(holeNum, type) {
    const hole = this.data.holes.find(h => h.number === holeNum);
    if (!hole) return;
    const key = `${type}_thoughts`;
    hole.beats[key] = hole.beats[key] || [];
    const id = `thought_h${holeNum}_${type}_${hole.beats[key].length + 1}`;
    hole.beats[key].push({
      id, label: 'NEW THOUGHT', text: '', baseQuality: 3,
      traitEffects: {}, resultGood: '', resultBad: '', status: 'empty',
    });
    this.markDirty();
    this.renderTree();
    this.selectNode(id, 'thought');
  },

  addDialogueNode(holeNum) {
    const hole = this.data.holes.find(h => h.number === holeNum);
    if (!hole || !hole.beats.dialogue_tree) return;
    const nodes = hole.beats.dialogue_tree.nodes;
    const id = `node_${nodes.length + 1}`;
    nodes.push({ id, speaker: 'dave', text: '', next: null, responses: [] });
    hole.beats.dialogue_tree.status = 'draft';
    this.markDirty();
    this.renderTree();
  },

  addResponse(parentId) {
    const node = this.findDialogueNodeById(parentId);
    if (!node || !node.responses) return;
    node.responses.push({
      id: `r_new_${node.responses.length}`,
      label: 'NEW', text: '', statKey: 'swagger',
      receivedVariants: { 1: '', 2: '', 3: '', 4: '', 5: '' },
      traitEffects: {}, partnerEffect: {}, setFlags: {}, next: '',
    });
    this.markDirty();
    this.renderNodeEditor(parentId, 'dialogue');
  },

  deleteResponse(parentId, idx) {
    const node = this.findDialogueNodeById(parentId);
    if (!node || !node.responses) return;
    node.responses.splice(idx, 1);
    this.markDirty();
    this.renderNodeEditor(parentId, 'dialogue');
  },

  addWalking(holeNum) {
    const hole = this.data.holes.find(h => h.number === holeNum);
    if (!hole) return;
    const id = `walk_h${holeNum}_1`;
    hole.beats.walking_1 = { id, text: '', choices: [], status: 'empty' };
    this.markDirty();
    this.renderTree();
    this.selectNode(id, 'walking');
  },

  addWalkingChoice(walkId) {
    const node = this.findNodeById(walkId);
    if (!node || !node.choices) return;
    node.choices.push({ label: 'NEW', text: '', traitEffects: {}, narrative: '' });
    this.markDirty();
    this.renderNodeEditor(walkId, 'walking');
  },

  addPhone(holeNum) {
    const hole = this.data.holes.find(h => h.number === holeNum);
    if (!hole) return;
    hole.beats.phone = { id: `phone_h${holeNum}`, from: 'sharon', type: 'text', preview: '', fullText: '', responses: [], status: 'empty' };
    this.markDirty();
    this.renderTree();
  },

  addHole() {
    const num = this.data.holes.length + 1;
    this.data.holes.push({
      number: num, name: `Hole ${num}`, par: 4, yards: 350, theme: '', arcBeat: '',
      beats: {
        intro: { id: `intro_h${num}`, text: '', status: 'empty' },
        tee_thoughts: [], walking_1: null, approach_thoughts: [], putt_thoughts: [],
        dialogue_tree: { id: `dialogue_h${num}`, nodes: [], status: 'empty' }, phone: null,
      },
    });
    this.markDirty();
    this.renderTree();
  },

  addNpc() {
    const id = prompt('NPC ID (lowercase, no spaces):');
    if (!id) return;
    this.data.npcs[id] = { id, name: id, role: '', personality: '', secret: '', statKey: null, icon: '👤', lineCount: 0 };
    this.markDirty();
    if (this.currentView === 'npcs') this.renderNpcPanel();
  },

  addFlag() {
    const id = prompt('Flag name (snake_case):');
    if (!id) return;
    this.data.flags.push({ id, setBy: '', readBy: [], description: '' });
    this.markDirty();
    if (this.currentView === 'flags') this.renderFlagPanel();
  },

  // ─── Data Lookup ───
  findNodeById(id) {
    for (const hole of this.data.holes) {
      if (hole.beats.intro?.id === id) return hole.beats.intro;
      if (hole.beats.walking_1?.id === id) return hole.beats.walking_1;
      if (hole.beats.phone?.id === id) return hole.beats.phone;
      if (hole.beats.dialogue_tree?.id === id) return hole.beats.dialogue_tree;
      for (const t of (hole.beats.tee_thoughts || [])) { if (t.id === id) return t; }
      for (const t of (hole.beats.approach_thoughts || [])) { if (t.id === id) return t; }
      for (const t of (hole.beats.putt_thoughts || [])) { if (t.id === id) return t; }
      // Dialogue sub-nodes
      for (const n of (hole.beats.dialogue_tree?.nodes || [])) {
        if (`${hole.beats.dialogue_tree.id}_${n.id}` === id) return n;
      }
    }
    return null;
  },

  findDialogueNodeById(compositeId) {
    for (const hole of this.data.holes) {
      const tree = hole.beats.dialogue_tree;
      if (!tree) continue;
      for (const n of tree.nodes) {
        if (`${tree.id}_${n.id}` === compositeId) return n;
      }
    }
    return null;
  },

  updateNpcLineCounts() {
    for (const key of Object.keys(this.data.npcs)) this.data.npcs[key].lineCount = 0;
    for (const hole of this.data.holes) {
      for (const n of (hole.beats.dialogue_tree?.nodes || [])) {
        if (this.data.npcs[n.speaker]) this.data.npcs[n.speaker].lineCount++;
      }
    }
  },

  // ─── Save / Export / Import ───
  save() {
    const json = JSON.stringify(this.data, null, 2);
    localStorage.setItem('corporate_golf_story', json);
    this.dirty = false;
    this.setStatus('Saved to browser storage');
  },

  exportJS() {
    const json = JSON.stringify(this.data, null, 2);
    const blob = new Blob([`// Corporate Golf Story Data — Exported ${new Date().toISOString()}\nconst EDITOR_DATA = ${json};\n`], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'story-export.js';
    a.click();
    URL.revokeObjectURL(url);
    this.setStatus('Exported to story-export.js');
  },

  importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let text = e.target.result;
        // Strip the JS variable declaration if present
        text = text.replace(/^.*?const\s+EDITOR_DATA\s*=\s*/s, '').replace(/;\s*$/, '');
        this.data = JSON.parse(text);
        this.renderTree();
        this.setStatus('Imported: ' + file.name);
      } catch (err) {
        alert('Import failed: ' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  },

  // ─── Modal ───
  openModal(title, bodyHTML) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-overlay').classList.add('open');
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
  },

  // ─── Util ───
  esc(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },
};

// ─── Boot ───
document.addEventListener('DOMContentLoaded', () => {
  // Try loading from localStorage first
  const saved = localStorage.getItem('corporate_golf_story');
  if (saved) {
    try {
      EDITOR_DATA.__saved = JSON.parse(saved);
    } catch {}
  }

  Editor.init();
});
