package vn.structlab.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "exercise_attempts")
public class ExerciseAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(nullable = false, length = 400)
    private String submittedAnswer;

    @Column(nullable = false)
    private boolean correct;

    @Column(nullable = false)
    private int pointsEarned;

    @Column(nullable = false, updatable = false)
    private LocalDateTime attemptedAt;

    protected ExerciseAttempt() {
    }

    public ExerciseAttempt(UserAccount user, Exercise exercise, String submittedAnswer,
                           boolean correct, int pointsEarned) {
        this.user = user;
        this.exercise = exercise;
        this.submittedAnswer = submittedAnswer;
        this.correct = correct;
        this.pointsEarned = pointsEarned;
    }

    @PrePersist
    void onCreate() {
        attemptedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public UserAccount getUser() { return user; }
    public Exercise getExercise() { return exercise; }
    public String getSubmittedAnswer() { return submittedAnswer; }
    public boolean isCorrect() { return correct; }
    public int getPointsEarned() { return pointsEarned; }
    public LocalDateTime getAttemptedAt() { return attemptedAt; }
}
