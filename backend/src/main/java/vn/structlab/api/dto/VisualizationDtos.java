package vn.structlab.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public final class VisualizationDtos {

    private VisualizationDtos() {
    }

    public record VisualizationRequest(
            @NotNull @Size(max = 12) List<Integer> initialValues,
            @NotEmpty @Size(max = 12) List<@Valid OperationRequest> operations
    ) {
    }

    public record OperationRequest(
            @NotNull String type,
            Integer value,
            Integer index
    ) {
    }

    public record StepView(
            int stepNumber,
            String operation,
            String description,
            List<Integer> state,
            List<Integer> highlightedIndices,
            Integer removedValue,
            Boolean found
    ) {
    }

    public record VisualizationResponse(
            String structureType,
            List<Integer> initialState,
            List<Integer> finalState,
            List<StepView> steps,
            String timeComplexity,
            String spaceComplexity
    ) {
    }
}
