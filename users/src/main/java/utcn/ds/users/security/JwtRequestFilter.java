package utcn.ds.users.security;

import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;


import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

public class JwtRequestFilter extends OncePerRequestFilter {

    private static final String SECRET_KEY = "6m6bJYp5bWfuZ23EDvJx5ilZbuq6B4wBqvHIF0Oc4Aw=";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        String jwt = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
        }
        if (jwt != null) {
            try {
                byte[] keyBytes = Base64.getDecoder().decode(SECRET_KEY);
                Jws<Claims> claimsJws = Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(keyBytes)).build().parseClaimsJws(jwt);
                Claims claims = claimsJws.getBody();
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_"+ claims.get("role").toString());
                List<SimpleGrantedAuthority> authorities = List.of(authority);
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(claims.getSubject(), null, authorities)
                );
            } catch (Exception e) {
            }
        }
        filterChain.doFilter(request, response);
    }
}
