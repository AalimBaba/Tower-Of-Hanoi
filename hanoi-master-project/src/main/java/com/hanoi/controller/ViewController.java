package com.hanoi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index() {
        return "game/levels"; // This maps to templates/game/levels.html
    }

    // @GetMapping("/game/{level}")
    // public String gamePage(@PathVariable int level) {
    //     // In the next step, we will create game.html
    //     return "game/game"; 
    // }

    @GetMapping("/login")
    public String loginPage() {
        return "auth/login";
    }
}