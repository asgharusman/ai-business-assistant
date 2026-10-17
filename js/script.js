
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatArea = document.getElementById("chatArea");
const typing = document.getElementById("typing");
const sendButton = document.getElementById("sendButton");

function addMessage(text, sender) {
    const message = document.createElement("div");

    message.classList.add("message");
    message.classList.add(
        sender === "user" ? "user-message" : "assistant-message"
    );

    message.textContent = text;
    chatArea.appendChild(message);

    chatArea.scrollTop = chatArea.scrollHeight;
}

chatForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const question = userInput.value.trim();

    if (!question) return;

    addMessage(question, "user");
    userInput.value = "";

    typing.hidden = false;
    sendButton.disabled = true;

    setTimeout(function () {
        typing.hidden = true;

        addMessage(
            "Thanks for your message! I am currently running in demo mode. We will connect the AI through n8n in the next step.",
            "assistant"
        );

        sendButton.disabled = false;
        userInput.focus();
    }, 800);
});
