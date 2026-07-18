package vn.structlab.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.structlab.api.model.ExerciseAttempt;

import java.util.List;

public interface ExerciseAttemptRepository extends JpaRepository<ExerciseAttempt, Long> {
    long countByUserId(Long userId);
    long countByUserIdAndCorrectTrue(Long userId);
    long countByUserIdAndExerciseTopicId(Long userId, Long topicId);
    long countByUserIdAndExerciseTopicIdAndCorrectTrue(Long userId, Long topicId);
    List<ExerciseAttempt> findTop8ByUserIdOrderByAttemptedAtDesc(Long userId);

    @Query("select coalesce(sum(a.pointsEarned), 0) from ExerciseAttempt a where a.user.id = :userId")
    Integer sumPointsByUserId(@Param("userId") Long userId);
}
