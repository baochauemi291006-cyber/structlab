package vn.structlab.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.structlab.api.model.Topic;

import java.util.List;
import java.util.Optional;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findAllByOrderByOrderIndexAsc();
    Optional<Topic> findBySlug(String slug);
}
