package com.livio.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

@Component
public class FrontendRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(FrontendRunner.class);
    private Process process;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting frontend Next.js development server...");
        
        String os = System.getProperty("os.name").toLowerCase();
        ProcessBuilder pb;
        if (os.contains("win")) {
            pb = new ProcessBuilder("cmd.exe", "/c", "npm run dev");
        } else {
            pb = new ProcessBuilder("npm", "run", "dev");
        }
        
        // Locate frontend directory relative to backend execution directory
        File frontendDir = new File("../frontend");
        if (!frontendDir.exists()) {
            logger.error("Frontend directory not found at: " + frontendDir.getAbsolutePath());
            return;
        }
        
        pb.directory(frontendDir);
        pb.redirectErrorStream(true);
        
        try {
            process = pb.start();
            logger.info("Frontend process started successfully.");
            
            // Read frontend console output in a separate thread so it doesn't block the backend thread
            new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        logger.info("[Frontend] " + line);
                    }
                } catch (Exception e) {
                    logger.error("Error reading frontend output: " + e.getMessage());
                }
            }).start();
            
            // Register shutdown hook to clean up the frontend server process on JVM exit
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                if (process != null && process.isAlive()) {
                    logger.info("Shutting down frontend server...");
                    process.destroy();
                }
            }));
            
        } catch (Exception e) {
            logger.error("Failed to start frontend process: " + e.getMessage(), e);
        }
    }
}
