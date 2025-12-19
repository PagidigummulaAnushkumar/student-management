package com.sms.student_management.Controller;


import com.sms.student_management.Entity.*;
import com.sms.student_management.Service.*;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

//    @PostMapping
//     public Teacher createTeacher(
//         @RequestParam Long user_id,
//         @RequestParam String employeeNumber,
//         @RequestParam String specialization) {

//     return teacherService.createTeacher(user_id, employeeNumber, specialization);
//     }

@PostMapping
public Teacher createTeacher(@RequestBody Map<String, Object> payload) {

    Long user_id = Long.valueOf(payload.get("user_id").toString());
    String employeeNumber = payload.get("employeeNumber").toString();
    String specialization = payload.get("specialization").toString();

    return teacherService.createTeacher(user_id, employeeNumber, specialization);
}


    // get all teachers
    @GetMapping
    public Iterable<Teacher> getAllTeachers() {
        return teacherService.getAllTeachers();
    }
    // get teacher by id
    @GetMapping("/{id}")
    public Teacher getTeacherById(@PathVariable Long id) {
        return teacherService.getTeacherById(id);
    }

    // update teacher by id
    @PutMapping("/{id}")
    public Teacher updateTeacher(
            @PathVariable Long id,
             @RequestBody Map<String, Object> payload) {

        String employeeNumber = payload.get("employeeNumber").toString();
        String specialization = payload.get("specialization").toString(); 

        return teacherService.updateTeacher(id, employeeNumber, specialization);
    }
    
    // update only specialization of teacher by id
    @PatchMapping("/{id}")
public Teacher patchTeacher(
        @PathVariable Long id,
        @RequestBody Map<String, Object> payload) {

    return teacherService.patchTeacher(id, payload);
}

    
    // delete teacher by id
    @DeleteMapping("/{id}")
    public void deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
    }
    
}
