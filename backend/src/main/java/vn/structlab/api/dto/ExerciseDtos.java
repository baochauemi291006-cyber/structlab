package vn.structlab.api.dto;

import jakarta.validation.constraints.NotBlank;
import vn.structlab.api.model.ExerciseType;

import java.util.List;

public final class ExerciseDtos {

    private ExerciseDtos() {
    }

    public record ExerciseView(
            Long id,
            String topicSlug,
            String topicTitle,
            String prompt,
            ExerciseType type,
            List<String> options,
            int points,
            String difficulty
    ) {
    }

    public record SubmitAnswerRequest(@NotBlank String answer) {
    }

    public record AttemptResult(
            boolean correct,
            String correctAnswer,
            String explanation,
            int pointsEarned,
            int totalPoints
    ) {
    }
}
