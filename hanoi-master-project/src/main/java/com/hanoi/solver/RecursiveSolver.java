package com.hanoi.solver;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component("recursiveSolver")
public class RecursiveSolver implements HanoiSolver {

    @Override
    public List<int[]> solve(int n, int start, int end, int aux) {
        List<int[]> moves = new ArrayList<>();
        calculateRecursive(n, start, end, aux, moves);
        return moves;
    }

    private void calculateRecursive(int n, int from, int to, int aux, List<int[]> moves) {
        if (n == 1) {
            moves.add(new int[]{from, to});
            return;
        }
        calculateRecursive(n - 1, from, aux, to, moves);
        moves.add(new int[]{from, to});
        calculateRecursive(n - 1, aux, to, from, moves);
    }
}