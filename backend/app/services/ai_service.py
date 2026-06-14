import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def enhance_prompt(raw_prompt: str) -> str:
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": f"""You are a prompt engineering expert. Take this rough prompt and enhance it into a clear, specific, highly effective AI prompt. Keep the user's intent exactly but make it more precise and complete.

Raw prompt: {raw_prompt}

Return ONLY the enhanced prompt, nothing else. No preamble, no explanation."""
            }
        ]
    )
    return message.content[0].text

def generate_followup_questions(state: dict) -> list:
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        messages=[
            {
                "role": "user",
                "content": f"""Based on this prompt-building state, generate 2 short follow-up questions that would make the final prompt significantly better. Return as JSON array of objects with 'id' and 'label' fields only.

State: {state}

Example format: [{{"id": "extra1", "label": "What tone should be avoided?"}}, {{"id": "extra2", "label": "Any examples to reference?"}}]

Return ONLY the JSON array."""
            }
        ]
    )
    import json
    try:
        return json.loads(message.content[0].text)
    except:
        return []