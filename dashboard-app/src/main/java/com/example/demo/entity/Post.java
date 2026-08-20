package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String shortContent;
    
    @Column(columnDefinition = "TEXT")
    private String detailedContent;
    
    private String hashtags; // 쉼표로 구분된 문자열 저장
    
    private LocalDateTime createdAt = LocalDateTime.now(ZoneId.of("Asia/Seoul"));

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getShortContent() { return shortContent; }
    public void setShortContent(String shortContent) { this.shortContent = shortContent; }
    public String getDetailedContent() { return detailedContent; }
    public void setDetailedContent(String detailedContent) { this.detailedContent = detailedContent; }
    public String getHashtags() { return hashtags; }
    public void setHashtags(String hashtags) { this.hashtags = hashtags; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
