package com.sms.student_management.Repository;


//import com.sms.student_management.Repository.*;
import com.sms.student_management.Entity.*;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

//import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
boolean existsByStudent_IdAndClassSection_Id(
            Long studentId,
            UUID classSectionId
    );

}