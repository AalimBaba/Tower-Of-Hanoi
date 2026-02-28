package com.hanoi.model;

public class RoomInitRequest {
    private int disks;
    private int towers;

    public RoomInitRequest() {}

    public RoomInitRequest(int disks, int towers) {
        this.disks = disks;
        this.towers = towers;
    }

    public int getDisks() {
        return disks;
    }

    public void setDisks(int disks) {
        this.disks = disks;
    }

    public int getTowers() {
        return towers;
    }

    public void setTowers(int towers) {
        this.towers = towers;
    }
}
