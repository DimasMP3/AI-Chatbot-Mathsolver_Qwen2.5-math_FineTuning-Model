import gradio as gr
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TextIteratorStreamer
from threading import Thread

MODEL_ID = "DimasMP3/qwen2.5-math-finetuned-7b"

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    torch_dtype=torch.float16,
    device_map="auto",
    load_in_4bit=True,
    low_cpu_mem_usage=True
)

def format_prompt(user_query):
    return f"""Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:
Solve the following math problem step-by-step:
{user_query}

### Response:
"""

def predict(message, history):
    prompt = format_prompt(message)
    inputs = tokenizer([prompt], return_tensors="pt").to(model.device)

    streamer = TextIteratorStreamer(
        tokenizer, 
        skip_prompt=True, 
        skip_special_tokens=True,
        timeout=10.0
    )

    generation_kwargs = dict(
        inputs,
        streamer=streamer,
        max_new_tokens=1024,
        do_sample=True,
        temperature=0.3, 
        top_p=0.9,
        repetition_penalty=1.1
    )

    thread = Thread(target=model.generate, kwargs=generation_kwargs)
    thread.start()

    partial_text = ""
    for new_text in streamer:
        partial_text += new_text
        yield partial_text

demo = gr.ChatInterface(
    fn=predict,
    title="Sultan Math AI Solver",
    description="Qwen 2.5 (7B Parameters) Fine-Tuned Model for Mathematical Reasoning",
    examples=[
        "Solve the equation 3x + 10 = 25",
        "Calculate the derivative of f(x) = 4x^3 - 2x",
        "A triangle has a base of 10cm and a height of 5cm, what is its area?"
    ],
    theme="soft",
    cache_examples=False,
)

if __name__ == "__main__":
    demo.launch()