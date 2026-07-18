package vn.structlab.api.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.structlab.api.dto.ProgressDtos.DashboardView;
import vn.structlab.api.service.ProgressService;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/me")
    public DashboardView dashboard(@AuthenticationPrincipal Jwt jwt) {
        return progressService.getDashboard(jwt.getSubject());
    }
}
