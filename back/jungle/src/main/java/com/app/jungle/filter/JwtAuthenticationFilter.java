package com.app.jungle.filter;

import com.app.jungle.domain.dto.response.UserResponseDTO;
import com.app.jungle.domain.entity.User;
import com.app.jungle.service.UserService;
import com.app.jungle.util.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// private이 붙어있는 경로는 모두 header에서 토큰을 검증한다.
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserService userService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // /private/** 와 /api/** 경로 모두 JWT 필터 적용
        return !path.startsWith("/private/") && !path.startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        String jwtToken = null;

        if (header != null && header.startsWith("Bearer ")) {
            jwtToken = header.substring(7);
        }

        if (jwtToken != null && jwtTokenUtil.verifyJwtToken(jwtToken) && SecurityContextHolder.getContext().getAuthentication() == null) {
            var claims = jwtTokenUtil.getUserPhoneFromToken(jwtToken);
            if (claims == null) {
                filterChain.doFilter(request, response);
                return;
            }

            String role = claims.get("role", String.class);
            String adminId = claims.get("adminId", String.class);
            String userPhone = claims.get("userPhone", String.class);

            if ("ADMIN".equals(role) || (adminId != null && userPhone == null)) {
                if (adminId != null) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken("ADMIN:" + adminId, null, List.of());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } else if (userPhone != null) {
                Long userId = userService.findUserIdByUserPhone(userPhone);
                User foundUser = userService.findUserById(userId);
                UserResponseDTO userResponseDTO = new UserResponseDTO(foundUser);
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userResponseDTO, null, List.of());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        filterChain.doFilter(request, response);
    }
}
