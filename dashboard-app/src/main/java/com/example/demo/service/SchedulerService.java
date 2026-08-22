package com.example.demo.service;

import com.example.demo.client.PythonClient;
import com.example.demo.entity.Post;
import com.example.demo.repository.PostRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class SchedulerService {
    private final PythonClient pythonClient;
    private final PostRepository postRepository;
    private final WebPushService webPushService;

    public SchedulerService(PythonClient pythonClient, PostRepository postRepository, WebPushService webPushService) {
        this.pythonClient = pythonClient;
        this.postRepository = postRepository;
        this.webPushService = webPushService;
    }

    // 매일 오전 7시 자동 실행 (장전)
    @Scheduled(cron = "0 0 7 * * *", zone = "Asia/Seoul")
    public void scheduleMorningPost() {
        fetchAndSave("장전");
    }

    // 매일 낮 12시 자동 실행 (점심)
    @Scheduled(cron = "0 0 12 * * *", zone = "Asia/Seoul")
    public void scheduleLunchPost() {
        fetchAndSave("점심");
    }

    // 매일 오후 8시 자동 실행 (장마감 이후)
    @Scheduled(cron = "0 0 20 * * *", zone = "Asia/Seoul")
    public void scheduleEveningPost() {
        fetchAndSave("장마감 이후");
    }

    public void forceFetchAndSave() {
        new Thread(() -> fetchAndSave("실시간 속보")).start();
    }

    // 3분마다 DB를 조회해서 NeonDB 콜드 스타트(Cold Start) 방지
    @Scheduled(initialDelay = 10000, fixedRate = 180000)
    public void pingDb() {
        try {
            postRepository.findById(1L);
        } catch (Exception e) {
            // ignore
        }
    }

    private void fetchAndSave(String timeContext) {
        try {
            PythonClient.SummarizeResponse response = pythonClient.fetchTodaySummary(timeContext).block(); // 동기적으로 대기
            
            if (response != null && response.success && response.title != null) {
                Post post = new Post();
                post.setTitle("[" + timeContext + "] " + response.title);
                post.setShortContent(response.short_summary);
                post.setDetailedContent(response.detailed_content);
                if (response.hashtags != null && !response.hashtags.isEmpty()) {
                    post.setHashtags(String.join(",", response.hashtags));
                }
                postRepository.save(post);
                System.out.println("✅ 성공: AI 요약본이 DB에 저장되었습니다! (" + timeContext + ")");
                
                // 알림 허용한 모든 유저에게 푸시 발송
                try {
                    String pushTitle = "새로운 증시 리포트가 도착했습니다! 🚀";
                    String pushUrl = "https://korekore.vercel.app/#report";
                    webPushService.broadcast(pushTitle, post.getShortContent(), pushUrl, null);
                } catch (Exception e) {
                    System.err.println("푸시 알림 자동 발송 실패: " + e.getMessage());
                }
            } else if (response != null && !response.success && "SKIP".equals(response.error)) {
                System.out.println("ℹ️ 스킵: " + timeContext + " 리포트는 오늘 휴장일(주말/공휴일) 조건에 의해 발송되지 않습니다.");
            } else {
                String errorMsg = (response != null && response.error != null) ? response.error : "알 수 없는 오류";
                System.err.println("❌ 실패: 파이썬 워커 응답 오류 - " + errorMsg);
            }
        } catch (Exception e) {
            System.err.println("❌ 치명적 오류: AI 서버 요청 중 예외 발생 - " + e.getMessage());
        }
    }
}
