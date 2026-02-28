package com.hanoi.solver;

import java.util.List;

public interface HanoiSolver {
    /**
     * Generates a list of moves to solve the puzzle.
     * Each move is an int array: [fromPeg, toPeg]
     */
    List<int[]> solve(int n, int startPeg, int endPeg, int auxPeg);
}