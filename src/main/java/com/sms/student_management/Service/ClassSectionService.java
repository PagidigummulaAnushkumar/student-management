package com.sms.student_management.Service;



//import com.sms.student_management.Service.*;
import com.sms.student_management.Entity.*;
import com.sms.student_management.Repository.*;
import org.springframework.stereotype.Service;

@Service
public class ClassSectionService {

    private final ClassSectionRepository classSectionRepository;

    public ClassSectionService(ClassSectionRepository classSectionRepository) {
        this.classSectionRepository = classSectionRepository;
    }

    public ClassSection createClassSection(Course course,
                                           Teacher teacher,
                                           String sectionName) {

        ClassSection section = new ClassSection();
        section.setCourse(course);
        section.setTeacher(teacher);
        section.setSectionName(sectionName);

        return classSectionRepository.save(section);
    }
}
