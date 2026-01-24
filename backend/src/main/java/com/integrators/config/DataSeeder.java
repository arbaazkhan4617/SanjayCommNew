package com.integrators.config;

import com.integrators.entity.*;
import com.integrators.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {
    // Expected counts for seeded data
    private static final long EXPECTED_SERVICES = 11; // CCTV, Computers, Networking, Access Controls, Fire Alarms, Video Door Phones, Solar Power, Audio Video, Power Supply, Accessories, EPABX & Intercom
    private static final long EXPECTED_CATEGORIES = 11; // Main categories (sub-categories are additional)
     private static final long EXPECTED_BRANDS = 111;
    private static final long EXPECTED_MODELS = 130;
    private static final long EXPECTED_PRODUCTS = 130;
    
    private final ServiceRepository serviceRepository;
    private final ProductCategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ModelRepository modelRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final Random random = new Random();
    
    // Camera image URLs to randomly choose from
    private static final String[] CAMERA_IMAGES = {
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTUPJq4eakJ7-Obx88Q-OMwr-7rOuRlbuivzd9UbfXwporWRrkfotcbPB1K-dWcUlZVu9xxyE_UDn8c60ywwv4rKjAhNKOu9njBqwwwMVFh&usqp=CAc",
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTvNAKRkm8TfitndBPnsCMAGR_glb92-7Itsaw82sanXgufaqXMbXnkN-uqTSq-QOChirDaR-lf",
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSs6ksd3SpuZEW7VBuUN8HzLV20peuKvflcloILL47M8poEDw2gRR2Pxq3Klu2R5X7Tz8v6Yok",
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSPgxzL4dnaTPPvXPwhmd80ulxVbgg_TTV6ZBLAEVk2BoLlLonRi5CThXDigUV6ZrJl1ZRU5PA"
    };
    
    private String getRandomCameraImage() {
        return CAMERA_IMAGES[random.nextInt(CAMERA_IMAGES.length)];
    }

    public DataSeeder(ServiceRepository serviceRepository, ProductCategoryRepository categoryRepository, BrandRepository brandRepository, ModelRepository modelRepository, ProductRepository productRepository, UserRepository userRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.serviceRepository = serviceRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.modelRepository = modelRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        System.out.println("========================================");
        System.out.println("Starting Data Seeder...");
        System.out.println("========================================");
        
        // Always seed users (check separately)
        seedDefaultUsers();
        
        // Check current counts
        long serviceCount = serviceRepository.count();
        long categoryCount = categoryRepository.count();
        long brandCount = brandRepository.count();
        long modelCount = modelRepository.count();
        long productCount = productRepository.count();
        
        System.out.println("Current database counts:");
        System.out.println("  Services: " + serviceCount + " (expected: " + EXPECTED_SERVICES + ")");
        System.out.println("  Categories: " + categoryCount + " (expected: " + EXPECTED_CATEGORIES + ")");
        System.out.println("  Brands: " + brandCount + " (expected: " + EXPECTED_BRANDS + ")");
        System.out.println("  Models: " + modelCount + " (expected: " + EXPECTED_MODELS + ")");
        System.out.println("  Products: " + productCount + " (expected: " + EXPECTED_PRODUCTS + ")");
        
        // Check if all counts match expected values
        boolean allCountsMatch = (serviceCount == EXPECTED_SERVICES) &&
                                 (categoryCount == EXPECTED_CATEGORIES) &&
                                 (brandCount == EXPECTED_BRANDS) &&
                                 (modelCount == EXPECTED_MODELS) &&
                                 (productCount == EXPECTED_PRODUCTS);
        
        if (allCountsMatch) {
            System.out.println("All counts match expected values. Database is fully seeded. Skipping product seeding...");
            System.out.println("========================================");
            return;
        }
        
        // If counts don't match, seed (idempotent methods will skip existing items)
        System.out.println("Counts don't match expected values. Seeding missing data...");
        System.out.println("Missing items:");
        if (serviceCount < EXPECTED_SERVICES) System.out.println("  - Services: " + (EXPECTED_SERVICES - serviceCount) + " missing");
        if (categoryCount < EXPECTED_CATEGORIES) System.out.println("  - Categories: " + (EXPECTED_CATEGORIES - categoryCount) + " missing");
        if (brandCount < EXPECTED_BRANDS) System.out.println("  - Brands: " + (EXPECTED_BRANDS - brandCount) + " missing");
        if (modelCount < EXPECTED_MODELS) System.out.println("  - Models: " + (EXPECTED_MODELS - modelCount) + " missing");
        if (productCount < EXPECTED_PRODUCTS) System.out.println("  - Products: " + (EXPECTED_PRODUCTS - productCount) + " missing");
        System.out.println("This may take a few moments...");
        
        try {
            seedData();
        } catch (Exception e) {
            System.err.println("ERROR during seeding: " + e.getMessage());
            e.printStackTrace();
            System.out.println("Continuing despite error...");
        }
        
        // Verify final counts
        long finalServiceCount = serviceRepository.count();
        long finalCategoryCount = categoryRepository.count();
        long finalBrandCount = brandRepository.count();
        long finalModelCount = modelRepository.count();
        long finalProductCount = productRepository.count();
        
        System.out.println("Final database counts after seeding:");
        System.out.println("  Services: " + finalServiceCount + " (expected: " + EXPECTED_SERVICES + ")");
        System.out.println("  Categories: " + finalCategoryCount + " (expected: " + EXPECTED_CATEGORIES + ")");
        System.out.println("  Brands: " + finalBrandCount + " (expected: " + EXPECTED_BRANDS + ")");
        System.out.println("  Models: " + finalModelCount + " (expected: " + EXPECTED_MODELS + ")");
        System.out.println("  Products: " + finalProductCount + " (expected: " + EXPECTED_PRODUCTS + ")");
        System.out.println("========================================");
        System.out.println("Database seeding completed!");
        System.out.println("========================================");
    }

    private void seedDefaultUsers() {
        System.out.println("Checking and creating default users...");
        
        // Create or update default admin user
        User adminUser = userRepository.findByEmail("admin@integrators.com").orElse(null);
        if (adminUser == null) {
            adminUser = new User();
            adminUser.setName("Admin User");
            adminUser.setEmail("admin@integrators.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setPhone("9876543210");
            adminUser.setRole("ADMIN");
            userRepository.save(adminUser);
            System.out.println("✓ Default admin user created:");
            System.out.println("  Email: admin@integrators.com");
            System.out.println("  Password: admin123");
        } else {
            // Update role if it's not ADMIN
            if (!"ADMIN".equals(adminUser.getRole())) {
                adminUser.setRole("ADMIN");
                userRepository.save(adminUser);
                System.out.println("✓ Admin user role updated to ADMIN");
            }
            System.out.println("Admin user already exists: admin@integrators.com");
        }

        // Create default test user if not exists
        if (!userRepository.existsByEmail("test@test.com")) {
            User testUser = new User();
            testUser.setName("Test User");
            testUser.setEmail("test@test.com");
            testUser.setPassword(passwordEncoder.encode("test123"));
            testUser.setPhone("9876543211");
            testUser.setRole("USER");
            userRepository.save(testUser);
            System.out.println("✓ Default test user created:");
            System.out.println("  Email: test@test.com");
            System.out.println("  Password: test123");
        } else {
            System.out.println("Test user already exists: test@test.com");
        }

        // Create default sales user if not exists
        if (!userRepository.existsByEmail("sales@sanjaycomm.com")) {
            User salesUser = new User();

            salesUser.setName("Sales Team");
            salesUser.setEmail("sales@sanjaycomm.com");
            salesUser.setPassword(passwordEncoder.encode("sales123"));
            salesUser.setPhone("9179500312");
            salesUser.setRole("SALES");
            userRepository.save(salesUser);
            System.out.println("✓ Default sales user created:");
            System.out.println("  Email: sales@sanjaycomm.com");
            System.out.println("  Password: sales123");
        } else {
            System.out.println("Sales user already exists: sales@sanjaycomm.com");
        }
        
        System.out.println("User seeding completed!");
    }

    private void seedData() {
        System.out.println("Creating all 11 services...");
        
        // 1. CCTV Service
        Service cctvService = createService("CCTV", "videocam", "Complete CCTV surveillance solutions including IP and analog systems");
        ProductCategory ipCameras = createCategory("IP Cameras", cctvService);
        ProductCategory ptzCameras = createCategory("PTZ Cameras", cctvService);
        ProductCategory wifiCameras = createCategory("WiFi Cameras", cctvService);
        ProductCategory bulletCameras = createCategory("Bullet Cameras", cctvService);
        ProductCategory domeCameras = createCategory("Dome Cameras", cctvService);
        ProductCategory dvrSystems = createCategory("DVR Systems", cctvService);
        ProductCategory cctvAccessoriesForCCTV = createCategory("CCTV Accessories", cctvService);
        ProductCategory ipHdSystems = createCategory("IP HD Systems", cctvService);
        ProductCategory analogHdSystems = createCategory("Analog HD Systems", cctvService);
        
        // 2. Computers Service
        Service computersService = createService("Computers", "desktop", "Desktop computers, laptops, and computer accessories");
        ProductCategory desktopPC = createCategory("Desktop PC", computersService);
        ProductCategory printers = createCategory("Printers", computersService);
        ProductCategory monitors = createCategory("Monitors", computersService);
        ProductCategory computerAccessories = createCategory("Computer Accessories", computersService);
        
        // 3. Networking Service
        Service networkingService = createService("Networking", "wifi", "Network equipment including switches, routers, and cables");
        ProductCategory networkSwitches = createCategory("Network Switches", networkingService);
        ProductCategory routers = createCategory("Routers", networkingService);
        ProductCategory cables = createCategory("Cables", networkingService);
        ProductCategory poeSwitches = createCategory("PoE Switches", networkingService);
        
        // 4. Access Controls Service
        Service accessControlService = createService("Access Controls", "shield-checkmark", "Access control systems including biometrics and electronic locks");
        ProductCategory biometricDevices = createCategory("Biometrics", accessControlService);
        ProductCategory doorLocks = createCategory("Door Locks", accessControlService);
        ProductCategory faceMachines = createCategory("Face Recognition Machines", accessControlService);
        ProductCategory electronicLocks = createCategory("Electronic Locks", accessControlService);
        ProductCategory gpsDevices = createCategory("GPS Devices for Vehicles", accessControlService);
        
        // 5. Fire Alarms Service
        Service fireAlarmService = createService("Fire Alarms", "flame", "Fire alarm systems and safety equipment");
        ProductCategory firePanels = createCategory("Fire Panels", fireAlarmService);
        ProductCategory smokeDetectors = createCategory("Smoke Detectors", fireAlarmService);
        ProductCategory conventionalFireAlarms = createCategory("Conventional Fire Alarm Systems", fireAlarmService);
        ProductCategory addressableFireAlarms = createCategory("Analogue Addressable Fire Alarm Systems", fireAlarmService);
        
        // 6. Video Door Phones Service
        Service videoDoorPhoneService = createService("Video Door Phones", "call", "Video door phone systems for residential and commercial use");
        ProductCategory videoDoorPhones = createCategory("Video Door Phones", videoDoorPhoneService);
        ProductCategory analogueVDP = createCategory("Analogue Video Door Phones", videoDoorPhoneService);
        ProductCategory ipVDP = createCategory("IP Video Door Phones", videoDoorPhoneService);
        
        // 7. Solar Power Service
        Service solarService = createService("Solar Power", "sunny", "Solar power solutions and inverters");
        ProductCategory solarInverters = createCategory("Solar Inverters", solarService);
        ProductCategory solarBatteries = createCategory("Solar Batteries", solarService);
        ProductCategory solarCables = createCategory("Solar Cables", solarService);
        
        // 8. Audio Video Service
        Service audioVideoService = createService("Audio Video", "musical-notes", "Audio and video equipment");
        ProductCategory speakers = createCategory("Speakers", audioVideoService);
        ProductCategory amplifiers = createCategory("Amplifiers", audioVideoService);
        
        // 9. Power Supply Service
        Service powerSupplyService = createService("Power Supply", "battery", "Power supply solutions including adapters, UPS, and power supplies");
        ProductCategory adapters = createCategory("Adapters", powerSupplyService);
        ProductCategory ups = createCategory("UPS", powerSupplyService);
        ProductCategory powerSupplies = createCategory("Power Supplies", powerSupplyService);
        
        // 10. Accessories Service
        Service accessoriesService = createService("Accessories", "construct", "Various accessories for security and technology systems");
        ProductCategory connectors = createCategory("Connectors", accessoriesService);
        ProductCategory brackets = createCategory("Brackets", accessoriesService);
        ProductCategory storage = createCategory("Storage", accessoriesService);
        ProductCategory cctvAccessories = createCategory("CCTV Accessories", accessoriesService);
        ProductCategory epabxAccessories = createCategory("EPABX Accessories", accessoriesService);
        
        // 11. EPABX & Intercom Service
        Service epabxService = createService("EPABX & Intercom", "call", "EPABX and intercom systems");
        ProductCategory epabxIntercom = createCategory("EPABX & Intercom", epabxService);
        
        System.out.println("All services and categories created. Starting to seed products...");
        
        // Seed CCTV products
        System.out.println("Starting to seed IP HD Systems...");
        try { seedIPHDSystems(ipHdSystems); } catch (Exception e) { System.err.println("Error seeding IP HD Systems: " + e.getMessage()); }
        
        System.out.println("Starting to seed Analog HD Systems...");
        try { seedAnalogHDSystems(analogHdSystems); } catch (Exception e) { System.err.println("Error seeding Analog HD Systems: " + e.getMessage()); }
        
        try { seedCCTVProducts(cctvService, ipCameras, ptzCameras, wifiCameras, bulletCameras, domeCameras, dvrSystems, cctvAccessoriesForCCTV); } catch (Exception e) { System.err.println("Error seeding CCTV Products: " + e.getMessage()); }
        
        // Seed Computer products
        try { seedComputerProducts(computersService, desktopPC, printers, monitors, computerAccessories); } catch (Exception e) { System.err.println("Error seeding Computer Products: " + e.getMessage()); }
        
        // Seed Networking products
        try { seedNetworkingProducts(networkingService, networkSwitches, routers, cables, poeSwitches); } catch (Exception e) { System.err.println("Error seeding Networking Products: " + e.getMessage()); }
        
        // Seed Access Control products
        try { seedAccessControlProducts(accessControlService, biometricDevices, doorLocks, faceMachines); } catch (Exception e) { System.err.println("Error seeding Access Control Products: " + e.getMessage()); }
        try { seedBiometrics(biometricDevices); } catch (Exception e) { System.err.println("Error seeding Biometrics: " + e.getMessage()); }
        try { seedElectronicLocks(electronicLocks); } catch (Exception e) { System.err.println("Error seeding Electronic Locks: " + e.getMessage()); }
        try { seedGPSDevices(gpsDevices); } catch (Exception e) { System.err.println("Error seeding GPS Devices: " + e.getMessage()); }
        
        // Seed Fire Alarm products
        try { seedFireAlarmProducts(fireAlarmService, firePanels, smokeDetectors); } catch (Exception e) { System.err.println("Error seeding Fire Alarm Products: " + e.getMessage()); }
        try { seedConventionalFireAlarms(conventionalFireAlarms); } catch (Exception e) { System.err.println("Error seeding Conventional Fire Alarms: " + e.getMessage()); }
        try { seedAddressableFireAlarms(addressableFireAlarms); } catch (Exception e) { System.err.println("Error seeding Addressable Fire Alarms: " + e.getMessage()); }
        
        // Seed Video Door Phone products
        try { seedVideoDoorPhoneProducts(videoDoorPhoneService, videoDoorPhones); } catch (Exception e) { System.err.println("Error seeding Video Door Phone Products: " + e.getMessage()); }
        try { seedAnalogueVDP(analogueVDP); } catch (Exception e) { System.err.println("Error seeding Analogue VDP: " + e.getMessage()); }
        try { seedIPVDP(ipVDP); } catch (Exception e) { System.err.println("Error seeding IP VDP: " + e.getMessage()); }
        
        // Seed Solar products
        try { seedSolarProducts(solarService, solarInverters, solarBatteries, solarCables); } catch (Exception e) { System.err.println("Error seeding Solar Products: " + e.getMessage()); }
        
        // Seed Audio Video products
        try { seedAudioVideoProducts(audioVideoService, speakers, amplifiers); } catch (Exception e) { System.err.println("Error seeding Audio Video Products: " + e.getMessage()); }
        
        // Seed Power Supply products
        try { seedPowerSupplyProducts(powerSupplyService, adapters, ups, powerSupplies); } catch (Exception e) { System.err.println("Error seeding Power Supply Products: " + e.getMessage()); }
        
        // Seed Accessories products
        try { seedAccessoriesProducts(accessoriesService, connectors, brackets, storage, cctvAccessories, epabxAccessories); } catch (Exception e) { System.err.println("Error seeding Accessories Products: " + e.getMessage()); }
        
        // Seed EPABX products
        try { seedEPABXProducts(epabxService, epabxAccessories); } catch (Exception e) { System.err.println("Error seeding EPABX Products: " + e.getMessage()); }
        
        System.out.println("All seed methods completed.");
    }

    private Service createService(String name, String icon, String description) {
        // Check if service already exists
        Service service = serviceRepository.findByName(name).orElse(null);
        if (service != null) {
            System.out.println("Service '" + name + "' already exists, reusing it.");
            return service;
        }
        
        // Create new service if it doesn't exist
        service = new Service();
        service.setName(name);
        service.setIcon(icon);
        service.setDescription(description);
        service = serviceRepository.save(service);
        System.out.println("Created new service: " + name);
        return service;
    }

    private ProductCategory createCategory(String name, Service service) {
        // Check if category already exists for this service
        java.util.List<ProductCategory> existingCategories = categoryRepository.findByServiceId(service.getId());
        for (ProductCategory cat : existingCategories) {
            if (name.equals(cat.getName())) {
                return cat; // Reuse existing category
            }
        }
        
        // Create new category if it doesn't exist
        ProductCategory category = new ProductCategory();
        category.setName(name);
        category.setService(service);
        category = categoryRepository.save(category);
        return category;
    }

    private Brand createBrand(String name, ProductCategory category) {
        // Check if brand already exists for this category
        java.util.List<Brand> existingBrands = brandRepository.findByCategoryId(category.getId());
        for (Brand b : existingBrands) {
            if (name.equals(b.getName())) {
                return b; // Reuse existing brand
            }
        }
        
        // Create new brand if it doesn't exist
        Brand brand = new Brand();
        brand.setName(name);
        brand.setCategory(category);
        brand = brandRepository.save(brand);
        return brand;
    }

    private Model createModel(String name, String image, Brand brand) {
        // Check if model already exists for this brand
        java.util.List<Model> existingModels = modelRepository.findByBrandId(brand.getId());
        for (Model m : existingModels) {
            if (name.equals(m.getName())) {
                return m; // Reuse existing model
            }
        }
        
        // Create new model if it doesn't exist
        Model model = new Model();
        model.setName(name);
        model.setImage(image);
        model.setBrand(brand);
        model = modelRepository.save(model);
        return model;
    }

    private Product createProduct(Model model, String name, String description, 
                                  BigDecimal price, BigDecimal originalPrice, Boolean inStock,
                                  Double rating, Integer reviews, Map<String, String> specifications) {
        // Check if product already exists for this model
        java.util.Optional<Product> existingProduct = productRepository.findByModelId(model.getId());
        if (existingProduct.isPresent()) {
            return existingProduct.get(); // Reuse existing product
        }
        
        // Create new product if it doesn't exist
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setOriginalPrice(originalPrice);
        product.setInStock(inStock);
        product.setRating(rating);
        product.setReviews(reviews);
        product.setModel(model);
        product.setSpecifications(specifications);
        product = productRepository.save(product);
        return product;
    }

    private void seedCCTVProducts(Service cctvService, ProductCategory ipCameras, ProductCategory ptzCameras,
                                  ProductCategory wifiCameras, ProductCategory bulletCameras,
                                  ProductCategory domeCameras, ProductCategory dvrSystems,
                                  ProductCategory cctvAccessories) {
        
        // Prama IP Camera
        Brand prama = createBrand("Prama", ipCameras);
        Model pramaVarifocal = createModel("Varifocal Zoom Lens IR Camera", 
            getRandomCameraImage(), prama);
        createProduct(pramaVarifocal, "Prama Varifocal Zoom Lens IR Camera",
            "High-quality IP camera with varifocal zoom lens (2.8-12mm) and powerful IR night vision up to 30 meters. Perfect for outdoor surveillance with adjustable focal length for flexible installation.",
            new BigDecimal("8500"), new BigDecimal("10000"), true, 4.5, 120,
            Map.of("Resolution", "4MP (2688 × 1520)", "Lens", "Varifocal 2.8-12mm", 
                   "Night Vision", "Up to 30m IR Range", "Weatherproof", "IP67",
                   "Power Supply", "12VDC / PoE", "Compression", "H.265+", "Warranty", "3 Years"));

        // Hikvision PTZ Camera
        Brand hikvision = createBrand("Hikvision", ptzCameras);
        Model hikvisionPTZ = createModel("Outdoor IR Speed Dome PTZ Camera",
            getRandomCameraImage(), hikvision);
        createProduct(hikvisionPTZ, "Hikvision Outdoor IR Speed Dome PTZ Camera",
            "Advanced PTZ camera with 360° continuous rotation, 20x optical zoom, and powerful IR illumination up to 200 meters. Features auto-tracking and preset positions. Ideal for large area surveillance.",
            new BigDecimal("45000"), new BigDecimal("55000"), true, 4.8, 85,
            Map.of("Resolution", "4MP", "Zoom", "20x Optical Zoom", "Rotation", "360° Pan, 90° Tilt",
                   "Night Vision", "Up to 200m IR Range", "Weatherproof", "IP66",
                   "Power Supply", "24VAC / PoE+", "Auto Tracking", "Yes", "Warranty", "3 Years"));

        // CP Plus WiFi Camera
        Brand cpPlus = createBrand("CP Plus", wifiCameras);
        Model cpPlusWifi = createModel("WiFi Dome Camera",
            getRandomCameraImage(), cpPlus);
        createProduct(cpPlusWifi, "CP Plus WiFi Dome Camera",
            "Wireless WiFi dome camera with easy installation. Supports mobile app viewing, cloud storage, and two-way audio. Perfect for home and small office security.",
            new BigDecimal("6500"), new BigDecimal("8000"), true, 4.4, 150,
            Map.of("Resolution", "2MP", "Connectivity", "WiFi 802.11n", "Night Vision", "Up to 20m IR",
                   "Power Supply", "12VDC", "Mobile App", "Yes", "Cloud Storage", "Optional", "Warranty", "2 Years"));

        // Dahua Bullet Camera
        Brand dahua = createBrand("Dahua", bulletCameras);
        Model dahuaBullet = createModel("Color Bullet Camera",
            getRandomCameraImage(), dahua);
        createProduct(dahuaBullet, "Dahua Color Bullet Camera",
            "Professional bullet camera with color night vision technology. Excellent for outdoor installation with vandal-proof design and weather-resistant housing.",
            new BigDecimal("9500"), new BigDecimal("12000"), true, 4.7, 200,
            Map.of("Resolution", "4MP", "Lens", "Fixed 3.6mm", "Night Vision", "Color Night Vision + IR",
                    "Weatherproof", "IP67", "Power Supply", "12VDC / PoE", "Vandal Proof", "Yes", "Warranty", "3 Years"));

        // HD Crystal IP Camera
        Brand hdCrystal = createBrand("HD Crystal", ipCameras);
        Model hdCrystalIP = createModel("IP Color Audio Dome Camera",
            getRandomCameraImage(), hdCrystal);
        createProduct(hdCrystalIP, "HD Crystal IP Color Audio Dome Camera",
            "Color IP dome camera with built-in microphone and speaker for two-way audio. Features excellent low-light performance with color night vision technology.",
            new BigDecimal("12000"), new BigDecimal("15000"), true, 4.6, 95,
            Map.of("Resolution", "4MP", "Audio", "Built-in Microphone & Speaker", "Night Vision", "Color Night Vision",
                   "Weatherproof", "IP67", "Power Supply", "PoE", "Two-way Audio", "Yes", "Warranty", "3 Years"));

        // CP Plus DVR 16 Channel
        Brand cpPlusDVR = createBrand("CP Plus", dvrSystems);
        Model cpPlusDVR16 = createModel("16 Channel DVR",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", cpPlusDVR);
        createProduct(cpPlusDVR16, "CP Plus 16 Channel DVR",
            "Advanced 16-channel digital video recorder with AI features. Supports smart motion detection, face recognition, and up to 8MP per channel. Features H.265+ compression for efficient storage.",
            new BigDecimal("20000"), new BigDecimal("25000"), true, 4.6, 150,
            Map.of("Channels", "16", "Compression", "H.265+", "AI Features", "Motion Detection, Face Recognition",
                   "HDD Support", "Up to 8TB", "Resolution", "Up to 8MP per Channel", "Mobile App", "Yes", "Warranty", "3 Years"));

        // Prama DVR 16 Channel
        Brand pramaDVR = createBrand("Prama", dvrSystems);
        Model pramaDVR16 = createModel("16 Channel DVR",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", pramaDVR);
        createProduct(pramaDVR16, "Prama 16 Channel DVR",
            "16-channel digital video recorder supporting up to 16 cameras. Features H.265 compression, mobile app support, and remote viewing capabilities.",
            new BigDecimal("18000"), new BigDecimal("22000"), true, 4.5, 180,
            Map.of("Channels", "16", "Compression", "H.265+/H.265", "HDD Support", "Up to 6TB",
                   "Resolution", "Up to 8MP per Channel", "Mobile App", "Yes", "Remote Viewing", "Yes", "Warranty", "2 Years"));

        // Hi-Focus DVR 16 Channel
        Brand hiFocus = createBrand("Hi-Focus", dvrSystems);
        Model hiFocusDVR16 = createModel("16 Channel DVR",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", hiFocus);
        createProduct(hiFocusDVR16, "Hi-Focus 16 Channel DVR",
            "Cost-effective 16-channel DVR solution. Perfect for small to medium installations with reliable performance and easy operation.",
            new BigDecimal("15000"), new BigDecimal("18000"), true, 4.4, 120,
            Map.of("Channels", "16", "Compression", "H.264", "HDD Support", "Up to 4TB",
                   "Resolution", "Up to 5MP per Channel", "Mobile App", "Yes", "Warranty", "2 Years"));

        // Hi-Focus DVR 4 Channel
        Model hiFocusDVR4 = createModel("4 Channel DVR",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", hiFocus);
        createProduct(hiFocusDVR4, "Hi-Focus 4 Channel DVR",
            "Compact 4-channel DVR for small installations. Ideal for homes and small offices.",
            new BigDecimal("8000"), new BigDecimal("10000"), true, 4.3, 200,
            Map.of("Channels", "4", "Compression", "H.264", "HDD Support", "Up to 2TB",
                   "Resolution", "Up to 5MP per Channel", "Mobile App", "Yes", "Warranty", "2 Years"));

        // Dahua DVR 4 Channel
        Brand dahuaDVR = createBrand("Dahua", dvrSystems);
        Model dahuaDVR4 = createModel("4 Channel 2MP DVR",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", dahuaDVR);
        createProduct(dahuaDVR4, "Dahua 4 Channel 2MP DVR",
            "Professional 4-channel DVR supporting 2MP cameras. Features advanced recording modes and mobile app access.",
            new BigDecimal("10000"), new BigDecimal("12000"), true, 4.5, 160,
            Map.of("Channels", "4", "Resolution", "Up to 2MP per Channel", "Compression", "H.265",
                   "HDD Support", "Up to 4TB", "Mobile App", "Yes", "Warranty", "3 Years"));

        // Consistent Hybrid Video Recorder 4 Channel
        Brand consistent = createBrand("Consistent", dvrSystems);
        Model consistentHVR4 = createModel("4 Channel Hybrid Video Recorder",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", consistent);
        createProduct(consistentHVR4, "Consistent 4 Channel Hybrid Video Recorder",
            "Hybrid video recorder supporting both analog and IP cameras. Flexible solution for upgrading existing systems.",
            new BigDecimal("12000"), new BigDecimal("15000"), true, 4.5, 140,
            Map.of("Channels", "4", "Type", "Hybrid (Analog + IP)", "Compression", "H.265",
                   "HDD Support", "Up to 4TB", "Mobile App", "Yes", "Warranty", "2 Years"));

        // Impact DVR 4 Channel
        Brand impact = createBrand("Impact", dvrSystems);
        Model impactDVR4 = createModel("4 Channel DVR",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", impact);
        createProduct(impactDVR4, "Impact 4 Channel DVR",
            "Reliable 4-channel DVR with excellent video quality and easy operation.",
            new BigDecimal("9000"), new BigDecimal("11000"), true, 4.4, 180,
            Map.of("Channels", "4", "Compression", "H.264", "HDD Support", "Up to 2TB",
                   "Resolution", "Up to 5MP per Channel", "Mobile App", "Yes", "Warranty", "2 Years"));

        // SecureEye PT Dome Camera
        Brand secureEye = createBrand("SecureEye", ptzCameras);
        Model secureEyePT = createModel("PT Dome Camera",
            getRandomCameraImage(), secureEye);
        createProduct(secureEyePT, "SecureEye PT Dome Camera",
            "Pan-tilt dome camera with remote control. Features smooth movement, preset positions, and excellent image quality.",
            new BigDecimal("25000"), new BigDecimal("30000"), true, 4.5, 90,
            Map.of("Resolution", "2MP", "PT Control", "Pan 360°, Tilt 90°", "Night Vision", "Up to 30m IR",
                   "Weatherproof", "IP66", "Power Supply", "12VDC", "Preset Positions", "64", "Warranty", "2 Years"));

        // EZVIZ H4 Camera
        Brand ezviz = createBrand("EZVIZ", wifiCameras);
        Model ezvizH4 = createModel("H4 Camera",
            getRandomCameraImage(), ezviz);
        createProduct(ezvizH4, "EZVIZ H4 Camera",
            "Smart WiFi camera with AI features including person detection. Supports cloud storage and mobile app control.",
            new BigDecimal("5500"), new BigDecimal("7000"), true, 4.3, 200,
            Map.of("Resolution", "2MP", "Connectivity", "WiFi", "AI Features", "Person Detection",
                   "Cloud Storage", "Yes", "Mobile App", "Yes", "Night Vision", "Yes", "Warranty", "2 Years"));

        // EZVIZ Wireless Cube Camera
        Model ezvizCube = createModel("Wireless Cube Camera",
            getRandomCameraImage(), ezviz);
        createProduct(ezvizCube, "EZVIZ Wireless Cube Camera",
            "Compact cube-shaped WiFi camera. Perfect for home and small office security with modern design.",
            new BigDecimal("5000"), new BigDecimal("6500"), true, 4.3, 220,
            Map.of("Resolution", "2MP", "Design", "Cube Shape", "Connectivity", "WiFi",
                   "Night Vision", "Yes", "Mobile App", "Yes", "Two-way Audio", "Yes", "Warranty", "2 Years"));

        // True View WiFi Mini Pan Camera
        Brand trueView = createBrand("True View", wifiCameras);
        Model trueViewWiFi = createModel("WiFi Mini Pan Camera",
            getRandomCameraImage(), trueView);
        createProduct(trueViewWiFi, "True View WiFi Mini Pan Camera",
            "Compact WiFi camera with pan functionality. Perfect for indoor monitoring with 360° coverage.",
            new BigDecimal("4500"), new BigDecimal("6000"), true, 4.2, 180,
            Map.of("Resolution", "2MP", "Pan", "360°", "Connectivity", "WiFi", 
                   "Night Vision", "Yes", "Mobile App", "Yes", "Two-way Audio", "Yes", "Warranty", "1 Year"));

        // Dual Lens 4G Solar PT Camera
        Brand dualLens = createBrand("Dual Lens", ptzCameras);
        Model dualLens4G = createModel("4G Solar PT Camera",
            getRandomCameraImage(), dualLens);
        createProduct(dualLens4G, "Dual Lens 4G Solar PT Camera",
            "Solar-powered PT camera with 4G connectivity. No wiring required, perfect for remote locations. Features dual lens technology for wider coverage.",
            new BigDecimal("35000"), new BigDecimal("45000"), true, 4.7, 75,
            Map.of("Resolution", "4MP Dual Lens", "Connectivity", "4G LTE", "Power", "Solar Panel + Battery",
                   "PT Control", "Yes", "Weatherproof", "IP67", "Battery Backup", "Yes", "Warranty", "2 Years"));

        // EyeSera Linkage PT Camera
        Brand eyeSera = createBrand("EyeSera", ptzCameras);
        Model eyeSeraPT = createModel("Linkage PT Camera",
            getRandomCameraImage(), eyeSera);
        createProduct(eyeSeraPT, "EyeSera Linkage PT Camera",
            "Advanced PT camera with linkage features. Supports multiple camera coordination and synchronized movement.",
            new BigDecimal("28000"), new BigDecimal("35000"), true, 4.6, 85,
            Map.of("Resolution", "4MP", "Linkage", "Multi-camera Coordination", "PT Control", "Yes",
                   "Night Vision", "Up to 50m IR", "Weatherproof", "IP66", "Synchronization", "Yes", "Warranty", "2 Years"));

        // CP Plus Wireless 2MP Camera
        Model cpPlusWireless = createModel("Wireless 2MP Camera",
            getRandomCameraImage(), cpPlus);
        createProduct(cpPlusWireless, "CP Plus Wireless 2MP Camera",
            "Wireless IP camera with easy setup. Features mobile app control and cloud storage options.",
            new BigDecimal("6000"), new BigDecimal("7500"), true, 4.4, 160,
            Map.of("Resolution", "2MP", "Connectivity", "WiFi", "Night Vision", "Up to 15m IR",
                   "Mobile App", "Yes", "Cloud Storage", "Optional", "Two-way Audio", "Yes", "Warranty", "2 Years"));

        // Impact 4MM Lens Color Camera
        Brand impactCamera = createBrand("Impact", bulletCameras);
        Model impact4MM = createModel("4MM Lens Color with Audio Camera",
            getRandomCameraImage(), impactCamera);
        createProduct(impact4MM, "Impact 4MM Lens Color with Audio Camera",
            "Color bullet camera with 4mm lens and built-in audio. Features excellent image quality and two-way communication.",
            new BigDecimal("7500"), new BigDecimal("9000"), true, 4.5, 150,
            Map.of("Resolution", "2MP", "Lens", "4mm Fixed", "Audio", "Built-in Microphone",
                   "Night Vision", "IR Night Vision", "Weatherproof", "IP66", "Warranty", "2 Years"));

        // Hi-Focus HD Bullet Camera
        Brand hiFocusCamera = createBrand("Hi-Focus", bulletCameras);
        Model hiFocusHD = createModel("Color HD Bullet Camera",
            getRandomCameraImage(), hiFocusCamera);
        createProduct(hiFocusHD, "Hi-Focus Color HD Bullet Camera",
            "HD bullet camera with excellent image quality. Perfect for outdoor surveillance.",
            new BigDecimal("5500"), new BigDecimal("7000"), true, 4.4, 200,
            Map.of("Resolution", "2MP HD", "Lens", "Fixed", "Night Vision", "IR Night Vision",
                   "Weatherproof", "IP66", "Power Supply", "12VDC", "Warranty", "2 Years"));

        // Consistent HD Camera
        Brand consistentCamera = createBrand("Consistent", bulletCameras);
        Model consistentHD = createModel("Color HD Camera",
            getRandomCameraImage(), consistentCamera);
        createProduct(consistentHD, "Consistent Color HD Camera",
            "Reliable HD camera with good performance. Cost-effective solution for surveillance.",
            new BigDecimal("5000"), new BigDecimal("6500"), true, 4.3, 180,
            Map.of("Resolution", "2MP HD", "Lens", "Fixed", "Night Vision", "IR Night Vision",
                   "Weatherproof", "IP66", "Power Supply", "12VDC", "Warranty", "2 Years"));
    }

    private void seedComputerProducts(Service computersService, ProductCategory desktopPC,
                                     ProductCategory printers, ProductCategory monitors,
                                     ProductCategory computerAccessories) {
        
        // HP Desktop PC
        Brand hp = createBrand("HP", desktopPC);
        Model hpDesktop = createModel("HP DT AIO-24-CR0901IN",
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300", hp);
        createProduct(hpDesktop, "HP Desktop PC AIO-24-CR0901IN",
            "All-in-one desktop PC with integrated 24-inch FHD display. Features Intel Core i5 processor, 8GB RAM, and 512GB SSD. Perfect for office and home use with modern design and space-saving form factor.",
            new BigDecimal("45000"), new BigDecimal("55000"), true, 4.6, 150,
            Map.of("Processor", "Intel Core i5 11th Gen", "RAM", "8GB DDR4", "Storage", "512GB SSD",
                   "Display", "24 inch FHD IPS", "Graphics", "Integrated", "OS", "Windows 11 Home",
                   "Ports", "USB 3.0, HDMI, Ethernet", "Warranty", "3 Years"));

        // TCS Barcode Printer
        Brand tcs = createBrand("TCS", printers);
        Model tcsPrinter = createModel("Barcode Printer TE 244",
            "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300", tcs);
        createProduct(tcsPrinter, "TCS Barcode Printer TE 244",
            "Professional thermal barcode printer for labels and tags. High-speed printing at 4 inches per second with excellent print quality at 203 DPI. Perfect for retail and warehouse applications.",
            new BigDecimal("25000"), new BigDecimal("30000"), true, 4.7, 95,
            Map.of("Print Speed", "4 inches/sec", "Resolution", "203 DPI", "Connectivity", "USB, Ethernet, Serial",
                   "Label Width", "Up to 4 inches", "Label Length", "Variable", "Media Types", "Labels, Tags",
                   "Warranty", "1 Year"));

        // Dahua Monitor
        Brand dahua = createBrand("Dahua", monitors);
        Model dahuaMonitor = createModel("LED 19 Inch",
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300", dahua);
        createProduct(dahuaMonitor, "Dahua LED 19 Inch Monitor",
            "19-inch LED monitor perfect for CCTV monitoring and general use. Features multiple video inputs (VGA, HDMI, BNC) and excellent viewing angles. Ideal for control rooms and security applications.",
            new BigDecimal("8500"), new BigDecimal("10000"), true, 4.5, 120,
            Map.of("Size", "19 inch", "Resolution", "1366x768", "Inputs", "VGA, HDMI, BNC",
                   "Viewing Angle", "178°", "Response Time", "5ms", "Brightness", "250 cd/m²",
                   "Warranty", "2 Years"));

        // Logitech Wireless Mouse
        Brand logitech = createBrand("Logitech", computerAccessories);
        Model logitechMouse = createModel("Wireless Mouse",
            "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300", logitech);
        createProduct(logitechMouse, "Logitech Wireless Mouse",
            "Ergonomic wireless mouse with long battery life up to 18 months. Features smooth scrolling, precise tracking, and comfortable design. Perfect for office and home use.",
            new BigDecimal("1200"), new BigDecimal("1500"), true, 4.6, 500,
            Map.of("Connectivity", "Wireless 2.4GHz", "Battery Life", "Up to 18 months", "DPI", "1000",
                   "Buttons", "3", "Scroll", "Smooth Scrolling", "Compatibility", "Windows, Mac, Linux",
                   "Warranty", "1 Year"));
    }

    private void seedNetworkingProducts(Service networkingService, ProductCategory networkSwitches,
                                       ProductCategory routers, ProductCategory cables,
                                       ProductCategory poeSwitches) {
        
        // D-Link 10-Port Switch
        Brand dlink = createBrand("D-Link", networkSwitches);
        Model dlink10Port = createModel("10-Port Gigabit Smart Switch",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", dlink);
        createProduct(dlink10Port, "D-Link 10-Port Gigabit Smart Switch",
            "Managed gigabit switch with 10 ports. Features VLAN support, QoS for optimized network performance, and web-based management interface.",
            new BigDecimal("12000"), new BigDecimal("15000"), true, 4.6, 180,
            Map.of("Ports", "10 Gigabit Ports", "Management", "Smart Managed", "VLAN", "Yes",
                   "QoS", "Yes", "Switching Capacity", "20 Gbps", "MAC Address Table", "8K entries",
                   "Warranty", "3 Years"));

        // D-Link 24-Port Switch
        Model dlink24Port = createModel("24-Port Gigabit Switch",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", dlink);
        createProduct(dlink24Port, "D-Link 24-Port Gigabit Switch",
            "High-performance 24-port gigabit switch. Ideal for medium to large networks with advanced management features including stacking capability.",
            new BigDecimal("25000"), new BigDecimal("30000"), true, 4.7, 150,
            Map.of("Ports", "24 Gigabit Ports", "Management", "Fully Managed", "VLAN", "Yes",
                   "Stacking", "Yes", "Switching Capacity", "48 Gbps", "MAC Address Table", "16K entries",
                   "Warranty", "3 Years"));

        // Rova POE Switch 16 Port
        Brand rova = createBrand("Rova", poeSwitches);
        Model rovaPOE16 = createModel("16 Port POE Switch",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", rova);
        createProduct(rovaPOE16, "Rova 16 Port POE Switch",
            "16-port POE switch with 2 SFP uplink ports. Provides power and data over single cable, reducing installation complexity. Total POE power budget of 300W.",
            new BigDecimal("18000"), new BigDecimal("22000"), true, 4.5, 200,
            Map.of("POE Ports", "16", "POE Power", "300W Total", "Uplink", "2 SFP Ports",
                   "Standards", "IEEE 802.3af/at", "Per Port Power", "Up to 30W", "Warranty", "2 Years"));

        // Tenda POE 16 Port
        Brand tenda = createBrand("Tenda", poeSwitches);
        Model tendaPOE16 = createModel("16 Port POE Gigabit",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", tenda);
        createProduct(tendaPOE16, "Tenda 16 Port POE Gigabit Switch",
            "Cost-effective 16-port POE switch. Perfect for small to medium CCTV installations with reliable power delivery.",
            new BigDecimal("15000"), new BigDecimal("18000"), true, 4.4, 180,
            Map.of("POE Ports", "16", "POE Power", "250W Total", "Speed", "Gigabit",
                   "Standards", "IEEE 802.3af", "Per Port Power", "Up to 15.4W", "Warranty", "2 Years"));

        // Consistent 5-Port Switch
        Brand consistent = createBrand("Consistent", networkSwitches);
        Model consistent5Port = createModel("5 Port Network Switch",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", consistent);
        createProduct(consistent5Port, "Consistent 5 Port Network Switch",
            "Compact 5-port unmanaged switch. Simple plug-and-play solution for small networks and home offices.",
            new BigDecimal("2500"), new BigDecimal("3000"), true, 4.3, 250,
            Map.of("Ports", "5", "Speed", "10/100 Mbps", "Type", "Unmanaged",
                   "LED Indicators", "Yes", "Auto MDI/MDIX", "Yes", "Warranty", "1 Year"));

        // Rova 5-Port Switch
        Model rova5Port = createModel("5-Port Switch",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", rova);
        createProduct(rova5Port, "Rova 5-Port Network Switch",
            "Affordable 5-port network switch for basic networking needs. Reliable and easy to use.",
            new BigDecimal("2000"), new BigDecimal("2500"), true, 4.2, 200,
            Map.of("Ports", "5", "Speed", "10/100 Mbps", "Type", "Unmanaged",
                   "LED Indicators", "Yes", "Warranty", "1 Year"));

        // Consistent 4G Router
        Brand consistentRouter = createBrand("Consistent", routers);
        Model consistent4G = createModel("4G Router",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", consistentRouter);
        createProduct(consistent4G, "Consistent 4G Router",
            "4G LTE router with WiFi. Perfect for locations without wired internet connection. Supports multiple devices simultaneously.",
            new BigDecimal("4500"), new BigDecimal("6000"), true, 4.5, 120,
            Map.of("4G Support", "Yes", "WiFi", "802.11n", "Ports", "4 LAN Ports",
                   "SIM Slot", "Yes", "Speed", "Up to 150Mbps", "Warranty", "1 Year"));

        // Mastel 4G Router
        Brand mastel = createBrand("Mastel", routers);
        Model mastel4G = createModel("4G Router",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", mastel);
        createProduct(mastel4G, "Mastel 4G Router",
            "High-speed 4G router with advanced features. Supports multiple devices simultaneously with excellent coverage.",
            new BigDecimal("5000"), new BigDecimal("6500"), true, 4.6, 100,
            Map.of("4G Support", "Yes", "WiFi", "802.11ac", "Ports", "4 LAN Ports",
                   "Speed", "Up to 150Mbps", "Antennas", "2 External", "Warranty", "1 Year"));

        // Tenda Router
        Brand tendaRouter = createBrand("Tenda", routers);
        Model tendaRouterModel = createModel("Tenda Router",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", tendaRouter);
        createProduct(tendaRouterModel, "Tenda Wireless Router",
            "Dual-band wireless router with excellent coverage. Features parental controls, guest network, and easy setup.",
            new BigDecimal("3500"), new BigDecimal("4500"), true, 4.4, 300,
            Map.of("WiFi", "Dual-band AC1200", "Ports", "4 LAN + 1 WAN", "Antennas", "4 External",
                   "Coverage", "Up to 2000 sq ft", "Guest Network", "Yes", "Warranty", "1 Year"));

        // Hi-Focus Outdoor Tenda P2P
        Brand hiFocus = createBrand("Hi-Focus", routers);
        Model hiFocusTenda = createModel("Outdoor Tenda P2P",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", hiFocus);
        createProduct(hiFocusTenda, "Hi-Focus Outdoor Tenda P2P",
            "Outdoor point-to-point wireless bridge. Extends network connectivity over long distances up to 5km.",
            new BigDecimal("12000"), new BigDecimal("15000"), true, 4.5, 80,
            Map.of("Range", "Up to 5km", "Speed", "300Mbps", "Weatherproof", "IP65",
                   "Antennas", "High Gain", "Frequency", "5GHz", "Warranty", "2 Years"));

        // True View Wireless Router
        Brand trueView = createBrand("True View", routers);
        Model trueViewRouter = createModel("Wireless Router",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", trueView);
        createProduct(trueViewRouter, "True View Wireless Router",
            "High-performance wireless router with advanced security features including WPA3 support.",
            new BigDecimal("4000"), new BigDecimal("5000"), true, 4.4, 150,
            Map.of("WiFi", "AC1200", "Ports", "4 LAN + 1 WAN", "Security", "WPA3",
                   "Coverage", "Up to 1500 sq ft", "Parental Controls", "Yes", "Warranty", "1 Year"));

        // CP Plus Wireless Router
        Brand cpPlus = createBrand("CP Plus", routers);
        Model cpPlusRouter = createModel("Wireless Router",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", cpPlus);
        createProduct(cpPlusRouter, "CP Plus Wireless Router",
            "Reliable wireless router for home and office use. Features easy setup and good coverage.",
            new BigDecimal("3800"), new BigDecimal("4800"), true, 4.3, 180,
            Map.of("WiFi", "AC1200", "Ports", "4 LAN + 1 WAN", "Security", "WPA2",
                   "Coverage", "Up to 1200 sq ft", "Warranty", "1 Year"));

        // Mastel Tenda Router
        Model mastelTenda = createModel("Tenda Router",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", mastel);
        createProduct(mastelTenda, "Mastel Tenda Router",
            "Professional router solution with multiple Tenda configurations. Suitable for various network requirements.",
            new BigDecimal("4500"), new BigDecimal("5500"), true, 4.5, 120,
            Map.of("Configuration", "01 Tenda / 03 Tenda", "WiFi", "Dual-band", "Ports", "Multiple",
                   "Management", "Advanced", "Warranty", "1 Year"));

        // HyNet CCA Cable
        Brand hyNet = createBrand("HyNet", cables);
        Model hyNetCCA = createModel("CCA Cable",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hyNet);
        createProduct(hyNetCCA, "HyNet CCA Cable",
            "Copper-clad aluminum cable for CCTV installations. Cost-effective solution for short to medium distances up to 100 meters.",
            new BigDecimal("25"), new BigDecimal("30"), true, 4.2, 500,
            Map.of("Type", "CCA (Copper Clad Aluminum)", "Length", "305 meters", "Gauge", "24 AWG",
                   "Color", "Black", "Resistance", "Higher than pure copper", "Warranty", "1 Year"));

        // HyNet 3+1 CCTV Cable
        Model hyNet3Plus1 = createModel("3+1 CCTV Cable",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hyNet);
        createProduct(hyNet3Plus1, "HyNet 3+1 CCTV Cable",
            "3+1 CCTV cable with power and video transmission in single cable. Simplifies installation by combining video and power lines.",
            new BigDecimal("30"), new BigDecimal("35"), true, 4.3, 400,
            Map.of("Type", "3+1 (3 Video + 1 Power)", "Length", "305 meters", "Gauge", "22 AWG",
                   "Color", "Black", "Installation", "Easy", "Warranty", "1 Year"));

        // Olive CAT-6 Outdoor Cable
        Brand olive = createBrand("Olive", cables);
        Model oliveCat6 = createModel("CAT-6 Outdoor Cable",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", olive);
        createProduct(oliveCat6, "Olive CAT-6 Outdoor Cable",
            "Weatherproof CAT-6 cable for outdoor networking. Features UV protection and waterproof design for harsh environments.",
            new BigDecimal("45"), new BigDecimal("55"), true, 4.5, 200,
            Map.of("Type", "CAT-6", "Length", "305 meters", "Outdoor", "Yes",
                   "UV Protection", "Yes", "Weatherproof", "IP65", "Warranty", "2 Years"));

        // HyNet Copper Outdoor Cable
        Model hyNetCopper = createModel("Copper Outdoor Cable",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hyNet);
        createProduct(hyNetCopper, "HyNet Copper Outdoor Cable",
            "Pure copper outdoor cable on wooden roll. Excellent for long-distance installations with superior signal quality.",
            new BigDecimal("50"), new BigDecimal("60"), true, 4.4, 150,
            Map.of("Type", "Pure Copper", "Length", "500 meters", "Outdoor", "Yes",
                   "Gauge", "24 AWG", "Material", "Pure Copper", "Warranty", "2 Years"));
    }

    private void seedAccessControlProducts(Service accessControlService, ProductCategory biometricDevices,
                                          ProductCategory doorLocks, ProductCategory faceMachines) {
        
        // Essel Biometric Device
        Brand essel = createBrand("Essel", biometricDevices);
        Model esselBio = createModel("Biometric Device",
            "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300", essel);
        createProduct(esselBio, "Essel Biometric Device",
            "Fingerprint-based biometric attendance system. Features large capacity (3000 fingerprints), color LCD display, and cloud sync capabilities.",
            new BigDecimal("18000"), new BigDecimal("22000"), true, 4.6, 250,
            Map.of("Capacity", "3000 Fingerprints", "Display", "2.8\" Color LCD", "Connectivity", "TCP/IP, USB Host",
                   "Reports", "Yes", "Cloud Sync", "Yes", "Multi-user", "Yes", "Warranty", "2 Years"));

        // Essel Biometric Door Lock
        Brand esselLock = createBrand("Essel", doorLocks);
        Model esselDoorLock = createModel("Biometric Door Lock",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", esselLock);
        createProduct(esselDoorLock, "Essel Biometric Door Lock",
            "Smart biometric door lock with fingerprint and PIN access. Features mobile app control, auto-lock, and rechargeable battery.",
            new BigDecimal("25000"), new BigDecimal("30000"), true, 4.7, 180,
            Map.of("Access", "Fingerprint + PIN", "Capacity", "100 Fingerprints", "Mobile App", "Yes",
                   "Battery", "Rechargeable", "Auto Lock", "Yes", "Warranty", "2 Years"));

        // Frameless Glass Door Lock
        Model glassDoorLock = createModel("Frameless Glass Door Lock",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", esselLock);
        createProduct(glassDoorLock, "Frameless Glass Door Lock",
            "Elegant frameless glass door lock with electronic access control. Perfect for modern offices and commercial spaces.",
            new BigDecimal("15000"), new BigDecimal("20000"), true, 4.5, 100,
            Map.of("Type", "Frameless Glass", "Access", "RFID/Card", "Battery", "Rechargeable",
                   "Design", "Sleek Modern", "Installation", "Easy", "Warranty", "1 Year"));

        // Hikvision Face Machine
        Brand hikvision = createBrand("Hikvision", faceMachines);
        Model hikvisionFace = createModel("Biometric Face Machine",
            "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300", hikvision);
        createProduct(hikvisionFace, "Hikvision Biometric Face Machine",
            "Advanced face recognition system with AI technology. Fast and accurate identification in less than 1 second.",
            new BigDecimal("35000"), new BigDecimal("45000"), true, 4.8, 120,
            Map.of("Recognition", "Face Recognition", "Capacity", "5000 Faces", "Speed", "< 1 second",
                   "AI Technology", "Yes", "Mask Detection", "Yes", "Warranty", "3 Years"));

        // Essel Face Machine AI
        Model esselFaceAI = createModel("Face Mars AI Essel",
            "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300", essel);
        createProduct(esselFaceAI, "Essel Face Mars AI",
            "AI-powered face recognition machine with mask detection. Advanced security features including temperature measurement option.",
            new BigDecimal("40000"), new BigDecimal("50000"), true, 4.7, 95,
            Map.of("Recognition", "Face Recognition + AI", "Capacity", "10000 Faces", "Mask Detection", "Yes",
                   "Temperature", "Optional", "Speed", "< 0.5 seconds", "Warranty", "2 Years"));

        // Fingerprint Scanner with Face ID
        Model fingerprintScanner = createModel("Scanner with Face ID",
            "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300", essel);
        createProduct(fingerprintScanner, "Fingerprint Scanner with Face ID",
            "Dual biometric scanner supporting both fingerprint and face recognition. High accuracy and speed with color LCD display.",
            new BigDecimal("22000"), new BigDecimal("28000"), true, 4.6, 140,
            Map.of("Biometrics", "Fingerprint + Face", "Capacity", "5000 Users", "Speed", "< 0.5 seconds",
                   "Display", "Color LCD", "Connectivity", "TCP/IP, USB", "Warranty", "2 Years"));
    }

    private void seedFireAlarmProducts(Service fireAlarmService, ProductCategory firePanels,
                                      ProductCategory smokeDetectors) {
        
        // Impact Fire Alarm Panel
        Brand impact = createBrand("Impact", firePanels);
        Model impactPanel = createModel("Fire Alarm Panel",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", impact);
        createProduct(impactPanel, "Impact Fire Alarm Panel",
            "Advanced fire alarm control panel with multiple zones. Features LCD display, battery backup, and EN54 certification.",
            new BigDecimal("35000"), new BigDecimal("45000"), true, 4.7, 85,
            Map.of("Zones", "Multiple Zones", "Display", "LCD", "Battery Backup", "Yes",
                   "Standards", "EN54 Certified", "Alarm Output", "Yes", "Warranty", "2 Years"));

        // Fire Alarm Zone Panel
        Model firePanel = createModel("Zone Panel",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", impact);
        createProduct(firePanel, "Fire Alarm Zone Panel",
            "Multi-zone fire alarm panel for commercial buildings. Reliable detection and alerting system with LED indicators.",
            new BigDecimal("30000"), new BigDecimal("38000"), true, 4.6, 120,
            Map.of("Zones", "Up to 8 Zones", "Display", "LED Indicators", "Battery Backup", "Yes",
                   "Standards", "EN54", "Alarm Sounder", "Built-in", "Warranty", "2 Years"));

        // Smoke Sensor
        Brand smokeSensorBrand = createBrand("Impact", smokeDetectors);
        Model smokeSensor = createModel("Smoke Sensor",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", smokeSensorBrand);
        createProduct(smokeSensor, "Smoke Sensor",
            "Photoelectric smoke detector with reliable detection. Easy installation and maintenance. Suitable for various environments.",
            new BigDecimal("2500"), new BigDecimal("3000"), true, 4.5, 200,
            Map.of("Type", "Photoelectric", "Voltage", "12VDC", "Operating Temp", "-10°C to +55°C",
                   "Standards", "EN54", "Sensitivity", "Adjustable", "Warranty", "2 Years"));
    }

    private void seedVideoDoorPhoneProducts(Service videoDoorPhoneService, ProductCategory videoDoorPhones) {
        
        // True View Video Doorbell
        Brand trueView = createBrand("True View", videoDoorPhones);
        Model trueViewDoorbell = createModel("WiFi Video Doorbell",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300", trueView);
        createProduct(trueViewDoorbell, "True View WiFi Video Doorbell",
            "Smart WiFi video doorbell with mobile app. Features two-way audio, motion detection, and night vision. Perfect for home security.",
            new BigDecimal("12000"), new BigDecimal("15000"), true, 4.6, 180,
            Map.of("Resolution", "1080p", "Connectivity", "WiFi", "Audio", "Two-way",
                   "Motion Detection", "Yes", "Mobile App", "Yes", "Night Vision", "Yes", "Warranty", "2 Years"));

        // Impact VDP
        Brand impact = createBrand("Impact", videoDoorPhones);
        Model impactVDP = createModel("Video Door Phone",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300", impact);
        createProduct(impactVDP, "Impact Video Door Phone",
            "HD video door phone system with indoor monitor. Clear video and audio communication with night vision capability.",
            new BigDecimal("15000"), new BigDecimal("18000"), true, 4.5, 150,
            Map.of("Resolution", "720p", "Display", "7 inch Indoor Monitor", "Audio", "Two-way",
                   "Night Vision", "Yes", "Wiring", "Wired", "Warranty", "2 Years"));

        // Hi-Focus VDP
        Brand hiFocus = createBrand("Hi-Focus", videoDoorPhones);
        Model hiFocusVDP = createModel("Video Door Phone",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300", hiFocus);
        createProduct(hiFocusVDP, "Hi-Focus Video Door Phone",
            "Cost-effective video door phone solution. Perfect for residential complexes with reliable performance.",
            new BigDecimal("10000"), new BigDecimal("13000"), true, 4.4, 200,
            Map.of("Resolution", "720p", "Display", "7 inch", "Audio", "Two-way",
                   "Night Vision", "Yes", "Wiring", "Wired", "Warranty", "1 Year"));

        // Hikvision VDP
        Brand hikvision = createBrand("Hikvision", videoDoorPhones);
        Model hikvisionVDP = createModel("Video Door Phone",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300", hikvision);
        createProduct(hikvisionVDP, "Hikvision Video Door Phone",
            "Professional video door phone system with advanced features. Supports multiple indoor stations and mobile app access.",
            new BigDecimal("20000"), new BigDecimal("25000"), true, 4.7, 160,
            Map.of("Resolution", "1080p", "Display", "10 inch Indoor Monitor", "Stations", "Multiple",
                   "Mobile App", "Yes", "Night Vision", "Yes", "Warranty", "3 Years"));

        // Vertel Smart Mini Pro
        Brand vertel = createBrand("Vertel", videoDoorPhones);
        Model vertelMini = createModel("Smart Mini Pro LF",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300", vertel);
        createProduct(vertelMini, "Vertel Smart Mini Pro LF",
            "Compact smart video door phone with advanced features. WiFi enabled with mobile app for remote access.",
            new BigDecimal("18000"), new BigDecimal("22000"), true, 4.6, 140,
            Map.of("Resolution", "1080p", "Connectivity", "WiFi", "Audio", "Two-way",
                   "Mobile App", "Yes", "Night Vision", "Yes", "Warranty", "2 Years"));
    }

    private void seedSolarProducts(Service solarService, ProductCategory solarInverters,
                                  ProductCategory solarBatteries, ProductCategory solarCables) {
        
        // Solar Inverter UTL
        Brand utl = createBrand("UTL", solarInverters);
        Model utlInverter = createModel("Solar Inverter UTL",
            "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300", utl);
        createProduct(utlInverter, "UTL Solar Inverter",
            "High-efficiency solar inverter for home and commercial use. Features MPPT technology, battery backup, and grid-tie capability. Efficiency over 95%.",
            new BigDecimal("25000"), new BigDecimal("30000"), true, 4.7, 120,
            Map.of("Capacity", "1kW to 5kW", "Technology", "MPPT", "Battery Backup", "Yes",
                   "Efficiency", ">95%", "Grid Tie", "Yes", "Warranty", "5 Years"));

        // Solar Battery
        Brand solarBatteryBrand = createBrand("UTL", solarBatteries);
        Model solarBattery = createModel("Solar Battery 12.8V",
            "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=300", solarBatteryBrand);
        createProduct(solarBattery, "Solar Battery 12.8V",
            "Deep cycle solar battery for energy storage. Long lifespan with 6000+ charge cycles. Available in 100Ah to 200Ah capacities.",
            new BigDecimal("15000"), new BigDecimal("20000"), true, 4.6, 150,
            Map.of("Voltage", "12.8V", "Capacity", "100Ah to 200Ah", "Type", "Lithium",
                   "Cycles", "6000+", "Depth of Discharge", "80%", "Warranty", "5 Years"));

        // Solar Cable
        Brand solarCableBrand = createBrand("UTL", solarCables);
        Model solarCable = createModel("DC Solar Cable 6 SQMM",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", solarCableBrand);
        createProduct(solarCable, "Solar Cable 1CX 6 SQMM DC",
            "Weatherproof DC solar cable for panel connections. UV resistant and durable for outdoor installations.",
            new BigDecimal("80"), new BigDecimal("100"), true, 4.5, 300,
            Map.of("Gauge", "6 SQMM", "Type", "DC Solar Cable", "Weatherproof", "Yes",
                   "UV Resistant", "Yes", "Length", "100 meters", "Warranty", "2 Years"));
    }

    private void seedAudioVideoProducts(Service audioVideoService, ProductCategory speakers,
                                       ProductCategory audioBoxes) {
        
        // Ahuja Speaker
        Brand ahuja = createBrand("Ahuja", speakers);
        Model ahujaSpeaker = createModel("Speaker",
            "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=300", ahuja);
        createProduct(ahujaSpeaker, "Ahuja Speaker",
            "Professional audio speaker with excellent sound quality. Perfect for announcements, background music, and public address systems.",
            new BigDecimal("3500"), new BigDecimal("4500"), true, 4.6, 200,
            Map.of("Power", "15W", "Type", "Ceiling/Wall Mount", "Frequency", "80Hz - 20kHz",
                   "Impedance", "8 Ohm", "Mounting", "Universal", "Warranty", "1 Year"));

        // Ceiling Speaker
        Model ceilingSpeaker = createModel("Metallic 6W 6 Inch",
            "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=300", ahuja);
        createProduct(ceilingSpeaker, "Metallic 6W 6 Inch Ceiling Speaker",
            "6-inch ceiling speaker with metallic finish. Perfect for background music and announcements in commercial spaces.",
            new BigDecimal("2500"), new BigDecimal("3000"), true, 4.5, 250,
            Map.of("Power", "6W", "Size", "6 Inch", "Type", "Ceiling Mount",
                   "Finish", "Metallic", "Frequency", "100Hz - 20kHz", "Warranty", "1 Year"));

        // Audio Box
        Brand audioBoxBrand = createBrand("Ahuja", audioBoxes);
        Model audioBox = createModel("2 Way Audio Box",
            "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=300", audioBoxBrand);
        createProduct(audioBox, "2 Way Audio Box",
            "Two-way audio box for intercom systems. Clear communication with noise cancellation technology.",
            new BigDecimal("4500"), new BigDecimal("5500"), true, 4.4, 180,
            Map.of("Audio", "Two-way", "Power", "12VDC", "Noise Cancellation", "Yes",
                   "Range", "Up to 100m", "Volume Control", "Yes", "Warranty", "1 Year"));
    }

    private void seedPowerSupplyProducts(Service powerSupplyService, ProductCategory adapters,
                                        ProductCategory ups, ProductCategory powerSupplies) {
        
        // Consistent Adapter 2MP
        Brand consistent = createBrand("Consistent", adapters);
        Model consistentAdapter2MP = createModel("2MP Adapter (12V 2Amp)",
            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300", consistent);
        createProduct(consistentAdapter2MP, "Consistent 2MP Adapter 12V 2Amp",
            "Power adapter for 2MP cameras. Reliable power supply with overcurrent and short circuit protection.",
            new BigDecimal("800"), new BigDecimal("1000"), true, 4.5, 400,
            Map.of("Output", "12V 2A", "Input", "100-240V AC", "Protection", "Overcurrent, Short Circuit",
                   "Efficiency", ">85%", "LED Indicator", "Yes", "Warranty", "1 Year"));

        // Consistent Adapter 5MP
        Model consistentAdapter5MP = createModel("5MP Adapter (12V 5Amp)",
            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300", consistent);
        createProduct(consistentAdapter5MP, "Consistent 5MP Adapter 12V 5Amp",
            "High-power adapter for 5MP cameras and multiple camera systems. Features full protection circuitry.",
            new BigDecimal("1500"), new BigDecimal("2000"), true, 4.6, 300,
            Map.of("Output", "12V 5A", "Input", "100-240V AC", "Protection", "Full Protection",
                   "Efficiency", ">85%", "Multiple Outputs", "Yes", "Warranty", "1 Year"));

        // Hikvision Power Supply 4 Channel
        Brand hikvision = createBrand("Hikvision", powerSupplies);
        Model hikvisionPS4 = createModel("4 Channel Power Supply",
            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300", hikvision);
        createProduct(hikvisionPS4, "Hikvision 4 Channel Power Supply",
            "4-channel centralized power supply for CCTV cameras. Features individual fuse protection for each channel.",
            new BigDecimal("3500"), new BigDecimal("4500"), true, 4.7, 250,
            Map.of("Channels", "4", "Output", "12V DC", "Total Power", "60W",
                   "Protection", "Individual Fuse", "LED Indicators", "Yes", "Warranty", "2 Years"));

        // EonSecure 16 Channel Power Supply
        Brand eonSecure = createBrand("EonSecure", powerSupplies);
        Model eonSecure16 = createModel("16 Channel Power Supply",
            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300", eonSecure);
        createProduct(eonSecure16, "EonSecure 16 Channel Power Supply",
            "16-channel power supply unit for large CCTV installations. Reliable and efficient with individual channel protection.",
            new BigDecimal("12000"), new BigDecimal("15000"), true, 4.6, 180,
            Map.of("Channels", "16", "Output", "12V DC", "Total Power", "200W",
                   "Protection", "Individual Fuse", "LED Indicators", "Yes", "Warranty", "2 Years"));

        // Consistent UPS
        Brand consistentUPS = createBrand("Consistent", ups);
        Model consistentUPSModel = createModel("UPS",
            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300", consistentUPS);
        createProduct(consistentUPSModel, "Consistent UPS",
            "Uninterruptible power supply for critical systems. Provides backup power during outages with automatic voltage regulation.",
            new BigDecimal("8000"), new BigDecimal("10000"), true, 4.5, 200,
            Map.of("Capacity", "600VA", "Backup Time", "15-30 minutes", "Battery", "Sealed Lead Acid",
                   "Output", "220V AC", "AVR", "Yes", "Warranty", "1 Year"));

        // Zebronic UPS
        Brand zebronic = createBrand("Zebronic", ups);
        Model zebronicUPS = createModel("UPS",
            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300", zebronic);
        createProduct(zebronicUPS, "Zebronic UPS",
            "Reliable UPS system for computers and CCTV. Features automatic voltage regulation and surge protection.",
            new BigDecimal("7500"), new BigDecimal("9500"), true, 4.4, 250,
            Map.of("Capacity", "600VA", "Backup Time", "10-20 minutes", "AVR", "Yes",
                   "Output", "220V AC", "Surge Protection", "Yes", "Warranty", "1 Year"));
    }

    private void seedAccessoriesProducts(Service accessoriesService, ProductCategory connectors,
                                        ProductCategory brackets, ProductCategory storage,
                                        ProductCategory cctvAccessories, ProductCategory epabxAccessories) {
        
        // WD Hard Disk 1TB
        Brand wd = createBrand("WD", storage);
        Model wd1TB = createModel("1TB Hard Disk",
            "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300", wd);
        createProduct(wd1TB, "WD 1TB Hard Disk",
            "Surveillance-grade 1TB hard disk for DVR/NVR systems. Designed for 24/7 operation with excellent reliability.",
            new BigDecimal("3500"), new BigDecimal("4000"), true, 4.7, 500,
            Map.of("Capacity", "1TB", "RPM", "5400", "Interface", "SATA 6Gb/s",
                   "Type", "Surveillance", "Workload", "24/7", "Warranty", "3 Years"));

        // WD Hard Disk 2TB
        Model wd2TB = createModel("2TB Hard Disk",
            "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300", wd);
        createProduct(wd2TB, "WD 2TB Hard Disk",
            "2TB surveillance hard disk with excellent reliability. Perfect for extended recording periods.",
            new BigDecimal("5500"), new BigDecimal("6500"), true, 4.7, 400,
            Map.of("Capacity", "2TB", "RPM", "5400", "Interface", "SATA 6Gb/s",
                   "Type", "Surveillance", "Workload", "24/7", "Warranty", "3 Years"));

        // WD Hard Disk 3TB
        Model wd3TB = createModel("3TB Hard Disk",
            "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300", wd);
        createProduct(wd3TB, "WD 3TB Hard Disk",
            "High-capacity 3TB hard disk for large surveillance systems. Extended recording capability.",
            new BigDecimal("7500"), new BigDecimal("9000"), true, 4.6, 300,
            Map.of("Capacity", "3TB", "RPM", "5400", "Interface", "SATA 6Gb/s",
                   "Type", "Surveillance", "Workload", "24/7", "Warranty", "3 Years"));

        // WD Hard Disk 6TB
        Model wd6TB = createModel("6TB Hard Disk",
            "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300", wd);
        createProduct(wd6TB, "WD 6TB Hard Disk",
            "Large capacity 6TB hard disk for enterprise surveillance systems. Maximum recording time.",
            new BigDecimal("15000"), new BigDecimal("18000"), true, 4.6, 200,
            Map.of("Capacity", "6TB", "RPM", "5400", "Interface", "SATA 6Gb/s",
                   "Type", "Surveillance", "Workload", "24/7", "Warranty", "3 Years"));

        // WD Hard Disk 8TB
        Model wd8TB = createModel("8TB Hard Disk",
            "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300", wd);
        createProduct(wd8TB, "WD 8TB Hard Disk",
            "Ultra-high capacity 8TB hard disk for large-scale surveillance deployments.",
            new BigDecimal("20000"), new BigDecimal("25000"), true, 4.5, 150,
            Map.of("Capacity", "8TB", "RPM", "5400", "Interface", "SATA 6Gb/s",
                   "Type", "Surveillance", "Workload", "24/7", "Warranty", "3 Years"));

        // WD Hard Disk 10TB
        Model wd10TB = createModel("10TB Hard Disk",
            "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300", wd);
        createProduct(wd10TB, "WD 10TB Hard Disk",
            "Enterprise-grade 10TB hard disk for maximum storage capacity in surveillance systems.",
            new BigDecimal("25000"), new BigDecimal("30000"), true, 4.5, 100,
            Map.of("Capacity", "10TB", "RPM", "5400", "Interface", "SATA 6Gb/s",
                   "Type", "Surveillance", "Workload", "24/7", "Warranty", "3 Years"));

        // Hi-Focus HDMI Cable
        Brand hiFocus = createBrand("Hi-Focus", connectors);
        Model hiFocusHDMI = createModel("HDMI 3 Meter",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hiFocus);
        createProduct(hiFocusHDMI, "Hi-Focus HDMI Cable 3 Meter",
            "High-quality HDMI cable for DVR to monitor connection. Supports 4K resolution with gold-plated connectors.",
            new BigDecimal("500"), new BigDecimal("600"), true, 4.5, 400,
            Map.of("Length", "3 meters", "Version", "HDMI 2.0", "Resolution", "Up to 4K",
                   "Gold Plated", "Yes", "Shielded", "Yes", "Warranty", "1 Year"));

        // Hi-Focus Memory Card 128GB
        Brand hiFocusStorage = createBrand("Hi-Focus", storage);
        Model hiFocus128GB = createModel("128GB Memory Card",
            "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300", hiFocusStorage);
        createProduct(hiFocus128GB, "Hi-Focus 128GB Memory Card",
            "High-speed 128GB memory card for IP cameras. Class 10 with excellent write speed up to 100MB/s.",
            new BigDecimal("1200"), new BigDecimal("1500"), true, 4.6, 350,
            Map.of("Capacity", "128GB", "Class", "Class 10", "Speed", "Up to 100MB/s",
                   "Type", "MicroSD", "Endurance", "High", "Warranty", "1 Year"));

        // Hi-Focus Memory Card 64GB
        Model hiFocus64GB = createModel("64GB Memory Card",
            "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300", hiFocusStorage);
        createProduct(hiFocus64GB, "Hi-Focus 64GB Memory Card",
            "64GB memory card for IP cameras. Reliable storage solution with good performance.",
            new BigDecimal("800"), new BigDecimal("1000"), true, 4.5, 400,
            Map.of("Capacity", "64GB", "Class", "Class 10", "Speed", "Up to 80MB/s",
                   "Type", "MicroSD", "Endurance", "High", "Warranty", "1 Year"));

        // Hi-Focus BNC Connector
        Model hiFocusBNC = createModel("BNC Connector",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hiFocus);
        createProduct(hiFocusBNC, "Hi-Focus BNC Connector",
            "High-quality BNC connector for CCTV cable termination. Easy installation with gold-plated contacts.",
            new BigDecimal("50"), new BigDecimal("60"), true, 4.4, 500,
            Map.of("Type", "BNC", "Cable Size", "RG59", "Gold Plated", "Yes",
                   "Pack", "10 pieces", "Installation", "Crimp Type", "Warranty", "1 Year"));

        // VGA Cable
        Model vgaCable = createModel("VGA Cable",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hiFocus);
        createProduct(vgaCable, "VGA Cable",
            "Standard VGA cable for monitor connections. Supports up to 1920x1080 resolution with shielded design.",
            new BigDecimal("400"), new BigDecimal("500"), true, 4.3, 300,
            Map.of("Length", "3 meters", "Resolution", "Up to 1080p", "Shielded", "Yes",
                   "Connectors", "Male to Male", "Gold Plated", "Yes", "Warranty", "1 Year"));

        // Video Balun
        Model videoBalun = createModel("Video Balun",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hiFocus);
        createProduct(videoBalun, "Hi-Focus Video Balun",
            "Video balun for converting BNC to UTP cable. Extends camera distance up to 600 meters.",
            new BigDecimal("300"), new BigDecimal("400"), true, 4.4, 200,
            Map.of("Type", "Active Video Balun", "Distance", "Up to 600m", "Input", "BNC",
                   "Output", "UTP", "Power", "12VDC", "Warranty", "1 Year"));

        // Clips
        Model clips = createModel("Cable Clips 6mm/10mm/12mm",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hiFocus);
        createProduct(clips, "Cable Clips 6mm, 10mm, 12mm",
            "Cable clips for organizing and securing CCTV cables. Available in multiple sizes for different cable diameters.",
            new BigDecimal("200"), new BigDecimal("250"), true, 4.3, 600,
            Map.of("Sizes", "6mm, 10mm, 12mm", "Material", "Plastic", "Pack", "100 pieces",
                   "Color", "White", "Installation", "Nail Type", "Warranty", "N/A"));

        // EM Lock Bracket
        Brand bracketBrand = createBrand("Hi-Focus", brackets);
        Model emLockBracket = createModel("EM Lock Bracket",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", bracketBrand);
        createProduct(emLockBracket, "EM Lock Bracket",
            "Mounting bracket for electromagnetic locks. Durable stainless steel construction with powder-coated finish.",
            new BigDecimal("1500"), new BigDecimal("2000"), true, 4.4, 150,
            Map.of("Type", "EM Lock Bracket", "Material", "Stainless Steel", "Finish", "Powder Coated",
                   "Compatibility", "Standard EM Locks", "Mounting", "Wall Mount", "Warranty", "1 Year"));

        // JB (Junction Box)
        Model jb = createModel("Junction Box",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hiFocus);
        createProduct(jb, "Junction Box",
            "Weatherproof junction box for cable connections. Protects connections from weather and environmental factors.",
            new BigDecimal("800"), new BigDecimal("1000"), true, 4.5, 250,
            Map.of("Material", "Plastic", "Weatherproof", "IP65", "Size", "Standard",
                   "Mounting", "Wall Mount", "Cable Entry", "Multiple", "Warranty", "1 Year"));

        // Remote Control
        Model remoteControl = createModel("Remote Control Zook",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hiFocus);
        createProduct(remoteControl, "Remote Control Zook",
            "Universal remote control for PTZ cameras. Easy to use with multiple camera support and long range.",
            new BigDecimal("2500"), new BigDecimal("3000"), true, 4.4, 180,
            Map.of("Type", "PTZ Camera Remote", "Range", "Up to 100m", "Battery", "AA Batteries",
                   "Compatibility", "Multiple Brands", "Functions", "Pan, Tilt, Zoom", "Warranty", "1 Year"));

        // 30 Pair Module with 2 Krone
        Model module30Pair = createModel("30 Pair Module with 2 Krone",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hiFocus);
        createProduct(module30Pair, "30 Pair Module with 2 Krone",
            "Telephone module with 30 pair capacity and 2 Krone blocks. For EPABX installations and telephone systems.",
            new BigDecimal("1200"), new BigDecimal("1500"), true, 4.3, 100,
            Map.of("Pairs", "30", "Krone Blocks", "2", "Type", "Telephone Module",
                   "Mounting", "Rack Mount", "Compatibility", "Standard EPABX", "Warranty", "1 Year"));

        // Hikvision External Siren
        Brand hikvisionAlarm = createBrand("Hikvision", cctvAccessories);
        Model hikvisionSiren = createModel("Wireless External Siren",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hikvisionAlarm);
        createProduct(hikvisionSiren, "Hikvision Wireless External Siren",
            "Wireless external siren for security systems. Loud alarm at 110dB with weatherproof design.",
            new BigDecimal("3500"), new BigDecimal("4500"), true, 4.5, 120,
            Map.of("Type", "Wireless", "Sound Level", "110dB", "Weatherproof", "IP65",
                   "Battery", "Rechargeable", "Range", "Up to 200m", "Warranty", "2 Years"));

        // Hikvision Intrusion Alarm
        Model hikvisionIntrusion = createModel("Wireless Intrusion Alarm",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hikvisionAlarm);
        createProduct(hikvisionIntrusion, "Hikvision Wireless Intrusion Alarm",
            "Wireless intrusion detection alarm system. Features motion sensors, remote monitoring, and mobile app control.",
            new BigDecimal("12000"), new BigDecimal("15000"), true, 4.6, 95,
            Map.of("Type", "Wireless", "Sensors", "Motion Detection", "Mobile App", "Yes",
                   "Battery", "Rechargeable", "Zones", "Multiple", "Warranty", "2 Years"));

        // Hikvision Magnetic Detector
        Model hikvisionMagnet = createModel("Wireless Magnetic Detector",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hikvisionAlarm);
        createProduct(hikvisionMagnet, "Hikvision Wireless Magnetic Detector",
            "Wireless magnetic door/window sensor. Detects opening and closing with long battery life.",
            new BigDecimal("2500"), new BigDecimal("3000"), true, 4.5, 200,
            Map.of("Type", "Wireless", "Detection", "Magnetic", "Range", "Up to 50m",
                   "Battery", "Long Life", "Installation", "Easy", "Warranty", "2 Years"));

        // Hikvision Security System
        Model hikvisionSecurity = createModel("Wireless Security System",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hikvisionAlarm);
        createProduct(hikvisionSecurity, "Hikvision Wireless Security System",
            "Complete wireless security system with multiple sensors and central control panel. Features mobile app and cloud connectivity.",
            new BigDecimal("35000"), new BigDecimal("45000"), true, 4.7, 80,
            Map.of("Components", "Control Panel + Sensors", "Connectivity", "Wireless", "Mobile App", "Yes",
                   "Zones", "Multiple Zones", "Cloud", "Yes", "Warranty", "2 Years"));

        // Next View Smart LED 32 Inch  
        Brand nextView = createBrand("Next View", cctvAccessories);
        Model nextViewLED = createModel("32 Inch Smart LED",
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300", nextView);
        createProduct(nextViewLED, "Next View Smart LED 32 Inch",
            "32-inch smart LED display for digital signage and information display. Features WiFi connectivity and smart features.",
            new BigDecimal("25000"), new BigDecimal("30000"), true, 4.5, 100,
            Map.of("Size", "32 inch", "Resolution", "Full HD", "Smart Features", "Yes",
                   "Connectivity", "WiFi, HDMI", "OS", "Android", "Warranty", "2 Years"));

        // Beetal G10 Telephone
        Brand beetal = createBrand("Beetal", epabxAccessories);
        Model beetalPhone = createModel("G10 Telephone Handset",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", beetal);
        createProduct(beetalPhone, "Beetal G10 Telephone Handset",
            "Professional telephone handset for EPABX systems. Clear audio quality and comfortable design.",
            new BigDecimal("800"), new BigDecimal("1000"), true, 4.4, 300,
            Map.of("Type", "Telephone Handset", "Compatibility", "EPABX", "Cord Length", "Standard",
                   "Audio", "Clear", "Design", "Ergonomic", "Warranty", "1 Year"));
    }

    private void seedEPABXProducts(Service epabxService, ProductCategory epabxAccessories) {
        // EPABX accessories are already covered in accessories
    }

    // ========== NEW SEEDING METHODS FOR CLIENT REQUIREMENTS ==========
    
    private void seedIPHDSystems(ProductCategory ipHdSystems) {
        // IP HD System Components: IP Cameras, NVR, POE Switches, CAT 6 Cables, Hard Disk, Connectors
        // Brands: Prama, CP Plus, Hikvision, Trueview, Consistent
        
        // IP Cameras - Various Types
        // Dome Cameras
        Brand prama = createBrand("Prama", ipHdSystems);
        Brand cpPlus = createBrand("CP Plus", ipHdSystems);
        Brand hikvision = createBrand("Hikvision", ipHdSystems);
        Brand trueview = createBrand("Trueview", ipHdSystems);
        Brand consistent = createBrand("Consistent", ipHdSystems);
        
        // Dome Camera - Prama
        Model pramaDome = createModel("Dome Camera", getRandomCameraImage(), prama);
        createProduct(pramaDome, "Prama IP HD Dome Camera",
            "IP HD dome camera for indoor use. Features digital image processor for superior quality, PoE support, and excellent low-light performance.",
            new BigDecimal("8500"), new BigDecimal("10000"), true, 4.5, 120,
            Map.of("Resolution", "4MP", "Type", "Dome - Indoor", "Power", "PoE", "Image Quality", "Digital Processor",
                   "Night Vision", "IR up to 30m", "Warranty", "2 Years On-site"));
        
        // Bullet Camera - Hikvision
        Model hikvisionBullet = createModel("Bullet Camera", getRandomCameraImage(), hikvision);
        createProduct(hikvisionBullet, "Hikvision IP HD Bullet Camera",
            "IP HD bullet camera for outdoor use. Weatherproof design with digital image processing for superior image quality.",
            new BigDecimal("9500"), new BigDecimal("12000"), true, 4.7, 200,
            Map.of("Resolution", "4MP", "Type", "Bullet - Outdoor", "Power", "PoE", "Weatherproof", "IP67",
                   "Image Quality", "Digital Processor", "Warranty", "2 Years On-site"));
        
        // Varifocal Camera - Prama
        Model pramaVarifocal = createModel("Varifocal Zoom Lens IR Camera", getRandomCameraImage(), prama);
        createProduct(pramaVarifocal, "Prama Varifocal Zoom Lens IR Camera",
            "Varifocal IP camera for long distance monitoring. Adjustable focal length with powerful IR night vision.",
            new BigDecimal("12000"), new BigDecimal("15000"), true, 4.6, 95,
            Map.of("Resolution", "4MP", "Type", "Varifocal", "Lens", "2.8-12mm", "Night Vision", "IR up to 50m",
                   "Power", "PoE", "Warranty", "2 Years On-site"));
        
        // PTZ Camera - Hikvision
        Model hikvisionPTZ = createModel("PTZ Camera", getRandomCameraImage(), hikvision);
        createProduct(hikvisionPTZ, "Hikvision IP HD PTZ Camera",
            "Advanced PTZ camera with 360° rotation and zoom. Perfect for large area surveillance with digital image processing.",
            new BigDecimal("45000"), new BigDecimal("55000"), true, 4.8, 85,
            Map.of("Resolution", "4MP", "Type", "PTZ", "Zoom", "20x Optical", "Rotation", "360°",
                   "Power", "PoE+", "Warranty", "2 Years On-site"));
        
        // WiFi Camera - CP Plus
        Model cpPlusWiFi = createModel("WiFi Camera", getRandomCameraImage(), cpPlus);
        createProduct(cpPlusWiFi, "CP Plus IP HD WiFi Camera",
            "Wireless IP HD camera with WiFi connectivity. Easy installation with mobile app support.",
            new BigDecimal("6500"), new BigDecimal("8000"), true, 4.4, 150,
            Map.of("Resolution", "2MP", "Type", "WiFi", "Connectivity", "WiFi 802.11n", "Mobile App", "Yes",
                   "Power", "12VDC", "Warranty", "2 Years On-site"));
        
        // 4G Camera - Trueview
        Model trueview4G = createModel("4G Camera", getRandomCameraImage(), trueview);
        createProduct(trueview4G, "Trueview IP HD 4G Camera",
            "4G enabled IP HD camera for remote locations. No internet wiring required, works on 4G network.",
            new BigDecimal("18000"), new BigDecimal("22000"), true, 4.5, 100,
            Map.of("Resolution", "4MP", "Type", "4G Camera", "Connectivity", "4G LTE", "Power", "12VDC",
                   "Mobile App", "Yes", "Warranty", "2 Years On-site"));
        
        // Solar Camera - Consistent
        Model consistentSolar = createModel("Solar Camera", getRandomCameraImage(), consistent);
        createProduct(consistentSolar, "Consistent IP HD Solar Camera",
            "Solar-powered IP HD camera with battery backup. Perfect for locations without power supply.",
            new BigDecimal("25000"), new BigDecimal("30000"), true, 4.6, 80,
            Map.of("Resolution", "4MP", "Type", "Solar Camera", "Power", "Solar + Battery", "Weatherproof", "IP67",
                   "Mobile App", "Yes", "Warranty", "2 Years On-site"));
        
        // NVR (Network Video Recorder) - Hikvision
        Model hikvisionNVR = createModel("NVR 16 Channel", "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", hikvision);
        createProduct(hikvisionNVR, "Hikvision 16 Channel NVR",
            "Network Video Recorder for IP HD systems. Supports up to 16 IP cameras with H.265+ compression.",
            new BigDecimal("25000"), new BigDecimal("30000"), true, 4.7, 150,
            Map.of("Channels", "16", "Type", "NVR", "Compression", "H.265+", "HDD Support", "Up to 8TB",
                   "Mobile App", "Yes", "Warranty", "2 Years On-site"));
        
        // POE Switch - Rova
        Brand rova = createBrand("Rova", ipHdSystems);
        Model rovaPOE = createModel("POE Switch 16 Port", "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", rova);
        createProduct(rovaPOE, "Rova 16 Port POE Switch",
            "16-port POE switch for IP HD systems. Provides power and data over single CAT 6 cable.",
            new BigDecimal("18000"), new BigDecimal("22000"), true, 4.5, 200,
            Map.of("Ports", "16 POE", "Power Budget", "300W", "Standards", "IEEE 802.3af/at",
                   "Uplink", "2 SFP", "Warranty", "2 Years On-site"));
        
        // CAT 6 Cable - Olive
        Brand olive = createBrand("Olive", ipHdSystems);
        Model oliveCat6 = createModel("CAT 6 Cable", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", olive);
        createProduct(oliveCat6, "Olive CAT 6 Outdoor Cable",
            "CAT 6 cable for digital data transmission in IP HD systems. Weatherproof design for outdoor use.",
            new BigDecimal("45"), new BigDecimal("55"), true, 4.5, 200,
            Map.of("Type", "CAT 6", "Length", "305 meters", "Outdoor", "Yes", "UV Protection", "Yes",
                   "Weatherproof", "IP65", "Warranty", "2 Years"));
        
        // Hard Disk - WD
        Brand wd = createBrand("WD", ipHdSystems);
        Model wdHDD = createModel("Surveillance Hard Disk 2TB", "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300", wd);
        createProduct(wdHDD, "WD Surveillance Hard Disk 2TB",
            "Surveillance-grade hard disk for NVR systems. Designed for 24/7 operation with excellent reliability.",
            new BigDecimal("5500"), new BigDecimal("6500"), true, 4.7, 400,
            Map.of("Capacity", "2TB", "Type", "Surveillance HDD", "RPM", "5400", "Interface", "SATA 6Gb/s",
                   "Workload", "24/7", "Warranty", "3 Years"));
        
        // Connectors - Hi-Focus
        Brand hiFocus = createBrand("Hi-Focus", ipHdSystems);
        Model hiFocusConnector = createModel("BNC Connector", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hiFocus);
        createProduct(hiFocusConnector, "Hi-Focus BNC Connector",
            "High-quality BNC connector for CCTV installations. Gold-plated contacts for reliable connections.",
            new BigDecimal("50"), new BigDecimal("60"), true, 4.4, 500,
            Map.of("Type", "BNC Connector", "Gold Plated", "Yes", "Pack", "10 pieces", "Installation", "Crimp Type",
                   "Warranty", "1 Year"));
    }
    
    private void seedAnalogHDSystems(ProductCategory analogHdSystems) {
        // Analog HD System Components: Analog Camera, DVR, 3+1 Cable, Hard Disk, Connectors
        // Used for non-commercial/residential use - Economic budget solution
        
        Brand prama = createBrand("Prama", analogHdSystems);
        Brand cpPlus = createBrand("CP Plus", analogHdSystems);
        Brand hikvision = createBrand("Hikvision", analogHdSystems);
        Brand trueview = createBrand("Trueview", analogHdSystems);
        Brand consistent = createBrand("Consistent", analogHdSystems);
        Brand hiFocus = createBrand("Hi-Focus", analogHdSystems);
        Brand dahua = createBrand("Dahua", analogHdSystems);
        Brand impact = createBrand("Impact", analogHdSystems);
        
        // Analog Dome Camera
        Model pramaAnalogDome = createModel("Analog Dome Camera", getRandomCameraImage(), prama);
        createProduct(pramaAnalogDome, "Prama Analog HD Dome Camera",
            "Analog HD dome camera for residential use. Cost-effective solution for home security with good image quality.",
            new BigDecimal("4500"), new BigDecimal("5500"), true, 4.4, 200,
            Map.of("Resolution", "2MP HD", "Type", "Dome - Indoor", "Power", "12VDC", "Use", "Residential/Non-commercial",
                   "Warranty", "2 Years On-site"));
        
        // Analog Bullet Camera
        Model hikvisionAnalogBullet = createModel("Analog Bullet Camera", getRandomCameraImage(), hikvision);
        createProduct(hikvisionAnalogBullet, "Hikvision Analog HD Bullet Camera",
            "Analog HD bullet camera for outdoor residential use. Weatherproof design with excellent value for money.",
            new BigDecimal("5000"), new BigDecimal("6000"), true, 4.5, 180,
            Map.of("Resolution", "2MP HD", "Type", "Bullet - Outdoor", "Power", "12VDC", "Weatherproof", "IP66",
                   "Use", "Residential/Non-commercial", "Warranty", "2 Years On-site"));
        
        // DVR Systems
        Model cpPlusDVR = createModel("DVR 16 Channel", "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", cpPlus);
        createProduct(cpPlusDVR, "CP Plus 16 Channel DVR",
            "16-channel DVR for analog HD systems. Perfect for residential and small commercial installations.",
            new BigDecimal("20000"), new BigDecimal("25000"), true, 4.6, 150,
            Map.of("Channels", "16", "Type", "DVR", "Compression", "H.265+", "HDD Support", "Up to 6TB",
                   "Use", "Residential/Non-commercial", "Warranty", "2 Years On-site"));
        
        Model hiFocusDVR4 = createModel("DVR 4 Channel", "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300", hiFocus);
        createProduct(hiFocusDVR4, "Hi-Focus 4 Channel DVR",
            "Compact 4-channel DVR for small residential installations. Economic solution for homes and small offices.",
            new BigDecimal("8000"), new BigDecimal("10000"), true, 4.3, 200,
            Map.of("Channels", "4", "Type", "DVR", "Compression", "H.264", "HDD Support", "Up to 2TB",
                   "Use", "Residential/Non-commercial", "Warranty", "2 Years On-site"));
        
        // 3+1 Cable - HyNet
        Brand hyNet = createBrand("HyNet", analogHdSystems);
        Model hyNet3Plus1 = createModel("3+1 CCTV Cable", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hyNet);
        createProduct(hyNet3Plus1, "HyNet 3+1 CCTV Cable",
            "3+1 CCTV cable combining video and power in single cable. Simplifies installation for analog systems.",
            new BigDecimal("30"), new BigDecimal("35"), true, 4.3, 400,
            Map.of("Type", "3+1 (3 Video + 1 Power)", "Length", "305 meters", "Gauge", "22 AWG",
                   "Use", "Analog Systems", "Warranty", "1 Year"));
        
        // Hard Disk
        Brand wd = createBrand("WD", analogHdSystems);
        Model wdHDD = createModel("Surveillance Hard Disk 1TB", "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300", wd);
        createProduct(wdHDD, "WD Surveillance Hard Disk 1TB",
            "Surveillance hard disk for DVR systems. Reliable storage for analog HD recordings.",
            new BigDecimal("3500"), new BigDecimal("4000"), true, 4.7, 500,
            Map.of("Capacity", "1TB", "Type", "Surveillance HDD", "RPM", "5400", "Interface", "SATA 6Gb/s",
                   "Workload", "24/7", "Warranty", "3 Years"));
        
        // Connectors
        Model hiFocusBNC = createModel("BNC Connector", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", hiFocus);
        createProduct(hiFocusBNC, "Hi-Focus BNC Connector",
            "BNC connector for analog camera connections. Easy installation with reliable performance.",
            new BigDecimal("50"), new BigDecimal("60"), true, 4.4, 500,
            Map.of("Type", "BNC Connector", "Gold Plated", "Yes", "Pack", "10 pieces", "Warranty", "1 Year"));
    }
    
    private void seedConventionalFireAlarms(ProductCategory conventionalFireAlarms) {
        // Conventional Fire Alarm Systems - Economic, small premises, no specific location
        // Brands: Agni, Notifier, Bosch, Honeywell, Ravel
        
        Brand agni = createBrand("Agni", conventionalFireAlarms);
        Brand notifier = createBrand("Notifier", conventionalFireAlarms);
        Brand bosch = createBrand("Bosch", conventionalFireAlarms);
        Brand honeywell = createBrand("Honeywell", conventionalFireAlarms);
        Brand ravel = createBrand("Ravel", conventionalFireAlarms);
        
        // Fire Alarm Panel - Agni
        Model agniPanel = createModel("Conventional Fire Panel", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", agni);
        createProduct(agniPanel, "Agni Conventional Fire Alarm Panel",
            "Economic conventional fire alarm panel for small premises. Zone-based detection without specific location identification.",
            new BigDecimal("25000"), new BigDecimal("30000"), true, 4.5, 120,
            Map.of("Type", "Conventional", "Zones", "Up to 8 Zones", "Location", "Zone-based (No specific location)",
                   "Use", "Small Premises", "Economic", "Yes", "Warranty", "2 Years On-site"));
        
        // Fire Alarm Panel - Bosch
        Model boschPanel = createModel("Conventional Fire Panel", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", bosch);
        createProduct(boschPanel, "Bosch Conventional Fire Alarm Panel",
            "Reliable conventional fire alarm system. Cost-effective solution for small to medium premises.",
            new BigDecimal("30000"), new BigDecimal("35000"), true, 4.6, 100,
            Map.of("Type", "Conventional", "Zones", "Up to 12 Zones", "Standards", "EN54 Certified",
                   "Use", "Small Premises", "Economic", "Yes", "Warranty", "2 Years On-site"));
        
        // Smoke Detector - Notifier
        Model notifierSmoke = createModel("Smoke Detector", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", notifier);
        createProduct(notifierSmoke, "Notifier Conventional Smoke Detector",
            "Conventional smoke detector for fire alarm systems. Reliable detection with easy installation.",
            new BigDecimal("2500"), new BigDecimal("3000"), true, 4.5, 200,
            Map.of("Type", "Conventional Smoke Detector", "Voltage", "12VDC", "Standards", "EN54",
                   "Installation", "Easy", "Warranty", "2 Years"));
    }
    
    private void seedAddressableFireAlarms(ProductCategory addressableFireAlarms) {
        // Analogue Addressable Fire Alarm Systems - Exact location, costly, precise
        // Brands: Agni, Notifier, Bosch, Honeywell, Ravel
        
        Brand agni = createBrand("Agni", addressableFireAlarms);
        Brand notifier = createBrand("Notifier", addressableFireAlarms);
        Brand bosch = createBrand("Bosch", addressableFireAlarms);
        Brand honeywell = createBrand("Honeywell", addressableFireAlarms);
        Brand ravel = createBrand("Ravel", addressableFireAlarms);
        
        // Addressable Fire Panel - Bosch
        Model boschAddressable = createModel("Addressable Fire Panel", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", bosch);
        createProduct(boschAddressable, "Bosch Analogue Addressable Fire Alarm Panel",
            "Advanced analogue addressable fire alarm system providing exact location of events. Precise detection for critical applications.",
            new BigDecimal("80000"), new BigDecimal("100000"), true, 4.8, 80,
            Map.of("Type", "Analogue Addressable", "Devices", "Up to 250 Addressable", "Location", "Exact Location",
                   "Use", "Precise/Critical Applications", "Cost", "High", "Warranty", "2 Years On-site"));
        
        // Addressable Fire Panel - Honeywell
        Model honeywellAddressable = createModel("Addressable Fire Panel", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", honeywell);
        createProduct(honeywellAddressable, "Honeywell Analogue Addressable Fire Alarm Panel",
            "Professional addressable fire alarm system with exact device location. Ideal for large commercial buildings.",
            new BigDecimal("90000"), new BigDecimal("110000"), true, 4.7, 70,
            Map.of("Type", "Analogue Addressable", "Devices", "Up to 500 Addressable", "Location", "Exact Location",
                   "Use", "Large Commercial", "Cost", "High", "Warranty", "2 Years On-site"));
        
        // Addressable Smoke Detector - Notifier
        Model notifierAddressable = createModel("Addressable Smoke Detector", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", notifier);
        createProduct(notifierAddressable, "Notifier Addressable Smoke Detector",
            "Addressable smoke detector with exact location identification. Part of addressable fire alarm system.",
            new BigDecimal("4500"), new BigDecimal("5500"), true, 4.6, 150,
            Map.of("Type", "Addressable Smoke Detector", "Location", "Exact Location ID", "Standards", "EN54",
                   "Installation", "Loop Wiring", "Warranty", "2 Years"));
    }
    
    private void seedBiometrics(ProductCategory biometrics) {
        // Biometrics - Uses: Access Control, Time & Attendance, Visitor Management, Employee Identification
        // Brands: Essl, Secureye, Matrix, Hikvision, Realtime
        
        Brand essl = createBrand("Essl", biometrics);
        Brand secureye = createBrand("Secureye", biometrics);
        Brand matrix = createBrand("Matrix", biometrics);
        Brand hikvision = createBrand("Hikvision", biometrics);
        Brand realtime = createBrand("Realtime", biometrics);
        
        // Biometric Device - Essl
        Model esslBio = createModel("Biometric Device", "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300", essl);
        createProduct(esslBio, "Essl Biometric Device",
            "Fingerprint-based biometric system for access control and time & attendance. Features large capacity and cloud sync.",
            new BigDecimal("18000"), new BigDecimal("22000"), true, 4.6, 250,
            Map.of("Type", "Fingerprint Biometric", "Capacity", "3000 Fingerprints", "Uses", "Access Control, Time & Attendance",
                   "Display", "2.8\" Color LCD", "Cloud Sync", "Yes", "Warranty", "2 Years On-site"));
        
        // Face Recognition - Hikvision
        Model hikvisionFace = createModel("Face Recognition Machine", "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300", hikvision);
        createProduct(hikvisionFace, "Hikvision Biometric Face Machine",
            "Advanced face recognition system for access control and visitor management. Fast and accurate identification.",
            new BigDecimal("35000"), new BigDecimal("45000"), true, 4.8, 120,
            Map.of("Type", "Face Recognition", "Capacity", "5000 Faces", "Uses", "Access Control, Visitor Management",
                   "Speed", "< 1 second", "AI Technology", "Yes", "Warranty", "2 Years On-site"));
        
        // Fingerprint Scanner with Face ID - Essl
        Model esslDual = createModel("Scanner with Face ID", "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300", essl);
        createProduct(esslDual, "Essl Fingerprint Scanner with Face ID",
            "Dual biometric scanner supporting both fingerprint and face recognition. Perfect for high-security access control.",
            new BigDecimal("22000"), new BigDecimal("28000"), true, 4.6, 140,
            Map.of("Type", "Fingerprint + Face", "Capacity", "5000 Users", "Uses", "Access Control, Employee ID",
                   "Speed", "< 0.5 seconds", "Display", "Color LCD", "Warranty", "2 Years On-site"));
    }
    
    private void seedAnalogueVDP(ProductCategory analogueVDP) {
        // Analogue VDP - Economic, single to 3 doors, works with outdoor/indoor station
        // Brands: Hikvision, CP Plus, Secureye, Honeywell
        
        Brand hikvision = createBrand("Hikvision", analogueVDP);
        Brand cpPlus = createBrand("CP Plus", analogueVDP);
        Brand secureye = createBrand("Secureye", analogueVDP);
        Brand honeywell = createBrand("Honeywell", analogueVDP);
        
        // Analogue VDP - Hikvision
        Model hikvisionVDP = createModel("Analogue Video Door Phone", "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300", hikvision);
        createProduct(hikvisionVDP, "Hikvision Analogue Video Door Phone",
            "Economic analogue video door phone system. Works with outdoor and indoor station for single to three doors. Speak and talk to visitors with electronic door lock support.",
            new BigDecimal("15000"), new BigDecimal("18000"), true, 4.5, 150,
            Map.of("Type", "Analogue VDP", "Doors", "1-3 Doors", "Stations", "Outdoor + Indoor", "Audio", "Two-way",
                   "Door Lock", "Electronic Lock Support", "Economic", "Yes", "Warranty", "2 Years On-site"));
        
        // Analogue VDP - CP Plus
        Model cpPlusVDP = createModel("Analogue Video Door Phone", "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300", cpPlus);
        createProduct(cpPlusVDP, "CP Plus Analogue Video Door Phone",
            "Cost-effective analogue video door phone. Perfect for residential use with clear video and audio communication.",
            new BigDecimal("12000"), new BigDecimal("15000"), true, 4.4, 180,
            Map.of("Type", "Analogue VDP", "Doors", "1-3 Doors", "Resolution", "720p", "Audio", "Two-way",
                   "Door Lock", "Electronic Lock Support", "Warranty", "2 Years On-site"));
    }
    
    private void seedIPVDP(ProductCategory ipVDP) {
        // IP VDP - Advanced, mobile app, remote unlock, internet connectivity
        // Brands: Hikvision, CP Plus, Secureye, Honeywell
        
        Brand hikvision = createBrand("Hikvision", ipVDP);
        Brand cpPlus = createBrand("CP Plus", ipVDP);
        Brand secureye = createBrand("Secureye", ipVDP);
        Brand honeywell = createBrand("Honeywell", ipVDP);
        
        // IP VDP - Hikvision
        Model hikvisionIPVDP = createModel("IP Video Door Phone", "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300", hikvision);
        createProduct(hikvisionIPVDP, "Hikvision IP Video Door Phone",
            "Advanced IP video door phone with mobile app connectivity. Connect via internet, speak and talk to visitors through video call on mobile application, and remotely unlock door with electronic lock.",
            new BigDecimal("25000"), new BigDecimal("30000"), true, 4.7, 160,
            Map.of("Type", "IP VDP", "Connectivity", "Internet/Mobile App", "Features", "Video Call, Remote Unlock",
                   "Mobile App", "Yes", "Remote Access", "Yes", "Door Lock", "Remote Electronic Lock", "Warranty", "2 Years On-site"));
        
        // IP VDP - True View
        Brand trueview = createBrand("True View", ipVDP);
        Model trueviewIPVDP = createModel("WiFi Video Doorbell", "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300", trueview);
        createProduct(trueviewIPVDP, "True View WiFi Video Doorbell",
            "Smart WiFi video doorbell with mobile app. Features two-way audio, motion detection, and remote door unlock capability.",
            new BigDecimal("12000"), new BigDecimal("15000"), true, 4.6, 180,
            Map.of("Type", "IP VDP - WiFi", "Connectivity", "WiFi + Mobile App", "Features", "Video Call, Remote Unlock",
                   "Motion Detection", "Yes", "Night Vision", "Yes", "Warranty", "2 Years On-site"));
    }
    
    private void seedElectronicLocks(ProductCategory electronicLocks) {
        // Electronic Locks - Features: Keyless Entry, Mobile App Control, Remote Access, PIN Code, Biometric Integration, Auto-lock, Access Logs, Guest Access, Battery Backup, Tamper Alerts
        // Brands: Essl, Yale, Godrej
        
        Brand essl = createBrand("Essl", electronicLocks);
        Brand yale = createBrand("Yale", electronicLocks);
        Brand godrej = createBrand("Godrej", electronicLocks);
        
        // Electronic Lock - Essl
        Model esslLock = createModel("Biometric Door Lock", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", essl);
        createProduct(esslLock, "Essl Biometric Electronic Door Lock",
            "Smart biometric electronic door lock with keyless entry, mobile app control, PIN code access, and access logs. Features auto-lock, guest access management, and battery backup.",
            new BigDecimal("25000"), new BigDecimal("30000"), true, 4.7, 180,
            Map.of("Type", "Biometric Electronic Lock", "Features", "Keyless, Mobile App, PIN, Biometric, Auto-lock, Access Logs",
                   "Battery", "Rechargeable", "Guest Access", "Yes", "Tamper Alert", "Yes", "Warranty", "2 Years On-site"));
        
        // Electronic Lock - Yale
        Model yaleLock = createModel("Smart Electronic Lock", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", yale);
        createProduct(yaleLock, "Yale Smart Electronic Lock",
            "Advanced smart electronic lock with remote access via mobile app. Features keyless entry, PIN code, biometric integration, and comprehensive access management.",
            new BigDecimal("30000"), new BigDecimal("35000"), true, 4.8, 150,
            Map.of("Type", "Smart Electronic Lock", "Features", "Keyless, Remote Access, Mobile App, PIN, Biometric",
                   "Access Logs", "Yes", "Guest Access", "Yes", "Battery Backup", "Yes", "Warranty", "2 Years On-site"));
        
        // Electronic Lock - Godrej
        Model godrejLock = createModel("Electronic Door Lock", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", godrej);
        createProduct(godrejLock, "Godrej Electronic Door Lock",
            "Reliable electronic door lock with keyless entry and PIN code access. Features auto-lock, access logs, and tamper alerts.",
            new BigDecimal("20000"), new BigDecimal("25000"), true, 4.6, 200,
            Map.of("Type", "Electronic Lock", "Features", "Keyless, PIN Code, Auto-lock, Access Logs",
                   "Battery", "Rechargeable", "Tamper Alert", "Yes", "Warranty", "2 Years On-site"));
    }
    
    private void seedGPSDevices(ProductCategory gpsDevices) {
        // GPS Devices for Vehicles - New category
        
        Brand consistent = createBrand("Consistent", gpsDevices);
        Brand mastel = createBrand("Mastel", gpsDevices);
        
        // GPS Device - Consistent
        Model consistentGPS = createModel("GPS Vehicle Tracker", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", consistent);
        createProduct(consistentGPS, "Consistent GPS Vehicle Tracker",
            "GPS tracking device for vehicles with real-time location tracking, geofencing, and mobile app monitoring.",
            new BigDecimal("8000"), new BigDecimal("10000"), true, 4.5, 120,
            Map.of("Type", "GPS Vehicle Tracker", "Features", "Real-time Tracking, Geofencing, Mobile App",
                   "Connectivity", "4G/GPS", "Battery", "Built-in", "Warranty", "2 Years On-site"));
        
        // GPS Device - Mastel
        Model mastelGPS = createModel("GPS Vehicle Tracker", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", mastel);
        createProduct(mastelGPS, "Mastel GPS Vehicle Tracker",
            "Advanced GPS tracking device with speed monitoring, route history, and alert notifications.",
            new BigDecimal("10000"), new BigDecimal("12000"), true, 4.6, 100,
            Map.of("Type", "GPS Vehicle Tracker", "Features", "Real-time Tracking, Speed Monitoring, Route History",
                   "Connectivity", "4G/GPS", "Alerts", "Yes", "Warranty", "2 Years On-site"));
    }
}
