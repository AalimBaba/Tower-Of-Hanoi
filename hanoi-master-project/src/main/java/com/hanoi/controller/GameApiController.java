package com.hanoi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hanoi.engine.TowerEngine;
import com.hanoi.model.GameState;

@RestController
@RequestMapping("/api/game")
public class GameApiController {

    @Autowired
    private TowerEngine engine;

    private GameState currentState; 

    @PostMapping("/start/{discs}")
    public ResponseEntity<GameState> startGame(@PathVariable int discs) {
        this.currentState = new GameState(discs);
        return ResponseEntity.ok(this.currentState);
    }

    @PostMapping("/move")
    public ResponseEntity<?> makeMove(@RequestParam int from, @RequestParam int to) {
        if (this.currentState == null) {
            return ResponseEntity.badRequest().body("No active game. Start one first.");
        }
        boolean valid = engine.validateAndMove(this.currentState, from, to);
        if (!valid) return ResponseEntity.badRequest().body("Invalid Move");
        return ResponseEntity.ok(this.currentState);
    }
}