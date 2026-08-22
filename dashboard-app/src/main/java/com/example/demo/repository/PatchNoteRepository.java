package com.example.demo.repository;

import com.example.demo.entity.PatchNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatchNoteRepository extends JpaRepository<PatchNote, Long> {
    List<PatchNote> findAllByOrderByCreatedAtDesc();
}
