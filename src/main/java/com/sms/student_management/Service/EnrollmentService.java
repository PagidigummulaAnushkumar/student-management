package com.sms.student_management.Service;



//import com.sms.student_management.Service.*;
import com.sms.student_management.Entity.*;
import com.sms.student_management.Repository.*;
import org.springframework.stereotype.Service;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    public Enrollment enrollStudent(Student student, ClassSection section) {

        boolean exists = enrollmentRepository
                .existsByStudentIdAndClassSectionId(
                        student.getId(),
                        section.getId()
                );

        if (exists) {
            throw new RuntimeException("Student already enrolled");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setClassSection(section);

        return enrollmentRepository.save(enrollment);
    }
}
