package vn.structlab.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.structlab.api.dto.ProgressDtos.AchievementView;
import vn.structlab.api.dto.ProgressDtos.DashboardView;
import vn.structlab.api.dto.ProgressDtos.RecentAttemptView;
import vn.structlab.api.dto.ProgressDtos.TopicProgressView;
import vn.structlab.api.model.ExerciseAttempt;
import vn.structlab.api.model.Topic;
import vn.structlab.api.model.UserAccount;
import vn.structlab.api.repository.ExerciseAttemptRepository;
import vn.structlab.api.repository.LessonCompletionRepository;
import vn.structlab.api.repository.LessonRepository;
import vn.structlab.api.repository.TopicRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProgressService {

    private final AuthService authService;
    private final TopicRepository topicRepository;
    private final LessonRepository lessonRepository;
    private final LessonCompletionRepository completionRepository;
    private final ExerciseAttemptRepository attemptRepository;

    public ProgressService(AuthService authService, TopicRepository topicRepository,
                           LessonRepository lessonRepository,
                           LessonCompletionRepository completionRepository,
                           ExerciseAttemptRepository attemptRepository) {
        this.authService = authService;
        this.topicRepository = topicRepository;
        this.lessonRepository = lessonRepository;
        this.completionRepository = completionRepository;
        this.attemptRepository = attemptRepository;
    }

    @Transactional(readOnly = true)
    public DashboardView getDashboard(String userEmail) {
        UserAccount user = authService.requireUser(userEmail);
        long completedLessons = completionRepository.countByUserId(user.getId());
        long totalLessons = lessonRepository.count();
        long attempts = attemptRepository.countByUserId(user.getId());
        long correctAttempts = attemptRepository.countByUserIdAndCorrectTrue(user.getId());
        double accuracy = percent(correctAttempts, attempts);
        int totalPoints = attemptRepository.sumPointsByUserId(user.getId());
        List<ExerciseAttempt> recentEntities = attemptRepository
                .findTop8ByUserIdOrderByAttemptedAtDesc(user.getId());

        List<TopicProgressView> topicProgress = topicRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(topic -> topicProgress(topic, user.getId()))
                .toList();
        List<RecentAttemptView> recent = recentEntities.stream()
                .map(attempt -> new RecentAttemptView(
                        attempt.getExercise().getId(), attempt.getExercise().getTopic().getTitle(),
                        attempt.getExercise().getPrompt(), attempt.isCorrect(),
                        attempt.getPointsEarned(), attempt.getAttemptedAt()))
                .toList();
        int streak = correctStreak(recentEntities);
        List<AchievementView> achievements = achievements(completedLessons, totalLessons, attempts,
                correctAttempts, streak);

        return new DashboardView(user.getDisplayName(), totalPoints, completedLessons, totalLessons,
                attempts, accuracy, streak, topicProgress, recent, achievements);
    }

    private TopicProgressView topicProgress(Topic topic, Long userId) {
        long totalLessons = lessonRepository.countByTopicId(topic.getId());
        long completedLessons = completionRepository.countByUserIdAndLessonTopicId(userId, topic.getId());
        long attempts = attemptRepository.countByUserIdAndExerciseTopicId(userId, topic.getId());
        long correct = attemptRepository.countByUserIdAndExerciseTopicIdAndCorrectTrue(userId, topic.getId());
        return new TopicProgressView(topic.getSlug(), topic.getTitle(), topic.getColor(),
                completedLessons, totalLessons, percent(completedLessons, totalLessons),
                percent(correct, attempts));
    }

    private int correctStreak(List<ExerciseAttempt> recent) {
        int streak = 0;
        for (ExerciseAttempt attempt : recent) {
            if (!attempt.isCorrect()) {
                break;
            }
            streak++;
        }
        return streak;
    }

    private List<AchievementView> achievements(long completedLessons, long totalLessons,
                                                long attempts, long correctAttempts, int streak) {
        List<AchievementView> result = new ArrayList<>();
        result.add(new AchievementView("first-step", "Bước đầu tiên",
                "Hoàn thành bài học đầu tiên", completedLessons >= 1));
        result.add(new AchievementView("practice-5", "Người luyện tập",
                "Trả lời ít nhất 5 câu hỏi", attempts >= 5));
        result.add(new AchievementView("streak-3", "Chuỗi chính xác",
                "Trả lời đúng 3 câu liên tiếp", streak >= 3));
        result.add(new AchievementView("all-lessons", "Nhà thám hiểm dữ liệu",
                "Hoàn thành toàn bộ bài học", totalLessons > 0 && completedLessons >= totalLessons));
        result.add(new AchievementView("correct-10", "Tư duy thuật toán",
                "Tích lũy 10 câu trả lời đúng", correctAttempts >= 10));
        return result;
    }

    private double percent(long part, long total) {
        if (total == 0) {
            return 0.0;
        }
        return Math.round((part * 10000.0 / total)) / 100.0;
    }
}
