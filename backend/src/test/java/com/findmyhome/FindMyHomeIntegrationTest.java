package com.findmyhome;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.findmyhome.common.dto.ApiResponse;
import com.findmyhome.connection.dto.ConnectionCreateRequest;
import com.findmyhome.connection.dto.ConnectionResponse;
import com.findmyhome.property.dto.PropertyCreateRequest;
import com.findmyhome.property.dto.PropertyResponse;
import com.findmyhome.property.model.FurnishingStatus;
import com.findmyhome.property.model.GenderPreference;
import com.findmyhome.property.model.PropertyType;
import com.findmyhome.review.dto.ReviewCreateRequest;
import com.findmyhome.review.dto.ReviewResponse;
import com.findmyhome.review.model.ReviewTargetType;
import com.findmyhome.stay.dto.StayCreateRequest;
import com.findmyhome.stay.dto.StayResponse;
import com.findmyhome.stay.model.StayStatus;
import com.findmyhome.user.dto.AuthResponse;
import com.findmyhome.user.dto.RegisterRequest;
import com.findmyhome.user.model.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class FindMyHomeIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("End-to-End Flow: Register -> List Property -> Connect -> Stay FSM -> Verified Reviews -> Duplicate Prevention")
    void testCompletePlatformLifecycle() throws Exception {

        // 1. Register Owner
        RegisterRequest ownerRegister = new RegisterRequest();
        ownerRegister.setEmail("owner@example.com");
        ownerRegister.setPassword("password123");
        ownerRegister.setFullName("John Owner");
        ownerRegister.setPhoneNumber("+919876543210");
        ownerRegister.setRole(Role.ROLE_OWNER);
        ownerRegister.setBio("Experienced property owner in Bengaluru");

        MvcResult ownerRegResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ownerRegister)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<?> ownerAuthApiResponse = objectMapper.readValue(
                ownerRegResult.getResponse().getContentAsString(), ApiResponse.class);
        AuthResponse ownerAuth = objectMapper.convertValue(ownerAuthApiResponse.getData(), AuthResponse.class);
        String ownerToken = ownerAuth.getToken();
        assertNotNull(ownerToken);

        // 2. Register Tenant
        RegisterRequest tenantRegister = new RegisterRequest();
        tenantRegister.setEmail("tenant@example.com");
        tenantRegister.setPassword("password123");
        tenantRegister.setFullName("Aditya Tenant");
        tenantRegister.setPhoneNumber("+919123456789");
        tenantRegister.setRole(Role.ROLE_TENANT);
        tenantRegister.setBio("Software engineer looking for a room in Koramangala");

        MvcResult tenantRegResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tenantRegister)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<?> tenantAuthApiResponse = objectMapper.readValue(
                tenantRegResult.getResponse().getContentAsString(), ApiResponse.class);
        AuthResponse tenantAuth = objectMapper.convertValue(tenantAuthApiResponse.getData(), AuthResponse.class);
        String tenantToken = tenantAuth.getToken();
        Long tenantId = tenantAuth.getUser().getId();
        assertNotNull(tenantToken);

        // 3. Owner creates a Property
        PropertyCreateRequest propertyRequest = new PropertyCreateRequest();
        propertyRequest.setTitle("Spacious 2BHK in Koramangala");
        propertyRequest.setDescription("Modern apartment close to tech parks");
        propertyRequest.setPropertyType(PropertyType.APARTMENT);
        propertyRequest.setAddressLine("Flat 302, Green Glen Layout, Koramangala");
        propertyRequest.setCity("Bengaluru");
        propertyRequest.setState("Karnataka");
        propertyRequest.setPincode("560034");
        propertyRequest.setRentAmount(new BigDecimal("28000.00"));
        propertyRequest.setDepositAmount(new BigDecimal("50000.00"));
        propertyRequest.setBedrooms(2);
        propertyRequest.setBathrooms(2);
        propertyRequest.setFurnishingStatus(FurnishingStatus.FULLY_FURNISHED);
        propertyRequest.setGenderPreference(GenderPreference.ANY);
        propertyRequest.setBachelorFriendly(true);

        MvcResult propertyResult = mockMvc.perform(post("/api/v1/properties")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(propertyRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<?> propertyApiResponse = objectMapper.readValue(
                propertyResult.getResponse().getContentAsString(), ApiResponse.class);
        PropertyResponse property = objectMapper.convertValue(propertyApiResponse.getData(), PropertyResponse.class);
        Long propertyId = property.getId();
        assertNotNull(propertyId);

        // 4. Public search (unauthenticated) - verifies that address is masked!
        MvcResult publicPropResult = mockMvc.perform(get("/api/v1/properties/" + propertyId))
                .andExpect(status().isOk())
                .andReturn();
        ApiResponse<?> publicPropApiResponse = objectMapper.readValue(
                publicPropResult.getResponse().getContentAsString(), ApiResponse.class);
        PropertyResponse publicProp = objectMapper.convertValue(publicPropApiResponse.getData(), PropertyResponse.class);
        assertTrue(publicProp.getAddressLine().contains("Connect with owner to view exact address"),
                "Public users should see masked address");

        // 5. Tenant sends connection request
        ConnectionCreateRequest connRequest = new ConnectionCreateRequest();
        connRequest.setMessage("Hi, I am interested in renting your 2BHK flat!");

        MvcResult connResult = mockMvc.perform(post("/api/v1/connections/properties/" + propertyId)
                        .header("Authorization", "Bearer " + tenantToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(connRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<?> connApiResponse = objectMapper.readValue(
                connResult.getResponse().getContentAsString(), ApiResponse.class);
        ConnectionResponse connection = objectMapper.convertValue(connApiResponse.getData(), ConnectionResponse.class);
        Long connectionId = connection.getId();

        // 6. Owner accepts connection request
        MvcResult acceptResult = mockMvc.perform(put("/api/v1/connections/" + connectionId + "/accept")
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<?> acceptApiResponse = objectMapper.readValue(
                acceptResult.getResponse().getContentAsString(), ApiResponse.class);
        ConnectionResponse acceptedConnection = objectMapper.convertValue(acceptApiResponse.getData(), ConnectionResponse.class);
        assertFalse(acceptedConnection.getTenant().getPhoneNumber().contains("***"),
                "Once connection is accepted, tenant contact is unlocked to owner");

        // 7. Owner creates Stay agreement
        StayCreateRequest stayRequest = new StayCreateRequest();
        stayRequest.setPropertyId(propertyId);
        stayRequest.setTenantId(tenantId);
        stayRequest.setStartDate(LocalDate.now());

        MvcResult stayResult = mockMvc.perform(post("/api/v1/stays")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(stayRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<?> stayApiResponse = objectMapper.readValue(
                stayResult.getResponse().getContentAsString(), ApiResponse.class);
        StayResponse stay = objectMapper.convertValue(stayApiResponse.getData(), StayResponse.class);
        Long stayId = stay.getId();
        assertEquals(StayStatus.ACCEPTED, stay.getStatus());

        // 8. Attempt review prematurely -> MUST FAIL (Anti-Fake rule: Stays must be COMPLETED)
        ReviewCreateRequest prematureReview = new ReviewCreateRequest();
        prematureReview.setTargetType(ReviewTargetType.PROPERTY);
        prematureReview.setRating(5);
        prematureReview.setComment("Great place!");
        mockMvc.perform(post("/api/v1/stays/" + stayId + "/reviews")
                        .header("Authorization", "Bearer " + tenantToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(prematureReview)))
                .andExpect(status().isBadRequest());

        // 9. Move-in Dual Confirmation
        // Tenant confirms move-in
        mockMvc.perform(put("/api/v1/stays/" + stayId + "/confirm-move-in")
                        .header("Authorization", "Bearer " + tenantToken))
                .andExpect(status().isOk());

        // Owner confirms move-in -> transitions to ACTIVE!
        MvcResult moveInResult = mockMvc.perform(put("/api/v1/stays/" + stayId + "/confirm-move-in")
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<?> activeStayApiResponse = objectMapper.readValue(
                moveInResult.getResponse().getContentAsString(), ApiResponse.class);
        StayResponse activeStay = objectMapper.convertValue(activeStayApiResponse.getData(), StayResponse.class);
        assertEquals(StayStatus.ACTIVE, activeStay.getStatus());

        // 10. Move-out Dual Confirmation
        // Tenant confirms move-out
        mockMvc.perform(put("/api/v1/stays/" + stayId + "/confirm-move-out")
                        .header("Authorization", "Bearer " + tenantToken))
                .andExpect(status().isOk());

        // Owner confirms move-out -> transitions to COMPLETED!
        MvcResult moveOutResult = mockMvc.perform(put("/api/v1/stays/" + stayId + "/confirm-move-out")
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<?> completedStayApiResponse = objectMapper.readValue(
                moveOutResult.getResponse().getContentAsString(), ApiResponse.class);
        StayResponse completedStay = objectMapper.convertValue(completedStayApiResponse.getData(), StayResponse.class);
        assertEquals(StayStatus.COMPLETED, completedStay.getStatus());
        assertTrue(completedStay.isEligibleForReview());

        // 11. Tenant submits verified review for Property
        ReviewCreateRequest propertyReview = new ReviewCreateRequest();
        propertyReview.setTargetType(ReviewTargetType.PROPERTY);
        propertyReview.setRating(5);
        propertyReview.setTitle("Clean and peaceful flat");
        propertyReview.setComment("Lived here for a year, owner was very cooperative and no bachelor issues.");
        propertyReview.setCleanlinessRating(5);
        propertyReview.setCommunicationRating(5);

        MvcResult reviewResult = mockMvc.perform(post("/api/v1/stays/" + stayId + "/reviews")
                        .header("Authorization", "Bearer " + tenantToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(propertyReview)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<?> reviewApiResponse = objectMapper.readValue(
                reviewResult.getResponse().getContentAsString(), ApiResponse.class);
        ReviewResponse review = objectMapper.convertValue(reviewApiResponse.getData(), ReviewResponse.class);
        assertNotNull(review.getId());
        assertEquals(5, review.getRating());

        // 12. Duplicate review prevention check -> MUST FAIL
        mockMvc.perform(post("/api/v1/stays/" + stayId + "/reviews")
                        .header("Authorization", "Bearer " + tenantToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(propertyReview)))
                .andExpect(status().isBadRequest());

        // 13. Owner submits verified review for Tenant
        ReviewCreateRequest tenantReview = new ReviewCreateRequest();
        tenantReview.setTargetType(ReviewTargetType.TENANT);
        tenantReview.setRating(5);
        tenantReview.setTitle("Great tenant");
        tenantReview.setComment("Always paid rent on time and kept the house spotless.");

        mockMvc.perform(post("/api/v1/stays/" + stayId + "/reviews")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tenantReview)))
                .andExpect(status().isCreated());
    }
}
