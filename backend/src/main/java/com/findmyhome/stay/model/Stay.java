package com.findmyhome.stay.model;

import com.findmyhome.common.entity.BaseEntity;
import com.findmyhome.property.model.Property;
import com.findmyhome.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "stays", indexes = {
    @Index(name = "idx_stay_tenant", columnList = "tenant_id"),
    @Index(name = "idx_stay_owner", columnList = "owner_id"),
    @Index(name = "idx_stay_property", columnList = "property_id"),
    @Index(name = "idx_stay_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stay extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private User tenant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private StayStatus status = StayStatus.REQUESTED;

    @Column(name = "tenant_confirmed_move_in", nullable = false)
    @Builder.Default
    private Boolean tenantConfirmedMoveIn = false;

    @Column(name = "owner_confirmed_move_in", nullable = false)
    @Builder.Default
    private Boolean ownerConfirmedMoveIn = false;

    @Column(name = "tenant_confirmed_move_out", nullable = false)
    @Builder.Default
    private Boolean tenantConfirmedMoveOut = false;

    @Column(name = "owner_confirmed_move_out", nullable = false)
    @Builder.Default
    private Boolean ownerConfirmedMoveOut = false;

    @Column(name = "dispute_reason", columnDefinition = "TEXT")
    private String disputeReason;

    public boolean isEligibleForReview() {
        return this.status == StayStatus.COMPLETED;
    }
}
