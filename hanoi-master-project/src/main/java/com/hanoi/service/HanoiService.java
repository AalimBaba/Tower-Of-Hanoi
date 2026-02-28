package com.hanoi.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class HanoiService {

    /**
     * Standard 3-Peg Recursive Algorithm
     * Returns a list of moves like ["1->3", "1->2", "3->2"]
     */
    public List<String> getStandardSolution(int n, int start, int aux, int end) {
        List<String> moves = new ArrayList<>();
        calculateStandard(n, start, aux, end, moves);
        return moves;
    }

    private void calculateStandard(int n, int start, int aux, int end, List<String> moves) {
        if (n == 1) {
            moves.add(start + "->" + end);
            return;
        }
        calculateStandard(n - 1, start, end, aux, moves);
        moves.add(start + "->" + end);
        calculateStandard(n - 1, aux, start, end, moves);
    }

    /**
     * Frame-Stewart Algorithm for 4-Peg Level
     * More efficient than 3-peg for multiple discs
     */
    public List<String> getFrameStewartSolution(int n, int start, int aux1, int aux2, int end) {
        List<String> moves = new ArrayList<>();
        calculateFrameStewart(n, start, aux1, aux2, end, moves);
        return moves;
    }

    private void calculateFrameStewart(int n, int start, int aux1, int aux2, int end, List<String> moves) {
        if (n == 0) return;
        if (n == 1) {
            moves.add(start + "->" + end);
            return;
        }

        // k is the optimal number of discs to move to the first auxiliary peg
        int k = n - (int) Math.round(Math.sqrt(2 * n + 1)) + 1;

        // 1. Move k discs to aux1 using 4 pegs
        calculateFrameStewart(k, start, aux2, end, aux1, moves);
        // 2. Move remaining n-k discs to end using 3 pegs
        calculateStandard(n - k, start, aux2, end, moves);
        // 3. Move k discs from aux1 to end using 4 pegs
        calculateFrameStewart(k, aux1, start, aux2, end, moves);
    }
}