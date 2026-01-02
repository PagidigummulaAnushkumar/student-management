// package com.sms.student_management.Service;



// //import com.sms.student_management.Service.*;
// import com.sms.student_management.Entity.*;
// import com.sms.student_management.Repository.*;

// import java.time.LocalDateTime;

// import org.springframework.stereotype.Service;

// @Service
// public class EnrollmentService {

//     // 2. DECLARE THE FIELDS
//     private final EnrollmentRepository enrollmentRepository;
//     private final StudentRepository studentRepository;       // <--- This was likely missing
//     private final ClassSectionRepository classSectionRepository;

//     // 3. INJECT THEM IN THE CONSTRUCTOR
//     public EnrollmentService(EnrollmentRepository enrollmentRepository, 
//                              StudentRepository studentRepository, // <--- Add this argument
//                              ClassSectionRepository classSectionRepository) {
//         this.enrollmentRepository = enrollmentRepository;
//         this.studentRepository = studentRepository;           // <--- Initialize it here
//         this.classSectionRepository = classSectionRepository;
//     }

//     // CREATE: Enroll a student into a class
//     // (Updated to use Long IDs as per your previous request)
//     public Enrollment enrollStudent(Long studentId, Long classSectionId, String status) {
        
//         // Now this line will work because studentRepository is defined
//         Student student = studentRepository.findById(studentId)
//                 .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

//         ClassSection classSection = classSectionRepository.findById(classSectionId)
//                 .orElseThrow(() -> new RuntimeException("Class Section not found with ID: " + classSectionId));

//         if (enrollmentRepository.existsByStudent_IdAndClassSection_Id(studentId, classSectionId)) {
//             throw new RuntimeException("Student is already enrolled in this class section.");
//         }

//         Enrollment enrollment = new Enrollment();
//         enrollment.setStudent(student);
//         enrollment.setClassSection(classSection);
//         enrollment.setStatus(status != null ? status : "ACTIVE");
//         enrollment.setEnrollmentDate(LocalDateTime.now());

//         return enrollmentRepository.save(enrollment);
//     }

//     public Iterable<Enrollment> getAllEnrollments() {
//         return enrollmentRepository.findAll();
//     }

//     public Enrollment getEnrollmentById(Long id) {
//         // TODO Auto-generated method stub
//         throw new UnsupportedOperationException("Unimplemented method 'getEnrollmentById'");
//     }
//     public void deleteEnrollmentById(Long id) {
//         // TODO Auto-generated method stub
//         throw new UnsupportedOperationException("Unimplemented method 'deleteEnrollmentById'");
//     }   
//     public Enrollment updateEnrollmentById(Long id, Enrollment enrollment) {
//         // TODO Auto-generated method stub
//         throw new UnsupportedOperationException("Unimplemented method 'updateEnrollmentById'");
//     }
    
// }


package com.sms.student_management.Service;

import com.sms.student_management.Entity.*;
import com.sms.student_management.Repository.*;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException; // Import this

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final ClassSectionRepository classSectionRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, 
                             StudentRepository studentRepository, 
                             ClassSectionRepository classSectionRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.classSectionRepository = classSectionRepository;
    }

    public Enrollment enrollStudent(Long studentId, Long classSectionId, String status) {
        // 1. Find the Student
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with ID: " + studentId));

        // 2. Find the ClassSection
        ClassSection classSection = classSectionRepository.findById(classSectionId)
                .orElseThrow(() -> new EntityNotFoundException("ClassSection not found with ID: " + classSectionId));

        // 3. Create and Save Enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setClassSection(classSection);
        enrollment.setStatus(status);
        
        // enrollmentDate is set automatically by @PrePersist in the Entity
        
        return enrollmentRepository.save(enrollment);
    }

    // ... your other methods (getAll, getById, etc.)
    // getAllEnrollments
    public Iterable<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }
    // getEnrollmentById
    public Enrollment getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found with ID: " + id));
    }
    // deleteEnrollmentById
    public void deleteEnrollmentById(Long id) {
        if (!enrollmentRepository.existsById(id)) {
            throw new EntityNotFoundException("Enrollment not found with ID: " + id);
        }
        enrollmentRepository.deleteById(id);
    }
    // updateEnrollmentById
    public Enrollment updateEnrollmentById(Long id, Enrollment updatedEnrollment) {
        Enrollment existingEnrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found with ID: " + id));

        // Update fields
        existingEnrollment.setStatus(updatedEnrollment.getStatus());
        // You can update other fields as necessary

        return enrollmentRepository.save(existingEnrollment);
    }
    
}