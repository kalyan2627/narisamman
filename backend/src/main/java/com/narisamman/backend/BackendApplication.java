package com.narisamman.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.narisamman.backend.model.Product;
import com.narisamman.backend.repository.ProductRepository;
import java.util.Arrays;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner demoData(ProductRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                // Seed APPROVED products (visible on Home)
                Product p1 = new Product();
                p1.setName("Pure Sundarbans Forest Honey");
                p1.setCategory("food");
                p1.setPrice(480.0);
                p1.setMrp(650.0);
                p1.setUnit("500g");
                p1.setEmoji("🍯");
                p1.setDescription("Single-origin wild honey collected from the UNESCO World Heritage Sundarbans forest by tribal honey hunters.");
                p1.setStock(45);
                p1.setArtisanId("a1");
                p1.setStatus("APPROVED");
                p1.setTags(Arrays.asList("organic", "wild", "certified"));
                p1.setImage("sundarbanshoney");
                repo.save(p1);

                Product p2 = new Product();
                p2.setName("Mango Pickle - Traditional Recipe");
                p2.setCategory("food");
                p2.setPrice(180.0);
                p2.setMrp(220.0);
                p2.setUnit("400g");
                p2.setEmoji("🥭");
                p2.setDescription("Handmade Bengal-style mango achaar using mustard oil and traditional spices. No artificial preservatives.");
                p2.setStock(120);
                p2.setArtisanId("a6");
                p2.setStatus("APPROVED");
                p2.setTags(Arrays.asList("handmade", "traditional"));
                p2.setImage("mangoPickle");
                repo.save(p2);

                Product p3 = new Product();
                p3.setName("Tant Saree - Crimson Border");
                p3.setCategory("textiles");
                p3.setPrice(1200.0);
                p3.setMrp(2000.0);
                p3.setUnit("piece");
                p3.setEmoji("👘");
                p3.setDescription("Handwoven Tant cotton saree with traditional crimson jamdani border. Breathable and perfect for Bengal summers.");
                p3.setStock(22);
                p3.setArtisanId("v1"); // Rekha Mondal
                p3.setStatus("APPROVED");
                p3.setTags(Arrays.asList("handwoven", "traditional", "cotton"));
                p3.setImage("tantSaree");
                repo.save(p3);

                Product p6 = new Product();
                p6.setName("Jaggery – Palm Sugar");
                p6.setCategory("food");
                p6.setPrice(160.0);
                p6.setMrp(200.0);
                p6.setUnit("1kg");
                p6.setEmoji("🍫");
                p6.setDescription("Traditional palm jaggery from date palms of West Bengal. Deep caramel flavor, zero refining.");
                p6.setStock(60);
                p6.setArtisanId("a6");
                p6.setStatus("APPROVED");
                p6.setTags(Arrays.asList("natural", "unrefined"));
                p6.setImage("jaggery");
                repo.save(p6);

                Product p7 = new Product();
                p7.setName("Dokra Metal Art – Tribal Couple");
                p7.setCategory("crafts");
                p7.setPrice(1200.0);
                p7.setMrp(1800.0);
                p7.setUnit("piece");
                p7.setEmoji("🗿");
                p7.setDescription("Ancient lost-wax cast Dokra craft from West Bengal tribes. This figurine took 3 weeks to cast and finish.");
                p7.setStock(10);
                p7.setArtisanId("a3");
                p7.setStatus("APPROVED");
                p7.setTags(Arrays.asList("dokra", "lost-wax", "ancient"));
                p7.setImage("handcraftedDecor");
                repo.save(p7);

                Product p8 = new Product();
                p8.setName("Tant Dupatta – Indigo Block Print");
                p8.setCategory("textiles");
                p8.setPrice(650.0);
                p8.setMrp(950.0);
                p8.setUnit("piece");
                p8.setEmoji("🟦");
                p8.setDescription("Hand block-printed cotton dupatta using indigo natural dye. Pairs beautifully with any Indian outfit.");
                p8.setStock(35);
                p8.setArtisanId("a2");
                p8.setStatus("APPROVED");
                p8.setTags(Arrays.asList("block-print", "natural-dye"));
                p8.setImage("dupattas");
                repo.save(p8);
                
                Product p9 = new Product();
                p9.setName("Bamboo Fruit Basket");
                p9.setCategory("crafts");
                p9.setPrice(450.0);
                p9.setMrp(700.0);
                p9.setUnit("piece");
                p9.setEmoji("🧺");
                p9.setDescription("Hand-woven bamboo basket by Purulia tribal women. Strong, eco-friendly, and a perfect kitchen companion.");
                p9.setStock(50);
                p9.setArtisanId("a3");
                p9.setStatus("APPROVED");
                p9.setTags(Arrays.asList("eco-friendly", "bamboo", "tribal"));
                p9.setImage("bambooCrafts");
                repo.save(p9);
                
                Product p10 = new Product();
                p10.setName("Tribal Textile Stole – Santhali");
                p10.setCategory("textiles");
                p10.setPrice(780.0);
                p10.setMrp(1100.0);
                p10.setUnit("piece");
                p10.setEmoji("🌺");
                p10.setDescription("Handloom stole featuring traditional Santhali tribal motifs in earthy tones. Rare and culturally significant.");
                p10.setStock(18);
                p10.setArtisanId("a3");
                p10.setStatus("APPROVED");
                p10.setTags(Arrays.asList("tribal", "handloom", "rare"));
                p10.setImage("tribalTextiles");
                repo.save(p10);

                // Seed PENDING products (not visible on Home, visible in Approvals and My Products)
                Product p4 = new Product();
                p4.setName("Baluchari Silk - Mahabharata Motif");
                p4.setCategory("textiles");
                p4.setPrice(8500.0);
                p4.setMrp(14000.0);
                p4.setUnit("piece");
                p4.setEmoji("🧵");
                p4.setDescription("Exquisite Baluchari silk saree featuring Mahabharata scenes woven in silk thread. Took 4 months to weave.");
                p4.setStock(3);
                p4.setArtisanId("v1"); // Rekha Mondal
                p4.setStatus("PENDING");
                p4.setTags(Arrays.asList("silk", "GI-certified", "heirloom"));
                p4.setImage("baluchari");
                repo.save(p4);

                Product p5 = new Product();
                p5.setName("Clay Terracotta Horse");
                p5.setCategory("crafts");
                p5.setPrice(380.0);
                p5.setMrp(550.0);
                p5.setUnit("piece");
                p5.setEmoji("🐴");
                p5.setDescription("Bankura's iconic terracotta horse, handcrafted by potters.");
                p5.setStock(25);
                p5.setArtisanId("a3");
                p5.setStatus("PENDING");
                p5.setTags(Arrays.asList("GI-tagged", "terracotta", "tribal"));
                p5.setImage("clayArtifacts");
                repo.save(p5);
            }
        };
    }
}
