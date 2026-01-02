package com.sms.student_management.Service;

import com.sms.student_management.Entity.AttendanceRecord;
import com.sms.student_management.Entity.AttendanceSession;
import com.sms.student_management.Entity.Student;
import com.sms.student_management.Repository.AttendanceRecordRepository;
import com.sms.student_management.Repository.AttendanceSessionRepository;
import com.sms.student_management.Repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class AttendanceRecordService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final StudentRepository studentRepository;
    private final AttendanceSessionRepository attendanceSessionRepository;

    public AttendanceRecordService(AttendanceRecordRepository attendanceRecordRepository,
                                   StudentRepository studentRepository,
                                   AttendanceSessionRepository attendanceSessionRepository) {
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.studentRepository = studentRepository;
        this.attendanceSessionRepository = attendanceSessionRepository;
    }

    // Create
    public AttendanceRecord createRecord(Long studentId, Long sessionId, Boolean present) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        AttendanceSession session = attendanceSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Attendance Session not found with ID: " + sessionId));

        AttendanceRecord record = new AttendanceRecord();
        record.setStudent(student);
        record.setSession(session);
        record.setPresent(present);

        return attendanceRecordRepository.save(record);
    }

    // Read All
    public Iterable<AttendanceRecord> getAllRecords() {
        return attendanceRecordRepository.findAll();
    }

    // Read One
    public AttendanceRecord getRecordById(Long id) {
        return attendanceRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance Record not found with ID: " + id));
    }

    // Update
    public AttendanceRecord updateRecord(Long id, Long studentId, Long sessionId, Boolean present) {
        AttendanceRecord record = getRecordById(id);

        if (present != null) record.setPresent(present);

        if (studentId != null) {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
            record.setStudent(student);
        }

        if (sessionId != null) {
            AttendanceSession session = attendanceSessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found with ID: " + sessionId));
            record.setSession(session);
        }

        return attendanceRecordRepository.save(record);
    }

    // Delete
    public void deleteRecord(Long id) {
        attendanceRecordRepository.deleteById(id);
    }
}
