package com.toh.platform.engine;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

/**
 * =========================================================================================
 * FRAME-STEWART ALGORITHM (4-TOWER SOLVER)
 * =========================================================================================
 * 
 * This class implements the Frame-Stewart algorithm, which is the presumed optimal solution
 * for the "Reve's Puzzle" (Tower of Hanoi with 4 pegs).
 * 
 * UNLIKE the standard 3-tower puzzle which has a complexity of O(2^n), the 4-tower version
 * significantly reduces the number of moves by utilizing the 4th peg as an additional auxiliary.
 * 
 * The complexity is approximately O(2^(sqrt(2n))), which is much faster for large n.
 * 
 * LOGIC:
 * 1. Split the stack of n disks into two parts: k (upper) and n-k (lower).
 * 2. Move the k smallest disks to a temporary peg using all 4 pegs.
 * 3. Move the remaining n-k disks to the destination peg using only 3 pegs (since one peg is occupied by the k stack).
 * 4. Move the k disks from the temporary peg to the destination using all 4 pegs.
 * 
 * The optimal 'k' is calculated as: n - round(sqrt(2n + 1))
 */
@Component
public class FrameStewartSolver {

    // Memoization cache to store optimal move counts for n disks
    private final java.util.Map<Integer, Long> memo = new java.util.HashMap<>();

    /**
     * Calculates the theoretical minimum number of moves for n discs using 4 pegs.
     * Uses dynamic programming/recursion with memoization to find the true optimal split 'k'.
     * 
     * @param n The number of disks
     * @return The total number of moves required
     */
    public long calculateOptimalMoves(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        if (memo.containsKey(n)) return memo.get(n);

        long minMoves = Long.MAX_VALUE;

        // Iterate through all possible split points 'k' (1 to n-1)
        // to find the one that minimizes the total moves.
        for (int k = 1; k < n; k++) {
            // Formula: 2 * T(k, 4) + T(n-k, 3)
            // T(n-k, 3) is standard Hanoi: 2^(n-k) - 1
            long moves = 2 * calculateOptimalMoves(k) + (long)(Math.pow(2, n - k) - 1);
            if (moves < minMoves) {
                minMoves = moves;
            }
        }
        
        memo.put(n, minMoves);
        return minMoves;
    }

    /**
     * Generates the actual sequence of moves to solve the puzzle.
     * 
     * @param n Number of disks
     * @param start Source Peg Index
     * @param end Destination Peg Index
     * @param aux1 First Auxiliary Peg
     * @param aux2 Second Auxiliary Peg
     * @return List of moves, where each move is an array [from, to]
     */
    public List<int[]> solve(int n, int start, int end, int aux1, int aux2) {
        List<int[]> moves = new ArrayList<>();
        solveFrameStewart(n, start, end, aux1, aux2, moves);
        return moves;
    }

    /**
     * Recursive helper method for the Frame-Stewart algorithm.
     */
    private void solveFrameStewart(int n, int start, int end, int aux1, int aux2, List<int[]> moves) {
        if (n == 0) return;
        if (n == 1) {
            moves.add(new int[]{start, end});
            return;
        }

        // 1. Find the optimal split point k
        int bestK = 1;
        long minMoves = Long.MAX_VALUE;

        for (int k = 1; k < n; k++) {
            long currentMoves = 2 * calculateOptimalMoves(k) + (long)(Math.pow(2, n - k) - 1);
            if (currentMoves < minMoves) {
                minMoves = currentMoves;
                bestK = k;
            }
        }
        
        int k = bestK;

        // 2. Move the top k disks from 'start' to 'aux1' using all 4 pegs.
        // We use 'end' and 'aux2' as the intermediate buffers.
        solveFrameStewart(k, start, aux1, end, aux2, moves);

        // 3. Move the remaining n-k disks from 'start' to 'end' using only 3 pegs.
        // Crucial: 'aux1' is now occupied by the k stack, so we can't use it.
        // We only have 'start', 'end', and 'aux2' available.
        solve3Pegs(n - k, start, end, aux2, moves);

        // 4. Move the k disks from 'aux1' to 'end' using all 4 pegs.
        // We bring the stack back on top of the largest disks.
        solveFrameStewart(k, aux1, end, start, aux2, moves);
    }

    /**
     * Standard 3-Tower Recursive Solver.
     * Used as a subroutine within the 4-Tower solver for the bottom n-k disks.
     */
    private void solve3Pegs(int n, int start, int end, int aux, List<int[]> moves) {
        if (n == 0) return;
        if (n == 1) {
            moves.add(new int[]{start, end});
            return;
        }
        // Move n-1 to aux
        solve3Pegs(n - 1, start, aux, end, moves);
        
        // Move largest disk to target
        moves.add(new int[]{start, end});
        
        // Move n-1 from aux to target
        solve3Pegs(n - 1, aux, end, start, moves);
    }
}