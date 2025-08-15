const chatForm = document.getElementById("chatForm");
const chatBox = document.getElementById("chatBox");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const age = ageInput.value.trim();
    const gender = genderInput.value;

    if (!age || !gender) return;

    // Show user message
    addMessage(`Age: ${age}, Gender: ${gender}`, "user-msg");

    // Clear inputs
    ageInput.value = "";
    genderInput.value = "";

    // Add bot typing message
    const botMessageEl = addMessage("Typing...", "bot-msg");

    try {
        // Send POST request to Spring Boot
        const payload = { age: age, gender: gender }; // keys match backend
        const response = await fetch("http://localhost:8080/music", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Server error");

        const data = await response.json();

        // Simulate typing effect
        typeText(botMessageEl, data.result || JSON.stringify(data));

    } catch (err) {
        botMessageEl.textContent = "Error: " + err.message;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
});

// Add message to chat
function addMessage(text, className) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${className}`;
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

// Typing effect
function typeText(element, text, i = 0) {
    if (i < text.length) {
        element.textContent = text.substring(0, i + 1);
        setTimeout(() => typeText(element, text, i + 1), 30);
    }
}
