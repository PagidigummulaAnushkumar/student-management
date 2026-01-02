package com.sms.student_management.Repository;

//import com.sms.student_management.Repository.*;
import com.sms.student_management.Entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, Long> {

    boolean existsByCode(String code);
}
