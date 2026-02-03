import os
import modal
from pydantic import BaseModel

MODEL_ID = "DimasMP3/qwen2.5-math-finetuned-7b"
MODEL_DIR = "/model" 

def download_model_to_image():
    from huggingface_hub import snapshot_download
    from transformers import AutoTokenizer
    
    print(f"Downloading model {MODEL_ID} to bake into image...")
    
    # Download Model Weights
    snapshot_download(
        MODEL_ID,
        local_dir=MODEL_DIR,
        ignore_patterns=["*.pt", "*.bin"], 
        local_dir_use_symlinks=False
    )
    
    AutoTokenizer.from_pretrained(MODEL_ID).save_pretrained(MODEL_DIR)
    print("Model baked successfully!")

image = (
    modal.Image.debian_slim()
    .apt_install("git")
 
    .pip_install(
        "torch",
        "transformers",
        "accelerate",
        "bitsandbytes",
        "scipy",
        "fastapi",
        "pydantic",
        "huggingface_hub[hf_transfer]" 
    )
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
  
    .run_function(download_model_to_image)
)

app = modal.App("qwen2-5ft-math", image=image)


class MathRequest(BaseModel):
    question: str
    temperature: float = 0.3 

class MathResponse(BaseModel):
    answer: str
    model_version: str = "v1.0"


@app.cls(gpu="T4", timeout=3600, scaledown_window=300, concurrency_limit=1)
class ModelEngine:
    
    @modal.enter()
    def load_model(self):
        import torch
        from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

        print("Loading model from baked image...")

        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16
        )

       
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
        self.model = AutoModelForCausalLM.from_pretrained(
            MODEL_DIR,
            quantization_config=bnb_config,
            device_map="auto",
            local_files_only=True 
        )
        print("Model Loaded Instantly!")

    @modal.method()
    def infer(self, user_query: str, temp: float = 0.3) -> str:
        import re
        
        query_lower = user_query.lower().strip()
        
        # 1. Handle Greetings explicitly (Model overfits to math, so we intercept greetings)
        greetings = ["halo", "hi", "hello", "hai", "selamat pagi", "selamat siang", "selamat sore", "selamat malam", "tes", "test", "p", "siang", "pagi", "malam", "sore"]
        if query_lower in greetings:
            return "Halo! Saya MathAI. Ada soal matematika yang bisa saya bantu selesaikan?"

        # 2. Strict Input Validation
        # If input is short AND has no numbers/math symbols, likely nice/gibberish
        # We also check for math keywords to allow text-only math questions like "what is a derivative?"
        
        math_keywords = [
            "hitung", "cari", "selesaikan", "tentukan", "berapa", "what", "solve", "find", "calculate",
            "turunan", "integral", "limit", "matriks", "matrix", "akar", "pangkat", "kuadrat",
            "sin", "cos", "tan", "log", "ln", "persamaan", "equation", "luas", "volume",
            "derivatif", "derivative", "jumlah", "kurang", "kali", "bagi", "tambah", "hasil", "result"
        ]
        
        has_digit = any(c.isdigit() for c in user_query)
        has_math_symbol = any(s in user_query for s in ["+", "-", "*", "/", "=", "^", "\\", "<", ">", "(", ")"])
        has_keyword = any(k in query_lower for k in math_keywords)
        
        # Guard clause: If short, no digits, no math symbols, and no keywords -> Reject
        if len(query_lower) < 15 and not (has_digit or has_math_symbol or has_keyword):
             return "Maaf, saya MathAI yang fokus pada matematika. Mohon berikan pertanyaan matematika atau persamaan yang jelas."

        prompt = f"""<|im_start|>system
You are MathAI, a highly capable mathematics expert.
Your goal is to solve math problems accurately and explain them step-by-step.

IMPORTANT INSTRUCTIONS:
- If the user input is a greeting or casual chat, reply naturally as an assistant.
- If the input is NOT a math problem or is nonsensical, politely refuse to answer.
- NEVER generate a math problem or solution if the user didn't ask for one.
- Use $...$ for inline math and $$...$$ for block equations.<|im_end|>
<|im_start|>user
{user_query}<|im_end|>
<|im_start|>assistant
"""
        
        inputs = self.tokenizer([prompt], return_tensors="pt").to(self.model.device)

        try:
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=1024,
                do_sample=True,
                temperature=temp,
                top_p=0.9,
                repetition_penalty=1.1,
                pad_token_id=self.tokenizer.eos_token_id,
                eos_token_id=self.tokenizer.eos_token_id
            )
            
            generated_ids = outputs[0][inputs['input_ids'].shape[1]:]
            response = self.tokenizer.decode(generated_ids, skip_special_tokens=True)
            
            response = response.replace("<|im_end|>", "").strip()
            response = re.sub(r'^(system|user|assistant)\s*', '', response, flags=re.IGNORECASE)
            
            return response
            
        except Exception as e:
            print(f"Error during inference: {e}")
            return "Maaf, terjadi kesalahan saat memproses jawaban."



# endpoint setup
@app.function(image=image, max_containers=1)
@modal.asgi_app()
def api():
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    
    # Metadata API 
    web_app = FastAPI(
        title="Qwen2.5-Math AI API",
        description="High-performance Math Reasoning API powered by Qwen 2.5 (Fine-Tuned)",
        version="1.0.0"
    )

    # Security: CORS Middleware
    web_app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @web_app.post("/api/v1/solve", response_model=MathResponse) 
    async def solve_problem(data: MathRequest):
        engine = ModelEngine()

        result = engine.infer.remote(data.question, data.temperature)
        return MathResponse(answer=result)

    @web_app.get("/health")
    async def health_check():
        return {
            "status": "operational", 
            "gpu": "Nvidia T4",
            "model": MODEL_ID
        }

    return web_app