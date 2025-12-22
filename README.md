# 📄 Resume Enhancer AI

**[🚀 Live Demo](https://resume-enhancer-lemon.vercel.app/)**

**Resume Enhancer AI** is an AI powered web app designed to adjust your  resume to specific job opportunities. By leveraging the power of **Google's Gemini**, the  tool analyzes your existing PDF resume and a target job description to rewrite and optimize your experience, ensuring you stand out to recruiters and ATS systems.

## ✨ Key Features

*   **🤖 Multi-Model Support:** Choose between 4 Gemini models (Gemini 3 Pro Preview, 3 Flash Preview, 2.5 Pro, and 2.5 Flash).
*   **📄 PDF Parsing:** Simply drag and drop your existing PDF resume directly into the app.
*   **🎯 Targeted Optimization:** Paste the Job Title and Job Description to generate a resume specifically crafted for that role.
*   **🎨 Custom UI Experience:** Fully customizable interface with **Dark/Light mode** toggles and various **Theme Color** selections.
*   **📥 Dual Export Formats:** Download your enhanced resume as a clean **PDF** or raw **HTML** file.
*   **🔒 Secure:** Users provide their own API key and the app fetches the data locally, ensuring security.

## 📸 Screenshots

### 1. The Interface
Clean and user-friendly input section for API keys, model selection, and job details.
![Home Screen](https://i.imgur.com/UZ7MpXI.png)


### 2. AI Processing
Visual feedback while the AI analyzes your profile and the job description.
![Loading Screen](https://i.imgur.com/0NbplLz.png)
*(Note: Replace path with your actual image path)*

### 3. The Result
A professionally formatted, enhanced resume ready for download.
![Result Screen](https://i.imgur.com/tIW1dk5.png)

## 🚀 How to Use

1.  **Open the App:** Visit the [Live Demo](https://resume-enhancer-lemon.vercel.app/).
2.  **API Key:** Paste your Google Gemini API Key.
3.  **Select Model:** Choose your preferred AI model (e.g., *Gemini 3.0 Flash Preview*).
4.  **Upload Resume:** Drag and drop your current resume (PDF format) into the upload area.
5.  **Job Details:**
    *   Enter the **Target Job Title** (e.g., "Senior Product Manager").
    *   Paste the full **Job Description**.
6.  **Enhance:** Click the **"Enhance Resume"** button.
7.  **Customize View:** Use the toggle at the top right to switch between **Dark/Light mode** or change the **Theme Color**.
8.  **Download:** Once generated, preview the result and click **"Download PDF"** or **"Download HTML"**.

## 💻 Running Locally

To run this project on your local machine:

1.  Clone the repository:
    ```bash
    git clone https://github.com/joshuazhang447/resume-enhancer.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd resume-enhancer-ai
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open the local server link (usually `http://localhost:5173` or `http://localhost:3000`) in your browser.
