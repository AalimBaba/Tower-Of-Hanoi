package com.hanoi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
@RequestMapping("/game")
public class GameController {

    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    /**
     * Maps to: http://localhost:8080/game/levels
     */
    @GetMapping("/levels")
    public String showLevels() {
        return "game/levels"; 
    }

    /**
     * Maps to: http://localhost:8080/game/{levelId}
     * Example: /game/1
     */
    @GetMapping("/{levelId}")
    public String playGame(@PathVariable(value = "levelId", required = false) Integer levelId, Model model) {
        
        // 1. Safety Check: If someone goes to just /game/ or uses a bad ID
        if (levelId == null || levelId < 1) {
            logger.warn("Received invalid Level ID. Redirecting to Level 1.");
            levelId = 1;
        }

        logger.info("Initializing Level: {}", levelId);

        // 2. The Bridge: This MUST match the [[${levelId}]] in play.html
        model.addAttribute("levelId", levelId);

        // 3. The Path: Points to src/main/resources/templates/game/play.html
        return "game/play";
    }
}