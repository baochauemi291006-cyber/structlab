package vn.structlab.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "lessons")
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(nullable = false, length = 140)
    private String title;

    @Column(nullable = false, length = 300)
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String codeExample;

    @Column(nullable = false)
    private int orderIndex;

    protected Lesson() {
    }

    public Lesson(Topic topic, String title, String summary, String content,
                  String codeExample, int orderIndex) {
        this.topic = topic;
        this.title = title;
        this.summary = summary;
        this.content = content;
        this.codeExample = codeExample;
        this.orderIndex = orderIndex;
    }

    public Long getId() { return id; }
    public Topic getTopic() { return topic; }
    public String getTitle() { return title; }
    public String getSummary() { return summary; }
    public String getContent() { return content; }
    public String getCodeExample() { return codeExample; }
    public int getOrderIndex() { return orderIndex; }
}
