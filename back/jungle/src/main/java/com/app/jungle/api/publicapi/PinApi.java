package com.app.jungle.api.publicapi;

import com.app.jungle.domain.dto.request.PinInitRequest;
import com.app.jungle.domain.dto.response.ApiResponseDTO;
import com.app.jungle.domain.entity.User;
import com.app.jungle.exception.UserException;
import com.app.jungle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pin")
@Profile("user")
public class PinApi {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/init")
    public ResponseEntity<ApiResponseDTO> initPin(@RequestBody PinInitRequest request) {
        User user = userRepository.findUserByUserNameAndUserPhone(request.getUserName(), request.getUserPhone())
                .orElseThrow(() -> new UserException("사용자를 찾을 수 없습니다."));

        if (user.getUserPinInitialized()) {
            throw new UserException("이미 PIN이 설정되어 있습니다.");
        }

        if (request.getUserPinNumber() == null || request.getUserPinNumber().length() != 4) {
            throw new UserException("PIN은 4자리를 입력해주세요.");
        }

        String encoded = passwordEncoder.encode(request.getUserPinNumber());
        user.changePinNumber(encoded);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponseDTO.of("PIN이 설정되었습니다."));
    }
}
