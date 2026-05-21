# recommender.py
# SmartLib AI Content & Collaborative Book Recommendation System

class BookRecommender:
    def __init__(self, catalog, member_interactions):
        self.catalog = catalog  # List of dicts: {'id': ..., 'title': ..., 'genre': ...}
        self.interactions = member_interactions # Dict of MemberID -> List of BookIDs borrowed

    def get_content_recommendations(self, member_id, limit=3):
        """Recommend books in genres the member has borrowed before, avoiding already borrowed ones."""
        borrowed = set(self.interactions.get(member_id, []))
        if not borrowed:
            # Fallback to general popular books across catalog
            return [b for b in self.catalog[:limit]]

        # Calculate genre preference scores
        genre_scores = {}
        for book_id in borrowed:
            book = next((b for b in self.catalog if b['id'] == book_id), None)
            if book:
                genre = book['genre']
                genre_scores[genre] = genre_scores.get(genre, 0) + 1

        # Score remaining books
        scored_recommendations = []
        for book in self.catalog:
            if book['id'] not in borrowed:
                genre = book['genre']
                score = genre_scores.get(genre, 0)
                if score > 0:
                    scored_recommendations.append((book, score))

        # Sort recommendations by highest score
        scored_recommendations.sort(key=lambda x: x[1], reverse=True)
        return [item[0] for item in scored_recommendations[:limit]]

    def get_collaborative_recommendations(self, member_id, limit=3):
        """Simple User-Based Collaborative Filtering using Jaccard Similarity."""
        my_borrowed = set(self.interactions.get(member_id, []))
        if not my_borrowed:
            return self.get_content_recommendations(member_id, limit)

        similar_users = []
        for other_id, other_borrowed in self.interactions.items():
            if other_id == member_id:
                continue
            other_set = set(other_borrowed)
            intersection = my_borrowed.intersection(other_set)
            union = my_borrowed.union(other_set)
            
            # Jaccard index similarity
            similarity = len(intersection) / len(union) if union else 0.0
            if similarity > 0:
                similar_users.append((other_id, similarity, other_set))

        if not similar_users:
            return self.get_content_recommendations(member_id, limit)

        # Sort other users by highest similarity
        similar_users.sort(key=lambda x: x[1], reverse=True)

        # Accumulate recommendation candidate scores
        recommendations = {}
        for other_id, similarity, other_set in similar_users:
            candidates = other_set.difference(my_borrowed)
            for book_id in candidates:
                recommendations[book_id] = recommendations.get(book_id, 0.0) + similarity

        # Sort candidates
        sorted_candidates = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
        
        result = []
        for book_id, score in sorted_candidates[:limit]:
            book = next((b for b in self.catalog if b['id'] == book_id), None)
            if book:
                result.append(book)
        return result

# Simple self-test validation block
if __name__ == "__main__":
    catalog = [
        {"id": "B01", "title": "Introduction to Algorithms", "genre": "Technology"},
        {"id": "B02", "title": "Clean Code", "genre": "Technology"},
        {"id": "B03", "title": "The Great Gatsby", "genre": "Fiction"},
        {"id": "B04", "title": "Deep Learning", "genre": "AI & ML"},
        {"id": "B05", "title": "Design Patterns", "genre": "Technology"}
    ]
    
    interactions = {
        "M01": ["B01", "B04"],         # Rachamalla Niharshith (Tech + AI)
        "M02": ["B01", "B02"],         # Sandeep (Tech)
        "M03": ["B03"],                # Anjali (Fiction)
        "M04": ["B01", "B04", "B05"]   # Rahul (Tech + AI + Design Patterns)
    }
    
    rec = BookRecommender(catalog, interactions)
    print("Content recommendations for Sandeep:", rec.get_content_recommendations("M02"))
    print("Collaborative recommendations for Sandeep:", rec.get_collaborative_recommendations("M02"))
