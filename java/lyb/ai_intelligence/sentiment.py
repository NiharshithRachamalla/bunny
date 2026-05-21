# sentiment.py
# SmartLib AI Natural Language Processing Review Sentiment Analyzer

class ReviewSentimentAnalyzer:
    def __init__(self):
        # Lexicons of positive/negative triggers
        self.positive_words = {
            'excellent', 'amazing', 'brilliant', 'wonderful', 'great', 'fantastic', 
            'love', 'good', 'masterpiece', 'clear', 'practical', 'highly', 'valuable',
            'perfect', 'easy', 'recommend', 'insightful', 'must-read', 'beautiful'
        }
        self.negative_words = {
            'boring', 'tedious', 'hard', 'difficult', 'confusing', 'poor', 'bad', 
            'disappointing', 'worst', 'waste', 'hate', 'unclear', 'dry', 'shallow',
            'heavy', 'dull', 'useless', 'overrated', 'incorrect', 'outdated'
        }
        
    def analyze_sentiment(self, review_text):
        """Perform lexical scoring analysis of input review comment."""
        clean_text = review_text.lower().replace('.', '').replace(',', '').replace('!', '')
        words = clean_text.split()
        
        pos_count = 0
        neg_count = 0
        matched_pos = []
        matched_neg = []
        
        for w in words:
            if w in self.positive_words:
                pos_count += 1
                matched_pos.append(w)
            elif w in self.negative_words:
                neg_count += 1
                matched_neg.append(w)
                
        total_hits = pos_count + neg_count
        if total_hits == 0:
            score = 0.0
            sentiment = "Neutral"
        else:
            # Score range: -1.0 (very negative) to +1.0 (very positive)
            score = (pos_count - neg_count) / total_hits
            if score > 0.2:
                sentiment = "Positive"
            elif score < -0.2:
                sentiment = "Negative"
            else:
                sentiment = "Neutral"
                
        return {
            "score": round(score, 2),
            "sentiment": sentiment,
            "positive_hits": matched_pos,
            "negative_hits": matched_neg,
            "word_count": len(words)
        }

# Simple validation execution block
if __name__ == "__main__":
    analyzer = ReviewSentimentAnalyzer()
    test_reviews = [
        "This book is an absolute masterpiece! Highly practical and clean structure.",
        "A boring and tedious read. The examples were very confusing and dry.",
        "The algorithms are clear, but some math sections are highly dry."
    ]
    for r in test_reviews:
        print(f"Review: \"{r}\"")
        print(f"Result: {analyzer.analyze_sentiment(r)}\n")
