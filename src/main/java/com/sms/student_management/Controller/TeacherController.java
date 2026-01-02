package com.sms.student_management.Controller;


import com.sms.student_management.Entity.*;
import com.sms.student_management.Service.*;

import java.util.Map;

import org.springframework.http.ResponseEntity;
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

// @PostMapping
// public Teacher createTeacher(@RequestBody Map<String, Object> payload) {

//     Long user = Long.valueOf(payload.get("user").toString());
//     String employeeNumber = payload.get("employeeNumber").toString();
//     String specialization = payload.get("specialization").toString();

//     return teacherService.createTeacher(user, employeeNumber, specialization);
// }

@PostMapping
    public ResponseEntity<?> createTeacher(@RequestBody Map<String, Object> payload) {
        
        // 1. Validate that all required fields exist
        if (!payload.containsKey("user") || 
            !payload.containsKey("employeeNumber") || 
            !payload.containsKey("specialization")) {
            
            return ResponseEntity.badRequest()
                .body("Error: Missing required fields. Please provide 'user', 'employeeNumber', and 'specialization'.");
        }

        try {
            // 2. Safely extract the User ID
            // We check for null specifically to avoid that NullPointerException
            Object userIdObj = payload.get("user");
            if (userIdObj == null) {
                return ResponseEntity.badRequest().body("Error: 'user' ID cannot be null.");
            }
            
            // Convert safely to Long
            Long userId = Long.valueOf(userIdObj.toString());
            
            // 3. Extract strings safely
            // (We already checked containsKey, but being explicit prevents edge cases)
            String employeeNumber = String.valueOf(payload.get("employeeNumber"));
            String specialization = String.valueOf(payload.get("specialization"));

            // 4. Call the service
            Teacher newTeacher = teacherService.createTeacher(userId, employeeNumber, specialization);
            
            // 5. Return the created teacher with HTTP 200 OK
            return ResponseEntity.ok(newTeacher);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Error: The 'user' field must be a valid number.");
        } catch (RuntimeException e) {
            // This catches "User not found" or "Employee number already exists" from the Service
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
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
