package com.sms.student_management.Controller;


import com.sms.student_management.Entity.*;
import com.sms.student_management.Service.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }



    @PostMapping
    public Student createStudent(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String studentNumber) {

        return studentService.createStudent(email, password, studentNumber);
    }

    // get all students
    @GetMapping
    public Iterable<Student> getAllStudents() {
        return studentService.getAllStudents();
    }
    
    // find student by id
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    // update student by id
    @PutMapping("/{id}")
    public Student updateStudent(
            @PathVariable Long id,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String studentNumber) {

        return studentService.updateStudent(id, email, password, studentNumber);
    }

}
