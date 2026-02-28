package com.hanoi.controller;

// THESE ARE THE MISSING PIECES:
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class ProfileController {

    @GetMapping("/leaderboard")
    public List<Map<String, Object>> getLeaderboard() {
        List<Map<String, Object>> players = new ArrayList<>();
        
        // Mock data for testing
        Map<String, Object> p1 = new HashMap<>();
        p1.put("username", "Neo");
        p1.put("moves", 7);
        p1.put("level", "1");
        p1.put("avatar", "https://api.dicebear.com/7.x/bottts/svg?seed=Neo");
        
        Map<String, Object> p2 = new HashMap<>();
        p2.put("username", "Trinity");
        p2.put("moves", 15);
        p2.put("level", "2");
        p2.put("avatar", "https://api.dicebear.com/7.x/bottts/svg?seed=Trinity");
        
        players.add(p1);
        players.add(p2);
        return players;
    }

    @GetMapping("/progress")
    public ResponseEntity<?> getPlayerProgress(Principal principal) {
        Map<String, Object> progress = new HashMap<>();
        progress.put("unlockedLevels", 1); // Start at level 1
        return ResponseEntity.ok(progress);
    }
}