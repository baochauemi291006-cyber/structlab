package vn.structlab.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.structlab.api.model.Lesson;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByTopicIdOrderByOrderIndexAsc(Long topicId);
    long countByTopicId(Long topicId);
}
