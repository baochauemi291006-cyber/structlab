package vn.structlab.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_completions", uniqueConstraints =
        @UniqueConstraint(columnNames = {"user_id", "lesson_id"}))
public class LessonCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    private LocalDateTime completedAt;

    protected LessonCompletion() {
    }

    public LessonCompletion(UserAccount user, Lesson lesson) {
        this.user = user;
        this.lesson = lesson;
    }

    @PrePersist
    void onCreate() {
        completedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public UserAccount getUser() { return user; }
    public Lesson getLesson() { return lesson; }
    public LocalDateTime getCompletedAt() { return completedAt; }
}
