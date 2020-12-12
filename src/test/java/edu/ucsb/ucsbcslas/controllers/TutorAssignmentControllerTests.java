package edu.ucsb.ucsbcslas.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.Map;
import java.util.HashMap;
import java.util.HashSet;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ucsb.ucsbcslas.advice.AuthControllerAdvice;
import edu.ucsb.ucsbcslas.entities.TutorAssignment;
import edu.ucsb.ucsbcslas.repositories.TutorAssignmentRepository;

import edu.ucsb.ucsbcslas.entities.AppUser;
import edu.ucsb.ucsbcslas.entities.Tutor;
import edu.ucsb.ucsbcslas.repositories.TutorRepository;
import jdk.jfr.Timestamp;
import edu.ucsb.ucsbcslas.models.Course;
import edu.ucsb.ucsbcslas.repositories.CourseRepository;

@WebMvcTest(value = TutorAssignmentController.class)
@WithMockUser
public class TutorAssignmentControllerTests {
    @Autowired
    private MockMvc mockMvc;
  
    @Autowired
    private ObjectMapper objectMapper;
  
    @MockBean
    TutorAssignmentRepository mockTutorAssignmentRepository;

    @MockBean
    CourseRepository mockCourseRepository;

    @MockBean
    TutorRepository mockTutorRepository;
    
    @MockBean
    AuthControllerAdvice mockAuthControllerAdvice;
  
    private String userToken() {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.MkiS50WhvOFwrwxQzd5Kp3VzkQUZhvex3kQv-CLeS3M";
    }

    @Test
    public void testGetTutorAssignments_Admin() throws Exception {
      List<TutorAssignment> expectedTutorAssignments = new ArrayList<TutorAssignment>();
      Course c = new Course(1L, "course 1", "F20", "fname", "lname", "email");
      Tutor t = new Tutor(1L, "Seth", "VanB", "vanbrocklin@ucsb.edu");
      expectedTutorAssignments.add(new TutorAssignment(1L, c, t, "TA"));
      when(mockTutorAssignmentRepository.findAll()).thenReturn(expectedTutorAssignments);
      when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(true);
      MvcResult response = mockMvc.perform(get("/api/member/tutorAssignments").contentType("application/json")
          .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isOk()).andReturn();
  
      verify(mockTutorAssignmentRepository, times(1)).findAll();
  
      String responseString = response.getResponse().getContentAsString();
      List<TutorAssignment> actualTutorAssignments = objectMapper.readValue(responseString, new TypeReference<List<TutorAssignment>>() {
      });
      assertEquals(actualTutorAssignments, expectedTutorAssignments);
    }

    @Test
    public void testGetTutorAssignments_Admin_notFound() throws Exception {
      List<TutorAssignment> expectedTutorAssignments = new ArrayList<TutorAssignment>();
      when(mockTutorAssignmentRepository.findAll()).thenReturn(expectedTutorAssignments);
      when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(true);
     mockMvc.perform(get("/api/member/tutorAssignments").contentType("application/json")
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isNotFound());
    }

    @Test
    public void testGetTutorAssignments_Instructor() throws Exception {
      List<TutorAssignment> expectedTutorAssignments = new ArrayList<TutorAssignment>();
      Course c = new Course(1L, "course 1", "F20", "fname", "lname", "email");
      Tutor t = new Tutor();
      List<Course> expectedTutorAssignmentss = new ArrayList<Course>();
      expectedTutorAssignmentss.add(c);
      expectedTutorAssignments.add(new TutorAssignment(1L, c, t, "TA"));
      AppUser user = new AppUser(1L, "email", "Seth", "VanB");
      when(mockAuthControllerAdvice.getUser(anyString())).thenReturn(user);
      when(mockTutorAssignmentRepository.findAllByCourse(c)).thenReturn(expectedTutorAssignments);
      when(mockCourseRepository.findAllByInstructorEmail("email")).thenReturn(expectedTutorAssignmentss);
      when(mockCourseRepository.findById(1L)).thenReturn(Optional.of(c));
      when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(false);
      MvcResult response = mockMvc.perform(get("/api/member/tutorAssignments").contentType("application/json")
          .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isOk()).andReturn();
  
      verify(mockTutorAssignmentRepository, times(1)).findAllByCourse(c);
      verify(mockCourseRepository, times(1)).findAllByInstructorEmail(anyString());
      verify(mockCourseRepository, times(1)).findById(1L);
  
      String responseString = response.getResponse().getContentAsString();
      List<TutorAssignment> actualTutorAssignments = objectMapper.readValue(responseString, new TypeReference<List<TutorAssignment>>() {
      });
      assertEquals(actualTutorAssignments, expectedTutorAssignments);
    }

    @Test
    public void testGetTutorAssignments_Instructor_notFound() throws Exception {
        List<TutorAssignment> expectedTutorAssignments = new ArrayList<TutorAssignment>();
        Course c = new Course(1L, "course 1", "F20", "fname", "lname", "email");
        List<Course> expectedTutorAssignmentss = new ArrayList<Course>();
        expectedTutorAssignmentss.add(c);
        AppUser user = new AppUser(1L, "email", "Seth", "VanB");
        when(mockAuthControllerAdvice.getUser(anyString())).thenReturn(user);
        when(mockTutorAssignmentRepository.findAllByCourse(c)).thenReturn(expectedTutorAssignments);
        when(mockCourseRepository.findAllByInstructorEmail("email")).thenReturn(expectedTutorAssignmentss);
        when(mockCourseRepository.findById(1L)).thenReturn(Optional.of(c));
        when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(false);
        mockMvc.perform(get("/api/member/tutorAssignments").contentType("application/json")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isNotFound());
    }

    @Test
    public void testGetTutorAssignments_Instructor_NotPresent() throws Exception {
        Course c = new Course(1L, "course 1", "F20", "fname", "lname", "email");
        List<Course> expectedTutorAssignmentss = new ArrayList<Course>();
        expectedTutorAssignmentss.add(c);
        AppUser user = new AppUser(1L, "email", "Seth", "VanB");
        when(mockAuthControllerAdvice.getUser(anyString())).thenReturn(user);
        when(mockCourseRepository.findAllByInstructorEmail("email")).thenReturn(expectedTutorAssignmentss);
        when(mockCourseRepository.findById(1L)).thenReturn(Optional.empty());
        when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(false);
        when(mockAuthControllerAdvice.getIsMember(anyString())).thenReturn(false);
        mockMvc.perform(get("/api/member/tutorAssignments").contentType("application/json")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isNotFound());
    }

    @Test
    public void testGetTutorAssignments_Member() throws Exception {
        List<TutorAssignment> expectedTutorAssignments = new ArrayList<TutorAssignment>();
        List<Course> expectedTutorAssignmentss = new ArrayList<Course>();
        Course c = new Course(1L, "course 1", "F20", "fname", "lname", "email");
        Tutor t = new Tutor(1L, "Seth", "VanB", "vanbrocklin@ucsb.edu");
        expectedTutorAssignments.add(new TutorAssignment(1L, c, t, "TA"));
        AppUser user = new AppUser(1L, "email", "Seth", "VanB");
        when(mockAuthControllerAdvice.getUser(anyString())).thenReturn(user);
        when(mockTutorAssignmentRepository.findAllByTutor(t)).thenReturn(expectedTutorAssignments);
        when(mockCourseRepository.findAllByInstructorEmail("email")).thenReturn(expectedTutorAssignmentss);
        when(mockTutorRepository.findByEmail("email")).thenReturn(Optional.of(t));
        when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(false);
        when(mockAuthControllerAdvice.getIsMember(anyString())).thenReturn(true);
        MvcResult response = mockMvc.perform(get("/api/member/tutorAssignments").contentType("application/json")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isOk()).andReturn();
    
        verify(mockTutorAssignmentRepository, times(1)).findAllByTutor(t);
        verify(mockCourseRepository, times(1)).findAllByInstructorEmail(anyString());
        verify(mockTutorRepository, times(1)).findByEmail("email");
    
        String responseString = response.getResponse().getContentAsString();
        List<TutorAssignment> actualTutorAssignments = objectMapper.readValue(responseString, new TypeReference<List<TutorAssignment>>() {
        });
        assertEquals(actualTutorAssignments, expectedTutorAssignments);
    }

    @Test
    public void testGetTutorAssignments_Member_notFound() throws Exception {
        List<TutorAssignment> expectedTutorAssignments = new ArrayList<TutorAssignment>();
        List<Course> expectedTutorAssignmentss = new ArrayList<Course>();
        Tutor t = new Tutor(1L, "Seth", "VanB", "vanbrocklin@ucsb.edu");
        AppUser user = new AppUser(1L, "email", "Seth", "VanB");
        when(mockAuthControllerAdvice.getUser(anyString())).thenReturn(user);
        when(mockTutorAssignmentRepository.findAllByTutor(t)).thenReturn(expectedTutorAssignments);
        when(mockCourseRepository.findAllByInstructorEmail("email")).thenReturn(expectedTutorAssignmentss);
        when(mockTutorRepository.findByEmail("email")).thenReturn(Optional.of(t));
        when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(false);
        when(mockAuthControllerAdvice.getIsMember(anyString())).thenReturn(true);
        mockMvc.perform(get("/api/member/tutorAssignments").contentType("application/json")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isNotFound());
    }

    @Test
    public void testGetTutorAssignments_Member_NotPresent() throws Exception {
        List<Course> expectedTutorAssignmentss = new ArrayList<Course>();
        AppUser user = new AppUser(1L, "email", "Seth", "VanB");
        when(mockAuthControllerAdvice.getUser(anyString())).thenReturn(user);
        when(mockCourseRepository.findAllByInstructorEmail("email")).thenReturn(expectedTutorAssignmentss);
        when(mockTutorRepository.findByEmail("email")).thenReturn(Optional.empty());
        when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(false);
        when(mockAuthControllerAdvice.getIsMember(anyString())).thenReturn(true);
        mockMvc.perform(get("/api/member/tutorAssignments").contentType("application/json")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isNotFound());
    }

    @Test
    public void testGetTutorAssignments_Unauthorized() throws Exception {
        List<Course> expectedTutorAssignmentss = new ArrayList<Course>();
        AppUser user = new AppUser(1L, "email", "Seth", "VanB");
        when(mockAuthControllerAdvice.getUser(anyString())).thenReturn(user);
        when(mockCourseRepository.findAllByInstructorEmail("email")).thenReturn(expectedTutorAssignmentss);
        when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(false);
        when(mockAuthControllerAdvice.getIsMember(anyString())).thenReturn(false);
        mockMvc.perform(get("/api/member/tutorAssignments").contentType("application/json")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isUnauthorized());
    }

    @Test
    public void testSaveTutorAssignment_Unauthorized() throws Exception {
        List<Course> expectedTutorAssignmentss = new ArrayList<Course>();
        String requestBody = "{tutorEmail: 'scottpchow@ucsb.edu', course:  {name: 'CMPSC 148', id: '2', quarter: '20203',"
            + "instructorFirstName: 'Chandra', instructorLastName: 'Krintz', instructorEmail: 'krintz@example.org'}, assignmentType: 'TA'}";
        AppUser user = new AppUser(1L, "email", "Seth", "VanB");
        when(mockAuthControllerAdvice.getUser(anyString())).thenReturn(user);
        when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(false);
        when(mockCourseRepository.findAllByInstructorEmail("email")).thenReturn(expectedTutorAssignmentss);
        mockMvc.perform(post("/api/member/tutorAssignments").with(csrf()).contentType(MediaType.APPLICATION_JSON).characterEncoding("utf-8")
            .content(requestBody).header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isUnauthorized());
    }

    @Test
    public void testSaveTutorAssignment_BadRequest() throws Exception {
        String requestBody = "{tutorEmail: 'scottpchow@ucsb.edu', course:  {name: 'CMPSC 148', id: '2', quarter: '20203', "
            +"instructorFirstName: 'Chandra', instructorLastName: 'Krintz', instructorEmail: 'krintz@example.org'}, assignmentType: 'TA'}";
        when(mockTutorRepository.findByEmail("scottpchow@ucsb.edu")).thenReturn(Optional.empty());
        when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(true);
        mockMvc.perform(post("/api/member/tutorAssignments").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("utf-8").content(requestBody).header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken()))
            .andExpect(status().isBadRequest());
    }

    @Test
    public void testSaveTutorAssignment_Admin() throws Exception {
        Course c = new Course(2L, "CMPSC 148", "20203", "Chandra", "Krintz", "krintz@example.org");
        Tutor t = new Tutor(1L, "Scott", "Chow", "scottpchow@ucsb.edu");
        TutorAssignment expectedTutorAssignment = new TutorAssignment(null, c, t, "TA");
        String requestBody = "{tutorEmail: 'scottpchow@ucsb.edu', course:  {name: 'CMPSC 148', id: '2', quarter: '20203',"+ 
            "instructorFirstName: 'Chandra', instructorLastName: 'Krintz', instructorEmail: 'krintz@example.org'}, assignmentType: 'TA'}";
        when(mockTutorRepository.findByEmail("scottpchow@ucsb.edu")).thenReturn(Optional.of(t));
        when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(true);
        when(mockTutorAssignmentRepository.save(any())).thenReturn(expectedTutorAssignment);
        MvcResult response = mockMvc
            .perform(post("/api/member/tutorAssignments").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("utf-8").content(requestBody).header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken()))
            .andExpect(status().isOk()).andReturn();
    
        verify(mockTutorAssignmentRepository, times(1)).save(expectedTutorAssignment);
    
        String responseString = response.getResponse().getContentAsString();
        TutorAssignment actualTutorAssignment = objectMapper.readValue(responseString, TutorAssignment.class);
        assertEquals(actualTutorAssignment, expectedTutorAssignment);
    }

    @Test
    public void testSaveTutorAssignment_Instructor() throws Exception {
        List<Course> expectedTutorAssignmentss = new ArrayList<Course>();
        Course c = new Course(2L, "CMPSC 148", "20203", "Chandra", "Krintz", "krintz@example.org");
        expectedTutorAssignmentss.add(c);
        Tutor t = new Tutor(1L, "Scott", "Chow", "scottpchow@ucsb.edu");
        TutorAssignment expectedTutorAssignment = new TutorAssignment(null, c, t, "TA");
        String requestBody = "{tutorEmail: 'scottpchow@ucsb.edu', course:  {name: 'CMPSC 148', id: '2', quarter: '20203',"+ 
            "instructorFirstName: 'Chandra', instructorLastName: 'Krintz', instructorEmail: 'krintz@example.org'}, assignmentType: 'TA'}";
        AppUser user = new AppUser(1L, "email", "Seth", "VanB");
        when(mockAuthControllerAdvice.getUser(anyString())).thenReturn(user);
        when(mockCourseRepository.findAllByInstructorEmail("email")).thenReturn(expectedTutorAssignmentss);
        when(mockTutorRepository.findByEmail("scottpchow@ucsb.edu")).thenReturn(Optional.of(t));
        when(mockAuthControllerAdvice.getIsAdmin(anyString())).thenReturn(false);
        when(mockTutorAssignmentRepository.save(any())).thenReturn(expectedTutorAssignment);
        MvcResult response = mockMvc
            .perform(post("/api/member/tutorAssignments").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("utf-8").content(requestBody).header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken()))
            .andExpect(status().isOk()).andReturn();
    
        verify(mockTutorAssignmentRepository, times(1)).save(expectedTutorAssignment);
    
        String responseString = response.getResponse().getContentAsString();
        TutorAssignment actualTutorAssignment = objectMapper.readValue(responseString, TutorAssignment.class);
        assertEquals(actualTutorAssignment, expectedTutorAssignment);
    }

    @Test
    public void testGetTutorAssignmentByCourseID() throws Exception{
        List<TutorAssignment> expectedTutorAssignments = new ArrayList<TutorAssignment>();
        Course c = new Course(1L, "course 1", "F20", "fname", "lname", "email");
        Tutor t = new Tutor(1L, "Seth", "VanB", "vanbrocklin@ucsb.edu");
        expectedTutorAssignments.add(new TutorAssignment(1L, c, t, "TA"));
         // mockito is the library that allows us to do this when stuf
         when(mockTutorAssignmentRepository.findAllByCourseId(1L)).thenReturn((expectedTutorAssignments));
         MvcResult response = mockMvc.perform(get("/api/public/tutorAssignment/1").contentType("application/json")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isOk()).andReturn();
        
            verify(mockTutorAssignmentRepository, times(1)).findAllByCourseId(1L);
        
            String responseString = response.getResponse().getContentAsString();
            List<TutorAssignment> actualTA = objectMapper.readValue(responseString, new TypeReference<List<TutorAssignment>>(){});
            assertEquals(actualTA, expectedTutorAssignments);

    }

    @Test
    public void testGetCourse() throws Exception{
        List<TutorAssignment> expectedTutorAssignment =new ArrayList<TutorAssignment>();
        List<TutorAssignment> resultingTutorAssignment =new ArrayList<TutorAssignment>();
        Course c1= new Course(1L, "course 1", "F20", "fname", "lname", "email");
        Course c2 = new Course(2L, "course 2", "S20", "fname", "lname", "email");
        Tutor t1 = new Tutor(1L, "Seth", "VanB", "vanbrocklin@ucsb.edu");
        Tutor t2 = new Tutor(2L, "Au", "Go", "AuGo@ucsb.edu");
        resultingTutorAssignment.add(new TutorAssignment(1L,c1,t1,"TA"));
        resultingTutorAssignment.add(new TutorAssignment(2L, c2,t2,"TA"));    
        

        expectedTutorAssignment.add(new TutorAssignment(1L,c1,t1,"TA"));

        when(mockTutorAssignmentRepository.findAll()).thenReturn((resultingTutorAssignment));
        MvcResult response = mockMvc.perform(get("/api/public/tutorAssignment/byCourseNumber/course 1").contentType("application/json")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isOk()).andReturn();    
        verify(mockTutorAssignmentRepository, times(1)).findAll();
        //for in list get name course                                                                          
        //for loop                                                                                    
        String responseString = response.getResponse().getContentAsString();
        List<TutorAssignment> actualTutorAssignment = objectMapper.readValue(responseString, new TypeReference<List<TutorAssignment>>(){});
        assertEquals(actualTutorAssignment, expectedTutorAssignment);
  }

    
    @Test
    public void testGetCourseNumbers() throws Exception {
        List<Course> expectedCourses = new ArrayList<Course>();
        Course c = new Course(2L, "CMPSC 148", "20203", "Chandra", "Krintz", "krintz@example.org");
        expectedCourses.add(c);
        Tutor t = new Tutor(1L, "Scott", "Chow", "scottpchow@ucsb.edu");
        TutorAssignment ta = new TutorAssignment(null, c, t, "TA");
        List<TutorAssignment> expectedTutorAssignment = new ArrayList<TutorAssignment>();
        expectedTutorAssignment.add(ta);
        Set<String> expectedCourseNumbers = new HashSet<String>();
        expectedCourseNumbers.add(ta.getCourse().getName());

        when(mockTutorAssignmentRepository.findAll()).thenReturn((expectedTutorAssignment));
        MvcResult response = mockMvc.perform(get("/api/public/tutorAssignment/course_numbers").contentType("application/json")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken())).andExpect(status().isOk()).andReturn();

        verify(mockTutorAssignmentRepository, times(1)).findAll();

        String responseString = response.getResponse().getContentAsString();
        Set<String> actualCourseNumber = objectMapper.readValue(responseString, new TypeReference<Set<String>>(){});
        assertEquals(actualCourseNumber, expectedCourseNumbers);
    }
}
