package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ScouterController {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String pythonWorkerUrl;

    public ScouterController(@org.springframework.beans.factory.annotation.Value("${app.python-worker.url}") String pythonWorkerUrl) {
        this.pythonWorkerUrl = pythonWorkerUrl;
    }

    @GetMapping("/scouter")
    public ResponseEntity<String> scoutStock(@RequestParam String stockName) {
        try {
            String url = pythonWorkerUrl + "/api/scout?stockName=" + stockName;
            String result = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage().replace("\"", "\\\"").replace("\n", " ") : "Unknown Error";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("{\"success\":false, \"error\":\"" + msg + "\"}");
        }
    }
    
    @GetMapping("/scouter/result")
    public ResponseEntity<String> scoutResult(@RequestParam String jobId) {
        try {
            String url = pythonWorkerUrl + "/api/scout/result?jobId=" + jobId;
            String result = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage().replace("\"", "\\\"").replace("\n", " ") : "Unknown Error";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("{\"status\":\"error\", \"error\":\"" + msg + "\"}");
        }
    }
    @GetMapping("/market-status")
    public ResponseEntity<String> marketStatus() {
        try {
            String url = pythonWorkerUrl + "/api/market-status";
            String result = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage().replace("\"", "\\\"").replace("\n", " ") : "Unknown Error";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("{\"kr_closed\":false, \"us_closed\":false, \"error\":\"" + msg + "\"}");
        }
    }

    @GetMapping("/fear-and-greed")
    public ResponseEntity<String> fearAndGreed() {
        try {
            String url = pythonWorkerUrl + "/api/fear-and-greed";
            String result = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage().replace("\"", "\\\"").replace("\n", " ") : "Unknown Error";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("{\"success\":false, \"error\":\"" + msg + "\"}");
        }
    }

    @GetMapping("/market-predict")
    public ResponseEntity<String> marketPredict() {
        try {
            String url = pythonWorkerUrl + "/api/market-predict";
            String result = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage().replace("\"", "\\\"").replace("\n", " ") : "Unknown Error";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("{\"success\":false, \"error\":\"" + msg + "\"}");
        }
    }

    @GetMapping("/market-futures")
    public ResponseEntity<String> marketFutures() {
        try {
            String url = pythonWorkerUrl + "/api/market-futures";
            String result = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage().replace("\"", "\\\"").replace("\n", " ") : "Unknown Error";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("{\"success\":false, \"error\":\"" + msg + "\"}");
        }
    }

    @GetMapping("/live-news")
    public ResponseEntity<String> liveNews() {
        try {
            String url = pythonWorkerUrl + "/api/live-news";
            String result = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage().replace("\"", "\\\"").replace("\n", " ") : "Unknown Error";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("{\"success\":false, \"items\":[], \"error\":\"" + msg + "\"}");
        }
    }

    @PostMapping("/compound/calc")
    public ResponseEntity<String> compoundCalc(@RequestBody String payload) {
        try {
            String url = pythonWorkerUrl + "/api/compound-calc";
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(payload, headers);
            String result = restTemplate.postForObject(url, entity, String.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage().replace("\"", "\\\"").replace("\n", " ") : "Unknown Error";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("{\"success\":false, \"error\":\"" + msg + "\"}");
        }
    }
}
