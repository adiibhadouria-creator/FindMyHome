package com.findmyhome;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FindMyHomeApplication {

    public static void main(String[] args) {
        SpringApplication.run(FindMyHomeApplication.class, args);
    }
}
