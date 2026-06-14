const PromptTree = {
    render(categoryId, tree) {
      const nav = document.getElementById('treeNav');
      const cat = tree.categories.find(c => c.id === categoryId);
      if (!cat) return;
  
      nav.innerHTML = `
        <div class="tree-item selected">
          <span>${cat.icon}</span>
          <span>${cat.label}</span>
        </div>
        <div style="margin-left: 12px; border-left: 1px solid var(--border); padding-left: 12px; margin-top: 4px;">
          <div class="tree-item" id="treeFormat">📄 Format</div>
          <div class="tree-item" id="treeTone">🎭 Tone</div>
          <div class="tree-item" id="treeAudience">👥 Audience</div>
          <div class="tree-item" id="treeDetails">📝 Details</div>
        </div>
      `;
    },
  
    markComplete(step) {
      const el = document.getElementById(`tree${step}`);
      if (el) {
        el.classList.add('selected');
        el.innerHTML = el.innerHTML.replace(/^./, '✅');
      }
    }
  };