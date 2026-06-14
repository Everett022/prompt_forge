function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
  }
  
  function updateCharCount() {
    const text = document.getElementById('promptCanvas').value;
    document.getElementById('charCount').textContent = `${text.length} characters`;
  }
  
  document.getElementById('promptCanvas').addEventListener('input', updateCharCount);
  
  document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
  });