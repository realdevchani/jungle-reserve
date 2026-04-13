package com.app.jungle.domain.dto.response;

import com.app.jungle.domain.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {

    private Long id;
    private String userName;
    private String userPhone;
    private Integer totalPracticeMinutes;
    private Boolean pinInitialized;

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.userName = user.getUserName();
        this.userPhone = user.getUserPhone();
        this.totalPracticeMinutes = user.getUserTotalPracticeMinutes();
        this.pinInitialized = user.getUserPinInitialized();
    }
}
