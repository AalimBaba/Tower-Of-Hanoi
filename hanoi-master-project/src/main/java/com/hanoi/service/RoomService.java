package com.hanoi.service;

import com.hanoi.model.GameState;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomService {

    private final Map<String, GameState> roomMap = new ConcurrentHashMap<>();

    public GameState getRoomState(String roomId) {
        return roomMap.get(roomId);
    }

    public GameState initRoomState(String roomId, int disks, int towers) {
        return roomMap.compute(roomId, (id, existing) -> {
            // Always reset when disks or towers change
            return new GameState(disks, towers);
        });
    }

    public void updateRoomState(String roomId, GameState state) {
        roomMap.put(roomId, state);
    }
}