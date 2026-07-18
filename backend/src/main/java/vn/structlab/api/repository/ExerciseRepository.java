package vn.structlab.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.structlab.api.model.Exercise;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByTopicSlugOrderByIdAsc(String topicSlug);
    long countByTopicId(Long topicId);
}
