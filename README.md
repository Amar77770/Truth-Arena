# 🛡️ TRUTH ARENA - The ExamGuard System
# Link - 

> **"Don't trust the forward button. Verify before you terrify."**

<img width="1919" height="1011" alt="image" src="https://github.com/user-attachments/assets/cc8f0d7b-9b1b-4e53-ae09-bc5b43569473" />



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

Students upload an Image, audio, video or type a rumor, and the system initiates a "Fight," resulting in a clear, confidence-scored verdict.

---

## 📸 Screenshots

### 1. The Landing Terminal (Landing Page)
*A retro BIOS boot sequence and 3D perspective grid welcoming the user.*

<img width="1919" height="982" alt="image" src="https://github.com/user-attachments/assets/a0c63bf6-da2f-49ba-8cda-b9213ad2e076" />
<img width="1887" height="873" alt="image" src="https://github.com/user-attachments/assets/6ff54155-5198-4925-9886-62ed63b06ef6" />
<img width="1858" height="856" alt="image" src="https://github.com/user-attachments/assets/6c6a8474-9421-4a54-a662-a9046e4f4d1f" />
<img width="1871" height="836" alt="image" src="https://github.com/user-attachments/assets/5348dce0-afef-4583-97d8-0698ca0c6de1" />
<img width="1828" height="884" alt="image" src="https://github.com/user-attachments/assets/eb1a572c-466d-4a2c-a7f7-739abe7e332a" />



### 2. The Battle Interface
*The user inputs a rumor or uploads a screenshot to start the analysis.*
<img width="1893" height="940" alt="image" src="https://github.com/user-attachments/assets/213816ca-c5fc-41dc-805e-fcdc73d6668e" />


### 3. The Courtroom Debate
*Real-time AI agents debating the facts in an arcade style.*
<img width="1919" height="996" alt="image" src="https://github.com/user-attachments/assets/49fb0513-f0f5-4abf-8eae-50539fc2aaa9" />


### 4. The Verdict Report
*A detailed dossier containing forensic analysis, official timelines, and action points.*
<img width="1919" height="1001" alt="image" src="https://github.com/user-attachments/assets/5edce986-a171-478a-b071-74018e4b898d" />


### 5. News Feed
*A Exam dedicated News feed to keep you up to date *
<img width="1919" height="1008" alt="image" src="https://github.com/user-attachments/assets/e47ad924-518d-4a68-851b-5d0c7fef3a3f" />

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
*    **Admin Dasboard :** To keep track of the data of the app. Use **Admin11** on playertag to get access.

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
