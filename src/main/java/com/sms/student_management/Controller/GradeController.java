package com.sms.student_management.Controller;

import com.sms.student_management.Entity.Grade;
import com.sms.student_management.Service.GradeService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    // CREATE
    @PostMapping
    public Grade createGrade(@RequestBody Map<String, Object> payload) {
        
        // Validation
        if (payload.get("marks") == null || payload.get("studentId") == null || payload.get("assessmentId") == null) {
            throw new RuntimeException("Error: 'marks', 'studentId', and 'assessmentId' are required.");
        }

        Integer marks = Integer.parseInt(payload.get("marks").toString());
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        Long assessmentId = Long.valueOf(payload.get("assessmentId").toString());

        return gradeService.createGrade(marks, studentId, assessmentId);
    }

    // READ ALL
    @GetMapping
    public Iterable<Grade> getAllGrades() {
        return gradeService.getAllGrades();
    }

    // READ ONE
    @GetMapping("/{id}")
    public Grade getGradeById(@PathVariable Long id) {
        return gradeService.getGradeById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Grade updateGrade(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        
        Integer marks = payload.get("marks") != null ? 
                        Integer.parseInt(payload.get("marks").toString()) : null;
                        
        Long studentId = payload.get("studentId") != null ? 
                         Long.valueOf(payload.get("studentId").toString()) : null;
                         
        Long assessmentId = payload.get("assessmentId") != null ? 
                            Long.valueOf(payload.get("assessmentId").toString()) : null;

        return gradeService.updateGrade(id, marks, studentId, assessmentId);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteGrade(@PathVariable Long id) {
        gradeService.deleteGrade(id);
    }
}