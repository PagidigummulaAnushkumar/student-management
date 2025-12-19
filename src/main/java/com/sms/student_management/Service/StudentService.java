package com.sms.student_management.Service;


import com.sms.student_management.Entity.*;
import com.sms.student_management.Entity.User.Role;
import com.sms.student_management.Repository.*;
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

    public Student createStudent(String email, String password, String studentNumber) {

        if (studentRepository.existsByStudentNumber(studentNumber)) {
            throw new RuntimeException("Student number already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(password);
        user.setRole(Role.STUDENT);

        userRepository.save(user);

        Student student = new Student();
        student.setStudentNumber(studentNumber);
        student.setUser(user);

        return studentRepository.save(student);
    }

    public Student getStudentById(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getStudentById'");
    }

    public Student updateStudent(Long id, String email, String password, String studentNumber) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateStudent'");
    }

    public Iterable<Student> getAllStudents() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllStudents'");
    }
}
