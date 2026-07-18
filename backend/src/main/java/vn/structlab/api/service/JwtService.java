package vn.structlab.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;
import vn.structlab.api.model.UserAccount;

import java.time.Duration;
import java.time.Instant;

@Service
public class JwtService {

    private final JwtEncoder encoder;
    private final Duration tokenTtl;

    public JwtService(JwtEncoder encoder, @Value("${app.jwt.ttl-hours:24}") long ttlHours) {
        this.encoder = encoder;
        this.tokenTtl = Duration.ofHours(ttlHours);
    }

    public String createToken(UserAccount user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("structlab-api")
                .issuedAt(now)
                .expiresAt(now.plus(tokenTtl))
                .subject(user.getEmail())
                .claim("name", user.getDisplayName())
                .claim("userId", user.getId())
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }

    public long expiresInSeconds() {
        return tokenTtl.toSeconds();
    }
}
