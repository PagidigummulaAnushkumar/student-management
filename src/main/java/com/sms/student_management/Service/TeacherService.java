package com.sms.student_management.Service;

//package com.sms.student_management.Service;

import com.sms.student_management.Entity.*;
//import com.sms.student_management.Entity.User.Role;
import com.sms.student_management.Repository.*;

import java.util.Map;

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


       

      public Teacher createTeacher(Long user_id,
                                 String employeeNumber,
                                 String specialization) {

        if (teacherRepository.existsByEmployeeNumber(employeeNumber)) {
            throw new RuntimeException("Employee number already exists");
        }

        User user = userRepository.findById(user_id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setEmployeeNumber(employeeNumber);
        teacher.setSpecialization(specialization);

        return teacherRepository.save(teacher);
    }

    // read all teachers
    public Iterable<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    // find teacher by id
    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
    }
    
    // update teacher by id
      public Teacher updateTeacher(Long id,
                                 String employeeNumber,
                                 String specialization) {

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        //Teacher teacher = getTeacherById(id);
        teacher.setEmployeeNumber(employeeNumber);
        teacher.setSpecialization(specialization);

        return teacherRepository.save(teacher);
    }

    // patch teacher by id
      public Teacher patchTeacher(Long id, Map<String, Object> payload) {

    Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Teacher not found"));

    if (payload.containsKey("employeeNumber")) {
        teacher.setEmployeeNumber(
                payload.get("employeeNumber").toString()
        );
    }

    if (payload.containsKey("specialization")) {
        teacher.setSpecialization(
                payload.get("specialization").toString()
        );
    }

    return teacherRepository.save(teacher);
}

    // delete teacher by id
    public void deleteTeacher(Long id) {    
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        teacherRepository.delete(teacher);
        userRepository.delete(teacher.getUser());
    }
    

}
