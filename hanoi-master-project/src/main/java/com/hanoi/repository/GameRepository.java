package com.hanoi.repository;

import com.hanoi.model.GameState;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameRepository extends JpaRepository<GameState, Long> {
    List<GameState> findByUserId(Long userId);
}