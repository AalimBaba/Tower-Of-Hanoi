package com.hanoi.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;
import java.lang.System;

@Entity
@Table(name = "game_state")
public class GameState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Transient 
    private List<Stack<Integer>> towers;

    @Column(columnDefinition = "TEXT")
    private String towerJson;

    private int moveCount;
    private Long userId;

    public GameState() { this(5, 3); }

    public GameState(int numberOfDisks) { this(numberOfDisks, 3); }

    public GameState(int numberOfDisks, int towerCount) {
        this.towers = new ArrayList<>();
        this.moveCount = 0;
        for (int i = 0; i < towerCount; i++) { towers.add(new Stack<>()); }
        for (int i = numberOfDisks; i > 0; i--) { towers.get(0).push(i); }
        System.out.println("GameState created with " + numberOfDisks + " discs, " + towerCount + " towers");
        System.out.println("First tower has " + towers.get(0).size() + " discs: " + towers.get(0));
    }

    public boolean applyMove(int from, int to) {
        if (from < 0 || to < 0 || from == to) return false;
        if (from >= towers.size() || to >= towers.size()) return false;
        Stack<Integer> src = towers.get(from);
        Stack<Integer> dest = towers.get(to);
        if (src.isEmpty()) return false;
        if (!dest.isEmpty() && src.peek() > dest.peek()) return false;
        
        dest.push(src.pop());
        this.moveCount++;
        return true;
    }

    public List<Stack<Integer>> getTowers() { return towers; }
    public void setTowers(List<Stack<Integer>> towers) { this.towers = towers; }
    public int getMoveCount() { return moveCount; }
    public void setMoveCount(int moveCount) { this.moveCount = moveCount; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTowerJson() { return towerJson; }
    public void setTowerJson(String towerJson) { this.towerJson = towerJson; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}