package vn.structlab.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String slug;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 240)
    private String shortDescription;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String overview;

    @Column(nullable = false, length = 30)
    private String icon;

    @Column(nullable = false, length = 20)
    private String color;

    @Column(nullable = false)
    private int orderIndex;

    @Column(nullable = false)
    private int estimatedMinutes;

    @Column(nullable = false, length = 30)
    private String difficulty;

    @Column(nullable = false)
    private boolean visualizerAvailable;

    protected Topic() {
    }

    public Topic(String slug, String title, String shortDescription, String overview, String icon,
                 String color, int orderIndex, int estimatedMinutes, String difficulty,
                 boolean visualizerAvailable) {
        this.slug = slug;
        this.title = title;
        this.shortDescription = shortDescription;
        this.overview = overview;
        this.icon = icon;
        this.color = color;
        this.orderIndex = orderIndex;
        this.estimatedMinutes = estimatedMinutes;
        this.difficulty = difficulty;
        this.visualizerAvailable = visualizerAvailable;
    }

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public String getTitle() { return title; }
    public String getShortDescription() { return shortDescription; }
    public String getOverview() { return overview; }
    public String getIcon() { return icon; }
    public String getColor() { return color; }
    public int getOrderIndex() { return orderIndex; }
    public int getEstimatedMinutes() { return estimatedMinutes; }
    public String getDifficulty() { return difficulty; }
    public boolean isVisualizerAvailable() { return visualizerAvailable; }
}
