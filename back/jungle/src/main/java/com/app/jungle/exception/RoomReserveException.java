package com.app.jungle.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class RoomReserveException extends RuntimeException {
    public RoomReserveException(String message) {
        super(message);
    }
}
