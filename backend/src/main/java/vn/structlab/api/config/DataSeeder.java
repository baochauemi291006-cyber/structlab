package vn.structlab.api.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vn.structlab.api.model.Exercise;
import vn.structlab.api.model.ExerciseType;
import vn.structlab.api.model.Lesson;
import vn.structlab.api.model.Topic;
import vn.structlab.api.model.UserAccount;
import vn.structlab.api.repository.ExerciseRepository;
import vn.structlab.api.repository.LessonRepository;
import vn.structlab.api.repository.TopicRepository;
import vn.structlab.api.repository.UserAccountRepository;

import java.util.List;

@Component
public class DataSeeder implements ApplicationRunner {

    private final TopicRepository topicRepository;
    private final LessonRepository lessonRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserAccountRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(TopicRepository topicRepository, LessonRepository lessonRepository,
                      ExerciseRepository exerciseRepository, UserAccountRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.topicRepository = topicRepository;
        this.lessonRepository = lessonRepository;
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (topicRepository.count() == 0) {
            seedLearningContent();
        }
        if (!userRepository.existsByEmailIgnoreCase("demo@structlab.vn")) {
            userRepository.save(new UserAccount("Bạn học Demo", "demo@structlab.vn",
                    passwordEncoder.encode("Demo123!")));
        }
    }

    private void seedLearningContent() {
        Topic array = topicRepository.save(new Topic(
                "array", "Array", "Truy cập nhanh, dữ liệu nằm liên tiếp trong bộ nhớ.",
                "Array lưu các phần tử cùng kiểu tại những vị trí liên tiếp. Mỗi phần tử được xác định " +
                        "bằng index bắt đầu từ 0. Đây là cấu trúc nền tảng để hiểu cách dữ liệu được tổ chức.",
                "Brackets", "#7C3AED", 1, 35, "Cơ bản", true));
        Topic stack = topicRepository.save(new Topic(
                "stack", "Stack", "Cấu trúc LIFO, phần tử vào sau được lấy ra trước.",
                "Stack giống như một chồng đĩa. Ta chỉ thêm hoặc lấy phần tử ở một đầu gọi là top. " +
                        "Stack thường được dùng cho undo, call stack và kiểm tra dấu ngoặc.",
                "Layers", "#F97316", 2, 30, "Cơ bản", true));
        Topic queue = topicRepository.save(new Topic(
                "queue", "Queue", "Cấu trúc FIFO, xử lý phần tử theo thứ tự đến.",
                "Queue hoạt động giống hàng chờ. Phần tử mới vào ở rear và phần tử cũ nhất rời đi ở front. " +
                        "Queue phù hợp cho lập lịch, xử lý tác vụ và duyệt BFS.",
                "ListStart", "#0EA5E9", 3, 30, "Cơ bản", true));

        lessonRepository.saveAll(List.of(
                new Lesson(array, "Array và index", "Hiểu cách Array lưu và truy cập phần tử.",
                        """
                        Array là một tập hợp phần tử được lưu liên tiếp. Index bắt đầu từ 0, vì vậy phần tử đầu tiên có index 0 và phần tử cuối có index n - 1.

                        Truy cập arr[i] có độ phức tạp O(1) vì địa chỉ phần tử được tính trực tiếp. Tìm kiếm tuyến tính có độ phức tạp O(n) vì có thể phải kiểm tra toàn bộ mảng.

                        Ưu điểm: truy cập nhanh, dễ duyệt, sử dụng bộ nhớ hiệu quả.
                        Hạn chế: kích thước thường cố định và chèn ở giữa cần dịch chuyển phần tử.
                        """,
                        """
                        int[] scores = {8, 9, 7, 10};
                        int first = scores[0];      // 8
                        scores[2] = 9;              // update O(1)
                        """, 1),
                new Lesson(array, "Chèn, xóa và tìm kiếm", "Phân tích từng thao tác quan trọng trên Array.",
                        """
                        Khi chèn vào giữa Array, các phần tử phía sau phải dịch sang phải. Khi xóa, chúng phải dịch sang trái để lấp khoảng trống. Hai thao tác này có độ phức tạp O(n).

                        Tìm kiếm tuyến tính đi từ trái sang phải cho đến khi thấy giá trị cần tìm. Nếu Array đã sắp xếp, binary search có thể giảm thời gian xuống O(log n).

                        Hãy dùng Visualizer để quan sát index thay đổi sau mỗi lần chèn hoặc xóa.
                        """,
                        """
                        for (int i = 0; i < scores.length; i++) {
                            if (scores[i] == target) return i;
                        }
                        return -1;
                        """, 2),
                new Lesson(stack, "Nguyên tắc LIFO", "Làm quen với top, push, pop và peek.",
                        """
                        Stack tuân theo Last In, First Out. Phần tử được thêm gần nhất sẽ được lấy ra trước.

                        push(value): thêm phần tử vào top.
                        pop(): lấy và xóa phần tử ở top.
                        peek(): đọc phần tử top nhưng không xóa.

                        Cả ba thao tác đều có độ phức tạp O(1). Cần kiểm tra Stack rỗng trước khi pop hoặc peek để tránh underflow.
                        """,
                        """
                        Deque<Integer> stack = new ArrayDeque<>();
                        stack.push(10);
                        stack.push(20);
                        int top = stack.peek();      // 20
                        int removed = stack.pop();  // 20
                        """, 1),
                new Lesson(stack, "Ứng dụng của Stack", "Dùng Stack để giải quyết bài toán thực tế.",
                        """
                        Stack được dùng trong undo/redo, lịch sử điều hướng, lời gọi hàm và kiểm tra dấu ngoặc cân bằng.

                        Với bài toán dấu ngoặc, ta push dấu mở. Khi gặp dấu đóng, ta kiểm tra và pop dấu mở tương ứng. Cuối cùng Stack phải rỗng.

                        Tư duy quan trọng là xác định dữ liệu nào cần được ghi nhớ theo thứ tự ngược lại.
                        """,
                        """
                        for (char c : expression.toCharArray()) {
                            if (c == '(') stack.push(c);
                            if (c == ')') stack.pop();
                        }
                        """, 2),
                new Lesson(queue, "Nguyên tắc FIFO", "Làm quen với front, rear, enqueue và dequeue.",
                        """
                        Queue tuân theo First In, First Out. Phần tử đến trước sẽ được xử lý trước.

                        enqueue(value): thêm phần tử ở rear.
                        dequeue(): lấy và xóa phần tử ở front.
                        peek(): xem phần tử ở front.

                        Với cấu trúc cài đặt phù hợp, các thao tác này có độ phức tạp O(1).
                        """,
                        """
                        Queue<String> tasks = new ArrayDeque<>();
                        tasks.offer("Task A");
                        tasks.offer("Task B");
                        String next = tasks.poll(); // Task A
                        """, 1),
                new Lesson(queue, "Queue trong hệ thống", "Hiểu cách Queue điều phối công việc.",
                        """
                        Queue xuất hiện trong hàng đợi in, hệ thống xử lý đơn hàng, message queue và thuật toán BFS.

                        Queue giúp tách nơi tạo tác vụ khỏi nơi xử lý tác vụ. Nếu tốc độ tạo nhanh hơn tốc độ xử lý, Queue giữ các tác vụ tạm thời và bảo toàn thứ tự.

                        Circular Queue tái sử dụng các ô trống bằng cách đưa rear quay lại đầu mảng.
                        """,
                        """
                        while (!queue.isEmpty()) {
                            Task task = queue.poll();
                            process(task);
                        }
                        """, 2)
        ));

        exerciseRepository.saveAll(List.of(
                exercise(array, "Array [4, 7, 9] sau khi chèn 5 tại index 1 sẽ thành gì?",
                        ExerciseType.PREDICT_STATE,
                        List.of("[4, 5, 7, 9]", "[5, 4, 7, 9]", "[4, 7, 5, 9]", "[4, 7, 9, 5]"),
                        "[4, 5, 7, 9]", "Các phần tử từ index 1 được dịch sang phải trước khi 5 được chèn vào.",
                        10, "Dễ"),
                exercise(array, "Độ phức tạp thời gian khi truy cập phần tử Array bằng index là gì?",
                        ExerciseType.COMPLEXITY, List.of("O(1)", "O(log n)", "O(n)", "O(n²)"),
                        "O(1)", "Địa chỉ phần tử được tính trực tiếp từ địa chỉ đầu và index.", 10, "Dễ"),
                exercise(array, "Thao tác nào thường cần dịch chuyển nhiều phần tử trong Array?",
                        ExerciseType.MULTIPLE_CHOICE,
                        List.of("Đọc arr[0]", "Cập nhật arr[i]", "Chèn tại đầu mảng", "Lấy độ dài"),
                        "Chèn tại đầu mảng", "Mọi phần tử hiện có phải dịch sang phải một vị trí.", 15, "Vừa"),
                exercise(stack, "Stack [2, 5] thực hiện push(8), pop(), push(10). Kết quả là gì?",
                        ExerciseType.PREDICT_STATE,
                        List.of("[2, 5, 10]", "[2, 8, 10]", "[2, 5, 8]", "[10, 5, 2]"),
                        "[2, 5, 10]", "8 được push rồi bị pop, sau đó 10 được đặt ở top.", 15, "Vừa"),
                exercise(stack, "Stack tuân theo nguyên tắc nào?", ExerciseType.MULTIPLE_CHOICE,
                        List.of("FIFO", "LIFO", "Random access", "Priority first"),
                        "LIFO", "Last In, First Out: phần tử vào sau được lấy ra trước.", 10, "Dễ"),
                exercise(stack, "Độ phức tạp trung bình của push và pop là gì?", ExerciseType.COMPLEXITY,
                        List.of("O(1)", "O(log n)", "O(n)", "O(n²)"),
                        "O(1)", "Cả push và pop chỉ tác động tại top của Stack.", 10, "Dễ"),
                exercise(queue, "Queue [3, 6, 9] thực hiện dequeue(), enqueue(12). Kết quả là gì?",
                        ExerciseType.PREDICT_STATE,
                        List.of("[6, 9, 12]", "[3, 6, 12]", "[12, 6, 9]", "[3, 6, 9]"),
                        "[6, 9, 12]", "3 rời khỏi front, sau đó 12 được thêm vào rear.", 15, "Vừa"),
                exercise(queue, "Phần tử nào rời Queue trước?", ExerciseType.MULTIPLE_CHOICE,
                        List.of("Phần tử mới nhất", "Phần tử cũ nhất", "Phần tử lớn nhất", "Phần tử ngẫu nhiên"),
                        "Phần tử cũ nhất", "Queue tuân theo First In, First Out.", 10, "Dễ"),
                exercise(queue, "Với cài đặt Queue phù hợp, enqueue và dequeue có độ phức tạp nào?",
                        ExerciseType.COMPLEXITY, List.of("O(1)", "O(log n)", "O(n)", "O(n²)"),
                        "O(1)", "Front và rear cho phép cập nhật trực tiếp mà không cần duyệt toàn bộ Queue.",
                        10, "Dễ")
        ));
    }

    private Exercise exercise(Topic topic, String prompt, ExerciseType type, List<String> options,
                              String correctAnswer, String explanation, int points, String difficulty) {
        return new Exercise(topic, prompt, type, options, correctAnswer, explanation, points, difficulty);
    }
}
