package com.school.controller;

import com.school.dto.ApiResponse;
import com.school.model.Result;
import com.school.model.Student;
import com.school.repository.ResultRepository;
import com.school.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;

    // Public: lookup results by roll number + date of birth
    @GetMapping("/lookup")
    public ResponseEntity<?> lookupResults(
            @RequestParam String rollNumber,
            @RequestParam String dob) {
        LocalDate dateOfBirth = LocalDate.parse(dob);
        return studentRepository.findByRollNumberAndDateOfBirth(rollNumber, dateOfBirth)
                .map(student -> {
                    List<Result> results = resultRepository.findByStudentId(student.getId());
                    Map<String, Object> response = new HashMap<>();
                    response.put("student", student);
                    response.put("results", results);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Result>> getResultsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultRepository.findByStudentId(studentId));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<Result>> getAllResults() {
        return ResponseEntity.ok(resultRepository.findAll());
    }

    // Save all subject results for a student's exam (upsert: deletes old, creates new)
    @Transactional
    @PostMapping("/admin/save")
    public ResponseEntity<?> saveStudentExamResults(@RequestBody Map<String, Object> request) {
        try {
            Long studentId = Long.valueOf(request.get("studentId").toString());
            String examType = request.get("examType").toString();
            String academicYear = request.get("academicYear").toString();

            Student student = studentRepository.findById(studentId).orElse(null);
            if (student == null) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Student not found"));
            }

            // Delete existing results for this student + exam + year
            List<Result> existing = resultRepository.findByStudentIdAndExamTypeAndAcademicYear(
                    studentId, examType, academicYear);
            if (!existing.isEmpty()) {
                resultRepository.deleteAll(existing);
                resultRepository.flush();
            }

            // Create new results from the list in request body
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> resultsList = (List<Map<String, Object>>) request.get("results");
            List<Result> savedResults = new ArrayList<>();
            for (Map<String, Object> r : resultsList) {
                Result newResult = new Result();
                newResult.setStudent(student);
                newResult.setSubject(r.get("subject").toString());
                newResult.setExamType(examType);
                newResult.setMarksObtained(Double.valueOf(r.get("marksObtained").toString()));
                newResult.setTotalMarks(Double.valueOf(r.get("totalMarks").toString()));
                newResult.setAcademicYear(academicYear);
                newResult.setRemarks(r.get("remarks") != null ? r.get("remarks").toString() : null);
                double percentage = (newResult.getMarksObtained() / newResult.getTotalMarks()) * 100;
                newResult.setGrade(calculateGrade(percentage));
                savedResults.add(resultRepository.save(newResult));
            }
            return ResponseEntity.ok(savedResults);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to save results: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> addResult(@RequestBody Result result) {
        if (result.getStudent() == null || result.getStudent().getId() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Student ID is required"));
        }
        Student student = studentRepository.findById(result.getStudent().getId())
                .orElse(null);
        if (student == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Student not found"));
        }
        result.setStudent(student);

        // Auto-calculate grade
        double percentage = (result.getMarksObtained() / result.getTotalMarks()) * 100;
        result.setGrade(calculateGrade(percentage));

        return ResponseEntity.ok(resultRepository.save(result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateResult(@PathVariable Long id, @RequestBody Result updated) {
        return resultRepository.findById(id).map(result -> {
            result.setSubject(updated.getSubject());
            result.setExamType(updated.getExamType());
            result.setMarksObtained(updated.getMarksObtained());
            result.setTotalMarks(updated.getTotalMarks());
            result.setAcademicYear(updated.getAcademicYear());
            result.setSemester(updated.getSemester());
            result.setRemarks(updated.getRemarks());

            double percentage = (updated.getMarksObtained() / updated.getTotalMarks()) * 100;
            result.setGrade(calculateGrade(percentage));

            return ResponseEntity.ok(resultRepository.save(result));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResult(@PathVariable Long id) {
        if (!resultRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        resultRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Result deleted successfully"));
    }

    private String calculateGrade(double percentage) {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C";
        if (percentage >= 40) return "D";
        return "F";
    }
}
