package com.learningmat.ecommerce;

import java.util.HashSet;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.learningmat.ecommerce.enums.Role;
import com.learningmat.ecommerce.module.user.User;
import com.learningmat.ecommerce.module.user.UserRepository;

@SpringBootApplication
@EnableScheduling
public class EcommerceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcommerceApplication.class, args);
	}

	@Bean
	ApplicationRunner applicationRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Kiểm tra xem user 'admin' đã tồn tại chưa
			if (userRepository.findByUsername("admin").isEmpty()) {

				// Tạo Set quyền roles
				var roles = new HashSet<String>();
				roles.add(Role.ADMIN.name());

				// Tạo User admin
				User user = User.builder()
						.username("admin")
						.password(passwordEncoder.encode("admin"))
						.roles(roles)
						.build();

				userRepository.save(user);
				System.out.println("Admin user has been created with default password: admin");
			}
		};
	}

}
