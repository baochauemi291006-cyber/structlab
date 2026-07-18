package vn.structlab.api.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String prompt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ExerciseType type;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "exercise_options", joinColumns = @JoinColumn(name = "exercise_id"))
    @OrderColumn(name = "option_order")
    @Column(name = "option_value", nullable = false, length = 400)
    private List<String> options = new ArrayList<>();

    @Column(nullable = false, length = 400)
    private String correctAnswer;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String explanation;

    @Column(nullable = false)
    private int points;

    @Column(nullable = false, length = 30)
    private String difficulty;

    protected Exercise() {
    }

    public Exercise(Topic topic, String prompt, ExerciseType type, List<String> options,
                    String correctAnswer, String explanation, int points, String difficulty) {
        this.topic = topic;
        this.prompt = prompt;
        this.type = type;
        this.options = new ArrayList<>(options);
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
        this.points = points;
        this.difficulty = difficulty;
    }

    public Long getId() { return id; }
    public Topic getTopic() { return topic; }
    public String getPrompt() { return prompt; }
    public ExerciseType getType() { return type; }
    public List<String> getOptions() { return options; }
    public String getCorrectAnswer() { return correctAnswer; }
    public String getExplanation() { return explanation; }
    public int getPoints() { return points; }
    public String getDifficulty() { return difficulty; }
}
