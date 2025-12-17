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
}
