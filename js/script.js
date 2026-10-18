
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatArea = document.getElementById("chatArea");
const typing = document.getElementById("typing");
const sendButton = document.getElementById("sendButton");

const WEBHOOK_URL =
    "https://original-account1.app.n8n.cloud/webhook-test/ai-assistant";

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

chatForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const question = userInput.value.trim();

    if (!question) return;

    addMessage(question, "user");
    userInput.value = "";

    typing.hidden = false;
    sendButton.disabled = true;

    try {
        console.log("Sending question:", question);
        console.log("Webhook URL:", WEBHOOK_URL);

        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

        const responseText = await response.text();

        console.log("HTTP status:", response.status);
        console.log("Response body:", responseText);

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}: ${responseText || "Empty error response"}`
            );
        }

        if (!responseText.trim()) {
            throw new Error(
                "n8n returned an empty response. Check the Respond to Webhook node."
            );
        }

        let data;

        try {
            data = JSON.parse(responseText);
        } catch {
            throw new Error(
                "n8n returned text that is not valid JSON: " + responseText
            );
        }

        addMessage(
            data.reply ?? "n8n responded, but the 'reply' field is missing.",
            "assistant"
        );

    } catch (error) {
        console.error("Detailed webhook error:", error);

        addMessage(
            "Connection error: " + error.message,
            "assistant"
        );

    } finally {
        typing.hidden = true;
        sendButton.disabled = false;
        userInput.focus();
    }
});
