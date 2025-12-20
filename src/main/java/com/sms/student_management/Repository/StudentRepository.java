package com.sms.student_management.Repository;



import org.springframework.data.jpa.repository.JpaRepository;
//import java.util.UUID;
import com.sms.student_management.Entity.Student;
import java.util.Optional;


// public interface StudentRepository extends JpaRepository<Student, Long> {
//     boolean existsByStudentNumber(String student_number);
//     Optional<Student> findByStudentNumber(String studentNumber);
//     boolean existsByEmail(String email);
// }

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByEmail(String email);
}