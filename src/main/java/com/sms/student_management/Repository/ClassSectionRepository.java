package com.sms.student_management.Repository;


//import com.sms.student_management.Repository.*;
import com.sms.student_management.Entity.ClassSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ClassSectionRepository extends JpaRepository<ClassSection, UUID> {
}

