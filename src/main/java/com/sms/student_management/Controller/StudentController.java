package com.sms.student_management.Controller;


import com.sms.student_management.Entity.*;
import com.sms.student_management.Service.*;

import java.time.LocalDate;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }



   

    //     @RequestParam String firstName,
    //     @RequestParam String lastName,
    //     @RequestParam String email,
    //     @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE)
    //     LocalDate dateOfBirth) {

    // return studentService.createStudent(firstName, lastName, email, dateOfBirth);
    @PostMapping
    public Student createStudent(@RequestBody Student student) {
    return studentService.createStudent(
        student.getFirstName(), 
        student.getLastName(), 
        student.getEmail(), 
        student.getDateOfBirth()
    );
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

@PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        // @RequestBody tells Spring to read the JSON from the "Body" tab in Postman
        return studentService.updateStudent(id, studentDetails);
    }

// patch mapping for updating student details
    @PatchMapping("/{id}")
    public Student patchStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        return studentService.updateStudent(id, studentDetails);
    }

    // delete student by id
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }

}
