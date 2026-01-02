package com.sms.student_management.Controller;

import com.sms.student_management.Entity.*;
import com.sms.student_management.Service.*;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/class-sections")
public class ClassSectionController {

    private final ClassSectionService classSectionService;

    public ClassSectionController(ClassSectionService classSectionService) {
        this.classSectionService = classSectionService;
    }

    // create a class section with one request body with field for course, teacher, and section name
    // @PostMapping
    // public ClassSection createSection(@RequestBody Map<String, Object> payload) {

    //     Long courseId = Long.valueOf(payload.get("course").toString());
    //     Long teacherId = Long.valueOf(payload.get("teacher").toString());
    //     String sectionName = payload.get("sectionName").toString();

    //     return classSectionService.createClassSection(courseId, teacherId, sectionName);
    // }

@PostMapping
public ClassSection createSection(@RequestBody Map<String, Object> payload) {

    // FIX: Change "course" to "courseId" to match your JSON
    // We also handle potential nulls to avoid crashing
    if (payload.get("courseId") == null || payload.get("teacherId") == null) {
        throw new RuntimeException("Error: 'courseId' and 'teacherId' are required.");
    }

    Long courseId = Long.valueOf(payload.get("courseId").toString());
    Long teacherId = Long.valueOf(payload.get("teacherId").toString());
    String sectionName = payload.get("sectionName").toString();

    return classSectionService.createClassSection(courseId, teacherId, sectionName);
}

    // get all class sections
    @GetMapping
    public Iterable<ClassSection> getAllClassSections() {
        return classSectionService.getAllClassSections();
    }

    @GetMapping("/{id}")
    public ClassSection getClassSectionById(@PathVariable Long id) {
        return classSectionService.getClassSectionById(id);
    }

  
    // delete a class section by id
    @DeleteMapping("/{id}")
    public void deleteClassSection(@PathVariable Long id) {
        classSectionService.deleteClassSection(id);
    }
    
    @PutMapping("/{id}")
    public ClassSection updateClassSection(@PathVariable Long id, @RequestBody Map<String, Object> payload) {

        Long courseId = Long.valueOf(payload.get("course").toString());
        Long teacherId = Long.valueOf(payload.get("teacher").toString());
        String sectionName = payload.get("sectionName").toString();

        return classSectionService.updateClassSection(id, courseId, teacherId, sectionName);
    }


    // @PostMapping
    // public ClassSection createSection(
    //         @RequestBody Course course,
    //         @RequestBody Teacher teacher,
    //         @RequestParam String sectionName) {

    //     return classSectionService.createClassSection(course, teacher, sectionName);
    // }
}

