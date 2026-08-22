package com.example.demo.controller;

import com.example.demo.entity.PatchNote;
import com.example.demo.repository.PatchNoteRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PatchNoteController {
    private final PatchNoteRepository patchNoteRepository;

    public PatchNoteController(PatchNoteRepository patchNoteRepository) {
        this.patchNoteRepository = patchNoteRepository;
    }

    @GetMapping("/patch-notes")
    public List<PatchNote> getPatchNotes() {
        return patchNoteRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/patch-notes")
    public PatchNote createPatchNote(@RequestBody PatchNote patchNote) {
        return patchNoteRepository.save(patchNote);
    }
}
