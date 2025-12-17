package com.sms.student_management.Repository;


import com.sms.student_management.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface GradeRepository extends JpaRepository<Grade, UUID> {
}
