package com.sms.student_management.Service;

import com.sms.student_management.Entity.*;
import com.sms.student_management.Repository.*;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

@Service
public class ParentService {

    private final ParentRepository parentRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ClassSectionRepository classSectionRepository;
    private final EnrollmentRepository enrollmentRepository;

    public ParentService(ParentRepository parentRepository,
                         UserRepository userRepository,
                         StudentRepository studentRepository,
                         ClassSectionRepository classSectionRepository,
                         EnrollmentRepository enrollmentRepository) {
        this.parentRepository = parentRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.classSectionRepository = classSectionRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    // Create
    public Parent createParent(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        Parent parent = new Parent();
        parent.setUser(user);

        return parentRepository.save(parent);
    }

    // Read All
    public Iterable<Parent> getAllParents() {
        return parentRepository.findAll();
    }

    // Read One
    public Parent getParentById(Long id) {
        return parentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Parent not found with ID: " + id));
    }

    // Update
    public Parent updateParent(Long id, Long userId) {
        Parent parent = getParentById(id);

        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
            parent.setUser(user);
        }

        return parentRepository.save(parent);
    }

    // Delete
    public void deleteParent(Long id) {
        if (!parentRepository.existsById(id)) {
            throw new EntityNotFoundException("Parent not found with ID: " + id);
        }
        parentRepository.deleteById(id);
    }

    // --- Child (Student) Management ---

    // Get all children of a parent
    public List<Student> getChildren(Long parentId) {
        Parent parent = getParentById(parentId);
        return parent.getStudents();
    }

    // Add a child to a parent
    public Parent addChild(Long parentId, Long studentId) {
        Parent parent = getParentById(parentId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with ID: " + studentId));

        if (parent.getStudents().contains(student)) {
            throw new RuntimeException("Student is already linked to this parent.");
        }

        parent.getStudents().add(student);
        return parentRepository.save(parent);
    }

    // Remove a child from a parent
    public Parent removeChild(Long parentId, Long studentId) {
        Parent parent = getParentById(parentId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with ID: " + studentId));

        if (!parent.getStudents().remove(student)) {
            throw new RuntimeException("Student is not linked to this parent.");
        }

        return parentRepository.save(parent);
    }

    // Parent enrolls their child in a class section (choose teacher for kid)
    public Enrollment enrollChild(Long parentId, Long studentId, Long classSectionId, String status) {
        Parent parent = getParentById(parentId);

        // Verify the student is actually this parent's child
        boolean isChild = parent.getStudents().stream()
                .anyMatch(s -> s.getId().equals(studentId));
        if (!isChild) {
            throw new RuntimeException("Student with ID " + studentId + " is not a child of parent with ID " + parentId);
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with ID: " + studentId));
        ClassSection classSection = classSectionRepository.findById(classSectionId)
                .orElseThrow(() -> new EntityNotFoundException("ClassSection not found with ID: " + classSectionId));

        if (enrollmentRepository.existsByStudent_IdAndClassSection_Id(studentId, classSectionId)) {
            throw new RuntimeException("Student is already enrolled in this class section.");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setClassSection(classSection);
        enrollment.setStatus(status != null ? status : "ACTIVE");

        return enrollmentRepository.save(enrollment);
    }
}