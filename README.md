# 🤖 AI Requirement-Gathering Chatbot & SRS Generator  
### A Smart AI System for Automated Requirements Elicitation & SRS Creation

![Banner](https://img.shields.io/badge/AI%20Chatbot-Requirements%20Engineering-blueviolet?style=for-the-badge)
![Node](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge)

---

## 📌 Project Overview

**AI Requirement-Gathering Chatbot & SRS Generator** is a web-based intelligent system designed to automate the requirements engineering process.

The chatbot:
- Asks requirement questions one-by-one  
- Avoids long confusing replies  
- Detects conflicting stakeholder answers  
- Categorizes requirements into Functional, Non-Functional, and Constraints  
- Stores all requirements  
- Generates a full **IEEE-style SRS document**

---

## 🚀 Features

### **AI Requirement Interview**
- Smart questioning system  
- Auto conflict detection  
- Auto categorization  

### **SRS Generator**
- Creates a complete IEEE SRS  
- Sections included: FRs, NFRs, Constraints, Glossary, RTM  
- Downloads as a `.txt` file  

### **Modern Chat UI**
- Clean dark theme  
- Timestamped messages  
- User & Bot profile avatars  
- Smooth animations  

### **Free AI Model**
- Uses HuggingFace Router + DeepSeek-V3 (free)  

---

## 🛠 Tech Stack

### **Frontend**
- HTML  
- CSS  
- JavaScript  

### **Backend**
- Node.js  
- Express.js  

### **AI API**
- HuggingFace Inference (DeepSeek-V3)  

---

## ⚙️ Installation Guide

### **1. Clone Repository**
```sh
git clone https://github.com/yourusername/your-repo-name
cd your-repo-name

```
### **2.Install Dependencies**
``` sh
npm install

```
   ### **3. Add Environment Variable**

Create .env file:
``` sh
HF_TOKEN=your_huggingface_api_key_here
```

 ### **4. Start Backend**
```sh
node server.js
```

 ### **5. Open Frontend**

Option A: Open index.html
Option B: If served by Express →
```sh
http://localhost:3000
```
🌟 Feedback

If you want improvements or features, feel free to open an Issue.
