package vn.structlab.api.controller;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.structlab.api.dto.ExerciseDtos.AttemptResult;
import vn.structlab.api.dto.ExerciseDtos.ExerciseView;
import vn.structlab.api.dto.ExerciseDtos.SubmitAnswerRequest;
import vn.structlab.api.service.ExerciseService;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public List<ExerciseView> exercises(@RequestParam String topic) {
        return exerciseService.getExercises(topic);
    }

    @PostMapping("/{exerciseId}/submit")
    public AttemptResult submit(@PathVariable Long exerciseId,
                                @Valid @RequestBody SubmitAnswerRequest request,
                                @AuthenticationPrincipal Jwt jwt) {
        return exerciseService.submit(exerciseId, request, jwt.getSubject());
    }
}
