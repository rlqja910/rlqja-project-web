package com.example.demo.dto;

import lombok.Data;

@Data
public class PushSubscriptionDto {
    private String endpoint;
    private Keys keys;
    private String visitorId;
    private String userName;

    @Data
    public static class Keys {
        private String p256dh;
        private String auth;
    }
}
