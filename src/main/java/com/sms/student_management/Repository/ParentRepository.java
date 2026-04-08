package com.sms.student_management.Repository;

//import com.sms.student_management.Repository.*;
import com.sms.student_management.Entity.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParentRepository extends JpaRepository<Parent, Long> {
    List<Parent> findByStudents_Id(Long studentId);
}
