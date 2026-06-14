from typing import Optional

PROMPT_TREE = {
    "categories": [
        {"id": "content", "label": "Content Creation", "icon": "✍️"},
        {"id": "code", "label": "Code & Tech", "icon": "💻"},
        {"id": "analysis", "label": "Analysis & Research", "icon": "🔍"},
        {"id": "business", "label": "Business & Strategy", "icon": "📊"},
        {"id": "creative", "label": "Creative & Fiction", "icon": "🎨"},
        {"id": "learning", "label": "Learning & Explanation", "icon": "🎓"},
    ],
    "branches": {
        "content": {
            "formats": ["Blog Post", "Social Media", "Email Newsletter", "Video Script", "Press Release"],
            "tones": ["Professional", "Casual", "Humorous", "Inspirational", "Educational"],
            "audiences": ["General Public", "Executives", "Developers", "Students", "Consumers"],
            "questions": [
                {"id": "topic", "label": "What is the main topic?", "type": "text"},
                {"id": "goal", "label": "What should the reader do or feel after?", "type": "text"},
                {"id": "length", "label": "Approximate length?", "type": "select",
                 "options": ["Short (under 300 words)", "Medium (300-800 words)", "Long (800+ words)"]},
                {"id": "keywords", "label": "Any keywords or phrases to include?", "type": "text"},
            ]
        },
        "code": {
            "formats": ["Write New Code", "Debug Existing Code", "Code Review", "Explain Code", "Refactor"],
            "tones": ["Precise", "Detailed", "Concise", "Educational", "Step-by-step"],
            "audiences": ["Junior Developer", "Senior Developer", "Non-Technical Stakeholder"],
            "questions": [
                {"id": "language", "label": "Programming language?", "type": "text"},
                {"id": "task", "label": "What specifically needs to be built or fixed?", "type": "text"},
                {"id": "context", "label": "Any relevant context or constraints?", "type": "text"},
                {"id": "output_format", "label": "How should the output be structured?", "type": "select",
                 "options": ["Just the code", "Code with comments", "Code with full explanation", "Step-by-step walkthrough"]},
            ]
        },
        "analysis": {
            "formats": ["Competitive Analysis", "Data Summary", "Literature Review", "Risk Assessment", "SWOT"],
            "tones": ["Objective", "Critical", "Comprehensive", "Executive Summary", "Academic"],
            "audiences": ["Executives", "Analysts", "Investors", "General Public", "Researchers"],
            "questions": [
                {"id": "subject", "label": "What are you analyzing?", "type": "text"},
                {"id": "angle", "label": "What specific angle or question to focus on?", "type": "text"},
                {"id": "data", "label": "Any specific data or sources to reference?", "type": "text"},
                {"id": "output", "label": "What format for the output?", "type": "select",
                 "options": ["Bullet points", "Narrative paragraphs", "Table / matrix", "Executive memo"]},
            ]
        },
        "business": {
            "formats": ["Strategy Memo", "Pitch Deck Outline", "Job Description", "Meeting Agenda", "Proposal"],
            "tones": ["Formal", "Persuasive", "Collaborative", "Direct", "Visionary"],
            "audiences": ["Board / Investors", "Team Members", "Clients", "Hiring Candidates", "Partners"],
            "questions": [
                {"id": "objective", "label": "What is the business objective?", "type": "text"},
                {"id": "company", "label": "Company or industry context?", "type": "text"},
                {"id": "constraints", "label": "Any constraints, budget, or timeline?", "type": "text"},
                {"id": "cta", "label": "What action should this drive?", "type": "text"},
            ]
        },
        "creative": {
            "formats": ["Short Story", "Poem", "Screenplay Scene", "Game Narrative", "World Building"],
            "tones": ["Dark", "Lighthearted", "Suspenseful", "Romantic", "Epic", "Satirical"],
            "audiences": ["Adults", "Young Adults", "Children", "Genre Fans", "General"],
            "questions": [
                {"id": "genre", "label": "Genre or style?", "type": "text"},
                {"id": "premise", "label": "Core premise or concept?", "type": "text"},
                {"id": "characters", "label": "Key characters or elements?", "type": "text"},
                {"id": "theme", "label": "Underlying theme or message?", "type": "text"},
            ]
        },
        "learning": {
            "formats": ["Simple Explanation", "Deep Dive", "Analogy", "Step-by-step Tutorial", "FAQ"],
            "tones": ["Beginner-friendly", "Technical", "Socratic", "Encouraging", "Structured"],
            "audiences": ["Complete Beginners", "Intermediate Learners", "Experts", "Kids", "Professionals"],
            "questions": [
                {"id": "concept", "label": "What concept or skill needs explaining?", "type": "text"},
                {"id": "prior_knowledge", "label": "What does the audience already know?", "type": "text"},
                {"id": "context", "label": "Why does the audience need to learn this?", "type": "text"},
                {"id": "depth", "label": "How deep should this go?", "type": "select",
                 "options": ["Surface overview", "Solid understanding", "Expert-level mastery"]},
            ]
        }
    }
}

def build_prompt(state: dict) -> str:
    category = state.get("category", "")
    format_ = state.get("format", "")
    tone = state.get("tone", "")
    audience = state.get("audience", "")
    answers = state.get("answers", {})

    branch = PROMPT_TREE["branches"].get(category, {})
    questions = branch.get("questions", [])

    parts = []

    if format_:
        parts.append(f"Create a {format_}")
    if tone:
        parts.append(f"in a {tone} tone")
    if audience:
        parts.append(f"targeted at {audience}.")

    for q in questions:
        qid = q["id"]
        if qid in answers and answers[qid]:
            label = q["label"].rstrip("?").rstrip(".")
            parts.append(f"{label}: {answers[qid]}.")

    return " ".join(parts)

def get_tree():
    return PROMPT_TREE