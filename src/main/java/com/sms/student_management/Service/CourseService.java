package com.sms.student_management.Service;


import com.sms.student_management.Entity.*;
import com.sms.student_management.Repository.*;
import org.springframework.stereotype.Service;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course createCourse(String name, String code) {

        if (courseRepository.existsByCode(code)) {
            throw new RuntimeException("Course code already exists");
        }

        Course course = new Course();
        course.setName(name);
        course.setCode(code);

        return courseRepository.save(course);
    }
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }
    
    public Iterable<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course updateCourse(Long id, String name, String code) {
        Course course = getCourseById(id);

        if (!course.getCode().equals(code) && courseRepository.existsByCode(code)) {
            throw new RuntimeException("Course code already exists");
        }

        course.setName(name);
        course.setCode(code);

        return courseRepository.save(course);
    }
    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }
    
}
