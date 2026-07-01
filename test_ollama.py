"""Test Ollama integration for AI question generation and scoring."""
import os
os.environ["OLLAMA_MODEL_NAME"] = "codellama:latest"

from app.services.ai_service import generate_job_questions, score_resume_against_job, score_answer

print("=" * 60)
print("Testing Ollama AI Integration")
print("=" * 60)

# Test 1: Question Generation
print("\n[Test 1] Generating interview questions...")
job_desc = "Python FastAPI backend engineer. 5+ years experience with REST APIs, PostgreSQL, and Docker."
try:
    questions = generate_job_questions(job_desc)
    print(f"✓ Generated {len(questions)} questions")
    for i, q in enumerate(questions[:3], 1):
        print(f"  Q{i}: {q.get('text', '')[:70]}...")
except Exception as e:
    print(f"✗ Error: {type(e).__name__}: {str(e)[:100]}")

# Test 2: Resume Scoring
print("\n[Test 2] Scoring resume against job...")
resume_text = "Senior Python Developer with 6 years experience building microservices with FastAPI and PostgreSQL. Strong database design skills."
try:
    score = score_resume_against_job(resume_text, job_desc)
    print(f"✓ Resume score: {score}")
except Exception as e:
    print(f"✗ Error: {type(e).__name__}: {str(e)[:100]}")

# Test 3: Answer Scoring
print("\n[Test 3] Scoring answer to interview question...")
question_text = "Describe your experience with FastAPI"
answer_text = "I have used FastAPI for 3 years to build REST APIs. I'm familiar with dependency injection, async handlers, and Pydantic validation."
try:
    score = score_answer(answer_text, question_text)
    print(f"✓ Answer score: {score}")
except Exception as e:
    print(f"✗ Error: {type(e).__name__}: {str(e)[:100]}")

print("\n" + "=" * 60)
print("Ollama integration test complete")
print("=" * 60)
