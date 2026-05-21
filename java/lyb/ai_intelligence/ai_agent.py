# ai_agent.py
# SmartLib AI Core Intelligence Orchestrator

import os
import json
from recommender import BookRecommender
from sentiment import ReviewSentimentAnalyzer
from forecaster import DemandForecaster

def run_ai_orchestration():
    print("=================================================")
    # Correct capitalization and punctuation in print statements to keep them clean
    print("   SMARTLIB AI — COGNITIVE INTELLIGENCE AGENT    ")
    print("=================================================")

    base_dir = "c:\\Users\\sande\\OneDrive\\Desktop\\bunny\\java\\lyb\\dashboard\\"
    
    # Path mappings
    catalog_path = os.path.join(base_dir, "catalog.json")
    transactions_path = os.path.join(base_dir, "transactions.json")
    summary_path = os.path.join(base_dir, "summary.json")
    reports_output_path = os.path.join(base_dir, "reports.json")

    # 1. Load Data Feeds from Java Backend Layer
    print("\n[Step 1] Loading JSON feeds from Java Core...")
    
    # Check if files exist, fallback to seeding mock data if not yet created by Java execution
    if not (os.path.exists(catalog_path) and os.path.exists(transactions_path)):
        print("[WARNING] Java reports not found in dashboard directory! Using fallback mock datasets.")
        catalog = [
            {"id": "B01", "title": "Introduction to Algorithms", "author": "Thomas H. Cormen", "genre": "Technology", "totalCopies": 2, "availableCopies": 1},
            {"id": "B02", "title": "Clean Code", "author": "Robert C. Martin", "genre": "Technology", "totalCopies": 1, "availableCopies": 0},
            {"id": "B03", "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "genre": "Fiction", "totalCopies": 5, "availableCopies": 5},
            {"id": "B04", "title": "Deep Learning", "author": "Ian Goodfellow", "genre": "AI & ML", "totalCopies": 1, "availableCopies": 0},
            {"id": "B05", "title": "Design Patterns", "author": "Erich Gamma", "genre": "Technology", "totalCopies": 3, "availableCopies": 3}
        ]
        transactions = [
            {"txId": "TX1", "bookTitle": "Introduction to Algorithms", "borrowerName": "Rachamalla Niharshith", "checkoutDate": "2026-05-21", "dueDate": "2026-06-04", "isReturned": False},
            {"txId": "TX2", "bookTitle": "Clean Code", "borrowerName": "Sandeep Kumar", "checkoutDate": "2026-05-21", "dueDate": "2026-06-04", "isReturned": False},
            {"txId": "TX3", "bookTitle": "Deep Learning", "borrowerName": "Rachamalla Niharshith", "checkoutDate": "2026-05-21", "dueDate": "2026-06-04", "isReturned": False}
        ]
    else:
        with open(catalog_path, 'r') as f:
            catalog = json.load(f)
        with open(transactions_path, 'r') as f:
            transactions = json.load(f)
        print("[Success] Loaded data successfully.")

    # 2. Re-map transactions for AI recommender & forecaster inputs
    print("\n[Step 2] Translating enterprise schemas to vector alignments...")
    # Map book titles to book ids
    title_to_id = {b['title'].lower(): b['id'] for b in catalog}
    
    # Interactions dictionary: MemberName/ID -> List of BookIDs
    # Since Java exports borrowerName, we map interactions based on borrowerName
    member_interactions = {}
    processed_transactions = []
    
    for tx in transactions:
        title = tx.get('bookTitle', '')
        book_id = title_to_id.get(title.lower(), 'B01') # fallback to B01 if mismatch
        borrower = tx.get('borrowerName', 'Unknown')
        
        if borrower not in member_interactions:
            member_interactions[borrower] = []
        member_interactions[borrower].append(book_id)
        
        processed_transactions.append({
            "transactionId": tx.get('txId'),
            "bookId": book_id,
            "memberId": borrower,
            "isReturned": tx.get('isReturned', False)
        })

    # Prepare catalog formatted for internal algorithms
    algo_catalog = []
    for b in catalog:
        algo_catalog.append({
            "id": b['id'],
            "title": b['title'],
            "genre": b['genre'],
            "copies": b.get('totalCopies', 1)
        })

    # 3. Running Collaborative Filtering Recommendations
    print("\n[Step 3] Executing User-Collaborative Recommendations...")
    recommender = BookRecommender(algo_catalog, member_interactions)
    recommendations_report = {}
    
    # Run recommendations for each active user in interactions
    for member in ["Rachamalla Niharshith", "Sandeep Kumar", "Anjali Sharma", "Rahul Verma"]:
        # Fallback to random if user has no interactions
        collab_rec = recommender.get_collaborative_recommendations(member, limit=2)
        content_rec = recommender.get_content_recommendations(member, limit=2)
        recommendations_report[member] = {
            "collaborative": collab_rec,
            "content_based": content_rec
        }
    print("[Success] Computed personalized vector recommendations.")

    # 4. Running NLP Sentiment Analysis on Book Reviews
    print("\n[Step 4] Executing lexical NLP Review Sentiment scoring...")
    analyzer = ReviewSentimentAnalyzer()
    
    seeded_reviews = [
        {"borrower": "Rachamalla Niharshith", "book": "Introduction to Algorithms", "text": "This book is an absolute masterpiece! Highly practical and clean structure. Love the clear proofs."},
        {"borrower": "Sandeep Kumar", "book": "Clean Code", "text": "Clean Code is an amazing, brilliant, and must-read book. Easy to understand and highly recommended!"},
        {"borrower": "Anjali Sharma", "book": "Deep Learning", "text": "The deep learning content is brilliant, clear, and wonderful, but some mathematical sections are heavy, difficult, and confusing."},
        {"borrower": "Rahul Verma", "book": "The Great Gatsby", "text": "A boring and tedious read. The pacing was dull and disappointingly slow. Quite useless for computer science."}
    ]
    
    sentiment_records = []
    pos_count = 0
    neg_count = 0
    neu_count = 0
    
    for rev in seeded_reviews:
        analysis = analyzer.analyze_sentiment(rev["text"])
        record = {
            "borrower": rev["borrower"],
            "book": rev["book"],
            "review": rev["text"],
            "sentiment": analysis["sentiment"],
            "score": analysis["score"],
            "positive_hits": analysis["positive_hits"],
            "negative_hits": analysis["negative_hits"]
        }
        sentiment_records.append(record)
        
        if analysis["sentiment"] == "Positive":
            pos_count += 1
        elif analysis["sentiment"] == "Negative":
            neg_count += 1
        else:
            neu_count += 1

    sentiment_report = {
        "reviews": sentiment_records,
        "summary": {
            "positive": pos_count,
            "neutral": neu_count,
            "negative": neg_count,
            "total_reviews": len(seeded_reviews)
        }
    }
    print("[Success] Classified and graded review matrix scores.")

    # 5. Running Predictive Demand Forecasting
    print("\n[Step 5] Extrapolating predictive demand velocities...")
    forecaster = DemandForecaster(algo_catalog, processed_transactions)
    forecast_report = forecaster.forecast_demand(days_ahead=7)
    print("[Success] Constructed inventory velocity projections.")

    # 6. Aggregating into Unified JSON Payload
    print("\n[Step 6] Saving compiled report payload to dashboard workspace...")
    master_report = {
        "recommendations": recommendations_report,
        "sentiment_analysis": sentiment_report,
        "demand_forecast": forecast_report
    }

    # Ensure dashboard folder exists
    os.makedirs(base_dir, exist_ok=True)
    
    with open(reports_output_path, 'w') as f:
        json.dump(master_report, f, indent=2)

    print(f"[Success] Multi-language intelligence metrics generated at: {reports_output_path}")
    print("=================================================")
    print("           AI PIPELINES RUN SUCCESSFULLY         ")
    print("=================================================")

if __name__ == "__main__":
    run_ai_orchestration()
