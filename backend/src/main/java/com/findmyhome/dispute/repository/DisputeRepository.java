package com.findmyhome.dispute.repository;

import com.findmyhome.dispute.model.Dispute;
import com.findmyhome.dispute.model.DisputeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {

    List<Dispute> findByStayId(Long stayId);

    List<Dispute> findByStatus(DisputeStatus status);
}
