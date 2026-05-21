package backend;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class LibraryService {
    private final LibraryRepository repository;
    private final Map<String, PriorityQueue<Member>> waitlists = new ConcurrentHashMap<>();
    private int transactionCounter = 1000;

    public LibraryService(LibraryRepository repository) {
        this.repository = repository;
    }

    private synchronized String generateTxId() {
        return "TX" + (++transactionCounter);
    }

    public synchronized Transaction checkoutBook(String memberId, String bookId, LocalDate checkoutDate) {
        Member member = repository.findMemberById(memberId);
        Book book = repository.findBookById(bookId);

        if (member == null || book == null) {
            throw new IllegalArgumentException("Invalid Member ID or Book ID");
        }

        // Attempt book checkout
        if (book.checkoutCopy()) {
            Transaction tx = new Transaction(generateTxId(), book, member, checkoutDate);
            repository.saveTransaction(tx);
            return tx;
        }

        // Book is sold out, add member to waitlist priority queue
        waitlists.computeIfAbsent(bookId, k -> new PriorityQueue<>()).add(member);
        System.out.println(String.format("Waitlist Registered: %s waitlisted for '%s'", member.getName(), book.getTitle()));
        return null;
    }

    public synchronized Member returnBook(String transactionId, LocalDate returnDate) {
        Transaction matchingTx = repository.findAllTransactions().stream()
            .filter(t -> t.getTransactionId().equals(transactionId) && !t.isReturned())
            .findFirst()
            .orElse(null);

        if (matchingTx == null) {
            throw new IllegalArgumentException("Active transaction matching ID was not found");
        }

        matchingTx.returnBook(returnDate);
        Book book = matchingTx.getBook();
        book.returnCopy();
        
        System.out.println(String.format("Book Returned: '%s' has been returned by %s.", book.getTitle(), matchingTx.getMember().getName()));
        
        // Calculate fines if any
        double fine = matchingTx.calculateActiveFine(returnDate);
        if (fine > 0) {
            System.out.println(String.format("Late Fine: Member fined $%.2f", fine));
        }

        // Check waitlist priority resolution
        PriorityQueue<Member> bookWaitlist = waitlists.get(book.getId());
        if (bookWaitlist != null && !bookWaitlist.isEmpty()) {
            Member nextInLine = bookWaitlist.poll();
            System.out.println(String.format("Waitlist Priority Resolved: Offering copy to %s (Priority: %d)", 
                nextInLine.getName(), nextInLine.getReservationPriority()));
            
            // Automatically check out to priority member
            if (book.checkoutCopy()) {
                Transaction newTx = new Transaction(generateTxId(), book, nextInLine, returnDate);
                repository.saveTransaction(newTx);
                System.out.println(String.format("Auto-Checkout Tx created: %s", newTx.getTransactionId()));
                return nextInLine;
            }
        }
        return null;
    }

    public List<Book> searchCatalog(String query) {
        String cleanQuery = query.toLowerCase().trim();
        if (cleanQuery.isEmpty()) {
            return repository.findAllBooks();
        }
        return repository.findAllBooks().stream()
            .filter(b -> b.getTitle().toLowerCase().contains(cleanQuery) 
                      || b.getAuthor().toLowerCase().contains(cleanQuery)
                      || b.getGenre().toLowerCase().contains(cleanQuery))
            .collect(Collectors.toList());
    }

    public PriorityQueue<Member> getWaitlistForBook(String bookId) {
        return waitlists.getOrDefault(bookId, new PriorityQueue<>());
    }
}
