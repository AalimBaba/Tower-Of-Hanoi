package com.hanoi.controller;

import com.hanoi.solver.HanoiSolver;
import com.toh.platform.engine.FrameStewartSolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * =========================================================================================
 * DSA CONTROLLER (The Brain of the Operation)
 * =========================================================================================
 * 
 * This controller acts as the API Gateway for our Algorithm Engine.
 * It exposes RESTful endpoints that allow the React Frontend to:
 * 1. Request step-by-step solutions for visualizations.
 * 2. Compare the computational efficiency of different algorithms.
 * 
 * ARCHITECTURE NOTE:
 * We use the Strategy Pattern here by injecting different implementations of the 'HanoiSolver'
 * interface (@Qualifier("recursiveSolver") vs @Qualifier("iterativeSolver")).
 */
@RestController
@RequestMapping("/api/dsa")
@CrossOrigin(origins = "http://localhost:3000") // CORS Policy: Allow React (Port 3000) to talk to Java (Port 8080)
public class DsaController {

    @Autowired
    @Qualifier("recursiveSolver")
    private HanoiSolver recursive; // Standard O(2^n) - Simple but stack-heavy

    @Autowired
    @Qualifier("iterativeSolver")
    private HanoiSolver iterative; // Stack-Safe O(2^n) - Uses heap memory

    @Autowired
    private FrameStewartSolver frameStewartSolver; // Optimized O(2^sqrt(2n)) for 4 Towers

    /**
     * API: GET /api/dsa/solve/{discs}
     * 
     * Purpose: Solves the CLASSIC 3-Tower Puzzle.
     * Logic: Uses the Recursive approach as it is the mathematical definition of the problem.
     * 
     * @param discs Number of disks to solve for
     * @return A JSON list of moves, e.g., [[0, 2], [0, 1], [2, 1]...]
     */
    @GetMapping("/solve/{discs}")
    public List<int[]> getSolution(@PathVariable int discs) {
        // We use the recursive solver as the "Gold Standard" for the shortest path
        // Start=0, End=2, Aux=1
        return recursive.solve(discs, 0, 2, 1);
    }

    /**
     * API: GET /api/dsa/solve4/{discs}
     * 
     * Purpose: Solves the REVE'S PUZZLE (4-Tower Variant).
     * Logic: Uses the Frame-Stewart Algorithm.
     * 
     * PEG MAPPING:
     * - 0: Start Peg
     * - 3: Destination Peg
     * - 1: Aux 1
     * - 2: Aux 2
     * 
     * @param discs Number of disks
     * @return List of integer arrays representing moves
     */
    @GetMapping("/solve4/{discs}")
    public List<int[]> getSolution4(@PathVariable int discs) {
        // Frame-Stewart Solver (4 Pegs). 
        // We map pegs to: Start=0, End=3, Aux1=1, Aux2=2
        return frameStewartSolver.solve(discs, 0, 3, 1, 2);
    }

    /**
     * API: GET /api/dsa/compare/{discs}
     * 
     * Purpose: RUNTIME COMPLEXITY ANALYSIS
     * Runs all algorithms back-to-back and measures their execution time in nanoseconds.
     * 
     * EDUCATIONAL VALUE:
     * - Demonstrates the "Time Complexity" difference between O(2^n) and O(2^sqrt(2n)).
     * - Shows the overhead of Object-Oriented programming (Iterative Stack) vs Native Recursion.
     * 
     * @param discs Number of disks
     * @return JSON object with timing data and move counts
     */
    @GetMapping("/compare/{discs}")
    public Map<String, Object> compareAlgorithms(@PathVariable int discs) {
        Map<String, Object> response = new HashMap<>();
        
        // 1. Measure Recursive Performance (3 Towers)
        // Clean and fast for small N, but risks StackOverflow for large N.
        long startRec = System.nanoTime();
        List<int[]> recMoves = recursive.solve(discs, 0, 2, 1);
        long recursiveTime = System.nanoTime() - startRec;

        // 2. Measure Iterative Performance (3 Towers)
        // Slower due to Heap allocation overhead of 'Frame' objects,
        // but robust against StackOverflow.
        long startIter = System.nanoTime();
        iterative.solve(discs, 0, 2, 1);
        long iterativeTime = System.nanoTime() - startIter;

        // 3. Measure Frame-Stewart Performance (4 Towers)
        // Should have significantly FEWER moves than 3-Tower versions.
        long startFS = System.nanoTime();
        List<int[]> fsMoves = frameStewartSolver.solve(discs, 0, 2, 1, 3);
        long fsTime = System.nanoTime() - startFS;

        // Construct the JSON response
        response.put("discs", discs);
        response.put("moves3Tower", recMoves.size());
        response.put("moves4Tower", fsMoves.size());
        
        response.put("time3TowerRecursive", recursiveTime);
        response.put("time3TowerIterative", iterativeTime);
        response.put("time4TowerFrameStewart", fsTime);
        
        // Big-O Notation for context
        response.put("complexity3Tower", "O(2^n)");
        response.put("complexity4Tower", "O(2^sqrt(2n))");
        
        return response;
    }
}