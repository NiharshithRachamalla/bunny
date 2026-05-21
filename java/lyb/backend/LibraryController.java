package backend;

import java.util.List;
import java.util.stream.Collectors;

public class LibraryController {
    private final LibraryRepository repository;

    public LibraryController(LibraryRepository repository) {
        this.repository = repository;
    }

    public String getDashboardSummaryJson() {
        List<Book> books = repository.findAllBooks();
        List<Transaction> txs = repository.findAllTransactions();

        int totalBooks = books.stream().mapToInt(Book::getTotalCopies).sum();
        int availableBooks = books.stream().mapToInt(Book::getAvailableCopies).sum();
        int checkedOut = totalBooks - availableBooks;

        long pendingTxs = txs.stream().filter(t -> !t.isReturned()).count();
        double totalFines = txs.stream().mapToDouble(t -> t.calculateActiveFine(java.time.LocalDate.now())).sum();

        // Build a manual clean JSON payload string to simulate standard Spring Boot controller serialization
        return String.format(
            "{\n" +
            "  \"totalCatalogVolume\": %d,\n" +
            "  \"availableStock\": %d,\n" +
            "  \"checkedOutVolume\": %d,\n" +
            "  \"activeBorrowersCount\": %d,\n" +
            "  \"accumulatedFines\": %.2f\n" +
            "}",
            totalBooks, availableBooks, checkedOut, pendingTxs, totalFines
        );
    }

    public String getBooksJson() {
        return "[\n" +
            repository.findAllBooks().stream()
                .map(b -> String.format(
                    "  {\n" +
                    "    \"id\": \"%s\",\n" +
                    "    \"title\": \"%s\",\n" +
                    "    \"author\": \"%s\",\n" +
                    "    \"genre\": \"%s\",\n" +
                    "    \"totalCopies\": %d,\n" +
                    "    \"availableCopies\": %d\n" +
                    "  }",
                    b.getId(), b.getTitle().replace("\"", "\\\""), b.getAuthor().replace("\"", "\\\""), b.getGenre(), b.getTotalCopies(), b.getAvailableCopies()
                ))
                .collect(Collectors.joining(",\n")) +
            "\n]";
    }

    public String getTransactionsJson() {
        return "[\n" +
            repository.findAllTransactions().stream()
                .map(t -> String.format(
                    "  {\n" +
                    "    \"txId\": \"%s\",\n" +
                    "    \"bookTitle\": \"%s\",\n" +
                    "    \"borrowerName\": \"%s\",\n" +
                    "    \"checkoutDate\": \"%s\",\n" +
                    "    \"dueDate\": \"%s\",\n" +
                    "    \"isReturned\": %b\n" +
                    "  }",
                    t.getTransactionId(), t.getBook().getTitle().replace("\"", "\\\""), t.getMember().getName().replace("\"", "\\\""), t.getCheckoutDate(), t.getDueDate(), t.isReturned()
                ))
                .collect(Collectors.joining(",\n")) +
            "\n]";
    }
}
