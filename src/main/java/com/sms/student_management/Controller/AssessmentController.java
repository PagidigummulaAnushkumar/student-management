package com.sms.student_management.Controller;

import com.sms.student_management.Entity.Assessment;
import com.sms.student_management.Service.AssessmentService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    // Create
    @PostMapping
    public Assessment createAssessment(@RequestBody Map<String, Object> payload) {
        
        // Extract data from the Map
        String title = payload.get("title").toString();
        Integer maxMarks = Integer.parseInt(payload.get("maxMarks").toString());
        Long classSectionId = Long.valueOf(payload.get("classSectionId").toString());

        return assessmentService.createAssessment(title, maxMarks, classSectionId);
    }

    // Get All
    @GetMapping
    public Iterable<Assessment> getAllAssessments() {
        return assessmentService.getAllAssessments();
    }

    // Get By ID
    @GetMapping("/{id}")
    public Assessment getAssessmentById(@PathVariable Long id) {
        return assessmentService.getAssessmentById(id);
    }

    // Update
    @PutMapping("/{id}")
    public Assessment updateAssessment(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        
        String title = payload.get("title") != null ? payload.get("title").toString() : null;
        
        Integer maxMarks = payload.get("maxMarks") != null ? 
                           Integer.parseInt(payload.get("maxMarks").toString()) : null;
                           
        Long classSectionId = payload.get("classSectionId") != null ? 
                              Long.valueOf(payload.get("classSectionId").toString()) : null;

        return assessmentService.updateAssessment(id, title, maxMarks, classSectionId);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssessment(@PathVariable Long id) {
        assessmentService.deleteAssessment(id);
        return ResponseEntity.ok("Assessment deleted successfully");
    }
}