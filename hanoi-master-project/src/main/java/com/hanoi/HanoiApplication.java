package com.hanoi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.hanoi", "com.toh.platform"})
public class HanoiApplication {
    public static void main(String[] args) {
        SpringApplication.run(HanoiApplication.class, args);
    }
}