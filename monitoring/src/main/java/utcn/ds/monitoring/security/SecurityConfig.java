package utcn.ds.monitoring.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig   {

    @Bean
    public JwtRequestFilter jwtRequestFilter() {
        return new JwtRequestFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeRequests((authz) -> authz
                        .requestMatchers("/websocket/**").permitAll()
                        .requestMatchers("/monitoring/getHourlyEnergyConsumption").hasRole("USER")
                        .anyRequest().authenticated()
                ).addFilterBefore(jwtRequestFilter(), UsernamePasswordAuthenticationFilter.class)
        ;
        return http.build();
    }

}