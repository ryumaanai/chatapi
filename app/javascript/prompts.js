document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generation-form');
    const newPromptContainer = document.getElementById('new-prompt');
    let promptCount = 0;
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const promptContent = form.querySelector('textarea').value;
      const promptId = `prompt-${Date.now()}-${promptCount++}`;
      const promptElement = document.createElement('div');
      promptElement.innerHTML = `
        <p><strong>プロンプト:</strong> ${promptContent}</p>
        <p><strong>レスポンス:</strong> <span id="response-text-${promptId}"></span></p>
      `;
      newPromptContainer.insertBefore(promptElement, newPromptContainer.firstChild);
  
      const responseTextContainer = document.getElementById(`response-text-${promptId}`);
  
      Rails.ajax({
        url: form.action,
        type: 'POST',
        data: new FormData(form),
        success: (response) => {
          const text = response.text;
          let currentIndex = 0;
  
          const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
              responseTextContainer.innerText += text[currentIndex];
              currentIndex++;
            } else {
              clearInterval(intervalId);
              form.reset();
            }
          }, 50);
        },
        error: (error) => {
          console.error('APIリクエストが失敗しました', error);
          responseTextContainer.innerText = 'エラーが発生しました。';
        }
      });
    });
});
