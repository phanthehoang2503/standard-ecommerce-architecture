package com.learningmat.ecommerce.configuration;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.annotation.CachingConfigurer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@EnableCaching
@Configuration
public class CacheConfig implements CachingConfigurer {
	@Override
	public CacheErrorHandler errorHandler() {
		return new CacheErrorHandler() {
			@Override
			public void handleCacheGetError(RuntimeException e, org.springframework.cache.Cache cache, Object key) {
				log.error("Redis Get Error: " + e.getMessage());
			}

			@Override
			public void handleCachePutError(RuntimeException e, org.springframework.cache.Cache cache, Object key,
					Object value) {
				log.error("Redis Put Error: " + e.getMessage());
			}

			@Override
			public void handleCacheEvictError(RuntimeException e, org.springframework.cache.Cache cache, Object key) {
				log.error("Redis Evict Error: " + e.getMessage());
			}

			@Override
			public void handleCacheClearError(RuntimeException e, org.springframework.cache.Cache cache) {
				log.error("Redis Clear Error: " + e.getMessage());
			}
		};
	}
}