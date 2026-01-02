package com.sms.student_management.Service;



//import com.sms.student_management.Service.*;
import com.sms.student_management.Entity.*;
import com.sms.student_management.Repository.*;
import org.springframework.stereotype.Service;

// @Service
// public class ClassSectionService {

//     private final ClassSectionRepository classSectionRepository;

//     public ClassSectionService(ClassSectionRepository classSectionRepository) {
//         this.classSectionRepository = classSectionRepository;
//     }

//     public ClassSection createClassSection(Long courseId,
//                                            Long teacherId,
//                                            String sectionName) {

//         ClassSection section = new ClassSection();
//         section.setCourse(courseId);
//         section.setTeacher(teacherId);
//         section.setSectionName(sectionName);

//         return classSectionRepository.save(section);
//     }
// }

@Service
public class ClassSectionService {

    private final ClassSectionRepository classSectionRepository;
    private final CourseRepository courseRepository;   // <--- Add this
    private final TeacherRepository teacherRepository; // <--- Add this

    // Constructor Injection
    public ClassSectionService(ClassSectionRepository classSectionRepository,
                               CourseRepository courseRepository,
                               TeacherRepository teacherRepository) {
        this.classSectionRepository = classSectionRepository;
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
    }

    public ClassSection createClassSection(Long courseId, 
                                           Long teacherId, 
                                           String sectionName) {

        // 1. Fetch the full Course object from the DB
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        // 2. Fetch the full Teacher object from the DB
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teacherId));

        // 3. Create the section and link the Objects (not IDs)
        ClassSection section = new ClassSection();
        section.setCourse(course);   // Now passing a 'Course' object
        section.setTeacher(teacher); // Now passing a 'Teacher' object
        section.setSectionName(sectionName);

        return classSectionRepository.save(section);
    }
    public Iterable<ClassSection> getAllClassSections() {
        return classSectionRepository.findAll();
    }
    public ClassSection getClassSectionById(Long id) {
        return classSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ClassSection not found with ID: " + id));
    }
    public void deleteClassSection(Long id) {
        classSectionRepository.deleteById(id);
    }
    public ClassSection updateClassSection(Long id,
                                           Long courseId,
                                           Long teacherId,
                                           String sectionName) {

        ClassSection existingSection = classSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ClassSection not found with ID: " + id));

        // Fetch the full Course object from the DB
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        // Fetch the full Teacher object from the DB
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teacherId));
        existingSection.setCourse(course);   // Now passing a 'Course' object
        existingSection.setTeacher(teacher); // Now passing a 'Teacher' object
        existingSection.setSectionName(sectionName);
        return classSectionRepository.save(existingSection);
}


}