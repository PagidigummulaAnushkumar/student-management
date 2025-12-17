package com.sms.student_management.Service;

//package com.sms.student_management.Service;

import com.sms.student_management.Entity.*;
import com.sms.student_management.Entity.User.Role;
import com.sms.student_management.Repository.*;
//import com.sms.student_management.Repository.*;
import org.springframework.stereotype.Service;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    public TeacherService(TeacherRepository teacherRepository,
                          UserRepository userRepository) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
    }

    public Teacher createTeacher(String email, String password) {

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(password);
        user.setRole(Role.TEACHER);

        userRepository.save(user);

        Teacher teacher = new Teacher();
        teacher.setUser(user);

        return teacherRepository.save(teacher);
    }
}
