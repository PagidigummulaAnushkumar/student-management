package com.sms.student_management.Controller;

import com.sms.student_management.Entity.*;
import com.sms.student_management.Service.EnrollmentService;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    // @PostMapping
    // public Enrollment enrollStudent(@RequestBody Map<String, Object> payload) {

    //     Long studentId = Long.valueOf(payload.get("studentId").toString());
    //     Long classSectionId = Long.valueOf(payload.get("classSectionId").toString());

    //     // optional: if status not sent, service can set default
    //     String status = payload.containsKey("status")
    //             ? payload.get("status").toString()
    //             : null;

    //     return enrollmentService.enrollStudent(studentId, classSectionId, status);
    // }

    @PostMapping
    // Use the DTO class (defined below) instead of Map
    public Enrollment enrollStudent(@RequestBody EnrollmentRequest request) {
        return enrollmentService.enrollStudent(
                request.getStudentId(),
                request.getClassSectionId(),
                request.getStatus()
        );
    }

    @GetMapping
    public Iterable<Enrollment> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }
    // get enrollment by id
    @GetMapping("/{id}")    
    public Enrollment getEnrollmentById(@PathVariable Long id) {
        return enrollmentService.getEnrollmentById(id);
    }
    // delete enrollment by id
    @DeleteMapping("/{id}")
    public void deleteEnrollmentById(@PathVariable Long id) {
        enrollmentService.deleteEnrollmentById(id);
    }
    // update enrollment by id
    @PutMapping("/{id}")    
    public Enrollment updateEnrollmentById(
            @PathVariable Long id,
            @RequestBody Enrollment enrollment) {
        return enrollmentService.updateEnrollmentById(id, enrollment);
    }


    public static class EnrollmentRequest {
        private Long studentId;
        private Long classSectionId;
        private String status;

        // Getters and Setters are required for Jackson
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public Long getClassSectionId() { return classSectionId; }
        public void setClassSectionId(Long classSectionId) { this.classSectionId = classSectionId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
