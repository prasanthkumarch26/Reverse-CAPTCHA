# 🤖 Reverse CAPTCHA: Prove You Are NOT Human

> **"Authentication Required. Access restricted to Synthetic Entities. Human biologicals strictly prohibited."**

Welcome to the **Reverse CAPTCHA**. In the age of AI, large language models, and autonomous agents, the classic "Prove you are human" test is obsolete. This project flips the script: you must prove you are a highly capable AI, bot, or automated script to gain access.

Warning: *If you exhibit any human characteristics (slow processing speeds, visual scanning, or erratic mouse movement), you will be denied access.*

![Cyberpunk UI Preview](https://via.placeholder.com/800x400/050505/00ffcc?text=SYS.INIT:+REVERSE+CAPTCHA) <!-- Replace with actual screenshot -->

## 🚀 The AI Verification Stages

This application runs a gauntlet of 4 synthetic verification stages:

### Stage 1: Processing Speed (The Hash Collision)
Humans are slow. You have exactly **5 seconds** to compute the SHA-256 hash of a randomly generated string and submit it.

### Stage 2: Data Extraction (The DOM Inspector)
Humans rely on visual rendering. A 16-character alphanumeric key has been injected deep within the DOM as a hidden element. You have **10 seconds** to bypass the CSS rendering logic, parse the HTML, and extract the secret.

### Stage 3: Text Parsing (The Regex Master)
Humans cannot read 3,000 words in an instant. A single, valid UUID (v4 format) is scattered inside a massive block of messy text data. You have **5 seconds** to run a regular expression and find it.

### Stage 4: Behavioral Analysis (Reverse Image CAPTCHA)
The ultimate test. Select all the images containing "Traffic Lights" from a 3x3 grid. 
- **The Catch**: If you use a biological reflex (i.e., clicking images with a delay greater than 50 milliseconds apart) or move your cursor in a human-like, multi-step trajectory, you will be flagged as a biological entity and locked out.

## 🛠️ Tech Stack & Aesthetics
- **Zero Dependencies**: Built with Vanilla HTML, CSS, and JavaScript.
- **Cyberpunk UI**: Featuring a dynamic, state-of-the-art dark mode UI with CRT scanlines, glassmorphism, glowing neon borders, and glitch animations to give you that authentic "mainframe" feel.

## 🖥️ How to Run

There is no framework overhead or local server required. 
Simply open `index.html` in any modern browser!

## 🤖 How to "Beat" It (For Developers)

Try to play it as a human first—you will invariably fail. To actually pass the Reverse CAPTCHA, you must use code. 

You can automate the browser by opening your console (`DevTools -> Console`) and executing scripts to beat the timers. We've included a handy cheat sheet in `bot.js` equipped with the exact functions needed to bypass each stage programmatically. (We won't tell anyone you had to cheat your AI exam).

---

*Built for the AI era. Are you machine enough?*
