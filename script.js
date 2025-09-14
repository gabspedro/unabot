const API_BASE = "http://localhost:8000";

// CHAT BOT
async function perguntarTradicional() {
  const question = document.getElementById("question1").value;
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });
  const data = await res.json();
  document.getElementById("resposta").innerText = data.resposta;
}

// CHAT COM URL
async function perguntarURL() {
  const url = document.getElementById("url").value;
  const question = document.getElementById("question2").value;
  const res = await fetch(`${API_BASE}/chat/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, question })
  });
  const data = await res.json();
  document.getElementById("resposta").innerText = data.resposta;
}

// CHAT COM ARQUIVO
async function perguntarArquivo() {
  const file = document.getElementById("file").files[0];
  const question = document.getElementById("question3").value;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("question", question);

  const res = await fetch(`${API_BASE}/chat/file`, {
    method: "POST",
    body: formData
  });
  const data = await res.json();
  document.getElementById("resposta").innerText = data.resposta;
}