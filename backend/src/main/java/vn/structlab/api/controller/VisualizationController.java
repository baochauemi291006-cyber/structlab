package vn.structlab.api.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.structlab.api.dto.VisualizationDtos.VisualizationRequest;
import vn.structlab.api.dto.VisualizationDtos.VisualizationResponse;
import vn.structlab.api.service.VisualizationService;

@RestController
@RequestMapping("/api/visualizations")
public class VisualizationController {

    private final VisualizationService visualizationService;

    public VisualizationController(VisualizationService visualizationService) {
        this.visualizationService = visualizationService;
    }

    @PostMapping("/{structureType}")
    public VisualizationResponse simulate(@PathVariable String structureType,
                                          @Valid @RequestBody VisualizationRequest request) {
        return visualizationService.simulate(structureType, request);
    }
}
