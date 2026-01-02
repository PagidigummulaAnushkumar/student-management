package com.sms.student_management.Repository;


//import com.sms.student_management.Repository.*;
import com.sms.student_management.Entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AssessmentRepository
        extends JpaRepository<Assessment, Long> {
}
