package com.example.demo.controller;

import com.example.demo.entity.Post;
import com.example.demo.repository.PostRepository;
import com.example.demo.service.SchedulerService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PostController {
    private final PostRepository postRepository;
    private final SchedulerService schedulerService;

    public PostController(PostRepository postRepository, SchedulerService schedulerService) {
        this.postRepository = postRepository;
        this.schedulerService = schedulerService;
    }

    @GetMapping("/posts")
    public List<Post> getPosts() {
        return postRepository.findTop20ByOrderByCreatedAtDesc();
    }

    @PostMapping("/posts/force-fetch")
    public String forceFetch() {
        schedulerService.forceFetchAndSave();
        return "수동 동기화 명령이 전달되었습니다.";
    }
}
