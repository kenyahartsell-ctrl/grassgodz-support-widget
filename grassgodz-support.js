(function () {
  if (document.getElementById('gg-support-widget')) return;

  var API_URL ='https://grassgodz-support-widget.vercel.app/api/chat';

  var styles = `
    #gg-support-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    #gg-fab { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; border-radius: 50%; background: #0F3214; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.25); z-index: 99998; transition: transform 0.2s; }
    #gg-fab:hover { transform: scale(1.07); }
    #gg-fab svg { width: 26px; height: 26px; fill: #F2E8CF; }
    #gg-badge { position: absolute; top: -2px; right: -2px; width: 14px; height: 14px; border-radius: 50%; background: #639922; border: 2px solid #fff; }
    #gg-panel { position: fixed; bottom: 92px; right: 24px; width: 360px; height: 520px; background: #fff; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.18); z-index: 99999; display: none; flex-direction: column; overflow: hidden; }
    #gg-panel.open { display: flex; }
    #gg-header { padding: 14px 16px; background: #0F3214; display: flex; align-items: center; gap: 10px; }
    #gg-header-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(242,232,207,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    #gg-header-avatar svg { width: 20px; height: 20px; fill: #F2E8CF; }
    #gg-header-title { color: #F2E8CF; font-size: 14px; font-weight: 600; }
    #gg-header-sub { color: rgba(242,232,207,0.7); font-size: 12px; display: flex; align-items: center; gap: 5px; }
    #gg-online-dot { width: 6px; height: 6px; border-radius: 50%; background: #97C459; display: inline-block; }
    #gg-close { margin-left: auto; background: none; border: none; cursor: pointer; padding: 4px; }
    #gg-close svg { width: 18px; height: 18px; stroke: rgba(242,232,207,0.7); }
    #gg-messages { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; background: #f9f7f2; }
    .gg-msg { max-width: 82%; }
    .gg-msg.bot { align-self: flex-start; }
    .gg-msg.user { align-self: flex-end; }
    .gg-bubble { padding: 10px 13px; border-radius: 14px; font-size: 13.5px; line-height: 1.5; }
    .gg-msg.bot .gg-bubble { background: #fff; border: 0.5px solid #e0ddd4; border-bottom-left-radius: 4px; color: #1a1a1a; }
    .gg-msg.user .gg-bubble { background: #0F3214; color: #F2E8CF; border-bottom-right-radius: 4px; }
    .gg-time { font-size: 11px; color: #999; margin-top: 3px; padding: 0 3px; }
    .gg-msg.user .gg-time { text-align: right; }
    #gg-quick { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 14px; background: #f9f7f2; border-top: 0.5px solid #e8e4da; }
    .gg-qbtn { font-size: 12px; padding: 5px 11px; border: 0.5px solid #c5c0b4; border-radius: 20px; background: #fff; color: #333; cursor: pointer; white-space: nowrap; transition: background 0.15s; }
    .gg-qbtn:hover { background: #f0ece2; }
    #gg-input-row { display: flex; gap: 8px; padding: 10px 12px; border-top: 0.5px solid #e0ddd4; background: #fff; }
    #gg-input { flex: 1; border: 0.5px solid #ccc; border-radius: 8px; padding: 8px 11px; font-size: 13.5px; outline: none; resize: none; color: #1a1a1a; background: #fff; }
    #gg-input:focus { border-color: #0F3214; }
    #gg-send { width: 36px; height: 36px; border-radius: 8px; background: #0F3214; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    #gg-send:disabled { opacity: 0.4; cursor: not-allowed; }
    #gg-send svg { width: 16px; height: 16px; fill: #F2E8CF; }
    .gg-typing { display: flex; gap: 4px; align-items: center; }
    .gg-dot { width: 6px; height: 6px; border-radius: 50%; background: #aaa; animation: gg-bounce 1.2s infinite; }
    .gg-dot:nth-child(2) { animation-delay: 0.2s; }
    .gg-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes gg-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }
    .gg-escalate { font-size: 12.5px; background: #fdf8ee; border: 0.5px solid #A0845C; border-radius: 10px; padding: 9px 12px; color: #5a4020; line-height: 1.5; }
    @media (max-width: 420px) {
      #gg-panel { width: calc(100vw - 20px); right: 10px; bottom: 80px; }
      #gg-fab { bottom: 16px; right: 16px; }
    }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  var widget = document.createElement('div');
  widget.id = 'gg-support-widget';
  widget.innerHTML = `
    <button id="gg-fab" aria-label="Open Grassgodz support chat">
      <div id="gg-badge"></div>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
    </button>

    <div id="gg-panel" role="dialog" aria-label="Grassgodz support chat">
      <div id="gg-header">
        <div id="gg-header-avatar">
          <svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 19.17L5.71 21l1-1C7 19 8 19 9 20l1 1 1.5-1.5C14 16 16 12 20 10l-3-2z"/></svg>
        </div>
        <div>
          <div id="gg-header-title">Grassgodz Support</div>
          <div id="gg-header-sub"><span id="gg-online-dot"></span> Online now</div>
        </div>
        <button id="gg-close" aria-label="Close support chat">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div id="gg-messages" aria-live="polite"></div>

      <div id="gg-quick">
        <button class="gg-qbtn" onclick="ggQuickSend(this)">Can't log in</button>
        <button class="gg-qbtn" onclick="ggQuickSend(this)">Card not working</button>
        <button class="gg-qbtn" onclick="ggQuickSend(this)">Stripe setup help</button>
        <button class="gg-qbtn" onclick="ggQuickSend(this)">Talk to a person</button>
      </div>

      <div id="gg-input-row">
        <textarea id="gg-input" rows="1" placeholder="Type your question..." aria-label="Support message"></textarea>
        <button id="gg-send" aria-label="Send message">
          <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  var messages = [];
  var isTyping = false;
  var exchangeCount = 0;

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function addMsg(role, text) {
    var container = document.getElementById('gg-messages');
    var div = document.createElement('div');
    div.className = 'gg-msg ' + (role === 'user' ? 'user' : 'bot');
    if (text === '__typing__') {
      div.id = 'gg-typing-el';
      div.innerHTML = '<div class="gg-bubble"><div class="gg-typing"><div class="gg-dot"></div><div class="gg-dot"></div><div class="gg-dot"></div></div></div>';
    } else {
      div.innerHTML = '<div class="gg-bubble">' + text.replace(/\n/g, '<br>') + '</div><div class="gg-time">' + getTime() + '</div>';
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function removeTyping() {
    var t = document.getElementById('gg-typing-el');
    if (t) t.remove();
  }

  function showEscalate() {
    var container = document.getElementById('gg-messages');
    var div = document.createElement('div');
    div.className = 'gg-msg bot';
    div.innerHTML = '<div class="gg-escalate">Still need help? Our team responds fast.<br><strong>Email:</strong> contact@grassgodz.com<br><strong>Or:</strong> use in-app support chat</div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  addMsg('bot', 'Hi! I\'m the Grassgodz support assistant. I can help with login issues, adding a payment card, or provider Stripe setup. What do you need help with?');

  async function send() {
    var input = document.getElementById('gg-input');
    var text = input.value.trim();
    if (!text || isTyping) return;

    input.value = '';
    addMsg('user', text);
    messages.push({ role: 'user', content: text });
    exchangeCount++;

    document.getElementById('gg-send').disabled = true;
    document.getElementById('gg-quick').style.display = 'none';
    isTyping = true;
    addMsg('bot', '__typing__');

    try {
      var res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages })
      });

      var data = await res.json();
      var reply = data.reply || 'Something went wrong. Please email contact@grassgodz.com and we\'ll help right away.';

      removeTyping();
      addMsg('bot', reply);
      messages.push({ role: 'assistant', content: reply });

      if (exchangeCount >= 8) showEscalate();

    } catch (e) {
      removeTyping();
      addMsg('bot', 'Connection issue. Please email contact@grassgodz.com or use in-app chat and we\'ll respond quickly.');
    }

    isTyping = false;
    document.getElementById('gg-send').disabled = false;
  }

  window.ggQuickSend = function (btn) {
    document.getElementById('gg-input').value = btn.textContent;
    send();
  };

  document.getElementById('gg-send').addEventListener('click', send);
  document.getElementById('gg-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });

  document.getElementById('gg-fab').addEventListener('click', function () {
    document.getElementById('gg-panel').classList.toggle('open');
  });

  document.getElementById('gg-close').addEventListener('click', function () {
    document.getElementById('gg-panel').classList.remove('open');
  });
})();
