package vn.structlab.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.structlab.api.model.UserAccount;

import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
