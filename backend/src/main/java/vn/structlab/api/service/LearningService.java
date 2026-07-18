package vn.structlab.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.structlab.api.dto.LearningDtos.CompletionResponse;
import vn.structlab.api.dto.LearningDtos.LessonView;
import vn.structlab.api.dto.LearningDtos.TopicDetail;
import vn.structlab.api.dto.LearningDtos.TopicSummary;
import vn.structlab.api.exception.NotFoundException;
import vn.structlab.api.model.Lesson;
import vn.structlab.api.model.LessonCompletion;
import vn.structlab.api.model.Topic;
import vn.structlab.api.model.UserAccount;
import vn.structlab.api.repository.LessonCompletionRepository;
import vn.structlab.api.repository.LessonRepository;
import vn.structlab.api.repository.TopicRepository;

import java.util.List;

@Service
public class LearningService {

    private final TopicRepository topicRepository;
    private final LessonRepository lessonRepository;
    private final LessonCompletionRepository completionRepository;
    private final AuthService authService;

    public LearningService(TopicRepository topicRepository, LessonRepository lessonRepository,
                           LessonCompletionRepository completionRepository, AuthService authService) {
        this.topicRepository = topicRepository;
        this.lessonRepository = lessonRepository;
        this.completionRepository = completionRepository;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public List<TopicSummary> getTopics() {
        return topicRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(topic -> new TopicSummary(
                        topic.getId(), topic.getSlug(), topic.getTitle(), topic.getShortDescription(),
                        topic.getIcon(), topic.getColor(), topic.getOrderIndex(), topic.getEstimatedMinutes(),
                        topic.getDifficulty(), topic.isVisualizerAvailable(),
                        lessonRepository.countByTopicId(topic.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public TopicDetail getTopic(String slug, String userEmail) {
        Topic topic = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy chủ đề " + slug + "."));
        UserAccount user = userEmail == null ? null : authService.requireUser(userEmail);
        List<LessonView> lessons = lessonRepository.findByTopicIdOrderByOrderIndexAsc(topic.getId()).stream()
                .map(lesson -> toLessonView(lesson, user))
                .toList();
        return new TopicDetail(
                topic.getId(), topic.getSlug(), topic.getTitle(), topic.getShortDescription(),
                topic.getOverview(), topic.getIcon(), topic.getColor(), topic.getEstimatedMinutes(),
                topic.getDifficulty(), topic.isVisualizerAvailable(), lessons);
    }

    @Transactional
    public CompletionResponse completeLesson(Long lessonId, String userEmail) {
        UserAccount user = authService.requireUser(userEmail);
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy bài học."));
        if (!completionRepository.existsByUserIdAndLessonId(user.getId(), lessonId)) {
            completionRepository.save(new LessonCompletion(user, lesson));
        }
        return new CompletionResponse(lessonId, true, "Đã lưu tiến độ bài học.");
    }

    private LessonView toLessonView(Lesson lesson, UserAccount user) {
        boolean completed = user != null
                && completionRepository.existsByUserIdAndLessonId(user.getId(), lesson.getId());
        return new LessonView(lesson.getId(), lesson.getTitle(), lesson.getSummary(),
                lesson.getContent(), lesson.getCodeExample(), lesson.getOrderIndex(), completed);
    }
}
