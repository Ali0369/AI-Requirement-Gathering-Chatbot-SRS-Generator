
const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.querySelector(".send-btn");
const srsBtn = document.querySelector(".srs-btn");

let collectedRequirements = [];

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });
srsBtn.addEventListener("click", generateSRS);

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  collectedRequirements.push(text);
  userInput.value = "";
  showTyping(true);

  const botReply = await askAI(text);
  showTyping(false);
  appendMessage("bot", botReply);
}

function appendMessage(sender, text) {
    const divWrapper = document.createElement("div");
    divWrapper.className = sender === "bot" ? "bot-wrapper" : "user-wrapper";
    divWrapper.style.display = "flex";
    divWrapper.style.alignItems = "flex-start";
    divWrapper.style.gap = "8px";


    const avatarContainer = document.createElement("div");
    avatarContainer.className = "avatar-container";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.style.backgroundImage = sender === "bot" 
        ? "url('images/robot.jpg')"
        : "url('images/manager.png')";

    const name = document.createElement("div");
    name.className = "avatar-name";
    name.textContent = sender === "bot" ? "Nova" : "Admin";

    avatarContainer.appendChild(avatar);
    avatarContainer.appendChild(name);


    const messageDiv = document.createElement("div");
    messageDiv.className = sender === "bot" ? "bot-message" : "user-message";
    messageDiv.textContent = text;


    const time = document.createElement("div");
    time.className = "timestamp";
    const now = new Date();
    time.textContent = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
    messageDiv.appendChild(time);


    if (sender === "bot") {
        divWrapper.appendChild(avatarContainer);
        divWrapper.appendChild(messageDiv);
    } else {
        divWrapper.appendChild(messageDiv);
        divWrapper.appendChild(avatarContainer);
    }

    chatbox.appendChild(divWrapper);
    chatbox.scrollTop = chatbox.scrollHeight;
}



async function askAI(message) {
  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    if (!data.reply) throw new Error("AI response missing 'reply' property");
    return data.reply;
  } catch (err) {
    console.error("askAI error:", err);
    return "⚠️ Error connecting to AI.";
  }
}


function showTyping(isTyping) {
  let typingDiv = document.getElementById("typingIndicator");
  if (isTyping) {
    if (!typingDiv) {
      typingDiv = document.createElement("div");
      typingDiv.id = "typingIndicator";
      typingDiv.className = "bot-message";
      typingDiv.innerHTML = "Typing...";
      chatbox.appendChild(typingDiv);
    }
  } else {
    if (typingDiv) typingDiv.remove();
  }
  chatbox.scrollTop = chatbox.scrollHeight;
}


let userName = "";
let projectName = "";


async function askUserInfo() {
    userName = prompt("Please enter your name for the SRS document:");
    if (!userName) userName = "Anonymous";

    projectName = prompt("Please enter your project name:");
    if (!projectName) projectName = "Untitled Project";
}


async function generateSRS() {
  
    if (!userName || !projectName) {
        await askUserInfo();
    }

    appendMessage("bot", "Generating SRS document...");

  
    const userDescription = collectedRequirements.join(". ") || "A software project.";

  
    const prompt = `
You are a professional requirements analyst.
A user wants a software project with the following description:
"${userDescription}"

Generate a full Software Requirements Specification (SRS) in IEEE standard format, including only main sections:

1. Introduction
2. Scope
3. Purpose
4. Definitions
5. User Characteristics
6. Functional Requirements
7. Non-Functional Requirements
8. Constraints
9. Conflicts
10. Final Summary

- Do NOT ask the user for further details.
- Automatically generate realistic and professional content for all sections, even if the user did not provide details.
- Keep it concise, clear, and suitable for stakeholders and developers.
`;

    let srsText;
    try {
        srsText = await askAI(prompt);
        if (!srsText) throw new Error("Empty AI response");
    } catch (err) {
        console.error("Error generating SRS:", err);
        srsText = `
1. Introduction
This section introduces the project.

2. Scope
Scope details of the project.

3. Purpose
Purpose details of the project.

4. Definitions
Definitions of terms used.

5. User Characteristics
Target users and characteristics.

6. Functional Requirements
Automatically generated functional requirements.

7. Non-Functional Requirements
Automatically generated non-functional requirements.

8. Constraints
Project constraints.

9. Conflicts
Any conflicts identified.

10. Final Summary
Summary of the system.
`;
    }

 
    downloadSRSWord(srsText, projectName, userName);
}


async function downloadSRSWord(srsText, projectName, userName) {
    const { Document, Packer, Paragraph, HeadingLevel, TextRun } = docx;

    const today = new Date().toLocaleDateString();

    const doc = new Document({
        sections: [
            {
                children: [
                  
                    new Paragraph({
                        text: "SOFTWARE REQUIREMENTS SPECIFICATION",
                        heading: HeadingLevel.TITLE,
                        spacing: { after: 400 }
                    }),
                    new Paragraph({
                        text: `Project: ${projectName}`,
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: `Author: ${userName}`,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: `Date: ${today}`,
                        spacing: { after: 400 }
                    }),
                    new Paragraph({ text: "", pageBreakBefore: true }), 
                  
                    ...srsText.split("\n").map(line => {
                        line = line.trim();
                        if (!line) return new Paragraph({ text: "" });

                    
                        line = line.replace(/^\s*#+\s*/, ""); 
                        line = line.replace(/\*\*/g, "");    

                       
                        const sectionMatch = line.match(/^(\d+)\.\s+(.+)/);
                        if (sectionMatch) {
                            return new Paragraph({
                                text: line,
                                heading: HeadingLevel.HEADING_1,
                                spacing: { after: 200 }
                            });
                        }

                    
                        return new Paragraph({
                            children: [new TextRun(line)],
                            spacing: { after: 120 }
                        });
                    })
                ]
            }
        ]
    });

    const blob = await Packer.toBlob(doc);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${projectName.replace(/\s+/g, "_")}_SRS.docx`;
    link.click();

    appendMessage("bot", `✅ Your SRS document for "${projectName}" is ready in Word format.`);
}









let splashProgress = document.getElementById("splashProgress");
let splashOverlay = document.getElementById("splashOverlay");
let width = 0;
let interval = setInterval(() => {
    if(width >= 100){
        clearInterval(interval);
        closeSplash();
    } else {
        width += 1;
        splashProgress.style.width = width + "%";
    }
}, 40);

function closeSplash() {
    splashOverlay.classList.add("splash-hide");
}


const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let w, h;

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

