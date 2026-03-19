export interface JavaSolution {
  id: number;
  title: string;
  problem: string;
  explanation: string;
  codeSnippet: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
}

export const CATEGORIES = [
  "Collections",
  "Exceptions",
  "Streams",
  "OOP",
  "Multithreading",
  "I/O",
  "Generics",
  "Design Patterns",
];

export const solutions: JavaSolution[] = [
  // ── COLLECTIONS ──────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "ArrayList vs LinkedList: Choosing the Right List",
    problem:
      "When should you use ArrayList over LinkedList and vice versa in Java?",
    explanation:
      "ArrayList uses a dynamic array internally, offering O(1) random access but O(n) insertions/deletions in the middle. LinkedList uses a doubly-linked list with O(1) insertions/deletions at known positions but O(n) random access. Use ArrayList when you read frequently; use LinkedList when you insert or delete elements in the middle often.",
    codeSnippet: `import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class ListComparison {
    public static void main(String[] args) {
        // ArrayList: fast random access
        List<String> arrayList = new ArrayList<>();
        arrayList.add("Alice");
        arrayList.add("Bob");
        String first = arrayList.get(0); // O(1)

        // LinkedList: fast insert/delete at known position
        LinkedList<String> linkedList = new LinkedList<>();
        linkedList.add("Alice");
        linkedList.addFirst("Zero"); // O(1)
        linkedList.addLast("End");  // O(1)

        // Performance comparison for insertions
        long start = System.nanoTime();
        for (int i = 0; i < 100_000; i++) {
            arrayList.add(0, "x"); // O(n) — shifts all elements
        }
        System.out.println("ArrayList prepend: " + (System.nanoTime() - start) + " ns");

        start = System.nanoTime();
        for (int i = 0; i < 100_000; i++) {
            linkedList.addFirst("x"); // O(1)
        }
        System.out.println("LinkedList prepend: " + (System.nanoTime() - start) + " ns");
    }
}`,
    category: "Collections",
    difficulty: "beginner",
    tags: ["ArrayList", "LinkedList", "List", "performance"],
  },
  {
    id: 2,
    title: "Iterating a HashMap Safely",
    problem:
      "What is the correct way to iterate over all entries in a HashMap without issues?",
    explanation:
      "Use entrySet() to iterate key-value pairs together, which avoids redundant lookups. Never modify a Map while iterating with a for-each loop — it throws ConcurrentModificationException. Use an Iterator.remove() or collect keys to remove separately.",
    codeSnippet: `import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class HashMapIteration {
    public static void main(String[] args) {
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 95);
        scores.put("Bob", 82);
        scores.put("Carol", 78);

        // Method 1: entrySet with for-each (preferred)
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.printf("%s -> %d%n", entry.getKey(), entry.getValue());
        }

        // Method 2: forEach with lambda (Java 8+)
        scores.forEach((name, score) ->
            System.out.printf("%s scored %d%n", name, score));

        // Method 3: Safe removal during iteration
        Iterator<Map.Entry<String, Integer>> it = scores.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, Integer> entry = it.next();
            if (entry.getValue() < 80) {
                it.remove(); // safe removal
            }
        }
    }
}`,
    category: "Collections",
    difficulty: "beginner",
    tags: ["HashMap", "Map", "iteration", "entrySet"],
  },
  {
    id: 3,
    title: "Fixing ConcurrentModificationException",
    problem:
      "You get a ConcurrentModificationException when removing elements from a List inside a for-each loop.",
    explanation:
      "The enhanced for-each loop uses an iterator internally. Modifying the collection while iterating invalidates the iterator and throws ConcurrentModificationException. Solutions: use Iterator.remove(), collect items to remove, use removeIf() (Java 8+), or use a CopyOnWriteArrayList for concurrent scenarios.",
    codeSnippet: `import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ConcurrentModFix {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));

        // ❌ WRONG — throws ConcurrentModificationException
        // for (int n : numbers) {
        //     if (n % 2 == 0) numbers.remove((Integer) n);
        // }

        // ✅ Option 1: Iterator.remove()
        Iterator<Integer> it = numbers.iterator();
        while (it.hasNext()) {
            if (it.next() % 2 == 0) it.remove();
        }
        System.out.println(numbers); // [1, 3, 5]

        // ✅ Option 2: removeIf (Java 8+, most idiomatic)
        numbers = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));
        numbers.removeIf(n -> n % 2 == 0);
        System.out.println(numbers); // [1, 3, 5]

        // ✅ Option 3: Stream filter
        numbers = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));
        numbers = numbers.stream()
                         .filter(n -> n % 2 != 0)
                         .collect(java.util.stream.Collectors.toList());
        System.out.println(numbers); // [1, 3, 5]
    }
}`,
    category: "Collections",
    difficulty: "beginner",
    tags: ["ConcurrentModificationException", "Iterator", "removeIf", "List"],
  },
  {
    id: 4,
    title: "Sorting with Comparator",
    problem:
      "How do you sort a list of custom objects by multiple fields using Comparator?",
    explanation:
      "Use Comparator.comparing() with thenComparing() to chain sort criteria. Java 8+ makes this clean and readable. You can sort ascending or descending, handle nulls, and compose complex sort orders without writing verbose anonymous classes.",
    codeSnippet: `import java.util.*;

public class ComparatorSorting {
    record Employee(String name, String dept, int salary) {}

    public static void main(String[] args) {
        List<Employee> staff = new ArrayList<>(List.of(
            new Employee("Alice", "Engineering", 95000),
            new Employee("Bob",   "Marketing",   72000),
            new Employee("Carol", "Engineering", 88000),
            new Employee("Dave",  "Marketing",   85000)
        ));

        // Sort by dept ASC, then salary DESC
        staff.sort(Comparator
            .comparing(Employee::dept)
            .thenComparing(Comparator.comparingInt(Employee::salary).reversed()));

        staff.forEach(e ->
            System.out.printf("%-12s %-12s %d%n", e.name(), e.dept(), e.salary()));
        // Alice   Engineering  95000
        // Carol   Engineering  88000
        // Dave    Marketing    85000
        // Bob     Marketing    72000
    }
}`,
    category: "Collections",
    difficulty: "intermediate",
    tags: ["Comparator", "Collections.sort", "lambda", "sorting"],
  },
  {
    id: 5,
    title: "Creating Unmodifiable Collections",
    problem:
      "How do you create a collection that cannot be modified after creation?",
    explanation:
      "Java provides several ways to create read-only collections. List.of(), Set.of(), Map.of() (Java 9+) return immutable collections. Collections.unmodifiableList() wraps an existing list but the underlying list can still be mutated. For true defensive copies, prefer List.copyOf().",
    codeSnippet: `import java.util.*;

public class UnmodifiableCollections {
    public static void main(String[] args) {
        // Java 9+: factory methods (truly immutable)
        List<String> immutable = List.of("a", "b", "c");
        // immutable.add("d"); // throws UnsupportedOperationException

        // Wrap existing list (view only — source can still change)
        List<String> source = new ArrayList<>(Arrays.asList("x", "y"));
        List<String> readOnly = Collections.unmodifiableList(source);
        source.add("z"); // allowed — changes are visible via readOnly!
        System.out.println(readOnly); // [x, y, z]

        // True defensive copy (Java 10+)
        List<String> safeCopy = List.copyOf(source);
        source.add("w"); // safeCopy still sees [x, y, z]
        System.out.println(safeCopy.size()); // 3

        // Unmodifiable map
        Map<String, Integer> config = Map.of(
            "timeout", 30,
            "retries", 3
        );
        System.out.println(config.get("timeout")); // 30
    }
}`,
    category: "Collections",
    difficulty: "beginner",
    tags: ["unmodifiableList", "List.of", "immutable", "Collections"],
  },

  // ── EXCEPTIONS ───────────────────────────────────────────────────────────────
  {
    id: 6,
    title: "try-with-resources for Auto-Closing",
    problem:
      "Resources like streams and connections must be closed after use. How do you ensure they are always closed?",
    explanation:
      "The try-with-resources statement (Java 7+) automatically closes any AutoCloseable resource at the end of the block, even if an exception is thrown. This eliminates the need for a finally block and prevents resource leaks. Multiple resources are closed in reverse declaration order.",
    codeSnippet: `import java.io.*;
import java.sql.*;

public class TryWithResources {
    public static void readFile(String path) throws IOException {
        // Both reader and stream are auto-closed, even on exception
        try (var fis = new FileInputStream(path);
             var reader = new BufferedReader(new InputStreamReader(fis))) {

            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } // reader.close() then fis.close() called automatically
    }

    // Custom AutoCloseable resource
    static class DatabaseConnection implements AutoCloseable {
        DatabaseConnection() { System.out.println("Connection opened"); }
        public void query(String sql) { System.out.println("Running: " + sql); }

        @Override
        public void close() { System.out.println("Connection closed"); }
    }

    public static void main(String[] args) {
        try (var conn = new DatabaseConnection()) {
            conn.query("SELECT * FROM users");
        } // prints "Connection closed" automatically
    }
}`,
    category: "Exceptions",
    difficulty: "beginner",
    tags: ["try-with-resources", "AutoCloseable", "resource leak", "Java 7"],
  },
  {
    id: 7,
    title: "Creating Custom Exceptions",
    problem:
      "How do you create meaningful custom exception classes for your application domain?",
    explanation:
      "Extend RuntimeException for unchecked exceptions (caller not forced to handle) or Exception for checked exceptions (caller must handle or declare). Include a cause constructor to preserve the original stack trace. Add domain-specific fields for richer error context.",
    codeSnippet: `// Checked exception (caller must handle)
public class InsufficientFundsException extends Exception {
    private final double amount;
    private final double balance;

    public InsufficientFundsException(double amount, double balance) {
        super(String.format("Cannot withdraw %.2f — balance is %.2f", amount, balance));
        this.amount = amount;
        this.balance = balance;
    }

    // Wrapping constructor: preserves original cause
    public InsufficientFundsException(double amount, double balance, Throwable cause) {
        super(String.format("Cannot withdraw %.2f — balance is %.2f", amount, balance), cause);
        this.amount = amount;
        this.balance = balance;
    }

    public double getShortfall() { return amount - balance; }
}

// Unchecked — used for programming errors
public class InvalidAccountStateException extends RuntimeException {
    public InvalidAccountStateException(String message) {
        super(message);
    }
}

// Usage
class BankAccount {
    private double balance;

    public void withdraw(double amount) throws InsufficientFundsException {
        if (balance < amount) throw new InsufficientFundsException(amount, balance);
        balance -= amount;
    }
}`,
    category: "Exceptions",
    difficulty: "intermediate",
    tags: ["custom exception", "RuntimeException", "checked", "unchecked"],
  },
  {
    id: 8,
    title: "Checked vs Unchecked Exceptions",
    problem:
      "When should you use a checked exception versus an unchecked (runtime) exception?",
    explanation:
      "Checked exceptions (subclasses of Exception) represent recoverable conditions the caller should handle — e.g., file not found, network timeout. Unchecked exceptions (subclasses of RuntimeException) represent programming bugs or unrecoverable states. Modern Java best practices often prefer unchecked for most cases to reduce boilerplate.",
    codeSnippet: `import java.io.*;
import java.util.Objects;

public class ExceptionTypes {
    // Checked: caller MUST handle or re-declare
    public String readConfig(String path) throws IOException {
        try (var reader = new BufferedReader(new FileReader(path))) {
            return reader.lines().reduce("", (a, b) -> a + b);
        }
    }

    // Unchecked: programming error — validation failure
    public void setAge(int age) {
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("Age out of range: " + age);
        }
        // ...
    }

    public static void main(String[] args) {
        var app = new ExceptionTypes();

        // Checked — compiler forces you to handle it
        try {
            String cfg = app.readConfig("/etc/app.conf");
        } catch (IOException e) {
            System.err.println("Config missing: " + e.getMessage());
        }

        // Unchecked — handle only if you can recover
        try {
            app.setAge(-5);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
        }
    }
}`,
    category: "Exceptions",
    difficulty: "beginner",
    tags: [
      "checked",
      "unchecked",
      "IOException",
      "RuntimeException",
      "best practices",
    ],
  },
  {
    id: 9,
    title: "Multi-catch and Exception Chaining",
    problem:
      "How do you handle multiple exception types in a single catch block and preserve the original cause?",
    explanation:
      "Java 7+ allows catching multiple exception types in one catch block using the pipe (|) operator. Exception chaining (wrapping one exception in another) preserves the root cause via initCause() or the cause constructor. Always log or rethrow exceptions; never silently swallow them.",
    codeSnippet: `import java.io.*;
import java.sql.*;

public class MultiCatch {
    public void processData(String file) throws AppException {
        try {
            // Operations that may throw different exceptions
            var reader = new FileReader(file);
            Connection conn = DriverManager.getConnection("jdbc:h2:mem:");
            // ... process
        } catch (FileNotFoundException | SQLException e) {
            // Multi-catch: same handler for related exceptions
            // 'e' is effectively final — cannot be reassigned
            throw new AppException("Data processing failed", e); // chaining
        } catch (IOException e) {
            System.err.println("IO error: " + e.getMessage());
            throw new AppException("IO failure", e);
        }
    }
}

class AppException extends RuntimeException {
    public AppException(String msg, Throwable cause) {
        super(msg, cause);
    }
    // Caller can inspect: e.getCause() to get original exception
}`,
    category: "Exceptions",
    difficulty: "intermediate",
    tags: ["multi-catch", "exception chaining", "Java 7", "cause"],
  },
  {
    id: 10,
    title: "Understanding finally Block Behavior",
    problem:
      "When does the finally block execute, and what happens if both catch and finally throw exceptions?",
    explanation:
      "The finally block always executes after try/catch, even if a return statement or exception occurs in try. If finally throws an exception, it suppresses the original exception from catch. This is why try-with-resources is preferred — it preserves both exceptions as primary + suppressed.",
    codeSnippet: `public class FinallyBehavior {
    public static int riskyMethod() {
        try {
            System.out.println("try block");
            return 1; // finally still runs before actual return!
        } catch (Exception e) {
            System.out.println("catch block");
            return 2;
        } finally {
            System.out.println("finally block — always runs");
            // return 3; // ⚠️ NEVER return in finally — suppresses exceptions!
        }
    }

    public static void suppressedExceptions() {
        try {
            throw new RuntimeException("original");
        } finally {
            // This SUPPRESSES the original exception!
            // The caller only sees "from finally"
            // throw new RuntimeException("from finally");
        }
    }

    public static void main(String[] args) {
        System.out.println("Return value: " + riskyMethod());
        // Output:
        // try block
        // finally block — always runs
        // Return value: 1
    }
}`,
    category: "Exceptions",
    difficulty: "intermediate",
    tags: ["finally", "return", "exception suppression", "try-catch"],
  },

  // ── STREAMS ──────────────────────────────────────────────────────────────────
  {
    id: 11,
    title: "filter, map, collect: Stream Pipeline Basics",
    problem:
      "How do you transform and collect a list of items using the Java Stream API?",
    explanation:
      "A Stream pipeline consists of a source, zero or more intermediate operations (lazy), and a terminal operation that triggers evaluation. filter() selects elements, map() transforms them, and collect() accumulates the result. Streams do not modify the original collection.",
    codeSnippet: `import java.util.*;
import java.util.stream.*;

public class StreamBasics {
    record Product(String name, String category, double price) {}

    public static void main(String[] args) {
        List<Product> catalog = List.of(
            new Product("Laptop",  "Electronics", 999.99),
            new Product("Shirt",   "Clothing",     29.99),
            new Product("Phone",   "Electronics", 699.99),
            new Product("Jeans",   "Clothing",     59.99),
            new Product("Tablet",  "Electronics", 449.99)
        );

        // Get names of electronics under $800, sorted
        List<String> results = catalog.stream()
            .filter(p -> p.category().equals("Electronics"))
            .filter(p -> p.price() < 800)
            .sorted(Comparator.comparingDouble(Product::price))
            .map(Product::name)
            .collect(Collectors.toList());

        System.out.println(results); // [Tablet, Phone]

        // Sum of all electronics prices
        double total = catalog.stream()
            .filter(p -> p.category().equals("Electronics"))
            .mapToDouble(Product::price)
            .sum();
        System.out.printf("Total: $%.2f%n", total); // Total: $2149.97
    }
}`,
    category: "Streams",
    difficulty: "beginner",
    tags: ["Stream", "filter", "map", "collect", "Collectors"],
  },
  {
    id: 12,
    title: "flatMap for Flattening Nested Collections",
    problem:
      "You have a list of objects each containing a list. How do you get a single flat stream of all nested elements?",
    explanation:
      'flatMap() transforms each element into a stream and then flattens all those streams into one. It is the stream equivalent of "for each item, for each sub-item". Use it to process nested collections, split strings into words, or flatten Optional results.',
    codeSnippet: `import java.util.*;
import java.util.stream.*;

public class FlatMapExample {
    record Order(String customer, List<String> items) {}

    public static void main(String[] args) {
        List<Order> orders = List.of(
            new Order("Alice", List.of("Laptop", "Mouse", "Keyboard")),
            new Order("Bob",   List.of("Phone")),
            new Order("Carol", List.of("Tablet", "Stylus"))
        );

        // All items across all orders (flat)
        List<String> allItems = orders.stream()
            .flatMap(order -> order.items().stream())
            .distinct()
            .sorted()
            .collect(Collectors.toList());
        System.out.println(allItems);
        // [Keyboard, Laptop, Mouse, Phone, Stylus, Tablet]

        // Count items ordered more than once across all orders
        Map<String, Long> itemFrequency = orders.stream()
            .flatMap(o -> o.items().stream())
            .collect(Collectors.groupingBy(item -> item, Collectors.counting()));
        System.out.println(itemFrequency);
    }
}`,
    category: "Streams",
    difficulty: "intermediate",
    tags: ["flatMap", "Stream", "nested collections", "distinct"],
  },
  {
    id: 13,
    title: "groupingBy: Grouping Stream Elements",
    problem:
      "How do you group a list of objects by a property and get counts, lists, or statistics per group?",
    explanation:
      "Collectors.groupingBy() is the stream equivalent of SQL GROUP BY. It returns a Map<K, List<T>> by default. Combine with downstream collectors like counting(), summingInt(), mapping(), or toSet() for powerful aggregations.",
    codeSnippet: `import java.util.*;
import java.util.stream.*;

public class GroupingByExample {
    record Employee(String name, String dept, double salary) {}

    public static void main(String[] args) {
        List<Employee> employees = List.of(
            new Employee("Alice", "Eng",  95000),
            new Employee("Bob",   "HR",   62000),
            new Employee("Carol", "Eng",  88000),
            new Employee("Dave",  "HR",   70000),
            new Employee("Eve",   "Eng",  102000)
        );

        // Group by department → list of names
        Map<String, List<String>> byDept = employees.stream()
            .collect(Collectors.groupingBy(
                Employee::dept,
                Collectors.mapping(Employee::name, Collectors.toList())
            ));
        System.out.println(byDept);
        // {Eng=[Alice, Carol, Eve], HR=[Bob, Dave]}

        // Average salary per department
        Map<String, Double> avgSalary = employees.stream()
            .collect(Collectors.groupingBy(
                Employee::dept,
                Collectors.averagingDouble(Employee::salary)
            ));
        System.out.println(avgSalary);
        // {Eng=95000.0, HR=66000.0}

        // Count per department
        Map<String, Long> countPerDept = employees.stream()
            .collect(Collectors.groupingBy(Employee::dept, Collectors.counting()));
        System.out.println(countPerDept); // {Eng=3, HR=2}
    }
}`,
    category: "Streams",
    difficulty: "intermediate",
    tags: ["groupingBy", "Collectors", "Stream", "aggregation"],
  },
  {
    id: 14,
    title: "Working with Optional to Avoid NullPointerException",
    problem:
      "How do you use Optional to safely handle potentially null values without null checks?",
    explanation:
      "Optional<T> is a container that may or may not hold a value. It makes the possibility of absence explicit in the type system. Use map(), flatMap(), filter(), orElse(), orElseGet(), and orElseThrow() to process the value safely. Never call get() without isPresent() check.",
    codeSnippet: `import java.util.Optional;

public class OptionalUsage {
    record User(String name, Optional<String> email) {}

    static Optional<User> findUserById(int id) {
        if (id == 1) return Optional.of(new User("Alice", Optional.of("alice@example.com")));
        if (id == 2) return Optional.of(new User("Bob", Optional.empty()));
        return Optional.empty();
    }

    public static void main(String[] args) {
        // Safe chaining — short-circuits if any step is empty
        String email = findUserById(1)
            .flatMap(user -> user.email())
            .map(String::toLowerCase)
            .orElse("no-email@default.com");
        System.out.println(email); // alice@example.com

        // orElseGet: lazy — only called if empty
        String email2 = findUserById(999)
            .flatMap(User::email)
            .orElseGet(() -> generateDefaultEmail());

        // orElseThrow: throw custom exception if absent
        User user = findUserById(1)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // filter: discard value if condition not met
        Optional<User> active = findUserById(1)
            .filter(u -> u.email().isPresent());
    }

    static String generateDefaultEmail() { return "guest@app.com"; }
}`,
    category: "Streams",
    difficulty: "intermediate",
    tags: ["Optional", "NullPointerException", "orElse", "flatMap"],
  },
  {
    id: 15,
    title: "Stream reduce: Custom Aggregations",
    problem:
      "How do you perform a custom aggregation over a stream, such as computing a product or a custom merge?",
    explanation:
      "reduce() combines stream elements into a single result using an associative binary operator. The two-argument form takes an identity value (safe for empty streams). Use it when no specific collector exists for your aggregation logic.",
    codeSnippet: `import java.util.*;
import java.util.stream.*;

public class StreamReduce {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5);

        // Sum (identity = 0, BinaryOperator = Integer::sum)
        int sum = numbers.stream()
            .reduce(0, Integer::sum);
        System.out.println("Sum: " + sum); // 15

        // Factorial via reduce
        int factorial = IntStream.rangeClosed(1, 5)
            .reduce(1, (a, b) -> a * b);
        System.out.println("5! = " + factorial); // 120

        // Find longest string
        Optional<String> longest = Stream.of("Java", "Streams", "API", "reduce")
            .reduce((a, b) -> a.length() >= b.length() ? a : b);
        longest.ifPresent(s -> System.out.println("Longest: " + s)); // Streams

        // Merge maps
        List<Map<String, Integer>> maps = List.of(
            Map.of("a", 1, "b", 2),
            Map.of("b", 3, "c", 4)
        );
        Map<String, Integer> merged = maps.stream()
            .reduce(new HashMap<>(), (acc, m) -> {
                acc.putAll(m); return acc;
            }, (m1, m2) -> { m1.putAll(m2); return m1; });
        System.out.println(merged); // {a=1, b=3, c=4}
    }
}`,
    category: "Streams",
    difficulty: "intermediate",
    tags: ["reduce", "Stream", "aggregation", "BinaryOperator"],
  },

  // ── OOP ───────────────────────────────────────────────────────────────────────
  {
    id: 16,
    title: "Interface vs Abstract Class: When to Use Each",
    problem:
      "Should you use an interface or an abstract class to define a contract for your hierarchy?",
    explanation:
      "Use an interface when you want to define a pure contract (what, not how) that multiple unrelated classes can implement. Use an abstract class when you want to share implementation code and state across a hierarchy of related classes. A class can implement many interfaces but extend only one abstract class.",
    codeSnippet: `// Interface: pure contract, no state
interface Drawable {
    void draw(); // abstract by default
    default void drawWithBorder() { // default implementation (Java 8+)
        System.out.println("[");
        draw();
        System.out.println("]");
    }
}

interface Resizable {
    void resize(double factor);
}

// Abstract class: shared state + partial implementation
abstract class Shape implements Drawable, Resizable {
    protected String color;
    protected double x, y;

    Shape(String color, double x, double y) {
        this.color = color; this.x = x; this.y = y;
    }

    abstract double area(); // subclasses MUST implement

    @Override
    public void resize(double factor) {
        // shared behavior — no need to reimplement in each subclass
        x *= factor; y *= factor;
    }
}

class Circle extends Shape {
    private double radius;
    Circle(String color, double x, double y, double radius) {
        super(color, x, y); this.radius = radius;
    }
    @Override public void draw() { System.out.println("○ circle r=" + radius); }
    @Override public double area() { return Math.PI * radius * radius; }
}`,
    category: "OOP",
    difficulty: "beginner",
    tags: ["interface", "abstract class", "inheritance", "OOP"],
  },
  {
    id: 17,
    title: "Builder Pattern for Complex Object Construction",
    problem:
      "A class has many optional fields. Constructors become unwieldy. How do you make instantiation clean and readable?",
    explanation:
      "The Builder pattern separates object construction from its representation. A static inner Builder class collects parameters via fluent setter methods and produces the object via a build() method. It avoids telescoping constructors and makes optional parameters explicit.",
    codeSnippet: `public final class HttpRequest {
    private final String url;
    private final String method;
    private final int timeoutMs;
    private final String body;
    private final boolean followRedirects;

    private HttpRequest(Builder b) {
        this.url             = b.url;
        this.method          = b.method;
        this.timeoutMs       = b.timeoutMs;
        this.body            = b.body;
        this.followRedirects = b.followRedirects;
    }

    public static class Builder {
        // Required
        private final String url;
        // Optional with defaults
        private String method = "GET";
        private int timeoutMs = 5000;
        private String body = null;
        private boolean followRedirects = true;

        public Builder(String url) { this.url = url; }

        public Builder method(String method) { this.method = method; return this; }
        public Builder timeout(int ms)       { this.timeoutMs = ms; return this; }
        public Builder body(String body)     { this.body = body; return this; }
        public Builder noRedirects()         { this.followRedirects = false; return this; }

        public HttpRequest build() {
            if (url == null || url.isBlank()) throw new IllegalStateException("URL required");
            return new HttpRequest(this);
        }
    }
}

// Usage — readable and self-documenting
HttpRequest req = new HttpRequest.Builder("https://api.example.com/data")
    .method("POST")
    .timeout(10_000)
    .body("{\"key\": \"value\"}")
    .build();`,
    category: "OOP",
    difficulty: "intermediate",
    tags: ["Builder pattern", "design pattern", "fluent API", "immutable"],
  },
  {
    id: 18,
    title: "Overriding equals() and hashCode() Correctly",
    problem:
      "Two objects with the same data are not considered equal. HashMap and HashSet behave unexpectedly.",
    explanation:
      "By default, equals() checks reference equality (same object in memory). Override it to compare fields. Always override hashCode() when you override equals() — objects that are equal must return the same hash code. Violating this contract breaks HashMap and HashSet.",
    codeSnippet: `import java.util.*;

public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;          // same reference
        if (!(o instanceof Point)) return false; // null-safe type check
        Point other = (Point) o;
        return x == other.x && y == other.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y); // consistent with equals
    }

    public static void main(String[] args) {
        Point p1 = new Point(3, 4);
        Point p2 = new Point(3, 4);

        System.out.println(p1.equals(p2)); // true (field equality)
        System.out.println(p1 == p2);      // false (different refs)

        Set<Point> set = new HashSet<>();
        set.add(p1);
        System.out.println(set.contains(p2)); // true — hashCode matches!

        Map<Point, String> map = new HashMap<>();
        map.put(p1, "origin area");
        System.out.println(map.get(p2)); // "origin area" ✓
    }
}`,
    category: "OOP",
    difficulty: "intermediate",
    tags: ["equals", "hashCode", "HashMap", "Objects.hash"],
  },
  {
    id: 19,
    title: "Singleton Pattern (Thread-Safe)",
    problem:
      "How do you ensure only one instance of a class exists across the application, even in a multi-threaded environment?",
    explanation:
      "The Bill Pugh / initialization-on-demand holder pattern is the most elegant thread-safe singleton. The inner static class is loaded only when getInstance() is first called, providing lazy initialization without synchronized overhead. Alternatively, an enum singleton handles serialization and reflection attacks automatically.",
    codeSnippet: `// ✅ Initialization-on-demand holder (thread-safe, lazy)
public final class ConfigManager {
    private final Map<String, String> props;

    private ConfigManager() {
        props = new HashMap<>();
        props.put("app.name", "MyApp");
        props.put("db.url", "jdbc:postgresql://localhost/mydb");
        System.out.println("ConfigManager initialized");
    }

    private static class Holder {
        static final ConfigManager INSTANCE = new ConfigManager();
    }

    public static ConfigManager getInstance() {
        return Holder.INSTANCE; // class loaded here, guaranteed once
    }

    public String get(String key) { return props.getOrDefault(key, ""); }
}

// ✅ Enum singleton (serialization-safe, reflection-resistant)
public enum AppLogger {
    INSTANCE;

    public void log(String msg) {
        System.out.println("[LOG] " + msg);
    }
}

// Usage
ConfigManager.getInstance().get("app.name"); // "MyApp"
AppLogger.INSTANCE.log("App started");`,
    category: "OOP",
    difficulty: "intermediate",
    tags: ["Singleton", "thread-safe", "design pattern", "enum"],
  },

  // ── MULTITHREADING ────────────────────────────────────────────────────────────
  {
    id: 20,
    title: "Using ExecutorService for Thread Pooling",
    problem:
      "Creating a new Thread for every task is expensive. How do you manage and reuse threads efficiently?",
    explanation:
      "ExecutorService manages a pool of worker threads. Submit Runnable/Callable tasks; the pool reuses threads instead of creating new ones. Always shut down the executor when done. Use invokeAll() to wait for multiple tasks, or Future.get() to retrieve results.",
    codeSnippet: `import java.util.concurrent.*;
import java.util.List;

public class ExecutorServiceExample {
    public static void main(String[] args) throws Exception {
        // Fixed pool of 4 threads
        ExecutorService pool = Executors.newFixedThreadPool(4);

        // Submit Callable tasks and collect Futures
        List<Callable<Integer>> tasks = List.of(
            () -> computeHeavy(1),
            () -> computeHeavy(2),
            () -> computeHeavy(3)
        );

        List<Future<Integer>> futures = pool.invokeAll(tasks);

        for (Future<Integer> future : futures) {
            System.out.println("Result: " + future.get()); // blocks until done
        }

        // Graceful shutdown
        pool.shutdown();
        if (!pool.awaitTermination(10, TimeUnit.SECONDS)) {
            pool.shutdownNow(); // force if not done in 10s
        }
    }

    static int computeHeavy(int id) throws InterruptedException {
        Thread.sleep(500); // simulate work
        System.out.println("Task " + id + " done on " + Thread.currentThread().getName());
        return id * id;
    }
}`,
    category: "Multithreading",
    difficulty: "intermediate",
    tags: ["ExecutorService", "thread pool", "Future", "Callable"],
  },
  {
    id: 21,
    title: "synchronized Block vs Method: Preventing Race Conditions",
    problem:
      "Multiple threads update a shared counter and the final value is wrong. How do you fix this data race?",
    explanation:
      "synchronized ensures only one thread at a time executes a block of code that accesses shared mutable state. Prefer synchronized blocks over methods to minimize the critical section. For simple counters, AtomicInteger is faster and preferred over full synchronization.",
    codeSnippet: `import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class CounterDemo {
    // ❌ Not thread-safe
    static int unsafeCount = 0;

    // ✅ Option 1: synchronized method
    static int syncCount = 0;
    static synchronized void increment() { syncCount++; }

    // ✅ Option 2: synchronized block (narrower scope)
    static int blockCount = 0;
    static final Object LOCK = new Object();
    static void incrementBlock() {
        // do non-critical work here...
        synchronized (LOCK) {
            blockCount++; // only critical section is locked
        }
    }

    // ✅ Option 3: AtomicInteger (best for counters)
    static AtomicInteger atomicCount = new AtomicInteger(0);

    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(10);
        for (int i = 0; i < 1000; i++) {
            pool.submit(() -> {
                unsafeCount++;           // ❌ race condition
                increment();             // ✅ synchronized
                incrementBlock();        // ✅ synchronized block
                atomicCount.incrementAndGet(); // ✅ atomic
            });
        }
        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println("Unsafe:   " + unsafeCount);    // may be < 1000
        System.out.println("Sync:     " + syncCount);      // always 1000
        System.out.println("Block:    " + blockCount);     // always 1000
        System.out.println("Atomic:   " + atomicCount);    // always 1000
    }
}`,
    category: "Multithreading",
    difficulty: "intermediate",
    tags: ["synchronized", "AtomicInteger", "race condition", "thread-safe"],
  },
  {
    id: 22,
    title: "CountDownLatch: Waiting for Multiple Threads",
    problem:
      "You need to wait for multiple parallel tasks to complete before proceeding. How do you coordinate this?",
    explanation:
      "CountDownLatch allows one or more threads to wait until a set of operations in other threads completes. Initialize it with a count; each worker calls countDown() when done; the waiting thread calls await() which blocks until the count reaches zero.",
    codeSnippet: `import java.util.concurrent.*;

public class CountDownLatchExample {
    public static void main(String[] args) throws InterruptedException {
        int workerCount = 5;
        CountDownLatch latch = new CountDownLatch(workerCount);
        ExecutorService pool = Executors.newFixedThreadPool(workerCount);

        for (int i = 1; i <= workerCount; i++) {
            final int id = i;
            pool.submit(() -> {
                try {
                    System.out.println("Worker " + id + " starting...");
                    Thread.sleep(500 + id * 100); // simulate variable work
                    System.out.println("Worker " + id + " finished");
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    latch.countDown(); // decrement even on exception
                }
            });
        }

        System.out.println("Main thread waiting...");
        latch.await(); // blocks until count = 0
        System.out.println("All workers finished! Proceeding...");

        pool.shutdown();
    }
}`,
    category: "Multithreading",
    difficulty: "advanced",
    tags: ["CountDownLatch", "concurrency", "thread coordination", "await"],
  },

  // ── I/O ───────────────────────────────────────────────────────────────────────
  {
    id: 23,
    title: "Reading Files with BufferedReader",
    problem:
      "How do you efficiently read a large text file line by line in Java?",
    explanation:
      "BufferedReader wraps a FileReader and adds buffering, greatly reducing disk I/O by reading chunks at a time. Use try-with-resources for automatic closing. For modern code, Files.lines() provides a Stream<String> and is often more concise.",
    codeSnippet: `import java.io.*;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;

public class ReadFileExample {
    // Classic approach: BufferedReader
    public static void readWithBufferedReader(String path) throws IOException {
        try (var reader = new BufferedReader(
                new InputStreamReader(new FileInputStream(path), StandardCharsets.UTF_8))) {
            String line;
            int lineNum = 0;
            while ((line = reader.readLine()) != null) {
                System.out.printf("%4d: %s%n", ++lineNum, line);
            }
        }
    }

    // Modern approach: Files.readAllLines (for small files)
    public static List<String> readAllLines(String path) throws IOException {
        return Files.readAllLines(Path.of(path), StandardCharsets.UTF_8);
    }

    // Stream approach: lazy, good for large files
    public static long countMatchingLines(String path, String keyword) throws IOException {
        try (var lines = Files.lines(Path.of(path), StandardCharsets.UTF_8)) {
            return lines
                .filter(line -> line.contains(keyword))
                .count();
        } // Stream closed automatically
    }

    public static void main(String[] args) throws IOException {
        var path = "data.txt";
        Files.writeString(Path.of(path), "Hello World\nJava I/O\nStreams are fast");
        readWithBufferedReader(path);
        System.out.println(countMatchingLines(path, "Java")); // 1
    }
}`,
    category: "I/O",
    difficulty: "beginner",
    tags: ["BufferedReader", "Files", "file reading", "NIO", "I/O"],
  },
  {
    id: 24,
    title: "Writing to Files with NIO",
    problem:
      "What is the cleanest way to write text or binary data to files in modern Java?",
    explanation:
      "The java.nio.file.Files class provides convenient utility methods. Files.writeString() is ideal for text. Files.write() works for byte arrays. For appending or streaming, use BufferedWriter from Files.newBufferedWriter(). Always specify the charset explicitly to avoid platform-dependent behavior.",
    codeSnippet: `import java.io.*;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class WriteFileExample {
    public static void main(String[] args) throws IOException {
        Path dir = Path.of("output");
        Files.createDirectories(dir);

        // Write full string at once
        Files.writeString(dir.resolve("simple.txt"),
            "Hello, Java NIO!",
            StandardCharsets.UTF_8);

        // Write multiple lines
        Files.write(dir.resolve("lines.txt"),
            List.of("Line 1", "Line 2", "Line 3"),
            StandardCharsets.UTF_8);

        // Append to existing file
        Files.writeString(dir.resolve("log.txt"),
            "[INFO] Application started\n",
            StandardCharsets.UTF_8,
            StandardOpenOption.CREATE, StandardOpenOption.APPEND);

        // BufferedWriter for streaming large output
        try (var writer = Files.newBufferedWriter(
                dir.resolve("large.txt"), StandardCharsets.UTF_8)) {
            for (int i = 0; i < 100_000; i++) {
                writer.write("Record " + i);
                writer.newLine();
            }
        }
        System.out.println("All files written successfully");
    }
}`,
    category: "I/O",
    difficulty: "beginner",
    tags: ["Files.writeString", "NIO", "BufferedWriter", "file writing"],
  },

  // ── GENERICS ─────────────────────────────────────────────────────────────────
  {
    id: 25,
    title: "Bounded Wildcards: <? extends T> vs <? super T>",
    problem:
      "When should you use upper-bounded wildcards (<? extends T>) versus lower-bounded wildcards (<? super T>)?",
    explanation:
      "Remember PECS: Producer Extends, Consumer Super. If a parameter produces (reads) values of type T, use <? extends T>. If it consumes (writes) values of type T, use <? super T>. This enables maximum flexibility — e.g., a method that sums numbers should accept any Number subtype.",
    codeSnippet: `import java.util.*;

public class BoundedWildcards {
    // Producer Extends: read from list (produces Numbers)
    public static double sum(List<? extends Number> list) {
        double total = 0;
        for (Number n : list) total += n.doubleValue(); // can read as Number
        // list.add(3.14); // ❌ compile error — type unknown
        return total;
    }

    // Consumer Super: write to list (consumes Integers)
    public static void addIntegers(List<? super Integer> list, int count) {
        for (int i = 0; i < count; i++) list.add(i); // can write Integer
        // Integer n = list.get(0); // ❌ can only read as Object
    }

    public static void main(String[] args) {
        List<Integer> ints   = List.of(1, 2, 3, 4, 5);
        List<Double>  doubles = List.of(1.5, 2.5, 3.5);

        System.out.println(sum(ints));    // 15.0
        System.out.println(sum(doubles)); // 7.5

        List<Number> numbers = new ArrayList<>();
        addIntegers(numbers, 5);
        System.out.println(numbers); // [0, 1, 2, 3, 4]
    }
}`,
    category: "Generics",
    difficulty: "advanced",
    tags: ["wildcards", "PECS", "bounded wildcards", "Generics"],
  },
  {
    id: 26,
    title: "Generic Methods and Type Inference",
    problem:
      "How do you write a utility method that works with any type without code duplication?",
    explanation:
      "Generic methods declare their own type parameter(s) before the return type. Java infers the type argument from the method arguments, so explicit type syntax like <String>method() is rarely needed. Generic methods are more flexible than making the whole class generic when the type is only needed for one method.",
    codeSnippet: `import java.util.*;
import java.util.function.Function;

public class GenericMethods {
    // Generic pair swap
    public static <T> void swap(T[] arr, int i, int j) {
        T temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
    }

    // Generic max using Comparable bound
    public static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }

    // Transform and collect — multiple type params
    public static <T, R> List<R> transform(List<T> input, Function<T, R> mapper) {
        List<R> result = new ArrayList<>(input.size());
        for (T item : input) result.add(mapper.apply(item));
        return result;
    }

    public static void main(String[] args) {
        Integer[] nums = {1, 5, 3, 2, 4};
        swap(nums, 0, 4);
        System.out.println(Arrays.toString(nums)); // [4, 5, 3, 2, 1]

        System.out.println(max("apple", "banana")); // banana
        System.out.println(max(42, 17));              // 42

        List<String> names = List.of("alice", "bob", "carol");
        List<Integer> lengths = transform(names, String::length);
        System.out.println(lengths); // [5, 3, 5]
    }
}`,
    category: "Generics",
    difficulty: "intermediate",
    tags: ["generic methods", "type inference", "Comparable", "Generics"],
  },

  // ── DESIGN PATTERNS ───────────────────────────────────────────────────────────
  {
    id: 27,
    title: "Factory Method Pattern",
    problem:
      "How do you decouple object creation from the code that uses the objects, allowing runtime selection of implementations?",
    explanation:
      "The Factory Method pattern defines an interface for creating objects but lets subclasses (or a factory class) decide which class to instantiate. This decouples the client from concrete implementations and makes it easy to add new types without modifying existing code (Open/Closed Principle).",
    codeSnippet: `public interface Notification {
    void send(String recipient, String message);
}

class EmailNotification implements Notification {
    @Override
    public void send(String to, String msg) {
        System.out.printf("📧 Email to %s: %s%n", to, msg);
    }
}

class SmsNotification implements Notification {
    @Override
    public void send(String to, String msg) {
        System.out.printf("📱 SMS to %s: %s%n", to, msg);
    }
}

class PushNotification implements Notification {
    @Override
    public void send(String to, String msg) {
        System.out.printf("🔔 Push to %s: %s%n", to, msg);
    }
}

class NotificationFactory {
    public static Notification create(String type) {
        return switch (type.toLowerCase()) {
            case "email" -> new EmailNotification();
            case "sms"   -> new SmsNotification();
            case "push"  -> new PushNotification();
            default -> throw new IllegalArgumentException("Unknown type: " + type);
        };
    }
}

// Usage — client doesn't know concrete class
Notification n = NotificationFactory.create("email");
n.send("alice@example.com", "Your order shipped!");`,
    category: "Design Patterns",
    difficulty: "intermediate",
    tags: ["Factory", "design pattern", "OCP", "decoupling"],
  },
  {
    id: 28,
    title: "Observer Pattern with Functional Interfaces",
    problem:
      "How do you implement a publish-subscribe system where multiple objects react to state changes?",
    explanation:
      "The Observer pattern defines a one-to-many dependency. When the subject changes state, all observers are notified. In modern Java, use List<Consumer<T>> for lightweight observers instead of a formal Observer interface, making registration and notification concise and functional.",
    codeSnippet: `import java.util.*;
import java.util.function.Consumer;

public class EventBus<T> {
    private final Map<String, List<Consumer<T>>> listeners = new HashMap<>();

    public void subscribe(String event, Consumer<T> handler) {
        listeners.computeIfAbsent(event, k -> new ArrayList<>()).add(handler);
    }

    public void publish(String event, T payload) {
        List<Consumer<T>> handlers = listeners.getOrDefault(event, List.of());
        handlers.forEach(h -> h.accept(payload));
    }
}

record OrderEvent(String orderId, String status) {}

class OrderService {
    private final EventBus<OrderEvent> bus;

    OrderService(EventBus<OrderEvent> bus) {
        this.bus = bus;
    }

    public void placeOrder(String id) {
        System.out.println("Processing order " + id);
        bus.publish("order.placed", new OrderEvent(id, "PLACED"));
    }
}

// Wiring
EventBus<OrderEvent> bus = new EventBus<>();
bus.subscribe("order.placed", e -> System.out.println("📧 Email sent for " + e.orderId()));
bus.subscribe("order.placed", e -> System.out.println("📦 Inventory updated for " + e.orderId()));

new OrderService(bus).placeOrder("ORD-001");`,
    category: "Design Patterns",
    difficulty: "advanced",
    tags: ["Observer", "EventBus", "Consumer", "publish-subscribe"],
  },
  {
    id: 29,
    title: "Strategy Pattern for Interchangeable Algorithms",
    problem:
      "You have multiple sorting or pricing algorithms. How do you switch between them at runtime without if-else chains?",
    explanation:
      "The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. In Java 8+, strategies are naturally represented as functional interfaces — just pass a lambda. This eliminates complex conditionals and makes adding new strategies trivial.",
    codeSnippet: `import java.util.function.ToDoubleFunction;

public class PricingEngine {
    // Strategy as functional interface (Java 8+ style)
    @FunctionalInterface
    interface PricingStrategy {
        double calculate(double basePrice, int quantity);
    }

    private PricingStrategy strategy;

    public PricingEngine(PricingStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(PricingStrategy strategy) {
        this.strategy = strategy;
    }

    public double price(double base, int qty) {
        return strategy.calculate(base, qty);
    }

    // Named strategies
    public static final PricingStrategy STANDARD  = (p, q) -> p * q;
    public static final PricingStrategy BULK       = (p, q) -> p * q * (q >= 10 ? 0.9 : 1.0);
    public static final PricingStrategy CLEARANCE  = (p, q) -> p * q * 0.5;

    public static void main(String[] args) {
        var engine = new PricingEngine(STANDARD);
        System.out.println(engine.price(10.0, 5));  // 50.0

        engine.setStrategy(BULK);
        System.out.println(engine.price(10.0, 15)); // 135.0 (10% bulk discount)

        engine.setStrategy(CLEARANCE);
        System.out.println(engine.price(10.0, 5));  // 25.0

        // Inline ad-hoc strategy
        engine.setStrategy((p, q) -> p * q * 0.75); // custom 25% off
    }
}`,
    category: "Design Patterns",
    difficulty: "intermediate",
    tags: ["Strategy", "functional interface", "lambda", "design pattern"],
  },
  {
    id: 30,
    title: "Decorator Pattern for Extending Behavior",
    problem:
      "How do you add responsibilities to an object dynamically without subclassing?",
    explanation:
      "The Decorator pattern wraps an object with another that adds behavior before or after delegating to the original. Java I/O streams (BufferedInputStream wrapping FileInputStream) are a classic example. It is more flexible than inheritance because decorators can be stacked in any combination.",
    codeSnippet: `interface TextProcessor {
    String process(String text);
}

// Base implementation
class PlainTextProcessor implements TextProcessor {
    @Override
    public String process(String text) { return text; }
}

// Abstract decorator
abstract class TextDecorator implements TextProcessor {
    protected final TextProcessor wrapped;
    TextDecorator(TextProcessor wrapped) { this.wrapped = wrapped; }
}

class TrimDecorator extends TextDecorator {
    TrimDecorator(TextProcessor wrapped) { super(wrapped); }
    @Override
    public String process(String text) { return wrapped.process(text.trim()); }
}

class UpperCaseDecorator extends TextDecorator {
    UpperCaseDecorator(TextProcessor wrapped) { super(wrapped); }
    @Override
    public String process(String text) { return wrapped.process(text).toUpperCase(); }
}

class HtmlEscapeDecorator extends TextDecorator {
    HtmlEscapeDecorator(TextProcessor wrapped) { super(wrapped); }
    @Override
    public String process(String text) {
        return wrapped.process(text)
            .replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}

// Stack decorators — order matters!
TextProcessor pipeline = new HtmlEscapeDecorator(
    new UpperCaseDecorator(
        new TrimDecorator(
            new PlainTextProcessor())));

System.out.println(pipeline.process("  hello <world>  "));
// HELLO &lt;WORLD&gt;`,
    category: "Design Patterns",
    difficulty: "advanced",
    tags: ["Decorator", "design pattern", "composition", "wrapping"],
  },
];
