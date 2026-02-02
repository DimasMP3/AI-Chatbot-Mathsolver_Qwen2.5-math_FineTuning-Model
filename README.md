
# 🧮 AI Math Solver (Qwen 2.5 Fine-Tuned)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)
![Modal](https://img.shields.io/badge/Backend-Modal-green)
![Model](https://img.shields.io/badge/Model-Qwen2.5--Math--7B-violet)

> **An advanced, AI-powered mathematics tutor capable of solving complex problems with step-by-step reasoning.**  
> Powered by a fine-tuned **Qwen 2.5 Math 7B** model and presented in a sleek, **Gemini-inspired UI**.

---

## ✨ Key Features

### 🧠 Advanced Math Engine
- **Fine-Tuned Qwen 2.5**: Optimized specifically for mathematical reasoning and logic.
- **Step-by-Step Solutions**: Doesn't just give the answer; explains the *how* and *why*.
- **LaTeX Rendering**: Beautifully formatted mathematical symbols using `react-latex-next`.

### 🎨 Modern UI/UX (Gemini Style)
- **Minimalist Design**: Clean, distraction-free interface inspired by Google Gemini.
- **Floating Input Pill**: Modern interaction pattern for seamless chatting.
- **Smart Typography**: Optimized for readability of complex equations.
- **Dark Mode**: Fully supported system-aware dark theme.

### ⚡ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Python, Modal (Serverless GPU Inference), FastAPI |
| **Model** | Qwen 2.5 Math 7B (Fine-Tuned), BitsAndBytes (4-bit Quantization) |
| **Math Engine** | KaTeX via `react-latex-next` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Modal Account (for backend deployment)

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

### 2. Backend Deployment (Modal)

This project uses **Modal** for serverless GPU inference.

```bash
cd modal
pip install modal
modal setup
modal deploy modal_gradio.py
```

Once deployed, copy your Modal API URL and update `frontend/.env`:
```env
NEXT_PUBLIC_API_URL=https://your-modal-url.modal.run/api/v1/solve
```

---

## 📸 Screenshots

| **Chat Interface** | **Math Rendering** |
|:---:|:---:|
| <img src="https://via.placeholder.com/400x300?text=Chat+UI" alt="Chat UI" width="400"/> | <img src="https://via.placeholder.com/400x300?text=Math+Rendering" alt="Math Render" width="400"/> |

> *Clean, responsive, and powerful.*

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/DimasMP3">DimasMP3</a>
</p>
