package vn.structlab.api.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.structlab.api.dto.AuthDtos.AuthResponse;
import vn.structlab.api.dto.AuthDtos.LoginRequest;
import vn.structlab.api.dto.AuthDtos.RegisterRequest;
import vn.structlab.api.dto.AuthDtos.UserView;
import vn.structlab.api.exception.ConflictException;
import vn.structlab.api.exception.NotFoundException;
import vn.structlab.api.model.UserAccount;
import vn.structlab.api.repository.UserAccountRepository;

import java.util.Locale;

@Service
public class AuthService {

    private final UserAccountRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserAccountRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Email này đã được sử dụng.");
        }
        UserAccount user = userRepository.save(new UserAccount(
                request.displayName().trim(), email, passwordEncoder.encode(request.password())));
        return response(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        UserAccount user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.email()))
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        return response(user);
    }

    @Transactional(readOnly = true)
    public UserAccount requireUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài khoản."));
    }

    public UserView toView(UserAccount user) {
        return new UserView(user.getId(), user.getDisplayName(), user.getEmail());
    }

    private AuthResponse response(UserAccount user) {
        return new AuthResponse(jwtService.createToken(user), "Bearer",
                jwtService.expiresInSeconds(), toView(user));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
