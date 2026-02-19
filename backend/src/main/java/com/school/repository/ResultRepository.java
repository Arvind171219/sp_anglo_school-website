package com.school.repository;

import com.school.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudentId(Long studentId);
    List<Result> findByStudentIdAndExamTypeAndAcademicYear(Long studentId, String examType, String academicYear);
}
