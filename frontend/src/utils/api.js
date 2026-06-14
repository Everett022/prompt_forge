const API_BASE = 'http://localhost:8000';

const API = {
  async getTree() {
    const res = await fetch(`${API_BASE}/api/prompts/tree`);
    if (!res.ok) throw new Error('Failed to fetch tree');
    return res.json();
  },

  async buildPrompt(state) {
    const res = await fetch(`${API_BASE}/api/prompts/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
    if (!res.ok) throw new Error('Failed to build prompt');
    return res.json();
  },

  async enhancePrompt(promptText, state) {
    const res = await fetch(`${API_BASE}/api/prompts/enhance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt_text: promptText, state })
    });
    if (!res.ok) throw new Error('Failed to enhance prompt');
    return res.json();
  },

  async getFollowupQuestions(state) {
    const res = await fetch(`${API_BASE}/api/prompts/followup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
    if (!res.ok) throw new Error('Failed to get follow-up questions');
    return res.json();
  },

  async getHistory() {
    const res = await fetch(`${API_BASE}/api/prompts/history`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  async saveWorkflow(data) {
    const res = await fetch(`${API_BASE}/api/workflows/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save workflow');
    return res.json();
  },

  async getWorkflows() {
    const res = await fetch(`${API_BASE}/api/workflows/`);
    if (!res.ok) throw new Error('Failed to fetch workflows');
    return res.json();
  },

  async deleteWorkflow(id) {
    const res = await fetch(`${API_BASE}/api/workflows/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete workflow');
    return res.json();
  }
};