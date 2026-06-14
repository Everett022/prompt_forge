const Dashboard = {
    tree: null,
    state: {
      category: null,
      format: null,
      tone: null,
      audience: null,
      answers: {}
    },
  
    async init() {
      try {
        this.tree = await API.getTree();
        this.renderCategoryGrid();
        this.bindHeaderButtons();
      } catch (e) {
        showToast('Cannot connect to backend. Is the server running?', 'error');
      }
    },
  
    renderCategoryGrid() {
      const grid = document.getElementById('categoryGrid');
      const descriptions = {
        content: 'Blogs, social, email, scripts',
        code: 'Write, debug, review, explain',
        analysis: 'Research, compare, assess',
        business: 'Strategy, pitches, proposals',
        creative: 'Stories, poems, worldbuilding',
        learning: 'Explain concepts & tutorials'
      };
  
      grid.innerHTML = this.tree.categories.map(cat => `
        <div class="category-card" data-id="${cat.id}">
          <div class="category-icon">${cat.icon}</div>
          <div class="category-name">${cat.label}</div>
          <div class="category-desc">${descriptions[cat.id] || ''}</div>
        </div>
      `).join('');
  
      grid.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => this.selectCategory(card.dataset.id));
      });
    },
  
    selectCategory(categoryId) {
      this.state = { category: categoryId, format: null, tone: null, audience: null, answers: {} };
      document.getElementById('categoryOverlay').style.display = 'none';
      this.updateBreadcrumb([categoryId]);
      PromptTree.render(categoryId, this.tree);
      this.renderOptions(categoryId);
      WorkflowPanel.load();
    },
  
    renderOptions(categoryId) {
      const branch = this.tree.branches[categoryId];
      if (!branch) return;
  
      const content = document.getElementById('optionsContent');
      content.innerHTML = `
        <div class="option-group">
          <div class="option-group-label">Format</div>
          <div class="option-chips" id="formatChips">
            ${branch.formats.map(f => `<div class="chip" data-type="format" data-value="${f}">${f}</div>`).join('')}
          </div>
        </div>
        <div class="option-group">
          <div class="option-group-label">Tone</div>
          <div class="option-chips" id="toneChips">
            ${branch.tones.map(t => `<div class="chip" data-type="tone" data-value="${t}">${t}</div>`).join('')}
          </div>
        </div>
        <div class="option-group">
          <div class="option-group-label">Audience</div>
          <div class="option-chips" id="audienceChips">
            ${branch.audiences.map(a => `<div class="chip" data-type="audience" data-value="${a}">${a}</div>`).join('')}
          </div>
        </div>
      `;
  
      content.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => this.selectChip(chip));
      });
    },
  
    selectChip(chip) {
      const type = chip.dataset.type;
      const value = chip.dataset.value;
  
      document.querySelectorAll(`.chip[data-type="${type}"]`).forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      this.state[type] = value;
  
      const allSelected = this.state.format && this.state.tone && this.state.audience;
      if (allSelected) {
        this.showQuestions();
      }
    },
  
    async showQuestions() {
      const branch = this.tree.branches[this.state.category];
      if (!branch) return;
  
      const panel = document.getElementById('questionsPanel');
      const list = document.getElementById('questionsList');
      panel.style.display = 'flex';
  
      list.innerHTML = branch.questions.map(q => `
        <div class="question-item">
          <label class="question-label">${q.label}</label>
          ${q.type === 'select'
            ? `<select class="select-input" data-qid="${q.id}">
                 <option value="">Choose...</option>
                 ${q.options.map(o => `<option value="${o}">${o}</option>`).join('')}
               </select>`
            : `<input type="text" class="input" data-qid="${q.id}" placeholder="Type your answer..." />`
          }
        </div>
      `).join('');
  
      document.getElementById('buildPromptBtn').onclick = () => this.buildPrompt();
      document.getElementById('closeQuestionsBtn').onclick = () => {
        panel.style.display = 'none';
      };
    },
  
    async buildPrompt() {
      const inputs = document.querySelectorAll('[data-qid]');
      inputs.forEach(input => {
        if (input.value) this.state.answers[input.dataset.qid] = input.value;
      });
  
      try {
        const result = await API.buildPrompt(this.state);
        document.getElementById('promptCanvas').value = result.prompt;
        updateCharCount();
        document.getElementById('questionsPanel').style.display = 'none';
        showToast('Prompt built! ✨', 'success');
      } catch (e) {
        showToast('Failed to build prompt', 'error');
      }
    },
  
    updateBreadcrumb(crumbs) {
      const bc = document.getElementById('breadcrumb');
      const labels = { start: 'Start', ...Object.fromEntries(
        (this.tree?.categories || []).map(c => [c.id, c.label])
      )};
      bc.innerHTML = ['Start', ...crumbs].map((c, i, arr) =>
        `<span class="crumb ${i === arr.length - 1 ? 'active' : ''}">${labels[c] || c}</span>`
      ).join('');
    },
  
    bindHeaderButtons() {
      document.getElementById('newPromptBtn').onclick = () => {
        this.state = { category: null, format: null, tone: null, audience: null, answers: {} };
        document.getElementById('categoryOverlay').style.display = 'flex';
        document.getElementById('promptCanvas').value = '';
        document.getElementById('questionsPanel').style.display = 'none';
        document.getElementById('optionsContent').innerHTML = '<p class="placeholder-text">Select a category to see options</p>';
        document.getElementById('treeNav').innerHTML = '';
        updateCharCount();
      };
  
      document.getElementById('copyBtn').onclick = () => {
        const text = document.getElementById('promptCanvas').value;
        if (!text) return showToast('Nothing to copy', 'error');
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
      };
  
      document.getElementById('clearBtn').onclick = () => {
        document.getElementById('promptCanvas').value = '';
        updateCharCount();
      };
  
      document.getElementById('enhanceBtn').onclick = async () => {
        const text = document.getElementById('promptCanvas').value;
        if (!text.trim()) return showToast('Write a prompt first', 'error');
        const btn = document.getElementById('enhanceBtn');
        btn.innerHTML = '<span class="spinner"></span> Enhancing...';
        btn.disabled = true;
        try {
          const result = await API.enhancePrompt(text, this.state);
          document.getElementById('promptCanvas').value = result.enhanced_prompt;
          updateCharCount();
          showToast('Prompt enhanced! 🚀', 'success');
        } catch (e) {
          showToast('Enhancement failed', 'error');
        } finally {
          btn.innerHTML = '✨ Enhance with AI';
          btn.disabled = false;
        }
      };
  
      document.getElementById('saveWorkflowBtn').onclick = () => {
        const text = document.getElementById('promptCanvas').value;
        if (!text.trim()) return showToast('Build a prompt first', 'error');
        document.getElementById('modalOverlay').style.display = 'flex';
      };
  
      document.getElementById('closeModalBtn').onclick = () => {
        document.getElementById('modalOverlay').style.display = 'none';
      };
  
      document.getElementById('cancelModalBtn').onclick = () => {
        document.getElementById('modalOverlay').style.display = 'none';
      };
  
      document.getElementById('confirmSaveBtn').onclick = async () => {
        const name = document.getElementById('workflowName').value.trim();
        if (!name) return showToast('Enter a workflow name', 'error');
        const desc = document.getElementById('workflowDesc').value.trim();
        const prompt = document.getElementById('promptCanvas').value;
        try {
          await API.saveWorkflow({
            name,
            description: desc,
            tree_state: this.state,
            final_prompt: prompt,
            category: this.state.category
          });
          document.getElementById('modalOverlay').style.display = 'none';
          document.getElementById('workflowName').value = '';
          document.getElementById('workflowDesc').value = '';
          showToast('Workflow saved! 💾', 'success');
          WorkflowPanel.load();
        } catch (e) {
          showToast('Failed to save workflow', 'error');
        }
      };
    },
  
    getState() { return this.state; }
  };