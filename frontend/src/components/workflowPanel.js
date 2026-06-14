const WorkflowPanel = {
    async load() {
      try {
        const workflows = await API.getWorkflows();
        const section = document.getElementById('workflowSection');
        const list = document.getElementById('workflowList');
  
        if (workflows.length === 0) {
          section.style.display = 'none';
          return;
        }
  
        section.style.display = 'block';
        list.innerHTML = workflows.map(w => `
          <div class="workflow-item" data-id="${w.id}">
            <div class="workflow-item-name">${w.name}</div>
            <div class="workflow-item-desc">${w.description || w.category || 'No description'}</div>
            <div class="workflow-item-actions">
              <button class="btn btn-sm btn-ghost" onclick="WorkflowPanel.load_workflow(${w.id})">Load</button>
              <button class="btn btn-sm btn-ghost" style="color:#ef4444;" onclick="WorkflowPanel.delete_workflow(${w.id})">Delete</button>
            </div>
          </div>
        `).join('');
      } catch (e) {
        console.error('Failed to load workflows', e);
      }
    },
  
    async load_workflow(id) {
      try {
        const workflows = await API.getWorkflows();
        const workflow = workflows.find(w => w.id === id);
        if (!workflow) return;
  
        document.getElementById('promptCanvas').value = workflow.final_prompt || '';
        updateCharCount();
        if (workflow.tree_state?.category) {
          Dashboard.selectCategory(workflow.tree_state.category);
        }
        showToast(`Loaded: ${workflow.name}`, 'success');
      } catch (e) {
        showToast('Failed to load workflow', 'error');
      }
    },
  
    async delete_workflow(id) {
      try {
        await API.deleteWorkflow(id);
        showToast('Workflow deleted', 'success');
        this.load();
      } catch (e) {
        showToast('Failed to delete workflow', 'error');
      }
    }
  };