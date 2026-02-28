package com.hanoi.solver;

import java.util.EmptyStackException;

/**
 * =========================================================================================
 * CUSTOM STACK IMPLEMENTATION
 * =========================================================================================
 * 
 * EDUCATIONAL PURPOSE:
 * Why build a stack when Java has java.util.Stack?
 * 1. To understand the underlying Data Structures (Linked List vs Array).
 * 2. To control performance (Avoid synchronized overhead of Vector-based Stack).
 * 3. To demonstrate Generic Programming (<T>).
 * 
 * ARCHITECTURE:
 * This is a "Linked List" based Stack.
 * - Top: The head of the list.
 * - Push: Insert at head (O(1)).
 * - Pop: Remove from head (O(1)).
 * 
 * MEMORY:
 * Each element is wrapped in a 'Node' object. This uses more memory per element
 * than an Array-based stack, but it never needs to "resize" (copying arrays),
 * so latency is consistent.
 * 
 * @param <T> The type of data this stack will hold (e.g., Integer, String, Frame).
 */
public class MyStack<T> {
    
    // The pointer to the top element (Head of the list)
    private Node<T> top;
    
    // Tracks number of elements (Optional, but good for O(1) size check)
    private int size;

    /**
     * Inner class representing a single node in the chain.
     * Contains the data and a reference to the next node down.
     */
    private static class Node<T> {
        T data;
        Node<T> next;

        Node(T data) {
            this.data = data;
        }
    }

    /**
     * Initialize an empty stack.
     */
    public MyStack() {
        this.top = null;
        this.size = 0;
    }

    /**
     * Adds an element to the top of the stack.
     * Complexity: O(1) - Constant Time
     * 
     * @param data The item to push
     */
    public void push(T data) {
        Node<T> newNode = new Node<>(data);
        newNode.next = top; // Point new node to current top
        top = newNode;      // Update top to be the new node
        size++;
    }

    /**
     * Removes and returns the top element.
     * Complexity: O(1) - Constant Time
     * 
     * @return The data from the top node
     * @throws EmptyStackException if stack is empty
     */
    public T pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        T data = top.data;
        top = top.next; // Move top pointer down one level
        size--;
        return data;
    }

    /**
     * Returns the top element without removing it.
     * Complexity: O(1) - Constant Time
     * 
     * @return The top element
     * @throws EmptyStackException if stack is empty
     */
    public T peek() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return top.data;
    }

    /**
     * Checks if the stack has no elements.
     * @return true if empty, false otherwise
     */
    public boolean isEmpty() {
        return top == null;
    }

    /**
     * Returns the number of elements in the stack.
     * @return Size of stack
     */
    public int size() {
        return size;
    }
}
