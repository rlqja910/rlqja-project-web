package com.example.demo.controller;

import com.example.demo.entity.AccessLog;
import com.example.demo.repository.AccessLogRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AdminController {
    private final AccessLogRepository accessLogRepository;

    public AdminController(AccessLogRepository accessLogRepository) {
        this.accessLogRepository = accessLogRepository;
    }

    @GetMapping("/admin/stats/searches")
    public List<java.util.Map<String, Object>> getTopSearches() {
        List<Object[]> results = accessLogRepository.findTopSearches();
        List<java.util.Map<String, Object>> response = new java.util.ArrayList<>();
        for (Object[] row : results) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("term", row[0]);
            map.put("count", row[1]);
            response.add(map);
        }
        return response;
    }

    @GetMapping("/admin/stats/pageviews")
    public List<java.util.Map<String, Object>> getTopPageViews() {
        List<Object[]> results = accessLogRepository.findTopPageViews();
        List<java.util.Map<String, Object>> response = new java.util.ArrayList<>();
        for (Object[] row : results) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("endpoint", row[0]);
            map.put("count", row[1]);
            response.add(map);
        }
        return response;
    }

    @GetMapping("/admin/logs/recent")
    public List<AccessLog> getRecentLogs() {
        return accessLogRepository.findTop50ByOrderByCreatedAtDesc();
    }

    @GetMapping("/admin/stats/retention")
    public List<java.util.Map<String, Object>> getTopReturningVisitors() {
        List<Object[]> results = accessLogRepository.findTopReturningVisitors();
        List<java.util.Map<String, Object>> response = new java.util.ArrayList<>();
        for (Object[] row : results) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("visitorId", row[0]);
            map.put("daysVisited", row[1]);
            map.put("totalActions", row[2]);
            response.add(map);
        }
        return response;
    }

    @GetMapping("/admin/logs")
    public org.springframework.data.domain.Page<AccessLog> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return accessLogRepository.findAllByOrderByCreatedAtDesc(
            org.springframework.data.domain.PageRequest.of(page, size)
        );
    }
}
