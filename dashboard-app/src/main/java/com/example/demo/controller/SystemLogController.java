package com.example.demo.controller;

import com.example.demo.entity.AccessLog;
import com.example.demo.repository.AccessLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SystemLogController {
    private final AccessLogRepository accessLogRepository;

    public SystemLogController(AccessLogRepository accessLogRepository) {
        this.accessLogRepository = accessLogRepository;
    }

    @PostMapping("/logs/visit")
    public ResponseEntity<String> logVisit(HttpServletRequest request, @RequestBody(required = false) java.util.Map<String, String> payload) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        } else {
            ip = ip.split(",")[0].trim();
        }
        String userAgent = request.getHeader("User-Agent");
        String visitorId = (payload != null && payload.containsKey("visitorId")) ? payload.get("visitorId") : null;
        String action = (payload != null && payload.containsKey("action")) ? payload.get("action") : "PAGE_VIEW";

        AccessLog log = new AccessLog();
        log.setIpAddress(ip);
        log.setVisitorId(visitorId);
        log.setUserAgent(userAgent);
        log.setAction(action);
        
        if (payload != null && payload.containsKey("endpoint")) {
            log.setEndpoint(payload.get("endpoint"));
        }

        accessLogRepository.save(log);
        return ResponseEntity.ok("logged");
    }

    @GetMapping("/logs/stats")
    public java.util.Map<String, Long> getStats() {
        java.time.ZonedDateTime nowKst = java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Seoul"));
        java.time.ZonedDateTime startOfDayKst = nowKst.toLocalDate().atStartOfDay(java.time.ZoneId.of("Asia/Seoul"));
        // DB의 createdAt이 서버 로컬(UTC)로 저장되므로, KST 자정을 UTC로 변환하여 쿼리에 전달
        java.time.LocalDateTime startOfDayUtc = startOfDayKst.withZoneSameInstant(java.time.ZoneId.of("UTC")).toLocalDateTime();

        long totalVisitors = accessLogRepository.countDistinctVisitors();
        long todayVisitors = accessLogRepository.countDistinctVisitorsAfter(startOfDayUtc);

        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("totalVisitors", totalVisitors);
        stats.put("todayVisitors", todayVisitors);
        return stats;
    }
}
