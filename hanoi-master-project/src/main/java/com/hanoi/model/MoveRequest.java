package com.hanoi.model;

public class MoveRequest {
    private int fromPeg;
    private int toPeg;

    public MoveRequest() {}

    public MoveRequest(int fromPeg, int toPeg) {
        this.fromPeg = fromPeg;
        this.toPeg = toPeg;
    }

    // MANUAL GETTERS AND SETTERS
    public int getFromPeg() { return fromPeg; }
    public void setFromPeg(int fromPeg) { this.fromPeg = fromPeg; }
    
    public int getToPeg() { return toPeg; }
    public void setToPeg(int toPeg) { this.toPeg = toPeg; }
}