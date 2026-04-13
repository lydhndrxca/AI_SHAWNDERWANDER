// ─── AI Assist Module ───
// Pluggable AI enhancement for the story editor.
// Supports OpenAI, Anthropic, or any compatible endpoint.

const AiAssist = {
  config: {
    provider: localStorage.getItem('ai_provider') || 'openai',
    apiKey: localStorage.getItem('ai_key') || '',
    model: localStorage.getItem('ai_model') || 'gpt-4o',
    endpoint: localStorage.getItem('ai_endpoint') || '',
  },

  PROVIDERS: {
    openai: { name: 'OpenAI', endpoint: 'https://api.openai.com/v1/chat/completions', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'] },
    anthropic: { name: 'Anthropic', endpoint: 'https://api.anthropic.com/v1/messages', models: ['claude-sonnet-4-20250514', 'claude-haiku-4-20250414'] },
    custom: { name: 'Custom Endpoint', endpoint: '', models: [] },
  },

  SYSTEM_PROMPT: `You are a narrative writer for "Corporate Golf," a text-based game set at Pebble Beach where corporate politics collide with golf. The tone is dark comedy — satirical but sincere. Think Office Space meets Caddyshack.

Characters:
- Player: Mid-level corporate employee, decent golfer, navigating career politics
- Dave Kowalski: Senior associate, friendly but competitive, been passed over twice
- Sharon Whitfield: VP, sharp and strategic, leaving the company in 3 months
- Tom Anderson: Client CEO, old money charm, might not renew
- Narrator: Calm, literary, wry, intimate voice

Style rules:
- Write in second person ("You walk to the ball...")
- Keep dialogue natural — people talk in fragments, not speeches
- Golf details should be specific and accurate
- Corporate satire should be subtle, not cartoonish
- Every line should serve both the golf game and the corporate story
- Humor comes from recognition, not slapstick`,

  // ─── Settings UI ───
  showSettings() {
    const c = this.config;
    Editor.openModal('AI Configuration', `
      <div class="ne-field">
        <div class="ne-field-label">PROVIDER</div>
        <select class="w95-select" id="ai-provider">
          <option value="openai" ${c.provider === 'openai' ? 'selected' : ''}>OpenAI</option>
          <option value="anthropic" ${c.provider === 'anthropic' ? 'selected' : ''}>Anthropic</option>
          <option value="custom" ${c.provider === 'custom' ? 'selected' : ''}>Custom Endpoint</option>
        </select>
      </div>
      <div class="ne-field">
        <div class="ne-field-label">API KEY</div>
        <input class="w95-input" id="ai-key" type="password" value="${c.apiKey}" placeholder="sk-..." />
      </div>
      <div class="ne-field">
        <div class="ne-field-label">MODEL</div>
        <input class="w95-input" id="ai-model" value="${c.model}" />
      </div>
      <div class="ne-field">
        <div class="ne-field-label">CUSTOM ENDPOINT (only for Custom provider)</div>
        <input class="w95-input" id="ai-endpoint" value="${c.endpoint}" placeholder="https://..." />
      </div>
      <div class="modal-actions">
        <button class="tool-btn" id="ai-save-btn">Save</button>
        <button class="tool-btn" id="ai-test-btn">Test Connection</button>
      </div>
    `);

    document.getElementById('ai-save-btn').addEventListener('click', () => {
      this.config.provider = document.getElementById('ai-provider').value;
      this.config.apiKey = document.getElementById('ai-key').value;
      this.config.model = document.getElementById('ai-model').value;
      this.config.endpoint = document.getElementById('ai-endpoint').value;
      localStorage.setItem('ai_provider', this.config.provider);
      localStorage.setItem('ai_key', this.config.apiKey);
      localStorage.setItem('ai_model', this.config.model);
      localStorage.setItem('ai_endpoint', this.config.endpoint);
      Editor.closeModal();
      Editor.setStatus('AI settings saved');
    });

    document.getElementById('ai-test-btn').addEventListener('click', async () => {
      this.config.provider = document.getElementById('ai-provider').value;
      this.config.apiKey = document.getElementById('ai-key').value;
      this.config.model = document.getElementById('ai-model').value;
      try {
        const result = await this.call('Say "Connected!" and nothing else.');
        alert('Success: ' + result);
      } catch (err) {
        alert('Failed: ' + err.message);
      }
    });
  },

  // ─── Core API Call ───
  async call(userPrompt, options = {}) {
    const { provider, apiKey, model } = this.config;
    if (!apiKey) throw new Error('No API key configured. Click AI Config to set up.');

    const systemPrompt = options.systemPrompt || this.SYSTEM_PROMPT;
    let endpoint, headers, body;

    if (provider === 'openai' || provider === 'custom') {
      endpoint = provider === 'custom' ? this.config.endpoint : this.PROVIDERS.openai.endpoint;
      headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` };
      body = JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: options.temperature || 0.8,
        max_tokens: options.maxTokens || 1000,
      });
    } else if (provider === 'anthropic') {
      endpoint = this.PROVIDERS.anthropic.endpoint;
      headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      };
      body = JSON.stringify({
        model,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.8,
      });
    }

    Editor.setStatus('AI working...');

    const response = await fetch(endpoint, { method: 'POST', headers, body });
    if (!response.ok) {
      const err = await response.text();
      Editor.setStatus('AI error');
      throw new Error(`API ${response.status}: ${err.slice(0, 200)}`);
    }

    const data = await response.json();
    Editor.setStatus('AI complete');

    if (provider === 'anthropic') {
      return data.content?.[0]?.text || '';
    }
    return data.choices?.[0]?.message?.content || '';
  },

  // ─── Enhance a specific field ───
  async enhanceField(nodeId, fieldType) {
    const node = Editor.findNodeById(nodeId) || Editor.data.endings.find(e => e.id === nodeId);
    if (!node) return;

    const contextHole = this.getHoleContext(nodeId);

    const prompts = {
      text: `Enhance this game text. Keep the same meaning but make it more vivid and engaging. Return ONLY the enhanced text, nothing else.\n\nCurrent: "${node.text}"${contextHole}`,
      thought: `Enhance this swing thought for a golf game. It should be vivid, specific, and capture what's going through the golfer's mind in the moment of the swing. Return ONLY the enhanced text.\n\nCurrent: "${node.text}"${contextHole}`,
      resultGood: `Write a vivid good-result narrative for this golf shot. The player chose "${node.text}" as their swing thought and it worked. 2-3 sentences, specific golf details. Return ONLY the narrative.\n\nLabel: ${node.label}${contextHole}`,
      resultBad: `Write a vivid bad-result narrative for this golf shot. The player chose "${node.text}" as their swing thought and it didn't work. 2-3 sentences, specific golf details, slightly humorous. Return ONLY the narrative.\n\nLabel: ${node.label}${contextHole}`,
      dialogueText: `Enhance this dialogue line for the game. Make it sound natural and character-appropriate. Return ONLY the line.\n\nSpeaker: ${node.speaker}\nCurrent: "${node.text}"${contextHole}`,
      walkingText: `Write a walking moment for this golf game. The player is walking between shots. It should ground them physically (the fairway, ocean, weather) and introduce a small story element. 2-3 sentences. Return ONLY the text.\n${contextHole}`,
      phoneText: `Write a text message from ${node.from || 'Sharon'} for this golf game. It should feel like a real text — casual but with subtext. Keep it under 3 sentences. Return ONLY the message text.\n${contextHole}`,
      intro: `Write a hole introduction for Pebble Beach. It should describe what the player sees from the tee — the course, the scenery, the atmosphere — and subtly establish the thematic feel. 3-4 sentences. Return ONLY the intro text.\n${contextHole}`,
      arcBeat: `Enhance this story arc beat description. It should clearly state what happens narratively on this hole and how it connects to the larger corporate story. 2-3 sentences. Return ONLY the text.\n\nCurrent: "${node.arcBeat || node.text}"${contextHole}`,
      endingText: `Write a full ending scene for this Corporate Golf ending. It should be 4-6 sentences, capturing the emotional resolution of the round. The tone should match the ending type.\n\nEnding: ${node.name}\nConditions: ${node.conditions}\nDescription: ${node.description}\n\nReturn ONLY the ending text.`,
    };

    const prompt = prompts[fieldType] || prompts.text;

    try {
      const result = await this.call(prompt);
      this.showResultModal(fieldType, node, result);
    } catch (err) {
      alert('AI Error: ' + err.message);
    }
  },

  // ─── Fill all 5 tier variants for a response ───
  async fillVariants(parentId, responseIdx) {
    const node = Editor.findDialogueNodeById(parentId);
    if (!node || !node.responses[responseIdx]) return;
    const r = node.responses[responseIdx];

    const prompt = `For this dialogue response in Corporate Golf, write 5 stat-tier variants. The player CHOSE to say this, but what the NPC HEARS depends on the player's ${r.statKey || 'swagger'} stat.

Player's intent: "${r.text}"
Label: ${r.label}
Context: A conversation with Dave (golf buddy) at Pebble Beach

Write 5 versions of how this line LANDS:
- Tier 1 (stat 0-20): DISASTROUS — embarrassing, socially painful, makes it worse
- Tier 2 (stat 21-40): AWKWARD — clumsy, try-hard, not quite right
- Tier 3 (stat 41-60): NORMAL — fine, unremarkable, adequate
- Tier 4 (stat 61-80): SMOOTH — charming, well-delivered, impressive
- Tier 5 (stat 81-100): MAGNETIC — perfect delivery, memorable, connection-building

Format EXACTLY like this (one per line, starting with the tier number and a pipe):
1|[tier 1 text]
2|[tier 2 text]
3|[tier 3 text]
4|[tier 4 text]
5|[tier 5 text]`;

    try {
      const result = await this.call(prompt, { temperature: 0.9 });
      const variants = {};
      for (const line of result.split('\n')) {
        const match = line.match(/^(\d)\|(.+)/);
        if (match) variants[parseInt(match[1])] = match[2].trim();
      }

      if (Object.keys(variants).length >= 3) {
        r.receivedVariants = { ...r.receivedVariants, ...variants };
        Editor.markDirty();
        Editor.renderNodeEditor(parentId, 'dialogue');
        Editor.setStatus(`AI filled ${Object.keys(variants).length} variants`);
      } else {
        this.showResultModal('variants', r, result);
      }
    } catch (err) {
      alert('AI Error: ' + err.message);
    }
  },

  // ─── Fill a single tier variant ───
  async fillSingleVariant(parentId, responseIdx, tier) {
    const node = Editor.findDialogueNodeById(parentId);
    if (!node || !node.responses[responseIdx]) return;
    const r = node.responses[responseIdx];
    const tierLabels = { 1: 'DISASTROUS (stat 0-20)', 2: 'AWKWARD (stat 21-40)', 3: 'NORMAL (stat 41-60)', 4: 'SMOOTH (stat 61-80)', 5: 'MAGNETIC (stat 81-100)' };

    const prompt = `Write a ${tierLabels[tier]} version of how this dialogue lands in Corporate Golf.

Player chose: "${r.text}"
Stat being tested: ${r.statKey || 'swagger'}
Tier ${tier}: ${tierLabels[tier]}

Write ONLY the received version — what the NPC experiences. 1-3 sentences. Describe the delivery, body language, and impact.`;

    try {
      const result = await this.call(prompt, { temperature: 0.85, maxTokens: 300 });
      r.receivedVariants = r.receivedVariants || {};
      r.receivedVariants[tier] = result.trim().replace(/^["']|["']$/g, '');
      Editor.markDirty();
      Editor.renderNodeEditor(parentId, 'dialogue');
      Editor.setStatus(`AI filled tier ${tier}`);
    } catch (err) {
      alert('AI Error: ' + err.message);
    }
  },

  // ─── Enhance hole intro or arc beat ───
  async enhance(type, holeNum) {
    const hole = Editor.data.holes.find(h => h.number === holeNum);
    if (!hole) return;
    await this.enhanceField(`hole_${holeNum}`, type === 'intro' ? 'intro' : 'arcBeat');
  },

  // ─── Generate NPC lines ───
  async generateNpcLines(npcKey) {
    const npc = Editor.data.npcs[npcKey];
    if (!npc) return;

    const prompt = `Generate 5 short voice lines for ${npc.name} (${npc.role}) in Corporate Golf. These are ambient reactions — not full dialogue, just quick responses to golf shots or situations.

Character: ${npc.name}
Personality: ${npc.personality}
Context: Corporate golf outing at Pebble Beach

Generate 5 lines, one per line. Each should be 1-10 words. Mix reactions: impressed, sympathetic, amused, competitive, thoughtful.`;

    try {
      const result = await this.call(prompt, { temperature: 0.9, maxTokens: 300 });
      Editor.openModal(`Generated Lines: ${npc.name}`, `
        <div class="ne-field-label">AI-GENERATED LINES</div>
        <div style="font-size:11px;line-height:2;white-space:pre-wrap;background:#fafafa;padding:8px;border:1px solid #ddd">${result}</div>
        <div class="text-dim mt-8">Copy lines you like into the dialogue trees or audio manifest.</div>
      `);
    } catch (err) {
      alert('AI Error: ' + err.message);
    }
  },

  // ─── Result Modal ───
  showResultModal(fieldType, node, result) {
    Editor.openModal('AI Result', `
      <div class="ne-field-label">AI GENERATED (${fieldType})</div>
      <textarea class="w95-textarea" id="ai-result" rows="8" style="width:100%">${result}</textarea>
      <div class="modal-actions">
        <button class="tool-btn" id="ai-accept">Accept</button>
        <button class="tool-btn" id="ai-reject">Discard</button>
      </div>
    `);

    document.getElementById('ai-accept')?.addEventListener('click', () => {
      const val = document.getElementById('ai-result').value;
      const fieldMap = {
        text: 'text', thought: 'text', dialogueText: 'text', walkingText: 'text',
        phoneText: 'fullText', intro: 'text', arcBeat: 'arcBeat',
        resultGood: 'resultGood', resultBad: 'resultBad',
        endingText: 'text',
      };
      const field = fieldMap[fieldType] || 'text';
      node[field] = val;
      Editor.markDirty();
      Editor.closeModal();
      if (Editor.selectedNode) {
        Editor.renderNodeEditor(Editor.selectedNode.id, Editor.selectedNode.type);
      }
    });

    document.getElementById('ai-reject')?.addEventListener('click', () => {
      Editor.closeModal();
    });
  },

  // ─── Context Helper ───
  getHoleContext(nodeId) {
    for (const hole of Editor.data.holes) {
      const ids = [
        hole.beats.intro?.id,
        hole.beats.walking_1?.id,
        hole.beats.phone?.id,
        hole.beats.dialogue_tree?.id,
        ...(hole.beats.tee_thoughts || []).map(t => t.id),
        ...(hole.beats.dialogue_tree?.nodes || []).map(n => `${hole.beats.dialogue_tree.id}_${n.id}`),
      ];
      if (ids.includes(nodeId)) {
        return `\n\nHole ${hole.number}: "${hole.name}" — ${hole.theme}\nArc beat: ${hole.arcBeat}\nPar ${hole.par}, ${hole.yards} yards.`;
      }
    }
    return '';
  },
};
