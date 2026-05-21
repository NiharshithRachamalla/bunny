package backend;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

public class LibraryRepository {
    private final Map<String, Book> books = new ConcurrentHashMap<>();
    private final Map<String, Member> members = new ConcurrentHashMap<>();
    private final List<Transaction> transactions = new CopyOnWriteArrayList<>();

    public void saveBook(Book book) {
        books.put(book.getId(), book);
    }

    public Book findBookById(String id) {
        return books.get(id);
    }

    public List<Book> findAllBooks() {
        return new ArrayList<>(books.values());
    }

    public void saveMember(Member member) {
        members.put(member.getId(), member);
    }

    public Member findMemberById(String id) {
        return members.get(id);
    }

    public List<Member> findAllMembers() {
        return new ArrayList<>(members.values());
    }

    public void saveTransaction(Transaction tx) {
        transactions.add(tx);
    }

    public List<Transaction> findAllTransactions() {
        return new CopyOnWriteArrayList<>(transactions);
    }
}
