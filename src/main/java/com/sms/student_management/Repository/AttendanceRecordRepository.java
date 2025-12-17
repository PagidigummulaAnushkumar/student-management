package com.sms.student_management.Repository;

//import com.sms.student_management.Repository.*;
import com.sms.student_management.Entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AttendanceRecordRepository
        extends JpaRepository<AttendanceRecord, UUID> {
}
