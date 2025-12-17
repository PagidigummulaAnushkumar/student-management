package com.sms.student_management.Controller;

//import com.sms.student_management.Controller.*;
import com.sms.student_management.Entity.*;
import com.sms.student_management.Service.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public Course createCourse(
            @RequestParam String name,
            @RequestParam String code) {

        return courseService.createCourse(name, code);
    }
}
