package com.hanoi.controller;

import com.hanoi.model.GameState;
import com.hanoi.model.RoomInitRequest;
import com.hanoi.model.MoveRequest;
import com.hanoi.engine.TowerEngine;
import com.hanoi.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.lang.System;

@Controller
public class MultiplayerController {

    @Autowired
    private TowerEngine engine;

    @Autowired
    private RoomService roomService;

    @MessageMapping("/init/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public GameState handleInit(@DestinationVariable String roomId, RoomInitRequest request) {
        int disks = request != null ? request.getDisks() : 5;
        int towers = request != null && request.getTowers() > 0 ? request.getTowers() : 3;
        if (disks < 1) disks = 1;
        System.out.println("Backend init received: roomId=" + roomId + ", disks=" + disks + ", towers=" + towers);
        roomService.initRoomState(roomId, disks, towers);
        GameState state = roomService.getRoomState(roomId);
        System.out.println("Backend returning state with " + state.getTowers().size() + " towers");
        return state;
    }

    // Listen for moves from the React frontend
    @MessageMapping("/move/{roomId}") 
    @SendTo("/topic/room/{roomId}")
    public GameState handleMove(@DestinationVariable String roomId, MoveRequest request) {
        GameState state = roomService.getRoomState(roomId);
        
        if (state != null) {
            // Use 'getFromPeg' and 'getToPeg' to match the frontend and model
            boolean valid = engine.validateAndMove(state, request.getFromPeg(), request.getToPeg());
            if (!valid) {
                return state; // Send back current state if move is illegal
            }
            
            // Update the state in the room service and return the updated state
            roomService.updateRoomState(roomId, state);
            return state;
        }
        
        return state;
    }
}
