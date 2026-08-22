package com.example.demo.service;

import com.example.demo.entity.PushLog;
import com.example.demo.entity.PushSubscription;
import com.example.demo.repository.PushLogRepository;
import com.example.demo.repository.PushSubscriptionRepository;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Security;
import java.util.List;

@Service
public class WebPushService {
    private final PushService pushService;
    private final PushSubscriptionRepository subscriptionRepository;
    private final PushLogRepository pushLogRepository;

    public WebPushService(
            @Value("${vapid.public.key}") String publicKey,
            @Value("${vapid.private.key}") String privateKey,
            PushSubscriptionRepository subscriptionRepository,
            PushLogRepository pushLogRepository) throws Exception {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
        this.pushService = new PushService(publicKey, privateKey);
        this.pushService.setSubject("mailto:kkb509@naver.com");
        this.subscriptionRepository = subscriptionRepository;
        this.pushLogRepository = pushLogRepository;
    }

    public void broadcast(String title, String body, String url, String visitorId) {
        List<PushSubscription> subs = visitorId == null ? subscriptionRepository.findAll() : subscriptionRepository.findByVisitorId(visitorId);
        int success = 0;
        int fail = 0;
        
        String safeTitle = title.replace("\"", "\\\"").replace("\n", " ");
        String safeBody = body.replace("\"", "\\\"").replace("\n", " ");
        String safeUrl = (url != null ? url : "https://korekore.vercel.app/").replace("\"", "\\\"");
        String payload = String.format("{\"title\":\"%s\",\"body\":\"%s\",\"url\":\"%s\"}", safeTitle, safeBody, safeUrl);
        
        try {
            for (PushSubscription sub : subs) {
                try {
                    nl.martijndwars.webpush.Subscription s = new nl.martijndwars.webpush.Subscription(
                        sub.getEndpoint(),
                        new nl.martijndwars.webpush.Subscription.Keys(sub.getP256dh(), sub.getAuth())
                    );
                    Notification notification = new Notification(s, payload);
                    pushService.send(notification);
                    success++;
                } catch (Exception e) {
                    fail++;
                }
            }
        } catch(Exception e) {
            fail += subs.size();
        }

        PushLog log = new PushLog();
        log.setTitle(title);
        log.setContent(body);
        log.setUrl(url != null ? url : "https://korekore.vercel.app/");
        log.setSuccessCount(success);
        log.setFailCount(fail);
        pushLogRepository.save(log);
    }
}
