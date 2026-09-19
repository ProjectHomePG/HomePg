package com.livio.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.sql.Connection;

@Configuration
public class DataSourceConfig {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${SPRING_DATASOURCE_URL:#{null}}")
    private String springDatasourceUrl;

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrl;

    @Value("${SPRING_DATASOURCE_USERNAME:#{null}}")
    private String springUsername;

    @Value("${SPRING_DATASOURCE_PASSWORD:#{null}}")
    private String springPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String rawUrl = springDatasourceUrl;
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = databaseUrl;
        }

        // Check if external PostgreSQL or MySQL database URL is provided
        if (rawUrl != null && !rawUrl.isBlank() && !rawUrl.contains("h2:file") && !rawUrl.contains("h2:mem")) {
            try {
                ParsedDbInfo dbInfo = parseConnectionUrl(rawUrl, springUsername, springPassword);
                logger.info("Configuring external database connection: {}", sanitizeUrl(dbInfo.jdbcUrl));

                DataSource externalDataSource = DataSourceBuilder.create()
                        .url(dbInfo.jdbcUrl)
                        .username(dbInfo.username)
                        .password(dbInfo.password)
                        .driverClassName(dbInfo.driverClassName)
                        .build();

                // Test connection
                try (Connection conn = externalDataSource.getConnection()) {
                    logger.info("Successfully connected to external database: {}", conn.getMetaData().getDatabaseProductName());
                    return externalDataSource;
                } catch (Exception connEx) {
                    logger.warn("Failed to connect to external database ({}). Falling back to persistent H2 database.", connEx.getMessage());
                }
            } catch (Exception ex) {
                logger.warn("Error parsing external database URL ({}). Falling back to persistent H2 database.", ex.getMessage());
            }
        }

        // Fallback to robust persistent file-based H2 database
        logger.info("Using embedded persistent H2 database (./data/livio_db)");
<<<<<<< HEAD
        String h2Url = "jdbc:h2:file:./data/livio_db;DB_CLOSE_DELAY=-1";
=======
        String h2Url = "jdbc:h2:file:./data/livio_db;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE";
>>>>>>> 29d935c056ea467b729b7384825dc2a9a607e06b
        return DataSourceBuilder.create()
                .url(h2Url)
                .username("sa")
                .password("")
                .driverClassName("org.h2.Driver")
                .build();
    }

    private ParsedDbInfo parseConnectionUrl(String rawUrl, String defaultUser, String defaultPass) {
        String trimmed = rawUrl.trim();
        String username = defaultUser;
        String password = defaultPass;
        String jdbcUrl = trimmed;
        String driver = "org.postgresql.Driver";

        // If it starts with standard Render/Heroku postgres URI (postgres:// or postgresql://)
        if (trimmed.startsWith("postgres://") || trimmed.startsWith("postgresql://")) {
            try {
                // Ensure proper URI parsing
                String uriString = trimmed.startsWith("postgres://") 
                        ? "http://" + trimmed.substring("postgres://".length())
                        : "http://" + trimmed.substring("postgresql://".length());
                URI uri = URI.create(uriString);

                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath(); // e.g. /livio_db
                String userInfo = uri.getUserInfo();

                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                }

                jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                driver = "org.postgresql.Driver";
            } catch (Exception e) {
                // Simple replacement fallback
                if (trimmed.startsWith("postgres://")) {
                    jdbcUrl = "jdbc:postgresql://" + trimmed.substring("postgres://".length());
                } else if (trimmed.startsWith("postgresql://")) {
                    jdbcUrl = "jdbc:postgresql://" + trimmed.substring("postgresql://".length());
                }
            }
        } else if (trimmed.startsWith("jdbc:postgresql://")) {
            driver = "org.postgresql.Driver";
        } else if (trimmed.startsWith("jdbc:mysql://") || trimmed.startsWith("mysql://")) {
            driver = "com.mysql.cj.jdbc.Driver";
            if (trimmed.startsWith("mysql://")) {
                jdbcUrl = "jdbc:mysql://" + trimmed.substring("mysql://".length());
            }
        }

        return new ParsedDbInfo(jdbcUrl, username != null ? username : "", password != null ? password : "", driver);
    }

    private String sanitizeUrl(String url) {
        if (url == null) return "";
        return url.replaceAll(":[^/@:]+@", ":****@");
    }

    private static class ParsedDbInfo {
        final String jdbcUrl;
        final String username;
        final String password;
        final String driverClassName;

        ParsedDbInfo(String jdbcUrl, String username, String password, String driverClassName) {
            this.jdbcUrl = jdbcUrl;
            this.username = username;
            this.password = password;
            this.driverClassName = driverClassName;
        }
    }
}
