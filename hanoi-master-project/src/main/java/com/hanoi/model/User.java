package com.hanoi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String avatar;
    private int totalMoves = 0;
    private int totalLevelsCompleted = 0;
    private long totalTimePlayed = 0;

    // Default Constructor
    public User() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public int getTotalMoves() { return totalMoves; }
    public void setTotalMoves(int totalMoves) { this.totalMoves = totalMoves; }

    public int getTotalLevelsCompleted() { return totalLevelsCompleted; }
    public void setTotalLevelsCompleted(int totalLevelsCompleted) { this.totalLevelsCompleted = totalLevelsCompleted; }

    public long getTotalTimePlayed() { return totalTimePlayed; }
    public void setTotalTimePlayed(long totalTimePlayed) { this.totalTimePlayed = totalTimePlayed; }
}