package com.hanoi.engine;

import com.hanoi.model.GameState;
import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TowerEngine {
    private final java.util.concurrent.ConcurrentHashMap<String, GameState> gameStates = new java.util.concurrent.ConcurrentHashMap<>();

    public GameState getOrCreateGame(String roomId, int disks) {
        return gameStates.computeIfAbsent(roomId, k -> new GameState(disks));
    }

    public GameState processMove(String roomId, int from, int to) {
        GameState state = getOrCreateGame(roomId, 0); // Fetch current state to get disk count
        if (state.applyMove(from, to)) {
            state.setMoveCount(state.getMoveCount() + 1);
        }
        return state;
    }

    
    public boolean validateAndMove(GameState state, int from, int to) {
        return state.applyMove(from, to);
    }

    public void resetGame(String roomId, int disks) {
        gameStates.put(roomId, new GameState(disks));
    }
}