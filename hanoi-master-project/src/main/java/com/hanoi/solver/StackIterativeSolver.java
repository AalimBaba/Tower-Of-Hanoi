package com.hanoi.solver;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

/**
 * =========================================================================================
 * ITERATIVE SOLVER (The "Stack Safe" Approach)
 * =========================================================================================
 * 
 * WHY DO WE NEED THIS?
 * The standard Recursive solution is elegant but dangerous for large N (number of disks).
 * Each recursive call consumes a "Stack Frame" in the Java Virtual Machine (JVM) memory.
 * If N is large (e.g., N=64), the recursion depth becomes 2^64 (theoretically), which
 * instantly causes a java.lang.StackOverflowError.
 * 
 * HOW THIS WORKS:
 * Instead of using the JVM's implicit call stack, we create our own EXPLICIT Stack data structure
 * in the Heap memory (which is much larger than the Stack memory).
 * 
 * We simulate the behavior of a function call by saving the "state" of where we left off.
 * 
 * RECURSIVE LOGIC MAPPING:
 * 1. Move n-1 disks from Source -> Aux (State 0 -> 1)
 * 2. Move largest disk from Source -> Dest (Action)
 * 3. Move n-1 disks from Aux -> Dest (State 1 -> 2)
 */
@Component("iterativeSolver")
public class StackIterativeSolver implements HanoiSolver {

    /**
     * Represents a "Snapshot" of a function call.
     * It stores all the local variables and the current execution point (state).
     */
    private static class Frame {
        int n, from, to, aux;
        
        // state 0: Initial call (Ready to process left child / n-1 move)
        // state 1: Left child returned (Ready to move current disk)
        // state 2: Right child returned (Finished, ready to pop)
        int state = 0; 

        Frame(int n, int from, int to, int aux) {
            this.n = n; this.from = from; this.to = to; this.aux = aux;
        }
    }

    /**
     * Solves the Tower of Hanoi problem iteratively.
     * 
     * @param n Number of disks
     * @param start Source Peg
     * @param end Destination Peg
     * @param aux Auxiliary Peg
     * @return List of moves [from, to]
     */
    @Override
    public List<int[]> solve(int n, int start, int end, int aux) {
        List<int[]> moves = new ArrayList<>();
        
        // We use our custom generic stack implementation
        MyStack<Frame> stack = new MyStack<>(); 
        
        // Push the initial problem onto the stack
        stack.push(new Frame(n, start, end, aux));

        // Loop until there are no more sub-problems to solve
        while (!stack.isEmpty()) {
            Frame f = stack.peek(); // Look at the current active problem
            
            // Base Case: If only 1 disk, just move it and be done with this frame
            if (f.n == 1) {
                moves.add(new int[]{f.from, f.to});
                stack.pop();
                continue;
            }

            // Recursive Step Simulation
            if (f.state == 0) {
                // Step 1: We need to move n-1 disks from 'from' to 'aux'.
                // We advance our state to 1 so next time we see this frame, we know we did this.
                f.state = 1;
                // Push the sub-problem (Recursion happens here)
                stack.push(new Frame(f.n - 1, f.from, f.aux, f.to));
            
            } else if (f.state == 1) {
                // Step 2: The sub-problem (n-1 disks) returned.
                // Now we move the nth (largest) disk.
                moves.add(new int[]{f.from, f.to});
                
                // Step 3: We need to move the n-1 disks from 'aux' to 'to'.
                f.state = 2;
                // Push the second sub-problem
                stack.push(new Frame(f.n - 1, f.aux, f.to, f.from));
            
            } else {
                // Step 4: Both sub-problems are done. We are finished with this frame.
                stack.pop();
            }
        }
        return moves;
    }
}