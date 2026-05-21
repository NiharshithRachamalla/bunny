package backend;

public class Book {
    private final String id;
    private final String title;
    private final String author;
    private final String genre;
    private int totalCopies;
    private int availableCopies;

    public Book(String id, String title, String author, String genre, int totalCopies) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.totalCopies = totalCopies;
        this.availableCopies = totalCopies;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public String getGenre() {
        return genre;
    }

    public synchronized int getTotalCopies() {
        return totalCopies;
    }

    public synchronized int getAvailableCopies() {
        return availableCopies;
    }

    public synchronized boolean checkoutCopy() {
        if (availableCopies > 0) {
            availableCopies--;
            return true;
        }
        return false;
    }

    public synchronized void returnCopy() {
        if (availableCopies < totalCopies) {
            availableCopies++;
        }
    }

    public synchronized void updateStock(int newTotal) {
        int diff = newTotal - this.totalCopies;
        this.totalCopies = newTotal;
        this.availableCopies += diff;
        if (this.availableCopies < 0) {
            this.availableCopies = 0;
        }
    }

    @Override
    public String toString() {
        return String.format("[%s] %s by %s (%s) - Available: %d/%d", 
            id, title, author, genre, availableCopies, totalCopies);
    }
}
