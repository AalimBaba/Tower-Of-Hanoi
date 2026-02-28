package com.hanoi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanoi.model.GameState;
import com.hanoi.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Stack;

@Service
public class GameService {
    
    @Autowired
    private GameRepository gameRepository;
    
    private final ObjectMapper mapper = new ObjectMapper();

    public void saveProgress(GameState state) throws JsonProcessingException {
        // Synchronize the memory state (towers) to the DB string (towerJson)
        String json = mapper.writeValueAsString(state.getTowers());
        state.setTowerJson(json);
        gameRepository.save(state);
    }

    @SuppressWarnings("unchecked")
    public void loadProgress(GameState state) throws JsonProcessingException {
        if (state.getTowerJson() != null) {
            // Convert JSON string back into the Stack objects for the Engine
            List<Stack<Integer>> loadedTowers = mapper.readValue(
                state.getTowerJson(), 
                mapper.getTypeFactory().constructCollectionType(List.class, Stack.class)
            );
            state.setTowers(loadedTowers);
        }
    }
}