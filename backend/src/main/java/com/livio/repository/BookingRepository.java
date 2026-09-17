package com.livio.repository;

import com.livio.entity.Booking;
import com.livio.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findByPgIdOrderByCreatedAtDesc(Long pgId);
    List<Booking> findByPgOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.bed.id = :bedId " +
           "AND b.status IN ('CONFIRMED', 'CHECKED_IN', 'PAYMENT_PENDING') " +
           "AND (:checkOutDate IS NULL OR b.checkInDate < :checkOutDate) " +
           "AND (b.checkOutDate IS NULL OR b.checkOutDate > :checkInDate)")
    long countOverlappingBedBookings(
            @Param("bedId") Long bedId,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.room.id = :roomId " +
           "AND b.status IN ('CONFIRMED', 'CHECKED_IN', 'PAYMENT_PENDING') " +
           "AND (:checkOutDate IS NULL OR b.checkInDate < :checkOutDate) " +
           "AND (b.checkOutDate IS NULL OR b.checkOutDate > :checkInDate)")
    long countOverlappingRoomBookings(
            @Param("roomId") Long roomId,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );
}
