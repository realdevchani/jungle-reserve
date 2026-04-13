package com.app.jungle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JungleApplication {

    public static void main(String[] args) {
        SpringApplication.run(JungleApplication.class, args);
    }

}
