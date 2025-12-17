package com.sms.student_management.Repository;



import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import com.sms.student_management.Entity.Student;
import java.util.Optional;


public interface StudentRepository extends JpaRepository<Student, UUID> {
    boolean existsByStudentNumber(String student_number);
    Optional<Student> findByStudentNumber(String studentNumber);
}