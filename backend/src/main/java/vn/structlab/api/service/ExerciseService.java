package vn.structlab.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.structlab.api.dto.ExerciseDtos.AttemptResult;
import vn.structlab.api.dto.ExerciseDtos.ExerciseView;
import vn.structlab.api.dto.ExerciseDtos.SubmitAnswerRequest;
import vn.structlab.api.exception.NotFoundException;
import vn.structlab.api.model.Exercise;
import vn.structlab.api.model.ExerciseAttempt;
import vn.structlab.api.model.UserAccount;
import vn.structlab.api.repository.ExerciseAttemptRepository;
import vn.structlab.api.repository.ExerciseRepository;
import vn.structlab.api.repository.TopicRepository;

import java.util.List;
import java.util.Locale;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseAttemptRepository attemptRepository;
    private final TopicRepository topicRepository;
    private final AuthService authService;

    public ExerciseService(ExerciseRepository exerciseRepository,
                           ExerciseAttemptRepository attemptRepository,
                           TopicRepository topicRepository,
                           AuthService authService) {
        this.exerciseRepository = exerciseRepository;
        this.attemptRepository = attemptRepository;
        this.topicRepository = topicRepository;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public List<ExerciseView> getExercises(String topicSlug) {
        if (!topicRepository.findBySlug(topicSlug).isPresent()) {
            throw new NotFoundException("Không tìm thấy chủ đề " + topicSlug + ".");
        }
        return exerciseRepository.findByTopicSlugOrderByIdAsc(topicSlug).stream()
                .map(this::toView)
                .toList();
    }

    @Transactional
    public AttemptResult submit(Long exerciseId, SubmitAnswerRequest request, String userEmail) {
        UserAccount user = authService.requireUser(userEmail);
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy câu hỏi."));
        String submitted = request.answer().trim();
        boolean correct = normalize(submitted).equals(normalize(exercise.getCorrectAnswer()));
        int earned = correct ? exercise.getPoints() : 0;
        attemptRepository.save(new ExerciseAttempt(user, exercise, submitted, correct, earned));
        int totalPoints = attemptRepository.sumPointsByUserId(user.getId());
        return new AttemptResult(correct, exercise.getCorrectAnswer(), exercise.getExplanation(),
                earned, totalPoints);
    }

    private ExerciseView toView(Exercise exercise) {
        return new ExerciseView(exercise.getId(), exercise.getTopic().getSlug(),
                exercise.getTopic().getTitle(), exercise.getPrompt(), exercise.getType(),
                List.copyOf(exercise.getOptions()), exercise.getPoints(), exercise.getDifficulty());
    }

    private String normalize(String value) {
        return value.trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT);
    }
}
