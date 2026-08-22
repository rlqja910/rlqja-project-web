package com.example.demo.repository;

import com.example.demo.entity.PushLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PushLogRepository extends JpaRepository<PushLog, Long> {
}
