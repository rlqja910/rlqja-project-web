package com.example.demo.controller;

import com.example.demo.dto.PushSubscriptionDto;
import com.example.demo.service.WebPushService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/push")
@RequiredArgsConstructor
@Slf4j
public class PushController {

    private final WebPushService webPushService;

    private final com.example.demo.repository.PushLogRepository pushLogRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody PushSubscriptionDto dto) {
        if (dto.getEndpoint() == null || dto.getKeys() == null) {
            return ResponseEntity.badRequest().body("Invalid subscription payload");
        }
        
        webPushService.subscribe(
                dto.getEndpoint(),
                dto.getKeys().getP256dh(),
                dto.getKeys().getAuth(),
                dto.getVisitorId(),
                dto.getUserName()
        );
        return ResponseEntity.ok(Map.of("success", true, "message", "Subscribed successfully"));
    }

    @GetMapping("/subscribers")
    public ResponseEntity<?> getSubscribers() {
        return ResponseEntity.ok(webPushService.getAllSubscriptions());
    }

    @GetMapping("/logs")
    public ResponseEntity<?> getLogs() {
        // Return logs sorted by ID descending
        return ResponseEntity.ok(pushLogRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id")));
    }

    @PostMapping("/send")
    public ResponseEntity<?> broadcastPush(@RequestBody Map<String, Object> payload) {
        try {
            String title = (String) payload.getOrDefault("title", "KOREKORE 알림");
            String body = (String) payload.getOrDefault("body", "새로운 소식이 있습니다.");
            String url = (String) payload.getOrDefault("url", "/");
            List<String> targetVisitorIds = (List<String>) payload.get("targetVisitorIds");

            webPushService.broadcast(title, body, url, targetVisitorIds);
            return ResponseEntity.ok(Map.of("success", true, "message", "Push sent successfully"));
        } catch (Exception e) {
            log.error("Failed to broadcast push", e);
            return ResponseEntity.internalServerError().body("Failed to send push");
        }
    }

    @PostMapping("/update-name")
    public ResponseEntity<?> updateName(@RequestBody Map<String, String> payload) {
        String visitorId = payload.get("visitorId");
        String userName = payload.get("userName");
        if (visitorId == null || userName == null) {
            return ResponseEntity.badRequest().body("visitorId and userName are required");
        }
        webPushService.updateName(visitorId, userName);
        return ResponseEntity.ok(Map.of("success", true, "message", "Name updated successfully"));
    }
}
