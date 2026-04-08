package com.sms.student_management.Controller;

import com.sms.student_management.Entity.Enrollment;
import com.sms.student_management.Entity.Parent;
import com.sms.student_management.Entity.Student;
import com.sms.student_management.Service.ParentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parents")
public class ParentController {

    private final ParentService parentService;

    public ParentController(ParentService parentService) {
        this.parentService = parentService;
    }

    // CREATE
    @PostMapping
    public Parent createParent(@RequestBody Map<String, Object> payload) {
        
        if (payload.get("userId") == null) {
            throw new RuntimeException("Error: 'userId' is required.");
        }

        Long userId = Long.valueOf(payload.get("userId").toString());

        return parentService.createParent(userId);
    }

    // READ ALL
    @GetMapping
    public Iterable<Parent> getAllParents() {
        return parentService.getAllParents();
    }

    // READ ONE
    @GetMapping("/{id}")
    public Parent getParentById(@PathVariable Long id) {
        return parentService.getParentById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Parent updateParent(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        
        Long userId = payload.get("userId") != null ? 
                      Long.valueOf(payload.get("userId").toString()) : null;

        return parentService.updateParent(id, userId);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteParent(@PathVariable Long id) {
        parentService.deleteParent(id);
    }

    // --- Child (Student) Management ---

    // Get all children of a parent
    @GetMapping("/{id}/students")
    public List<Student> getChildren(@PathVariable Long id) {
        return parentService.getChildren(id);
    }

    // Add a child to a parent
    @PostMapping("/{id}/students/{studentId}")
    public Parent addChild(@PathVariable Long id, @PathVariable Long studentId) {
        return parentService.addChild(id, studentId);
    }

    // Remove a child from a parent
    @DeleteMapping("/{id}/students/{studentId}")
    public Parent removeChild(@PathVariable Long id, @PathVariable Long studentId) {
        return parentService.removeChild(id, studentId);
    }

    // Parent enrolls their child in a class section (choose teacher for kid)
    @PostMapping("/{id}/students/{studentId}/enrollments")
    public Enrollment enrollChild(
            @PathVariable Long id,
            @PathVariable Long studentId,
            @RequestBody Map<String, Object> payload) {

        if (payload.get("classSectionId") == null) {
            throw new IllegalArgumentException("Error: 'classSectionId' is required.");
        }

        Long classSectionId = Long.valueOf(payload.get("classSectionId").toString());
        String status = payload.containsKey("status") ? payload.get("status").toString() : null;

        return parentService.enrollChild(id, studentId, classSectionId, status);
    }
}