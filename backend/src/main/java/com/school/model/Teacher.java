package com.school.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "teachers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String designation;
    private String subject;
    private String qualification;
    private String phone;
    private String email;
    private String photoUrl;
    private String section; // "pre-primary", "primary", "upper-primary"
    private Integer joiningYear;
}
