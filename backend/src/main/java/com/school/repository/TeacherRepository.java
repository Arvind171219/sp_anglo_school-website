package com.school.repository;

import com.school.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    List<Teacher> findBySection(String section);
    List<Teacher> findAllByOrderByNameAsc();
}
