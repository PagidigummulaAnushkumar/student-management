
package com.sms.student_management.Controller;

import com.sms.student_management.Entity.AttendanceRecord;
import com.sms.student_management.Service.AttendanceRecordService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/attendance-records")
public class AttendanceRecordController {

    private final AttendanceRecordService attendanceRecordService;

    public AttendanceRecordController(AttendanceRecordService attendanceRecordService) {
        this.attendanceRecordService = attendanceRecordService;
    }

    // CREATE
    @PostMapping
    public AttendanceRecord createRecord(@RequestBody Map<String, Object> payload) {
        
        // Validation
        if (payload.get("studentId") == null || payload.get("sessionId") == null || payload.get("present") == null) {
            throw new RuntimeException("Error: 'studentId', 'sessionId', and 'present' are required.");
        }

        Long studentId = Long.valueOf(payload.get("studentId").toString());
        Long sessionId = Long.valueOf(payload.get("sessionId").toString());
        
        // Parse Boolean
        Boolean present = Boolean.valueOf(payload.get("present").toString());

        return attendanceRecordService.createRecord(studentId, sessionId, present);
    }

    // READ ALL
    @GetMapping
    public Iterable<AttendanceRecord> getAllRecords() {
        return attendanceRecordService.getAllRecords();
    }

    // READ ONE
    @GetMapping("/{id}")
    public AttendanceRecord getRecordById(@PathVariable Long id) {
        return attendanceRecordService.getRecordById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public AttendanceRecord updateRecord(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        
        Long studentId = payload.get("studentId") != null ? 
                         Long.valueOf(payload.get("studentId").toString()) : null;
                         
        Long sessionId = payload.get("sessionId") != null ? 
                         Long.valueOf(payload.get("sessionId").toString()) : null;

        Boolean present = payload.get("present") != null ? 
                          Boolean.valueOf(payload.get("present").toString()) : null;

        return attendanceRecordService.updateRecord(id, studentId, sessionId, present);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteRecord(@PathVariable Long id) {
        attendanceRecordService.deleteRecord(id);
    }
}