package com.sms.student_management.Controller;


import com.sms.student_management.Entity.*;
import com.sms.student_management.Service.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping
    public Teacher createTeacher(
            @RequestParam String email,
            @RequestParam String password) {

        return teacherService.createTeacher(email, password);
    }
}
