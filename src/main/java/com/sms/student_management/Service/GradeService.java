package com.sms.student_management.Service;

import com.sms.student_management.Entity.Assessment;
import com.sms.student_management.Entity.Grade;
import com.sms.student_management.Entity.Student;
import com.sms.student_management.Repository.AssessmentRepository;
import com.sms.student_management.Repository.GradeRepository;
import com.sms.student_management.Repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class GradeService {

    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final AssessmentRepository assessmentRepository;

    public GradeService(GradeRepository gradeRepository, 
                        StudentRepository studentRepository, 
                        AssessmentRepository assessmentRepository) {
        this.gradeRepository = gradeRepository;
        this.studentRepository = studentRepository;
        this.assessmentRepository = assessmentRepository;
    }

    // Create
    public Grade createGrade(Integer marks, Long studentId, Long assessmentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found with ID: " + assessmentId));

        Grade grade = new Grade();
        grade.setMarks(marks);
        grade.setStudent(student);
        grade.setAssessment(assessment);

        return gradeRepository.save(grade);
    }

    // Read All
    public Iterable<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }

    // Read One
    public Grade getGradeById(Long id) {
        return gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found with ID: " + id));
    }

    // Update
    public Grade updateGrade(Long id, Integer marks, Long studentId, Long assessmentId) {
        Grade grade = getGradeById(id);

        if (marks != null) grade.setMarks(marks);

        if (studentId != null) {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
            grade.setStudent(student);
        }

        if (assessmentId != null) {
            Assessment assessment = assessmentRepository.findById(assessmentId)
                    .orElseThrow(() -> new RuntimeException("Assessment not found with ID: " + assessmentId));
            grade.setAssessment(assessment);
        }

        return gradeRepository.save(grade);
    }

    // Delete
    public void deleteGrade(Long id) {
        gradeRepository.deleteById(id);
    }
}
