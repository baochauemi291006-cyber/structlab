package vn.structlab.api.dto;

import java.time.LocalDateTime;
import java.util.List;

public final class ProgressDtos {

    private ProgressDtos() {
    }

    public record DashboardView(
            String displayName,
            int totalPoints,
            long completedLessons,
            long totalLessons,
            long attempts,
            double accuracy,
            int correctStreak,
            List<TopicProgressView> topics,
            List<RecentAttemptView> recentAttempts,
            List<AchievementView> achievements
    ) {
    }

    public record TopicProgressView(
            String slug,
            String title,
            String color,
            long completedLessons,
            long totalLessons,
            double lessonPercent,
            double quizAccuracy
    ) {
    }

    public record RecentAttemptView(
            Long exerciseId,
            String topicTitle,
            String prompt,
            boolean correct,
            int pointsEarned,
            LocalDateTime attemptedAt
    ) {
    }

    public record AchievementView(String id, String title, String description, boolean unlocked) {
    }
}
