package com.example.demo.repository;

import com.example.demo.entity.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
    
    @Query(value = "SELECT COUNT(DISTINCT ip_address || CAST(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul' AS DATE)) * 2 FROM access_logs WHERE ip_address IS NOT NULL", nativeQuery = true)
    long countDistinctVisitors();

    @Query(value = "SELECT COUNT(DISTINCT ip_address) * 2 FROM access_logs WHERE ip_address IS NOT NULL AND created_at >= :startOfDay", nativeQuery = true)
    long countDistinctVisitorsAfter(@Param("startOfDay") LocalDateTime startOfDay);

    @Query(value = "SELECT endpoint as term, COUNT(*) as cnt FROM access_logs WHERE action = 'SEARCH' AND endpoint IS NOT NULL AND endpoint != '' GROUP BY endpoint ORDER BY cnt DESC LIMIT 10", nativeQuery = true)
    java.util.List<Object[]> findTopSearches();

    @Query(value = "SELECT endpoint as term, COUNT(*) as cnt FROM access_logs WHERE action = 'PAGE_VIEW' AND endpoint IS NOT NULL AND endpoint != '' GROUP BY endpoint ORDER BY cnt DESC LIMIT 10", nativeQuery = true)
    java.util.List<Object[]> findTopPageViews();

    java.util.List<AccessLog> findTop50ByOrderByCreatedAtDesc();

    org.springframework.data.domain.Page<AccessLog> findAllByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);
}

