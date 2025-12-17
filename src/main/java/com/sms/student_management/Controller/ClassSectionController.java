package com.sms.student_management.Controller;

import com.sms.student_management.Entity.*;
import com.sms.student_management.Service.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/class-sections")
public class ClassSectionController {

    private final ClassSectionService classSectionService;

    public ClassSectionController(ClassSectionService classSectionService) {
        this.classSectionService = classSectionService;
    }

    @PostMapping
    public ClassSection createSection(
            @RequestBody Course course,
            @RequestBody Teacher teacher,
            @RequestParam String sectionName) {

        return classSectionService.createClassSection(course, teacher, sectionName);
    }
}

