/* ============================================================
   Factory IA — lógica 100% local (sem backend / sem HTTP)
   ============================================================ */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const messagesEl = $("messages");
  const welcomeEl = $("welcome");
  const form = $("composer");
  const input = $("input");
  const sendBtn = $("sendBtn");
  const agentSelect = $("agentSelect");
  const topbarAgentName = $("topbarAgentName");
  const newChatBtn = $("newChatBtn");
  const clearBtn = $("clearBtn");
  const sidebar = $("sidebar");
  const overlay = $("overlay");
  const menuBtn = $("menuBtn");
  const sidebarClose = $("sidebarClose");

  const PLACEHOLDER_REPLY = "Essa é uma resposta da Inteligência Artificial";

  const AGENT_LABELS = {
    geral: "Agente Geral",
    codigo: "Agente Código",
    escrita: "Agente Escrita",
    dados: "Agente Dados",
  };

  let threadEl = null;
  let isTyping = false;

  const SVG_ATTRS =
    'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  const AI_AVATAR =
    '<span class="avatar avatar-ai" aria-hidden="true">' +
    '<svg class="icon" ' + SVG_ATTRS + '><use href="#i-sparkles" /></svg>' +
    "</span>";

  /* ---------- Sidebar mobile ---------- */
  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  }

  menuBtn.addEventListener("click", openSidebar);
  sidebarClose.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  /* ---------- Agente (placeholder) ---------- */
  agentSelect.addEventListener("change", () => {
    topbarAgentName.textContent =
      AGENT_LABELS[agentSelect.value] || "Agente Geral";
  });

  /* ---------- Textarea auto-resize + estado do botão ---------- */
  function autoresize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 160) + "px";
    sendBtn.disabled = input.value.trim().length === 0;
  }

  input.addEventListener("input", autoresize);
  autoresize();

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  /* ---------- Construção de mensagens ---------- */
  function ensureThread() {
    if (!threadEl) {
      welcomeEl.style.display = "none";
      threadEl = document.createElement("div");
      threadEl.className = "thread";
      messagesEl.appendChild(threadEl);
    }
    return threadEl;
  }

  function scrollToBottom() {
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "smooth" });
  }

  function escapeHtml(str) {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function addUserMessage(text) {
    const thread = ensureThread();
    const row = document.createElement("div");
    row.className = "msg msg-user";
    row.innerHTML =
      '<span class="avatar avatar-user" aria-hidden="true">Você</span>' +
      '<div class="msg-body"><div class="bubble"></div></div>';
    row.querySelector(".bubble").textContent = text;
    thread.appendChild(row);
    scrollToBottom();
  }

  function addTypingIndicator() {
    const thread = ensureThread();
    const row = document.createElement("div");
    row.className = "msg msg-ai";
    row.id = "typingRow";
    row.innerHTML =
      AI_AVATAR +
      '<div class="msg-body">' +
      '<div class="msg-name">Factory IA <span class="agent-tag">· placeholder</span></div>' +
      '<div class="typing" aria-label="Digitando..."><span></span><span></span><span></span></div>' +
      "</div>";
    thread.appendChild(row);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const row = $("typingRow");
    if (row) row.remove();
  }

  function addAiMessage() {
    const thread = ensureThread();
    const agent = AGENT_LABELS[agentSelect.value] || "Agente Geral";

    const row = document.createElement("div");
    row.className = "msg msg-ai";
    row.innerHTML =
      AI_AVATAR +
      '<div class="msg-body">' +
      '<div class="msg-name">Factory IA <span class="agent-tag">· ' +
      escapeHtml(agent) +
      "</span></div>" +
      '<div class="bubble"></div>' +
      "</div>";

    const bubble = row.querySelector(".bubble");
    bubble.textContent = PLACEHOLDER_REPLY;

    thread.appendChild(row);
    scrollToBottom();
  }

  /* ---------- Envio (simulado, local) ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || isTyping) return;

    addUserMessage(text);
    input.value = "";
    autoresize();
    closeSidebar();

    isTyping = true;
    sendBtn.disabled = true;
    addTypingIndicator();

    // Simula latência apenas para efeito visual — sem rede.
    setTimeout(() => {
      removeTypingIndicator();
      addAiMessage();
      isTyping = false;
      autoresize();
      input.focus();
    }, 900);
  });

  /* ---------- Novo chat / limpar ---------- */
  function resetChat() {
    if (threadEl) {
      threadEl.remove();
      threadEl = null;
    }
    welcomeEl.style.display = "";
    input.value = "";
    autoresize();
    messagesEl.scrollTo({ top: 0 });
    closeSidebar();
    input.focus();
  }

  newChatBtn.addEventListener("click", resetChat);
  clearBtn.addEventListener("click", resetChat);
})();
