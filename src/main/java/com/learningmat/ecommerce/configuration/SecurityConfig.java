package com.learningmat.ecommerce.configuration;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	@Value("${jwt.signerKey}")
	protected String SIGNER_KEY;

	// private final String[] PUBLIC_ENDPOINT = {
	// "/users", "/auth/token", "/auth/introspect",
	// "/v3/api-docs/**",
	// "/categories",
	// "/products",
	// "/swagger-ui/**",
	// "/swagger-ui.html",
	// "/api/payment/**"
	// };

	private final String[] PUBLIC_GET_ENDPOINTS = {
			"/categories",
			"/products/**",
			"/v3/api-docs/**",
			"/swagger-ui/**",
			"/swagger-ui.html"
	};

	private final String[] PUBLIC_POST_ENDPOINTS = {
			"/users",
			"/auth/token",
			"/auth/introspect",
			"/api/payment/**"
	};

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(10);
	}

	// let all request past through filter
	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests(
				request -> request
						.requestMatchers(HttpMethod.POST, PUBLIC_POST_ENDPOINTS).permitAll()
						.requestMatchers(HttpMethod.GET, PUBLIC_GET_ENDPOINTS).permitAll()
						.anyRequest().authenticated());
		http
				.oauth2ResourceServer(oauth2 -> oauth2
						.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder())
								.jwtAuthenticationConverter(
										jwtAuthenticationConverter())));
		http.csrf(AbstractHttpConfigurer::disable);
		return http.build();
	}

	@Bean
	JwtDecoder jwtDecoder() {
		SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
		return NimbusJwtDecoder
				.withSecretKey(secretKeySpec)
				.macAlgorithm(MacAlgorithm.HS512)
				.build();
	}

	@Bean
	JwtAuthenticationConverter jwtAuthenticationConverter() {
		JwtGrantedAuthoritiesConverter gAC = new JwtGrantedAuthoritiesConverter();
		gAC.setAuthorityPrefix("ROLE_"); // change prefix from SCOPE_ to ROLE_

		JwtAuthenticationConverter jAC = new JwtAuthenticationConverter();

		jAC.setJwtGrantedAuthoritiesConverter(gAC);
		return jAC;
	}

	@Bean
	RoleHierarchy roleHierarchy() {
		return RoleHierarchyImpl.fromHierarchy(
				"ROLE_ADMIN > ROLE_STAFF \n ROLE_STAFF > ROLE_USER");
	}
}
