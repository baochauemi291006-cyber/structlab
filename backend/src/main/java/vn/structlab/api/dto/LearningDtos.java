package vn.structlab.api.dto;

import java.util.List;

public final class LearningDtos {

    private LearningDtos() {
    }

    public record TopicSummary(
            Long id,
            String slug,
            String title,
            String shortDescription,
            String icon,
            String color,
            int orderIndex,
            int estimatedMinutes,
            String difficulty,
            boolean visualizerAvailable,
            long lessonCount
    ) {
    }

    public record TopicDetail(
            Long id,
            String slug,
            String title,
            String shortDescription,
            String overview,
            String icon,
            String color,
            int estimatedMinutes,
            String difficulty,
            boolean visualizerAvailable,
            List<LessonView> lessons
    ) {
    }

    public record LessonView(
            Long id,
            String title,
            String summary,
            String content,
            String codeExample,
            int orderIndex,
            boolean completed
    ) {
    }

    public record CompletionResponse(Long lessonId, boolean completed, String message) {
    }
}
