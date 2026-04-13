# JWT 로그인 구축 가이드

> Spring Boot + JWT + Redis를 이용한 로그인 시스템 구축 순서 가이드
> 프로젝트: jungle-reserve (com.app.jungle)
> 시그니처: userPhone (전화번호 기반 인증)

---

## 📋 구축 순서 (의존성 순서대로)

### 1단계: 기본 설정 (Config)

#### 1-1. `application.yml` - JWT 관련 설정 추가
```yaml
jwt:
  secret: "시크릿키-256비트-이상"
  token-blacklist-prefix: "blacklist:"
  refresh-blacklist-prefix: "refresh:"
```
- `secret`: JWT 서명에 사용할 비밀키
- `token-blacklist-prefix`: 블랙리스트 Redis 키 prefix
- `refresh-blacklist-prefix`: RefreshToken Redis 키 prefix

#### 1-2. `build.gradle` - 필요한 의존성
```gradle
// JWT
implementation 'io.jsonwebtoken:jjwt-api:0.12.3'
implementation 'io.jsonwebtoken:jjwt-impl:0.12.3'
implementation 'io.jsonwebtoken:jjwt-jackson:0.12.3'

// Spring Security
implementation 'org.springframework.boot:spring-boot-starter-security'

// Redis (토큰 저장/블랙리스트)
implementation 'org.springframework.boot:spring-boot-starter-data-redis'
implementation 'org.springframework.boot:spring-boot-starter-cache'
```

#### 1-3. `config/RedisConfig.java` - Redis 설정
```
역할: RedisTemplate 빈 등록 (Key/Value 직렬화 설정)
메서드:
  - redisTemplate(): RedisTemplate<String, String> 빈 생성
```

#### 1-4. `config/CacheConfig.java` - 캐시 설정
```
역할: RedisCacheManager 빈 등록
메서드:
  - cacheManager(): RedisCacheManager 빈 생성 (TTL 10분, JSON 직렬화)
```

#### 1-5. `config/BcryptConfig.java` - 비밀번호 암호화 (선택)
```
역할: PasswordEncoder 빈 등록
메서드:
  - passwordEncoder(): BCryptPasswordEncoder 빈 생성
※ 이 프로젝트는 PIN 번호(4자리)로 인증하므로 Bcrypt 미사용, 하지만 빈은 등록되어 있음
```

---

### 2단계: 도메인 계층 (Domain)

#### 2-1. `domain/entity/User.java` - JPA 엔티티
```
테이블: jungle_user
필드:
  - id (PK, AUTO_INCREMENT)
  - userName (이름)
  - userPinNumber (PIN 4자리, 기본값 "0000")
  - userPhone (전화번호 - JWT 시그니처로 사용)
  - userParentPhone (보호자 전화번호)
  - UserType (enum: normalStudent, majorStudent)
  - UserMajor (enum: vocal, guitar, piano, composition, drum, saxophone)
```

#### 2-2. `domain/dto/TokenDTO.java`
```
역할: 토큰 관련 데이터 전달
필드:
  - userId: Long        → Redis 키에 사용
  - accessToken: String → 액세스 토큰
  - refreshToken: String → 리프레시 토큰
```

#### 2-3. `domain/dto/request/UserLoginRequest.java`
```
역할: 로그인 요청 데이터
필드:
  - userName: String      → 사용자 이름
  - userPinNumber: String → PIN 번호
  - userPhone: String     → 전화번호
```

#### 2-4. `domain/dto/response/ApiResponseDTO.java`
```
역할: 통일된 API 응답 포맷
필드:
  - message: String → 응답 메시지
  - data: T         → 응답 데이터 (제네릭)
정적 메서드:
  - of(message): 메시지만
  - of(message, data): 메시지 + 데이터
```

#### 2-5. `domain/dto/response/UserResponseDTO.java`
```
역할: 사용자 정보 응답 (비밀번호/PIN 제외)
필드:
  - id, userName, userPhone, userParentPhone, userMajor, userType
생성자:
  - UserResponseDTO(User user): Entity → DTO 변환
```

---

### 3단계: 예외 처리 계층 (Exception)

#### 3-1. `exception/UserException.java`
```
역할: 사용자 관련 예외 (BAD_REQUEST 400)
```

#### 3-2. `exception/AuthException.java`
```
역할: 인증 관련 예외 (UNAUTHORIZED 401)
```

#### 3-3. `exception/JwtTokenException.java`
```
역할: JWT 토큰 관련 예외 (UNAUTHORIZED 401)
```

#### 3-4. `exception/GlobalExceptionHandler.java`
```
역할: @RestControllerAdvice로 전역 예외 처리
핸들러:
  - handleMemberException(UserException)     → 400
  - handleAuthException(AuthException)       → 401
  - handleTokenException(JwtTokenException)  → 401
  - handleException(Exception)               → 500

※ import 주의: com.app.jungle.domain.dto.response.ApiResponseDTO 사용
```

---

### 4단계: 유틸리티 계층 (Util)

#### 4-1. `util/JwtTokenUtil.java`
```
역할: JWT 토큰 생성/검증/파싱 유틸리티
설정:
  - @Value("${jwt.secret}") secretKey

메서드:
  1. generateAccessToken(Map<String,String> claims): String
     → claims에서 "userPhone" 추출하여 AccessToken 생성
     → 만료시간: 60일 (개발용, 운영에서는 30분 권장)
     → issuer: "jungle"

  2. generateRefreshToken(Map<String,String> claims): String
     → RefreshToken 생성 (구조 동일, 만료시간 60일)

  3. verifyJwtToken(String token): boolean
     → 토큰 유효성 검증 (만료/변조/잘못된 토큰 처리)

  4. getUserPhoneFromToken(String token): Claims
     → 토큰에서 Claims(페이로드) 추출
     → claims.get("userPhone")으로 전화번호 꺼내기

  5. getTokenExpiry(String token): Long
     → 토큰 남은 시간(ms) 반환
```

---

### 5단계: 리포지토리 계층 (Repository)

#### 5-1. `repository/UserRepository.java`
```
역할: JPA Repository (Spring Data JPA)
메서드:
  - findById(long id): Optional<User>
  - findUserByUserPhone(String userPhone): Optional<User>
  - findUserByUserParentPhone(String userParentPhone): Optional<User>
  - findUserByUserNameAndUserPhoneAndUserPinNumber(
      String userName, String userPhone, String userPinNumber
    ): Optional<User>  ← 로그인에 사용
```

---

### 6단계: 서비스 계층 (Service)

#### 6-1. `service/UserService.java` (인터페이스)
```
메서드:
  - findUserIdByUserPhone(String userPhone): Long
  - findUserById(Long id): User
  - findUsers(): List<User>
  - modifyUser(User user): void
  - registerUsers(List<User> users): void
  - registerUser(User user): void
  - findUserByUserPhone(String userPhone): User
```

#### 6-2. `service/UserServiceImpl.java` (구현체)
```
어노테이션: @Service, @RequiredArgsConstructor, @Transactional
의존성: UserRepository
※ 인터페이스 메서드명은 find 로 통일 (get 사용 X)
```

#### 6-3. `service/AuthService.java` (인터페이스)
```
메서드:
  1. login(UserLoginRequest): Map<String,String>
     → 로그인 성공 시 accessToken + refreshToken 반환

  2. saveRefreshToken(TokenDTO): boolean
     → Redis에 RefreshToken 저장 (키: refresh:{userId}, TTL: 7일)

  3. validateRefreshToken(TokenDTO): boolean
     → Redis에 저장된 RefreshToken과 비교 검증

  4. reissueAccessToken(TokenDTO): String
     → RefreshToken으로 새 AccessToken 발급

  5. revokeRefreshToken(TokenDTO): boolean
     → Redis에서 RefreshToken 삭제 (무효화)

  6. saveBlacklistedToken(TokenDTO): boolean
     → 블랙리스트에 추가 (키: blacklist:{userId}, Set 구조)

  7. isBlackedRefreshToken(TokenDTO): boolean
     → 블랙리스트 여부 확인
```

#### 6-4. `service/AuthServiceImpl.java` (구현체)
```
어노테이션: @Service, @Slf4j, @RequiredArgsConstructor, @Transactional
의존성: UserRepository, JwtTokenUtil, RedisTemplate

@Value 설정:
  - BLACKLIST_TOKEN_PREFIX: "blacklist:"
  - REFRESH_TOKEN_PREFIX: "refresh:"

login 흐름:
  1. 이름 + 전화번호 + PIN으로 회원 조회
  2. 없으면 UserException
  3. claim에 userPhone 넣고 토큰 2개 생성
  4. Redis에 RefreshToken 저장
  5. tokens Map 반환

reissueAccessToken 흐름:
  1. RefreshToken에서 userPhone 추출
  2. 블랙리스트 확인
  3. RefreshToken 유효성 검증
  4. 새 AccessToken 생성 후 반환
```

---

### 7단계: 필터 & 핸들러 (Filter & Handler)

#### 7-1. `handler/JwtAuthenticationEntryPoint.java`
```
역할: 인증 실패 시 401 응답 반환
인터페이스: AuthenticationEntryPoint
의존성: ObjectMapper

동작:
  - /private/** 경로에 토큰 없이 접근 시
  - { message: "토큰 없음 또는 인증 실패", data: null } JSON 반환
```

#### 7-2. `filter/JwtAuthenticationFilter.java`
```
역할: /private/** 경로 요청 시 JWT 토큰 검증
상속: OncePerRequestFilter
의존성: JwtTokenUtil, UserService

동작 흐름:
  1. shouldNotFilter(): /private/로 시작하지 않으면 필터 건너뜀
  2. Authorization 헤더에서 "Bearer " 제거하여 토큰 추출
  3. 토큰에서 userPhone 추출
  4. userPhone으로 사용자 조회
  5. UserResponseDTO로 변환
  6. SecurityContext에 인증 정보 설정
  7. filterChain.doFilter() 계속 진행
```

---

### 8단계: 보안 설정 (Security)

#### 8-1. `config/SecurityConfig.java`
```
역할: Spring Security 전체 설정
의존성: JwtAuthenticationEntryPoint, AuthService

SecurityFilterChain 설정:
  - CORS: localhost:3000 허용
  - CSRF: 비활성화
  - /private/**: 인증 필요
  - 그 외: 모두 허용
  - JwtAuthenticationFilter를 UsernamePasswordAuthenticationFilter 앞에 추가
  - 인증 실패: JwtAuthenticationEntryPoint
  - 로그아웃: /logout 경로
    → 세션 무효화
    → refreshToken 쿠키에서 꺼내서 블랙리스트에 추가
    → 쿠키 만료 처리

※ OAuth2 관련 코드 제거됨 (소셜 로그인 미사용)
```

---

### 9단계: API 컨트롤러 (Controller)

#### 9-1. `api/publicapi/AuthApi.java` - 인증 API (공개)
```
경로: /auth/*

엔드포인트:
  1. POST /auth/login
     → @RequestBody UserLoginRequest
     → 로그인 성공: accessToken(body) + refreshToken(httpOnly cookie)

  2. POST /auth/refresh
     → @CookieValue refreshToken + @RequestBody TokenDTO
     → 새 accessToken 발급
```

#### 9-2. `api/UserApi.java` - 회원 관리 API (공개)
```
경로: /users/*

엔드포인트:
  1. POST /users/register      → 회원 단 건 등록
  2. POST /users/register-all   → 회원 전체 등록 (관리자)
  3. PUT  /users/modify          → 회원 정보 수정
```

#### 9-3. `api/privateapi/UserAuthApi.java` - 인증 필요 API (보호)
```
경로: /private/users/*

엔드포인트:
  1. GET /private/users/me
     → Authentication에서 UserResponseDTO 추출
     → 현재 로그인한 사용자 정보 반환
```

---

## 🔄 로그인 전체 흐름

```
[클라이언트]                          [서버]
    |                                    |
    |-- POST /auth/login ------------->  |
    |   { userName, userPhone,           |
    |     userPinNumber }                |
    |                                    |-- DB에서 회원 조회
    |                                    |-- JWT 토큰 2개 생성
    |                                    |-- Redis에 RefreshToken 저장
    |                                    |
    |  <-- 200 OK --------------------- |
    |  body: { accessToken }             |
    |  cookie: refreshToken (httpOnly)   |
    |                                    |
    |-- GET /private/users/me -------->  |
    |   Header: Authorization:           |
    |   Bearer {accessToken}             |
    |                                    |-- JwtAuthenticationFilter
    |                                    |   1. "Bearer " 제거 (substring 7)
    |                                    |   2. 토큰 검증
    |                                    |   3. userPhone 추출
    |                                    |   4. 사용자 조회
    |                                    |   5. SecurityContext 설정
    |                                    |
    |  <-- 200 OK --------------------- |
    |  body: { id, userName, ... }       |
    |                                    |
    |-- POST /auth/refresh ---------->   |
    |   cookie: refreshToken             |
    |                                    |-- 블랙리스트 확인
    |                                    |-- RefreshToken 검증
    |                                    |-- 새 AccessToken 생성
    |                                    |
    |  <-- 200 OK --------------------- |
    |  body: { accessToken }             |
    |                                    |
    |-- POST /logout ----------------->  |
    |   cookie: refreshToken             |
    |                                    |-- RefreshToken 블랙리스트 추가
    |                                    |-- 세션 무효화
    |                                    |-- 쿠키 만료 처리
    |                                    |
    |  <-- 200 "로그아웃 성공" --------- |
```

---

## 📁 최종 파일 구조

```
src/main/java/com/app/jungle/
├── JungleApplication.java
├── api/
│   ├── UserApi.java                    ← 회원 관리 (공개)
│   ├── publicapi/
│   │   └── AuthApi.java                ← 로그인/토큰재발급 (공개)
│   └── privateapi/
│       └── UserAuthApi.java            ← 내 정보 조회 (인증 필요)
├── config/
│   ├── BcryptConfig.java
│   ├── CacheConfig.java
│   ├── RedisConfig.java
│   └── SecurityConfig.java            ← OAuth2 제거, JWT만
├── domain/
│   ├── dto/
│   │   ├── TokenDTO.java              ← userId로 변경
│   │   ├── request/
│   │   │   └── UserLoginRequest.java  ← @Data 추가
│   │   └── response/
│   │       ├── ApiResponseDTO.java
│   │       └── UserResponseDTO.java
│   ├── entity/
│   │   └── User.java
│   └── enums/user/
│       ├── UserMajor.java
│       └── UserType.java
├── exception/
│   ├── AuthException.java
│   ├── GlobalExceptionHandler.java    ← import 수정
│   ├── JwtTokenException.java
│   └── UserException.java
├── filter/
│   └── JwtAuthenticationFilter.java   ← getUserPhoneFromToken으로 변경
├── handler/
│   └── JwtAuthenticationEntryPoint.java ← 새로 생성
├── repository/
│   └── UserRepository.java
├── service/
│   ├── AuthService.java               ← 메서드 7개로 확장
│   ├── AuthServiceImpl.java           ← 새로 생성
│   ├── UserService.java
│   └── UserServiceImpl.java           ← 구현 완성, 어노테이션 추가
└── util/
    └── JwtTokenUtil.java              ← getUserPhoneFromToken으로 변경
```

---

## ⚠️ 주요 네이밍 규칙

| 구분 | oauth (참고) | jungle-reserve (현재) |
|------|-------------|----------------------|
| 엔티티명 | Member | User |
| 시그니처 | memberEmail | userPhone |
| TokenDTO 키 | memberId | userId |
| 토큰 추출 메서드 | getMemberEmailFromToken | getUserPhoneFromToken |
| Service 조회 메서드 | getMemberById | findUserById |
| 인증 방식 | 이메일 + 비밀번호(Bcrypt) | 이름 + 전화번호 + PIN(4자리) |
| 소셜 로그인 | OAuth2 (Google, Naver, Kakao) | 미사용 |
| DB | Oracle + MyBatis | MySQL + JPA |

---

## 🔑 Redis 키 구조

| 용도 | 키 패턴 | 값 | TTL |
|------|---------|-----|-----|
| RefreshToken 저장 | `refresh:{userId}` | refreshToken 문자열 | 7일 |
| 블랙리스트 | `blacklist:{userId}` | refreshToken Set | 7일 |
