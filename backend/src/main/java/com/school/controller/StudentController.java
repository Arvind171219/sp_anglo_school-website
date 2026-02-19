package com.school.controller;

import com.school.dto.ApiResponse;
import com.school.model.Student;
import com.school.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudent(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/roll/{rollNumber}")
    public ResponseEntity<?> getByRollNumber(@PathVariable String rollNumber) {
        return studentRepository.findByRollNumber(rollNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/class/{className}")
    public ResponseEntity<List<Student>> getByClass(@PathVariable String className) {
        return ResponseEntity.ok(studentRepository.findByClassName(className));
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody Student student) {
        if (studentRepository.existsByRollNumber(student.getRollNumber())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Roll number already exists"));
        }
        return ResponseEntity.ok(studentRepository.save(student));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student updated) {
        return studentRepository.findById(id).map(student -> {
            student.setFirstName(updated.getFirstName());
            student.setLastName(updated.getLastName());
            student.setDateOfBirth(updated.getDateOfBirth());
            student.setGender(updated.getGender());
            student.setEmail(updated.getEmail());
            student.setPhone(updated.getPhone());
            student.setAddress(updated.getAddress());
            student.setClassName(updated.getClassName());
            student.setSection(updated.getSection());
            student.setGuardianName(updated.getGuardianName());
            student.setGuardianPhone(updated.getGuardianPhone());
            student.setAdmissionYear(updated.getAdmissionYear());
            return ResponseEntity.ok(studentRepository.save(student));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        if (!studentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        studentRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Student deleted successfully"));
    }
}
