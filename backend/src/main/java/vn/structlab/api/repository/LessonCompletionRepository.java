package vn.structlab.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.structlab.api.model.LessonCompletion;

public interface LessonCompletionRepository extends JpaRepository<LessonCompletion, Long> {
    boolean existsByUserIdAndLessonId(Long userId, Long lessonId);
    long countByUserId(Long userId);
    long countByUserIdAndLessonTopicId(Long userId, Long topicId);
}
