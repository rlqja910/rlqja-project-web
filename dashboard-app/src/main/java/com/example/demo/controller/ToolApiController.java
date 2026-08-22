package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/tool")
public class ToolApiController {

    // 예시: 외부 툴 상태 확인 API
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getToolStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "running");
        response.put("toolName", "ExampleTool");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    // 예시: 외부 툴에 명령(Command) 전송 API
    @PostMapping("/command")
    public ResponseEntity<Map<String, Object>> executeCommand(@RequestBody Map<String, Object> commandPayload) {
        String command = (String) commandPayload.get("command");
        
        // TODO: 실제 외부 툴과 통신하여 명령을 실행하는 로직 작성
        System.out.println("Executing command on external tool: " + command);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Command executed: " + command);
        return ResponseEntity.ok(response);
    }
}
