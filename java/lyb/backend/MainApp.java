package backend;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public class MainApp {
    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("   SMARTLIB AI — ENTERPRISE CONCURRENT ENGINE    ");
        System.out.println("=================================================");

        // 1. Initialize Components
        LibraryRepository repository = new LibraryRepository();
        LibraryService service = new LibraryService(repository);
        LibraryController controller = new LibraryController(repository);

        // 2. Seed Books (Catalog)
        repository.saveBook(new Book("B01", "Introduction to Algorithms", "Thomas H. Cormen", "Technology", 2));
        repository.saveBook(new Book("B02", "Clean Code", "Robert C. Martin", "Technology", 1)); // Solo copy to test waitlists
        repository.saveBook(new Book("B03", "The Great Gatsby", "F. Scott Fitzgerald", "Fiction", 5));
        repository.saveBook(new Book("B04", "Deep Learning", "Ian Goodfellow", "AI & ML", 1)); // AI Book
        repository.saveBook(new Book("B05", "Design Patterns", "Erich Gamma", "Technology", 3));

        // 3. Seed Members
        Member niharshith = new Member("M01", "Rachamalla Niharshith", Member.MemberType.PREMIUM, 99); // Top priority VIP
        Member sandeep = new Member("M02", "Sandeep Kumar", Member.MemberType.BASIC, 10);
        Member anjali = new Member("M03", "Anjali Sharma", Member.MemberType.BASIC, 5);
        Member rahul = new Member("M04", "Rahul Verma", Member.MemberType.PREMIUM, 80);

        repository.saveMember(niharshith);
        repository.saveMember(sandeep);
        repository.saveMember(anjali);
        repository.saveMember(rahul);

        // 4. Simulate Checkout Scenarios
        LocalDate today = LocalDate.now();
        System.out.println("\n--- SIMULATION START: INVENTORY CHECKOUT ---");
        
        // Niharshith checks out Algorithms
        Transaction t1 = service.checkoutBook(niharshith.getId(), "B01", today);
        System.out.println("Successful borrow: " + t1);

        // Sandeep borrows the ONLY copy of "Clean Code"
        Transaction t2 = service.checkoutBook(sandeep.getId(), "B02", today);
        System.out.println("Successful borrow: " + t2);

        // Rahul tries to borrow the sold out "Clean Code" (Goes to waitlist priority: 80)
        Transaction t3 = service.checkoutBook(rahul.getId(), "B02", today);

        // Anjali tries to borrow the sold out "Clean Code" (Goes to waitlist priority: 5)
        Transaction t4 = service.checkoutBook(anjali.getId(), "B02", today);

        // Niharshith tries to borrow "Clean Code" (Goes to waitlist priority: 99 - HIGHEST!)
        Transaction t5 = service.checkoutBook(niharshith.getId(), "B02", today);

        // 5. Simulate Multithreaded Waitlist Resolution
        System.out.println("\n--- SIMULATION: CONCURRENT WAITLIST RESOLUTION ---");
        
        // Create a separate worker thread representing Sandeep returning the book
        Thread returnThread = new Thread(() -> {
            try {
                Thread.sleep(1000); // simulate some reading time delay
                System.out.println("\n[System Thread] Sandeep is returning 'Clean Code'...");
                // Sandeep returns Clean Code
                service.returnBook(t2.getTransactionId(), today.plusDays(2));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        returnThread.start();
        try {
            returnThread.join(); // Wait for return scenario to complete
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // 6. Generate Data Feeds for Python AI and Dashboard layers
        System.out.println("\n--- EXPORTING ANALYTICS STATE REPORT DUMP ---");
        String summary = controller.getDashboardSummaryJson();
        String bookCatalogJson = controller.getBooksJson();
        String txLogsJson = controller.getTransactionsJson();

        System.out.println(summary);

        try {
            // Write reports to dashboard assets directory to simulate REST responses
            String baseDir = "c:\\Users\\sande\\OneDrive\\Desktop\\bunny\\java\\lyb\\dashboard\\";
            java.io.File folder = new java.io.File(baseDir);
            if (!folder.exists()) {
                folder.mkdirs();
            }
            
            FileWriter summaryFile = new FileWriter(baseDir + "summary.json");
            summaryFile.write(summary);
            summaryFile.close();

            FileWriter catalogFile = new FileWriter(baseDir + "catalog.json");
            catalogFile.write(bookCatalogJson);
            catalogFile.close();

            FileWriter txFile = new FileWriter(baseDir + "transactions.json");
            txFile.write(txLogsJson);
            txFile.close();

            System.out.println("State JSON reports successfully exported inside /dashboard/ assets directory!");
        } catch (IOException e) {
            System.err.println("Failed to write report files: " + e.getMessage());
        }

        System.out.println("\n=================================================");
        System.out.println("          SIMULATION COMPLETED SUCCESSFULLY      ");
        System.out.println("=================================================");
    }
}
