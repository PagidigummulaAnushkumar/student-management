package com.sms.student_management.Controller;

import com.sms.student_management.Entity.AttendanceSession;
import com.sms.student_management.Service.AttendanceSessionService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance-sessions")
public class AttendanceSessionController {

    private final AttendanceSessionService attendanceSessionService;

    public AttendanceSessionController(AttendanceSessionService attendanceSessionService) {
        this.attendanceSessionService = attendanceSessionService;
    }

    // CREATE
    @PostMapping
    public AttendanceSession createSession(@RequestBody Map<String, Object> payload) {
        // Validation
        if (payload.get("sessionDate") == null || payload.get("classSessionId") == null) {
            throw new RuntimeException("Error: 'sessionDate' and 'classSessionId' are required.");
        }

        // Parse Date (Expects string "YYYY-MM-DD")
        LocalDate date = LocalDate.parse(payload.get("sessionDate").toString());

        // Parse ID
        Long classSectionId = Long.valueOf(payload.get("classSessionId").toString());

        return attendanceSessionService.createSession(date, classSectionId);
    }

    // READ ALL
    @GetMapping
    public Iterable<AttendanceSession> getAllSessions() {
        return attendanceSessionService.getAllSessions();
    }

    // READ ONE
    @GetMapping("/{id}")
    public AttendanceSession getSessionById(@PathVariable Long id) {
        return attendanceSessionService.getSessionById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public AttendanceSession updateSession(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        
        LocalDate date = null;
        if (payload.get("sessionDate") != null) {
            date = LocalDate.parse(payload.get("sessionDate").toString());
        }

        Long classSectionId = null;
        if (payload.get("classSessionId") != null) {
            classSectionId = Long.valueOf(payload.get("classSessionId").toString());
        }

        return attendanceSessionService.updateSession(id, date, classSectionId);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteSession(@PathVariable Long id) {
        attendanceSessionService.deleteSession(id);
    }
}