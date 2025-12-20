package com.sms.student_management.Service;


import com.sms.student_management.Entity.*;
//import com.sms.student_management.Entity.User.Role;
import com.sms.student_management.Repository.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentService(StudentRepository studentRepository,
                          UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    public Student createStudent(
        String firstName,
        String lastName,
        String email,
        LocalDate dateOfBirth
) {

    // 1️⃣ Validate unique email
    if (studentRepository.existsByEmail(email)) {
        throw new RuntimeException("Student with this email already exists");
    }

    // 2️⃣ Create student object
    Student student = new Student();
    student.setFirstName(firstName);
    student.setLastName(lastName);
    student.setEmail(email);
    student.setDateOfBirth(dateOfBirth);

    // 3️⃣ Set system-managed fields
    student.setEnrollmentDate(LocalDateTime.now());


    // 4️⃣ Save to DB
    return studentRepository.save(student);
}
// public Student updateStudent(
//         Long id,
//         String firstName,
//         String lastName,
//         String email,
//         LocalDate dateOfBirth) {

//     Student student = studentRepository.findById(id)
//             .orElseThrow(() -> new RuntimeException("Student not found"));

//     student.setFirstName(firstName);
//     student.setLastName(lastName);
//     student.setEmail(email);
//     student.setDateOfBirth(dateOfBirth);

//     return studentRepository.save(student);
// }

// In StudentService.java


// In StudentService.java

public Student updateStudent(Long id, Student updatedDetails) {
    // 1. Find the existing student
    Student existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

    // 2. Update ONLY if the new value is NOT null
    if (updatedDetails.getFirstName() != null) {
        existingStudent.setFirstName(updatedDetails.getFirstName());
    }
    
    if (updatedDetails.getLastName() != null) {
        existingStudent.setLastName(updatedDetails.getLastName());
    }
    
    if (updatedDetails.getEmail() != null) {
        // Optional: Check if the new email is already taken by ANOTHER student
        existingStudent.setEmail(updatedDetails.getEmail());
    }
    
    if (updatedDetails.getDateOfBirth() != null) {
        existingStudent.setDateOfBirth(updatedDetails.getDateOfBirth());
    }
    
   

    // 3. Save back to database
    return studentRepository.save(existingStudent);
}


// In StudentService.java

public Student patchStudent(Long id, Student partialUpdate) {
    // 1. Find the existing student
    Student existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

    // 2. Update ONLY the fields that are not null
    if (partialUpdate.getFirstName() != null) {
        existingStudent.setFirstName(partialUpdate.getFirstName());
    }
    if (partialUpdate.getLastName() != null) {
        existingStudent.setLastName(partialUpdate.getLastName());
    }
    if (partialUpdate.getEmail() != null) {
        existingStudent.setEmail(partialUpdate.getEmail());
    }
    if (partialUpdate.getDateOfBirth() != null) {
        existingStudent.setDateOfBirth(partialUpdate.getDateOfBirth());
    }
 
    // 3. Save and return
    return studentRepository.save(existingStudent);
}
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
    public Iterable<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
    

    public Student updateStudent(Long id, String email, String password, String studentNumber) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateStudent'");
    }

    
}
