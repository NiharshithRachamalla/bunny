package backend;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Transaction {
    private final String transactionId;
    private final Book book;
    private final Member member;
    private final LocalDate checkoutDate;
    private LocalDate returnDate;
    private boolean isReturned;
    private static final int RENTAL_PERIOD_DAYS = 14;
    private static final double DAILY_FINE_RATE = 0.50; // $0.50 per day over due date

    public Transaction(String transactionId, Book book, Member member, LocalDate checkoutDate) {
        this.transactionId = transactionId;
        this.book = book;
        this.member = member;
        this.checkoutDate = checkoutDate;
        this.isReturned = false;
        this.returnDate = null;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public Book getBook() {
        return book;
    }

    public Member getMember() {
        return member;
    }

    public LocalDate getCheckoutDate() {
        return checkoutDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public boolean isReturned() {
        return isReturned;
    }

    public LocalDate getDueDate() {
        return checkoutDate.plusDays(RENTAL_PERIOD_DAYS);
    }

    public synchronized void returnBook(LocalDate returnDate) {
        this.returnDate = returnDate;
        this.isReturned = true;
    }

    public synchronized double calculateActiveFine(LocalDate currentDate) {
        if (isReturned) {
            if (returnDate.isAfter(getDueDate())) {
                long daysLate = ChronoUnit.DAYS.between(getDueDate(), returnDate);
                return daysLate * DAILY_FINE_RATE;
            }
            return 0.0;
        } else {
            if (currentDate.isAfter(getDueDate())) {
                long daysLate = ChronoUnit.DAYS.between(getDueDate(), currentDate);
                return daysLate * DAILY_FINE_RATE;
            }
            return 0.0;
        }
    }

    @Override
    public String toString() {
        return String.format("Tx: %s | Member: %s | Book: %s | Due: %s | Returned: %b",
            transactionId, member.getName(), book.getTitle(), getDueDate(), isReturned);
    }
}
