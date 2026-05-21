package com.example.naarisamman.migration;

import com.example.naarisamman.model.Consumer;
import com.example.naarisamman.model.SHG;
import com.example.naarisamman.repository.ConsumerRepository;
import com.example.naarisamman.repository.SHGRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PasswordMigrationRunner implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(PasswordMigrationRunner.class);

    @Autowired
    private ConsumerRepository consumerRepository;

    @Autowired
    private SHGRepository shgRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        logger.info("Starting database password migration scanning...");

        // Migrate Consumers
        List<Consumer> consumers = consumerRepository.findAll();
        int consumerMigratedCount = 0;
        for (Consumer consumer : consumers) {
            String pass = consumer.getPassword();
            if (pass != null && !pass.startsWith("$2a$")) {
                consumer.setPassword(passwordEncoder.encode(pass));
                consumerRepository.save(consumer);
                consumerMigratedCount++;
            }
        }
        if (consumerMigratedCount > 0) {
            logger.info("Successfully migrated {} Consumer password records to BCrypt.", consumerMigratedCount);
        } else {
            logger.info("All Consumer passwords are already hashed.");
        }

        // Migrate SHGs
        List<SHG> shgs = shgRepository.findAll();
        int shgMigratedCount = 0;
        for (SHG shg : shgs) {
            String pass = shg.getPassword();
            if (pass != null && !pass.startsWith("$2a$")) {
                shg.setPassword(passwordEncoder.encode(pass));
                shgRepository.save(shg);
                shgMigratedCount++;
            }
        }
        if (shgMigratedCount > 0) {
            logger.info("Successfully migrated {} SHG vendor password records to BCrypt.", shgMigratedCount);
        } else {
            logger.info("All SHG vendor passwords are already hashed.");
        }

        logger.info("Database password migration scanning completed successfully.");
    }
}
