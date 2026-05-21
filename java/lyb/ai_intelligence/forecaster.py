# forecaster.py
# SmartLib AI Inventory Demand Forecaster

class DemandForecaster:
    def __init__(self, catalog, transactions):
        self.catalog = catalog  # List of dicts: {'id': ..., 'title': ..., 'genre': ..., 'copies': ...}
        self.transactions = transactions  # List of dicts: {'transactionId': ..., 'bookId': ..., 'memberId': ..., 'borrowDate': ..., 'returnDate': ..., 'isReturned': ...}

    def forecast_demand(self, days_ahead=7):
        """
        Calculate inventory checkout velocities and extrapolate demand metrics.
        No external libraries (numpy, pandas) are used to ensure environment portability.
        """
        # Calculate checkout frequency per book
        checkout_counts = {}
        genre_counts = {}
        active_borrows = {}
        
        for tx in self.transactions:
            book_id = tx.get('bookId')
            checkout_counts[book_id] = checkout_counts.get(book_id, 0) + 1
            
            # Find the book in catalog to get genre
            book = next((b for b in self.catalog if b['id'] == book_id), None)
            if book:
                genre = book.get('genre')
                genre_counts[genre] = genre_counts.get(genre, 0) + 1
            
            # Check if book is currently borrowed (not returned)
            if not tx.get('isReturned', False):
                active_borrows[book_id] = active_borrows.get(book_id, 0) + 1

        total_tx = len(self.transactions) or 1
        
        forecasts = []
        for book in self.catalog:
            book_id = book['id']
            copies = book.get('copies', 1)
            currently_borrowed = active_borrows.get(book_id, 0)
            available = max(0, copies - currently_borrowed)
            
            # Historical borrowing velocity (checkouts per historical records)
            history_borrows = checkout_counts.get(book_id, 0)
            velocity = history_borrows / total_tx # normalized velocity score
            
            # Forecasted demand score (higher velocity = higher demand)
            # Add simple linear extrapolation for days_ahead
            # If available is 0, risk of stockout is 100%
            # If velocity is high and available is low, risk is high
            demand_score = round(velocity * 100, 2)
            
            # Stockout risk evaluation: High, Medium, Low
            if available == 0:
                stockout_risk = "Critical"
                urgency_level = "High"
            elif available == 1 and demand_score > 30:
                stockout_risk = "High"
                urgency_level = "High"
            elif demand_score > 15:
                stockout_risk = "Medium"
                urgency_level = "Medium"
            else:
                stockout_risk = "Low"
                urgency_level = "Low"
                
            # Extrapolated next-week borrowing count estimation
            predicted_checkouts_next_7_days = round(velocity * 5 * (days_ahead / 7), 1)
            
            forecasts.append({
                "book_id": book_id,
                "title": book['title'],
                "genre": book['genre'],
                "available_copies": available,
                "total_copies": copies,
                "historical_checkouts": history_borrows,
                "demand_score": demand_score,
                "stockout_risk": stockout_risk,
                "urgency_level": urgency_level,
                "predicted_checkouts": predicted_checkouts_next_7_days
            })
            
        # Genre-level demand breakdown
        genre_demand = []
        for genre, count in genre_counts.items():
            percentage = round((count / total_tx) * 100, 1)
            genre_demand.append({
                "genre": genre,
                "checkout_count": count,
                "demand_share_percentage": percentage
            })
            
        # Sort genre demand by checkout count
        genre_demand.sort(key=lambda x: x['checkout_count'], reverse=True)

        return {
            "book_forecasts": forecasts,
            "genre_demand": genre_demand,
            "overall_occupancy_rate": round((sum(active_borrows.values()) / sum(b.get('copies', 1) for b in self.catalog)) * 100, 1) if self.catalog else 0.0
        }

if __name__ == "__main__":
    catalog = [
        {"id": "B01", "title": "Introduction to Algorithms", "genre": "Technology", "copies": 2},
        {"id": "B02", "title": "Clean Code", "genre": "Technology", "copies": 1},
        {"id": "B03", "title": "The Great Gatsby", "genre": "Fiction", "copies": 5},
        {"id": "B04", "title": "Deep Learning", "genre": "AI & ML", "copies": 1}
    ]
    transactions = [
        {"transactionId": "TX1", "bookId": "B01", "memberId": "M01", "isReturned": False},
        {"transactionId": "TX2", "bookId": "B02", "memberId": "M02", "isReturned": False},
        {"transactionId": "TX3", "bookId": "B01", "memberId": "M04", "isReturned": True},
        {"transactionId": "TX4", "bookId": "B04", "memberId": "M01", "isReturned": False}
    ]
    
    forecaster = DemandForecaster(catalog, transactions)
    print(forecaster.forecast_demand())
