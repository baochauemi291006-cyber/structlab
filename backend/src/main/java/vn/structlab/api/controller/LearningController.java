package vn.structlab.api.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.structlab.api.dto.LearningDtos.CompletionResponse;
import vn.structlab.api.dto.LearningDtos.TopicDetail;
import vn.structlab.api.dto.LearningDtos.TopicSummary;
import vn.structlab.api.service.LearningService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LearningController {

    private final LearningService learningService;

    public LearningController(LearningService learningService) {
        this.learningService = learningService;
    }

    @GetMapping("/topics")
    public List<TopicSummary> topics() {
        return learningService.getTopics();
    }

    @GetMapping("/topics/{slug}")
    public TopicDetail topic(@PathVariable String slug, @AuthenticationPrincipal Jwt jwt) {
        return learningService.getTopic(slug, jwt == null ? null : jwt.getSubject());
    }

    @PostMapping("/lessons/{lessonId}/complete")
    public CompletionResponse complete(@PathVariable Long lessonId, @AuthenticationPrincipal Jwt jwt) {
        return learningService.completeLesson(lessonId, jwt.getSubject());
    }
}
