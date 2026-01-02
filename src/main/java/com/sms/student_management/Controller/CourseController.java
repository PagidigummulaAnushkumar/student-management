package com.sms.student_management.Controller; // Use your actual package

import com.sms.student_management.Entity.Course;
import com.sms.student_management.Service.CourseService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    // Change RequestParam to RequestBody Map
    public Course createCourse(@RequestBody Map<String, String> payload) {
        
        String name = payload.get("name");
        String code = payload.get("code");

        return courseService.createCourse(name, code);
    }
    
  
    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    // get all courses
    @GetMapping
    public Iterable<Course> getAllCourses() {
        return courseService.getAllCourses();
    }
    
    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Map<String, String>
    payload) {
            
            String name = payload.get("name");
            String code = payload.get("code");
    
            return courseService.updateCourse(id, name, code);
        }
    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }       
}
