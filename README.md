# 🛡️ TRUTH ARENA - The ExamGuard System

> **"Don't trust the forward button. Verify before you terrify."**

![Banner Placeholder] 

**Truth Arena** is a gamified, real-time fact-checking engine designed specifically for the Indian competitive exam ecosystem (JEE, NEET, UPSC, CBSE). It combines the aesthetic of a retro 8-bit fighting game with the power of **Google Gemini 3.0** and **Search Grounding** to dismantle fake news, morphed screenshots, and viral rumors.

---

## 🚨 The Problem: "System Compromised"

Every exam season, millions of students face a psychological war.
- **Viral Hoaxes:** "JEE Mains Postponed!" spreads on WhatsApp faster than official notices.
- **Deepfakes & Morphs:** Edited screenshots of the NTA website or news channels cause panic.
- **Information Overload:** Students waste critical study hours doom-scrolling through conflicting updates.

The current solution ? Boring fact-check articles that students don't read.

## ⚔️ The Solution: "Truth Arena"

We turned fact-checking into a **Spectator Sport**.

Truth Arena doesn't just tell you if something is true or false; it simulates a **Courtroom Battle** between two AI Agents:
1.  **Advocate Rumor (P1):** Represents the viral claim.
2.  **Advocate Logic (P2):** Represents facts grounded in Google Search.
3.  **The Judge:** Delivers the final verdict.

Students upload a screenshot or type a rumor, and the system initiates a "Fight," resulting in a clear, confidence-scored verdict.

---

## 📸 Screenshots

### 1. The Landing Terminal
*A retro BIOS boot sequence and 3D perspective grid welcoming the user.*
![Landing Page]

### 2. The Battle Interface
*The user inputs a rumor or uploads a screenshot to start the analysis.*
![Battle Interface]

### 3. The Courtroom Debate
*Real-time AI agents debating the facts in an arcade style.*
![Courtroom Debate]

### 4. The Verdict Report
*A detailed dossier containing forensic analysis, official timelines, and action points.*
![Verdict Report]

---

## 🛠️ Tech Stack: "The Arsenal"

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite | Core application logic and UI. |
| **Styling** | Tailwind CSS | Cyberpunk/Retro styling, animations, and responsive layout. |
| **AI Engine** | **Google Gemini 3.0 Flash** | The brain behind the debate, logic extraction, and reasoning. |
| **Grounding** | **Google Search Tool** | Connects the AI to the live internet for real-time verification (NTA, PIB, etc.). |
| **Database** | Supabase | Stores battle history and user logs. |
| **Visuals** | HTML5 Canvas | Image resizing and compression for analysis. |
| **Charts** | Recharts | Visualizing confidence scores. |

---

## 🚀 Key Features

*   **Multi-Agent Debate Simulation:** Watch AI agents argue for and against the rumor in real-time.
*   **Visual Forensics:** Upload a screenshot, and the AI analyzes it for font inconsistencies, pixel manipulation, and metadata anomalies.
*   **Live Official Timeline:** Generates a timeline of *actual* official events to contrast with the rumor.
*   **Action Directives:** Tells the student exactly what to do (e.g., "Ignore the PDF," "Check nta.ac.in").
*   **Intel Feed:** A live news feed of verified updates, cached to reduce API calls.
*   **Retro Sound Design:** Custom sound service for clicks, battles, and typing effects.

---

## 💻 Setup & Installation

### Steps

1.  **Clone the Repository**
    ```bash
    git clone 
    cd truth-arena
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    # Required for the AI to work
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    ```

---

## 🧠 How It Works (The Logic Flow)

1.  **Input:** User enters text or uploads an image.
2.  **Preprocessing:** Image is resized/compressed; text is sanitized.
3.  **The Prompt:** A complex system instruction is sent to `gemini-3-flash-preview` with the `googleSearch` tool enabled.
4.  **Grounding:** Gemini queries Google Search for the specific exam keywords + "official notification" or "fake news".
5.  **Synthesis:** The model generates a JSON response containing:
    *   A simulated debate script.
    *   A confidence score (0-100).
    *   Extracted claims and individual verdicts.
    *   Source URLs.
6.  **Rendering:** The React frontend parses the JSON and plays out the "Battle" animation before revealing the Dossier.

---

## 🤝 Contributing

This is a community project built to help students. Pull requests are welcome!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with 💻 and ☕ for the Class of 2025.*