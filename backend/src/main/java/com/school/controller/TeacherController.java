package com.school.controller;

import com.school.dto.ApiResponse;
import com.school.model.Teacher;
import com.school.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherRepository teacherRepository;

    // Public - anyone can view teachers
    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(teacherRepository.findAllByOrderByNameAsc());
    }

    // Admin - CRUD
    @PostMapping
    public ResponseEntity<?> addTeacher(@RequestBody Teacher teacher) {
        return ResponseEntity.ok(teacherRepository.save(teacher));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeacher(@PathVariable Long id, @RequestBody Teacher updated) {
        return teacherRepository.findById(id).map(t -> {
            t.setName(updated.getName());
            t.setDesignation(updated.getDesignation());
            t.setSubject(updated.getSubject());
            t.setQualification(updated.getQualification());
            t.setPhone(updated.getPhone());
            t.setEmail(updated.getEmail());
            t.setPhotoUrl(updated.getPhotoUrl());
            t.setSection(updated.getSection());
            t.setJoiningYear(updated.getJoiningYear());
            return ResponseEntity.ok(teacherRepository.save(t));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        if (!teacherRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        teacherRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Teacher deleted"));
    }
}
