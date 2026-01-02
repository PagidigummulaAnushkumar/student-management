package com.sms.student_management.Service;

import com.sms.student_management.Entity.AttendanceSession;
import com.sms.student_management.Entity.ClassSection;
import com.sms.student_management.Repository.AttendanceSessionRepository;
import com.sms.student_management.Repository.ClassSectionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AttendanceSessionService {

    private final AttendanceSessionRepository attendanceSessionRepository;
    private final ClassSectionRepository classSectionRepository;

    public AttendanceSessionService(AttendanceSessionRepository attendanceSessionRepository,
                                    ClassSectionRepository classSectionRepository) {
        this.attendanceSessionRepository = attendanceSessionRepository;
        this.classSectionRepository = classSectionRepository;
    }

    // Create
    public AttendanceSession createSession(LocalDate sessionDate, Long classSectionId) {
        ClassSection classSection = classSectionRepository.findById(classSectionId)
                .orElseThrow(() -> new RuntimeException("Class Section not found with ID: " + classSectionId));

        AttendanceSession session = new AttendanceSession();
        session.setSessionDate(sessionDate);
        session.setClassSection(classSection);

        return attendanceSessionRepository.save(session);
    }

    // Read All
    public Iterable<AttendanceSession> getAllSessions() {
        return attendanceSessionRepository.findAll();
    }

    // Read One
    public AttendanceSession getSessionById(Long id) {
        return attendanceSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance Session not found with ID: " + id));
    }

    // Update
    public AttendanceSession updateSession(Long id, LocalDate sessionDate, Long classSectionId) {
        AttendanceSession session = getSessionById(id);

        if (sessionDate != null) {
            session.setSessionDate(sessionDate);
        }

        if (classSectionId != null) {
            ClassSection classSection = classSectionRepository.findById(classSectionId)
                    .orElseThrow(() -> new RuntimeException("Class Section not found with ID: " + classSectionId));
            session.setClassSection(classSection);
        }

        return attendanceSessionRepository.save(session);
    }

    // Delete
    public void deleteSession(Long id) {
        attendanceSessionRepository.deleteById(id);
    }
}