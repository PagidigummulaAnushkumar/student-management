
package com.sms.student_management.Service;

import com.sms.student_management.Entity.Assessment;
import com.sms.student_management.Entity.ClassSection;
import com.sms.student_management.Repository.AssessmentRepository;
import com.sms.student_management.Repository.ClassSectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final ClassSectionRepository classSectionRepository;

    public AssessmentService(AssessmentRepository assessmentRepository, 
                             ClassSectionRepository classSectionRepository) {
        this.assessmentRepository = assessmentRepository;
        this.classSectionRepository = classSectionRepository;
    }

    // Create
    public Assessment createAssessment(String title, Integer maxMarks, Long classSectionId) {
        ClassSection section = classSectionRepository.findById(classSectionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class Section not found with ID: " + classSectionId));

        Assessment assessment = new Assessment();
        assessment.setTitle(title);
        assessment.setMaxMarks(maxMarks);
        assessment.setClassSection(section);

        return assessmentRepository.save(assessment);
    }

    // Read All
    public Iterable<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    // Read One
    public Assessment getAssessmentById(Long id) {
        return assessmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment not found"));
    }

    // Update
    public Assessment updateAssessment(Long id, String title, Integer maxMarks, Long classSectionId) {
        Assessment assessment = getAssessmentById(id);

        if (title != null) assessment.setTitle(title);
        if (maxMarks != null) assessment.setMaxMarks(maxMarks);
        
        if (classSectionId != null) {
             ClassSection section = classSectionRepository.findById(classSectionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class Section not found with ID: " + classSectionId));
             assessment.setClassSection(section);
        }

        return assessmentRepository.save(assessment);
    }

    // Delete
    public void deleteAssessment(Long id) {
        if (!assessmentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment not found");
        }
        assessmentRepository.deleteById(id);
    }
}