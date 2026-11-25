package com.findmyhome.config;

import com.findmyhome.connection.model.ConnectionRequest;
import com.findmyhome.connection.model.ConnectionStatus;
import com.findmyhome.connection.repository.ConnectionRequestRepository;
import com.findmyhome.dispute.model.Dispute;
import com.findmyhome.dispute.model.DisputeStatus;
import com.findmyhome.dispute.repository.DisputeRepository;
import com.findmyhome.property.model.FurnishingStatus;
import com.findmyhome.property.model.GenderPreference;
import com.findmyhome.property.model.Property;
import com.findmyhome.property.model.PropertyStatus;
import com.findmyhome.property.model.PropertyType;
import com.findmyhome.property.repository.PropertyRepository;
import com.findmyhome.review.model.Review;
import com.findmyhome.review.model.ReviewTargetType;
import com.findmyhome.review.repository.ReviewRepository;
import com.findmyhome.stay.model.Stay;
import com.findmyhome.stay.model.StayStatus;
import com.findmyhome.stay.repository.StayRepository;
import com.findmyhome.user.model.Role;
import com.findmyhome.user.model.User;
import com.findmyhome.user.model.VerificationStatus;
import com.findmyhome.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

@Component
@Profile("!test")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final StayRepository stayRepository;
    private final ReviewRepository reviewRepository;
    private final DisputeRepository disputeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting FindMyHome Dummy Data Seeding...");

        String defaultEncodedPassword = passwordEncoder.encode("password123");

        // 1. Seed or Update Users
        User rajesh = getOrCreateUser("rajesh.owner@example.com", "Rajesh Sharma", "+91 9820123456",
                Role.ROLE_OWNER, "Verified owner of 3 premium properties in Bengaluru. Responsive and bachelor-friendly landlord.",
                defaultEncodedPassword, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80");

        User priya = getOrCreateUser("priya.owner@example.com", "Priya Nair", "+91 9845012345",
                Role.ROLE_OWNER, "Tech executive and homeowner offering student & bachelor-friendly apartments across Pune & Bengaluru.",
                defaultEncodedPassword, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80");

        User vikram = getOrCreateUser("vikram.owner@example.com", "Vikram Malhotra", "+91 9811098765",
                Role.ROLE_OWNER, "Real estate developer providing verified modern residences in Delhi NCR and Gurgaon.",
                defaultEncodedPassword, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80");

        User sunita = getOrCreateUser("sunita.owner@example.com", "Sunita Deshmukh", "+91 9769012345",
                Role.ROLE_OWNER, "Owner of high-rise properties in Hyderabad Financial District and Mumbai Powai.",
                defaultEncodedPassword, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80");

        User aarav = getOrCreateUser("aarav.tenant@example.com", "Aarav Patel", "+91 9123456780",
                Role.ROLE_TENANT, "Senior Frontend Engineer relocating to Bengaluru. Looking for a peaceful, bachelor-friendly apartment.",
                defaultEncodedPassword, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80");

        User rohan = getOrCreateUser("rohan.tenant@example.com", "Rohan Gupta", "+91 9876501234",
                Role.ROLE_TENANT, "Graduate student at IISc Bengaluru. Quiet tenant, respectful of house rules.",
                defaultEncodedPassword, "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80");

        User ananya = getOrCreateUser("ananya.tenant@example.com", "Ananya Sen", "+91 9988776655",
                Role.ROLE_TENANT, "Product Designer at a tech firm in Indiranagar. Non-smoker, looking for well-lit studio/1BHK.",
                defaultEncodedPassword, "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80");

        User kabir = getOrCreateUser("kabir.tenant@example.com", "Kabir Mehta", "+91 9123487654",
                Role.ROLE_TENANT, "Management consultant working in DLF Cyber City Gurgaon. Punctual rent payer with 5-star verified history.",
                defaultEncodedPassword, "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80");

        User sneha = getOrCreateUser("sneha.tenant@example.com", "Sneha Reddy", "+91 9456781230",
                Role.ROLE_TENANT, "AI Researcher at Gachibowli campus. Seeking a comfortable 2BHK close to office shuttle stops.",
                defaultEncodedPassword, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80");

        // 2. Seed Properties
        Property p1 = getOrCreateProperty(
                "Sunview 2BHK Apartment - Koramangala 4th Block",
                "Spacious fully furnished 2BHK flat with balconies overlooking greenery. High-speed fiber WiFi, power backup, and 24x7 gated security. Zero bachelor restrictions.",
                PropertyType.APARTMENT,
                "Flat 302, Green Haven Apartments, 4th Block, Koramangala",
                "Bengaluru", "Karnataka", "560034",
                new BigDecimal("28000.00"), new BigDecimal("60000.00"),
                2, 2, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, true,
                "WiFi, Power Backup, 24/7 Security, Washing Machine, Geyser, Covered Parking, Modular Kitchen",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                rajesh
        );

        Property p2 = getOrCreateProperty(
                "Green Valley 1BHK Flat - HSR Layout Sector 2",
                "Cozy 1BHK located in peaceful HSR Layout Sector 2. Walking distance to popular cafes, gyms, and supermarkets. Ideal for single working professionals or couples.",
                PropertyType.APARTMENT,
                "House #142, 19th Main Road, Sector 2, HSR Layout",
                "Bengaluru", "Karnataka", "560102",
                new BigDecimal("18500.00"), new BigDecimal("40000.00"),
                1, 1, FurnishingStatus.SEMI_FURNISHED, GenderPreference.ANY, true,
                "Power Backup, Water Purifier, Bike Parking, CCTV, Refrigerator",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                rajesh
        );

        Property p3 = getOrCreateProperty(
                "Indiranagar Boutique Studio - 100ft Road",
                "Chic, designer studio apartment located off 100ft Road in Indiranagar. Features natural sunlight, dedicated workspace, and modern appliances.",
                PropertyType.APARTMENT,
                "Studio 4B, Metro View Residency, 100ft Road, Indiranagar",
                "Bengaluru", "Karnataka", "560038",
                new BigDecimal("24000.00"), new BigDecimal("50000.00"),
                1, 1, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, true,
                "High Speed WiFi, Air Conditioner, Smart TV, Microwave, Elevator, Power Backup",
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
                rajesh
        );

        Property p4 = getOrCreateProperty(
                "TechNest 3BHK Penthouse - Whitefield EPIP Zone",
                "Luxury 3BHK penthouse situated right next to ITPL and EPIP Zone. Swimming pool, gym, club house access included. Bachelor friendly with individual bathroom for each bedroom.",
                PropertyType.APARTMENT,
                "Tower 5, Unit 1401, Prestige Tech Enclave, Whitefield",
                "Bengaluru", "Karnataka", "560066",
                new BigDecimal("42000.00"), new BigDecimal("90000.00"),
                3, 3, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, true,
                "Gym, Swimming Pool, Clubhouse, 2 Covered Car Parking, 100% Power Backup, Dishwasher",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                priya
        );

        Property p5 = getOrCreateProperty(
                "Bluebell 2BHK Urban Suite - Hinjawadi Phase 1",
                "Modern 2BHK apartment situated within walking distance of Infosys and TCS Phase 1 campus. Serene environment with mountain views.",
                PropertyType.APARTMENT,
                "B-Block 603, Bluebell Meadows, Hinjawadi Phase 1",
                "Pune", "Maharashtra", "411057",
                new BigDecimal("22000.00"), new BigDecimal("45000.00"),
                2, 2, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, true,
                "WiFi, Geyser, Washing Machine, Power Backup, Security, Lift",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
                priya
        );

        Property p6 = getOrCreateProperty(
                "Koregaon Park Green View 1BHK - Lane 7",
                "Peaceful and aesthetic 1BHK in lush Koregaon Park Lane 7. Close to premier restaurants, Osho garden, and wellness centres.",
                PropertyType.APARTMENT,
                "Flat 204, Silver Oak Manor, Lane 7, Koregaon Park",
                "Pune", "Maharashtra", "411001",
                new BigDecimal("20000.00"), new BigDecimal("40000.00"),
                1, 1, FurnishingStatus.SEMI_FURNISHED, GenderPreference.ANY, true,
                "Air Conditioner, Power Backup, Balcony, Covered Parking, Security",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
                priya
        );

        Property p7 = getOrCreateProperty(
                "CyberCity Skylight 2BHK - DLF Phase 3 Gurgaon",
                "Sunlit 2BHK floor near Moulsari Avenue metro station and CyberHub. No landlord interference, fully equipped kitchen with pipeline gas.",
                PropertyType.APARTMENT,
                "Plot 284, U-Block, DLF Phase 3, Cyber City",
                "Gurgaon", "Haryana", "122002",
                new BigDecimal("34000.00"), new BigDecimal("70000.00"),
                2, 2, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, true,
                "Metro Proximity, 24/7 Water, Power Backup, Piped Gas, Smart Locks",
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
                vikram
        );

        Property p8 = getOrCreateProperty(
                "Hauz Khas Student Haven - South Delhi",
                "Well maintained 1BHK apartment in South Delhi close to IIT Delhi and Hauz Khas Village. Friendly community, ideal for students and researchers.",
                PropertyType.APARTMENT,
                "Flat 12, Kaveri Apartments, Hauz Khas",
                "New Delhi", "Delhi", "110016",
                new BigDecimal("19000.00"), new BigDecimal("38000.00"),
                1, 1, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, true,
                "WiFi, Study Desks, RO Water, Terrace Access, Daily Housekeeping option",
                "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80",
                vikram
        );

        Property p9 = getOrCreateProperty(
                "Silicon Heights 2BHK - Gachibowli Financial District",
                "High-rise 2BHK flat directly opposite Microsoft and Amazon campus in Gachibowli. Unobstructed city view, modular wardrobes and gym in building.",
                PropertyType.APARTMENT,
                "Flat 1104, Silicon Heights Tower B, Gachibowli",
                "Hyderabad", "Telangana", "500032",
                new BigDecimal("26000.00"), new BigDecimal("52000.00"),
                2, 2, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, true,
                "Gym, Piped Gas, 100% DG Backup, Intercom, EV Charging Points",
                "https://images.unsplash.com/photo-1502005229762-ae1b465ab790?auto=format&fit=crop&w=1200&q=80",
                sunita
        );

        Property p10 = getOrCreateProperty(
                "Powai Lakeview Studio - Hiranandani Gardens",
                "Scenic studio apartment overlooking Powai Lake. Located inside prestigious Hiranandani Gardens township. Walking distance to shopping and dining.",
                PropertyType.APARTMENT,
                "Wing C 802, Kensington Complex, Hiranandani Gardens, Powai",
                "Mumbai", "Maharashtra", "400076",
                new BigDecimal("32000.00"), new BigDecimal("75000.00"),
                1, 1, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, true,
                "Lake View, 24/7 Security, Piped Gas, Central Park Access, High Speed Internet",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                sunita
        );

        // 3. Seed Connection Requests
        createConnectionIfAbsent(aarav, p1, ConnectionStatus.ACCEPTED, "Hi Rajesh, I'm a software engineer looking to move into your Koramangala 2BHK flat.");
        createConnectionIfAbsent(rohan, p2, ConnectionStatus.ACCEPTED, "Hello Rajesh, I am an IISc research student interested in your HSR Layout 1BHK.");
        createConnectionIfAbsent(ananya, p3, ConnectionStatus.PENDING, "Hi Rajesh, I love your studio apartment on 100ft road! Can I schedule a visit this weekend?");
        createConnectionIfAbsent(kabir, p7, ConnectionStatus.PENDING, "Hi Vikram, I work at CyberHub and would like to connect regarding the DLF Phase 3 flat.");
        createConnectionIfAbsent(sneha, p9, ConnectionStatus.ACCEPTED, "Hi Sunita, I work at Microsoft Gachibowli and am looking for a 2BHK close to campus.");
        createConnectionIfAbsent(rohan, p5, ConnectionStatus.REJECTED, "Hi Priya, inquiring about your Pune Hinjawadi flat.");

        // 4. Seed Stays (respecting single active stay constraint per tenant)
        // Stay 1: Aarav at p1 (Koramangala 2BHK) - COMPLETED
        Stay stay1 = getOrCreateStay(p1, aarav, rajesh,
                LocalDate.now().minusMonths(14), LocalDate.now().minusMonths(2),
                StayStatus.COMPLETED, true, true, true, true);

        // Stay 2: Aarav at p3 (Indiranagar Studio) - ACTIVE
        getOrCreateStay(p3, aarav, rajesh,
                LocalDate.now().minusMonths(1), null,
                StayStatus.ACTIVE, true, true, false, false);

        // Stay 3: Rohan at p2 (HSR 1BHK) - COMPLETED
        Stay stay3 = getOrCreateStay(p2, rohan, rajesh,
                LocalDate.now().minusMonths(12), LocalDate.now().minusMonths(1),
                StayStatus.COMPLETED, true, true, true, true);

        // Stay 4: Rohan at p5 (Pune 2BHK) - ACCEPTED (waiting for dual move-in handshake)
        getOrCreateStay(p5, rohan, priya,
                LocalDate.now().plusDays(5), null,
                StayStatus.ACCEPTED, false, false, false, false);

        // Stay 5: Sneha at p9 (Hyderabad 2BHK) - ACTIVE
        getOrCreateStay(p9, sneha, sunita,
                LocalDate.now().minusMonths(3), null,
                StayStatus.ACTIVE, true, true, false, false);

        // Stay 6: Kabir at p7 (CyberCity 2BHK) - COMPLETED
        Stay stay6 = getOrCreateStay(p7, kabir, vikram,
                LocalDate.now().minusMonths(10), LocalDate.now().minusMonths(2),
                StayStatus.COMPLETED, true, true, true, true);

        // 5. Seed Reviews on Completed Stays
        // Stay 1 Reviews
        createReviewIfAbsent(stay1, aarav, ReviewTargetType.PROPERTY, p1, null, 5, 5, 5,
                "Clean flat, peaceful locality, deposit returned promptly",
                "Lived in this Koramangala flat for a full year. No restrictions on bachelors, power backup was reliable during rains, and security was prompt.");

        createReviewIfAbsent(stay1, aarav, ReviewTargetType.OWNER, null, rajesh, 5, 5, 5,
                "Extremely supportive landlord",
                "Rajesh is a model landlord. Whenever there was any plumbing issue he got it fixed within 2 hours. Full deposit returned without unjust deductions.");

        createReviewIfAbsent(stay1, rajesh, ReviewTargetType.TENANT, null, aarav, 5, 5, 5,
                "Model tenant - Highly recommended",
                "Aarav was a very responsible tenant. Paid rent on the 1st of every month without reminders and handed back the flat in immaculate condition.");

        // Stay 3 Reviews
        createReviewIfAbsent(stay3, rohan, ReviewTargetType.PROPERTY, p2, null, 5, 5, 4,
                "Super quiet and convenient for remote work",
                "Loved living in this HSR Layout flat. Great cafes nearby, reliable water supply, and peaceful residential neighborhood.");

        createReviewIfAbsent(stay3, rohan, ReviewTargetType.OWNER, null, rajesh, 5, 5, 5,
                "Very respectful of tenant privacy",
                "Rajesh never micro-managed and respected privacy completely. Deposit was refunded in full within 48 hours of move-out.");

        createReviewIfAbsent(stay3, rajesh, ReviewTargetType.TENANT, null, rohan, 5, 5, 5,
                "Punctual and respectful tenant",
                "Rohan maintained the house exceptionally well. Always polite and communicative.");

        // Stay 6 Reviews
        createReviewIfAbsent(stay6, kabir, ReviewTargetType.PROPERTY, p7, null, 5, 5, 5,
                "Top-notch location and modern amenities",
                "Literally 5 minutes from CyberHub. Excellent piped gas, smart locks, and no parking troubles. Highly recommended for working bachelors.");

        createReviewIfAbsent(stay6, kabir, ReviewTargetType.OWNER, null, vikram, 5, 5, 5,
                "Professional and transparent owner",
                "Vikram handled the lease agreement with utmost transparency. Zero friction during move-in or move-out.");

        createReviewIfAbsent(stay6, vikram, ReviewTargetType.TENANT, null, kabir, 5, 5, 5,
                "Great experience hosting Kabir",
                "Kabir was prompt, neat, and very courteous throughout the ten-month stay.");

        // 6. Seed an example dispute resolution record
        createDisputeIfAbsent(stay3, rohan,
                "AC servicing charge clarification during summer",
                "Tenant requested owner clarification regarding AC regular maintenance vs repair responsibility. Mutually agreed and resolved smoothly.",
                DisputeStatus.RESOLVED_VALID,
                "Owner reimbursed the filter maintenance cost as per rental agreement clause 8.",
                Instant.now().minusSeconds(86400 * 45));

        log.info("FindMyHome Dummy Data Seeding Complete!");
    }

    private User getOrCreateUser(String email, String fullName, String phone, Role role, String bio, String encodedPassword, String photoUrl) {
        Optional<User> existing = userRepository.findByEmail(email.toLowerCase().trim());
        if (existing.isPresent()) {
            User user = existing.get();
            user.setPassword(encodedPassword);
            user.setVerificationStatus(VerificationStatus.VERIFIED);
            user.setProfilePhotoUrl(photoUrl);
            user.setBio(bio);
            return userRepository.save(user);
        }

        User newUser = User.builder()
                .email(email.toLowerCase().trim())
                .fullName(fullName)
                .phoneNumber(phone)
                .role(role)
                .bio(bio)
                .password(encodedPassword)
                .verificationStatus(VerificationStatus.VERIFIED)
                .profilePhotoUrl(photoUrl)
                .build();
        return userRepository.save(newUser);
    }

    private Property getOrCreateProperty(String title, String desc, PropertyType type, String address,
                                        String city, String state, String pincode,
                                        BigDecimal rent, BigDecimal deposit,
                                        int bed, int bath, FurnishingStatus furnishing,
                                        GenderPreference genderPref, boolean bachelorFriendly,
                                        String amenities, String photoUrls, User owner) {
        Optional<Property> existing = propertyRepository.findByOwnerId(owner.getId()).stream()
                .filter(p -> p.getTitle().equalsIgnoreCase(title))
                .findFirst();

        if (existing.isPresent()) {
            Property p = existing.get();
            p.setDescription(desc);
            p.setAmenities(amenities);
            p.setPhotoUrls(photoUrls);
            p.setAddressLine(address);
            p.setCity(city);
            p.setState(state);
            p.setPincode(pincode);
            p.setRentAmount(rent);
            p.setDepositAmount(deposit);
            p.setBedrooms(bed);
            p.setBathrooms(bath);
            p.setFurnishingStatus(furnishing);
            p.setGenderPreference(genderPref);
            p.setBachelorFriendly(bachelorFriendly);
            return propertyRepository.save(p);
        }

        Property prop = Property.builder()
                .title(title)
                .description(desc)
                .propertyType(type)
                .addressLine(address)
                .city(city)
                .state(state)
                .pincode(pincode)
                .rentAmount(rent)
                .depositAmount(deposit)
                .bedrooms(bed)
                .bathrooms(bath)
                .furnishingStatus(furnishing)
                .genderPreference(genderPref)
                .bachelorFriendly(bachelorFriendly)
                .amenities(amenities)
                .photoUrls(photoUrls)
                .status(PropertyStatus.AVAILABLE)
                .owner(owner)
                .build();
        return propertyRepository.save(prop);
    }

    private void createConnectionIfAbsent(User tenant, Property property, ConnectionStatus status, String message) {
        boolean exists = connectionRequestRepository.findByTenantId(tenant.getId()).stream()
                .anyMatch(c -> c.getProperty().getId().equals(property.getId()));
        if (!exists) {
            ConnectionRequest request = ConnectionRequest.builder()
                    .tenant(tenant)
                    .property(property)
                    .status(status)
                    .message(message)
                    .respondedAt(status != ConnectionStatus.PENDING ? Instant.now().minusSeconds(86400 * 2) : null)
                    .build();
            connectionRequestRepository.save(request);
        }
    }

    private Stay getOrCreateStay(Property property, User tenant, User owner,
                                 LocalDate startDate, LocalDate endDate,
                                 StayStatus status,
                                 boolean tMoveIn, boolean oMoveIn, boolean tMoveOut, boolean oMoveOut) {
        Optional<Stay> existing = stayRepository.findByTenantId(tenant.getId()).stream()
                .filter(s -> s.getProperty().getId().equals(property.getId()) && s.getStatus() == status)
                .findFirst();

        if (existing.isPresent()) {
            return existing.get();
        }

        Stay stay = Stay.builder()
                .property(property)
                .tenant(tenant)
                .owner(owner)
                .startDate(startDate)
                .endDate(endDate)
                .status(status)
                .tenantConfirmedMoveIn(tMoveIn)
                .ownerConfirmedMoveIn(oMoveIn)
                .tenantConfirmedMoveOut(tMoveOut)
                .ownerConfirmedMoveOut(oMoveOut)
                .build();
        return stayRepository.save(stay);
    }

    private void createReviewIfAbsent(Stay stay, User author, ReviewTargetType targetType,
                                      Property targetProperty, User targetUser,
                                      int rating, int cleanliness, int communication,
                                      String title, String comment) {
        if (reviewRepository.existsByStayIdAndAuthorIdAndTargetType(stay.getId(), author.getId(), targetType)) {
            return;
        }

        Review review = Review.builder()
                .stay(stay)
                .author(author)
                .targetType(targetType)
                .targetProperty(targetProperty)
                .targetUser(targetUser)
                .rating(rating)
                .cleanlinessRating(cleanliness)
                .communicationRating(communication)
                .title(title)
                .comment(comment)
                .build();
        reviewRepository.save(review);
    }

    private void createDisputeIfAbsent(Stay stay, User reportedBy, String reason, String desc,
                                       DisputeStatus status, String resolutionNotes, Instant resolvedAt) {
        if (!disputeRepository.findByStayId(stay.getId()).isEmpty()) {
            return;
        }

        Dispute dispute = Dispute.builder()
                .stay(stay)
                .reportedBy(reportedBy)
                .reason(reason)
                .description(desc)
                .status(status)
                .resolutionNotes(resolutionNotes)
                .resolvedAt(resolvedAt)
                .build();
        disputeRepository.save(dispute);
    }
}
