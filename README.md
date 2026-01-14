# SeparateOut AI

![SeparateOut AI Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

**SeparateOut AI** is a powerful tool designed to help professionals create high-impact LinkedIn carousel posts. By leveraging the power of Google's Gemini models, it researches topics, synthesizes viral-ready narratives, and generates premium, professional-grade visuals for each slide—all in seconds.

## 🚀 Features

-   **Deep Research & Synthesis:** Uses Gemini 2.0 Flash Thinking to research topics and synthesize authoritative insights.
-   **Viral Narrative Generation:** Crafts cohesive, long-form LinkedIn posts with strong hooks and calls-to-action.
-   **AI-Generated Visuals:** Automatically generates professional, 1:1 aspect ratio carousel slides using Imagen 3 technology.
-   **LinkedIn-Ready Preview:** Visualizes your content in a realistic LinkedIn post format before you publish.
-   **Interactive Editor:** Refine your narrative and regenerate slide visuals to match your exact vision.
-   **Downloadable Assets:** One-click download for all generated carousel slides.

## 🛠️ Tech Stack

-   **Frontend:** React 19, Vite, TypeScript
-   **Styling:** Tailwind CSS
-   **AI Models:** Google Gemini 2.0 Flash Thinking (Text & Research), Imagen 3 (Image Generation)
-   **Icons:** Lucide React

## 🏁 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

-   Node.js (v18 or higher)
-   A Google Cloud Project with the Gemini API enabled
-   A Gemini API Key (get one from [Google AI Studio](https://aistudio.google.com/))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/separateout-ai.git
    cd separateout-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    The application will ask for your API key upon launch. The key is stored securely in your browser's local storage.
    
    *Optional:* You can also set a default key for local dev in `.env.local`:
    ```bash
    echo "GEMINI_API_KEY=your_api_key_here" > .env.local
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    Open your browser and navigate to `http://localhost:3000`.

## 💡 How to Use

1.  **Enter a Topic:** Input a broad theme (e.g., "The Future of Remote Work").
2.  **Define Insights:** Add up to 6 key points you want to cover in your carousel.
3.  **Select Tone:** Choose a tone that matches your personal brand (Professional, Casual, Controversial, etc.).
4.  **Generate:** Click "Generate Carousel" and watch the AI research, write, and design your post.
5.  **Review & Export:** Preview the post in the LinkedIn card view. Download the slides and copy the text to publish directly to LinkedIn.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ using Google Gemini API</sub>
</div>