package com.example.demo.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.List;

@Component
public class PythonClient {
    private final WebClient webClient;

    public PythonClient(@Value("${app.python-worker.url}") String workerUrl) {
        this.webClient = WebClient.create(workerUrl);
    }

    public Mono<SummarizeResponse> fetchTodaySummary(String timeContext) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/summarize-today")
                        .queryParam("timeContext", timeContext)
                        .build())
                .retrieve()
                .bodyToMono(SummarizeResponse.class);
    }

    public Mono<MarketStatusResponse> fetchMarketStatus() {
        return webClient.get()
                .uri("/api/market-status")
                .retrieve()
                .bodyToMono(MarketStatusResponse.class);
    }

    public static class SummarizeResponse {
        public boolean success;
        public String title;
        public String short_summary;
        public String detailed_content;
        public List<String> hashtags;
        public String error;
    }

    public static class MarketStatusResponse {
        public boolean kr_closed;
        public boolean us_closed;
    }
}
