package com.sms.student_management.Controller;

import com.sms.student_management.Entity.*;
import com.sms.student_management.Service.EnrollmentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public Enrollment enrollStudent(
            @RequestBody Student student,
            @RequestBody ClassSection classSection) {

        return enrollmentService.enrollStudent(student, classSection);
    }
}
