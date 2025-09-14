const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("chat-message", sender === "user" ? "chat-user" : "chat-bot");
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    addMessage(question, "user");
    userInput.value = "";

    // Mensagem temporária "Pensando..."
    const thinkingMsg = document.createElement("div");
    thinkingMsg.classList.add("chat-message", "chat-bot");
    thinkingMsg.textContent = "Pensando...";
    chatBox.appendChild(thinkingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
    const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    });

    const data = await res.json();
    thinkingMsg.remove();
    addMessage(data.resposta ?? "Sem resposta", "bot");
    } catch (err) {
    thinkingMsg.remove();
    addMessage("Erro ao conectar com o servidor.", "bot");
    }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});