package com.sms.student_management.Service;

import com.sms.student_management.Entity.*;
import com.sms.student_management.Repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ParentServiceTest {

    @Mock
    private ParentRepository parentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ClassSectionRepository classSectionRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private ParentService parentService;

    private User parentUser;
    private Parent parent;
    private Student student;
    private ClassSection classSection;

    @BeforeEach
    void setUp() {
        parentUser = new User();
        parentUser.setId(1L);
        parentUser.setEmail("parent@test.com");
        parentUser.setPasswordHash("hash");
        parentUser.setRole(User.Role.PARENT);

        parent = new Parent();
        parent.setId(1L);
        parent.setUser(parentUser);
        parent.setStudents(new ArrayList<>());

        student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");
        student.setEmail("john@test.com");

        Teacher teacher = new Teacher();
        teacher.setId(1L);

        Course course = new Course();
        course.setId(1L);
        course.setName("Math");
        course.setCode("MATH101");

        classSection = new ClassSection();
        classSection.setId(1L);
        classSection.setCourse(course);
        classSection.setTeacher(teacher);
        classSection.setSectionName("Section A");
    }

    @Test
    void createParent_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(parentUser));
        when(parentRepository.save(any(Parent.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Parent result = parentService.createParent(1L);

        assertNotNull(result);
        assertEquals(parentUser, result.getUser());
        verify(parentRepository).save(any(Parent.class));
    }

    @Test
    void createParent_UserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> parentService.createParent(99L));
    }

    @Test
    void getChildren_Success() {
        parent.getStudents().add(student);
        when(parentRepository.findById(1L)).thenReturn(Optional.of(parent));

        List<Student> children = parentService.getChildren(1L);

        assertEquals(1, children.size());
        assertEquals("John", children.get(0).getFirstName());
    }

    @Test
    void addChild_Success() {
        when(parentRepository.findById(1L)).thenReturn(Optional.of(parent));
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(parentRepository.save(any(Parent.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Parent result = parentService.addChild(1L, 1L);

        assertEquals(1, result.getStudents().size());
        assertEquals(student, result.getStudents().get(0));
    }

    @Test
    void addChild_AlreadyLinked() {
        parent.getStudents().add(student);
        when(parentRepository.findById(1L)).thenReturn(Optional.of(parent));
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        assertThrows(IllegalStateException.class, () -> parentService.addChild(1L, 1L));
    }

    @Test
    void addChild_StudentNotFound() {
        when(parentRepository.findById(1L)).thenReturn(Optional.of(parent));
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> parentService.addChild(1L, 99L));
    }

    @Test
    void removeChild_Success() {
        parent.getStudents().add(student);
        when(parentRepository.findById(1L)).thenReturn(Optional.of(parent));
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(parentRepository.save(any(Parent.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Parent result = parentService.removeChild(1L, 1L);

        assertTrue(result.getStudents().isEmpty());
    }

    @Test
    void removeChild_NotLinked() {
        when(parentRepository.findById(1L)).thenReturn(Optional.of(parent));
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        assertThrows(IllegalStateException.class, () -> parentService.removeChild(1L, 1L));
    }

    @Test
    void enrollChild_Success() {
        parent.getStudents().add(student);
        when(parentRepository.findById(1L)).thenReturn(Optional.of(parent));
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(classSectionRepository.findById(1L)).thenReturn(Optional.of(classSection));
        when(enrollmentRepository.existsByStudent_IdAndClassSection_Id(1L, 1L)).thenReturn(false);
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(invocation -> {
            Enrollment e = invocation.getArgument(0);
            e.setId(1L);
            return e;
        });

        Enrollment result = parentService.enrollChild(1L, 1L, 1L, "ACTIVE");

        assertNotNull(result);
        assertEquals(student, result.getStudent());
        assertEquals(classSection, result.getClassSection());
        assertEquals("ACTIVE", result.getStatus());
    }

    @Test
    void enrollChild_NotParentsChild() {
        // parent has no children linked
        when(parentRepository.findById(1L)).thenReturn(Optional.of(parent));

        assertThrows(IllegalArgumentException.class, () -> parentService.enrollChild(1L, 1L, 1L, "ACTIVE"));
    }

    @Test
    void enrollChild_AlreadyEnrolled() {
        parent.getStudents().add(student);
        when(parentRepository.findById(1L)).thenReturn(Optional.of(parent));
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(classSectionRepository.findById(1L)).thenReturn(Optional.of(classSection));
        when(enrollmentRepository.existsByStudent_IdAndClassSection_Id(1L, 1L)).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> parentService.enrollChild(1L, 1L, 1L, "ACTIVE"));
    }

    @Test
    void enrollChild_DefaultStatus() {
        parent.getStudents().add(student);
        when(parentRepository.findById(1L)).thenReturn(Optional.of(parent));
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(classSectionRepository.findById(1L)).thenReturn(Optional.of(classSection));
        when(enrollmentRepository.existsByStudent_IdAndClassSection_Id(1L, 1L)).thenReturn(false);
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Enrollment result = parentService.enrollChild(1L, 1L, 1L, null);

        assertEquals("ACTIVE", result.getStatus());
    }
}
