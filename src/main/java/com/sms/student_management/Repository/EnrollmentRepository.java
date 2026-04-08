package com.sms.student_management.Repository;


//import com.sms.student_management.Repository.*;
import com.sms.student_management.Entity.*;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
boolean existsByStudent_IdAndClassSection_Id(
            Long studentId,
            Long classSectionId
    );

List<Enrollment> findByStudentId(Long studentId);

}