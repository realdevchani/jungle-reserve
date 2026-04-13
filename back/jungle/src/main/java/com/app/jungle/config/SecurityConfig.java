package com.app.jungle.config;

import com.app.jungle.domain.dto.TokenDTO;
import com.app.jungle.filter.JwtAuthenticationFilter;
import com.app.jungle.handler.JwtAuthenticationEntryPoint;
import com.app.jungle.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final AuthService authService;

    @Value("${cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())      // CSRF 비활성화
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/auth/**", "/api/pin/init", "/api/admin/login").permitAll()
                    .requestMatchers("/ws/**").permitAll()
                    .requestMatchers("/api/**").authenticated()
                    .requestMatchers("/private/**").authenticated()
                    .anyRequest().permitAll()
            )
            .exceptionHandling(exception -> exception
                    .authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .logout(logout -> logout
                    .logoutUrl("/logout")
                    .logoutSuccessHandler((request, response, authentication) -> {
                        HttpSession session = request.getSession(false);
                        if(session != null) {
                            session.invalidate();
                        }

                        // 쿠키를 들고와서 삭제한다
                        Cookie[] cookies = request.getCookies();
                        if(cookies != null){
                            for(Cookie cookie : cookies){
                                log.info("cookie : " + cookie.getName());
                                if(cookie.getName().equals("refreshToken")){
                                    String refreshToken = cookie.getValue();
                                    TokenDTO tokenDTO = new TokenDTO();
                                    tokenDTO.setRefreshToken(refreshToken);
                                    authService.saveBlacklistedToken(tokenDTO);
                                }
                            }
                        }

                        ResponseCookie expiredCookie = ResponseCookie.from("refreshToken", "")
                                        .path("/")
                                        .httpOnly(true)
                                        .maxAge(0)
                                        .build();
                        response.addHeader(HttpHeaders.SET_COOKIE, expiredCookie.toString());
                        response.setContentType("application/json; charset=UTF-8");
                        response.setCharacterEncoding("UTF-8");
                        response.getWriter().write("로그아웃 성공");
                    })
                    .permitAll()
            );

        return http.build();
    }


    // Cors 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        for (String origin : allowedOrigins.split(",")) {
            String trimmed = origin.trim();
            if (trimmed.contains("*")) {
                configuration.addAllowedOriginPattern(trimmed);
            } else {
                configuration.addAllowedOrigin(trimmed);
            }
        }
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
