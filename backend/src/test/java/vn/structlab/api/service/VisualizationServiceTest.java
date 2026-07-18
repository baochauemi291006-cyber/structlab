package vn.structlab.api.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import vn.structlab.api.dto.VisualizationDtos.OperationRequest;
import vn.structlab.api.dto.VisualizationDtos.VisualizationRequest;
import vn.structlab.api.dto.VisualizationDtos.VisualizationResponse;
import vn.structlab.api.exception.InvalidOperationException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class VisualizationServiceTest {

    private VisualizationService service;

    @BeforeEach
    void setUp() {
        service = new VisualizationService();
    }

    @Test
    void simulatesStackOperationsInLifoOrder() {
        VisualizationRequest request = new VisualizationRequest(
                List.of(2, 5),
                List.of(
                        new OperationRequest("PUSH", 8, null),
                        new OperationRequest("POP", null, null),
                        new OperationRequest("PUSH", 10, null)
                ));

        VisualizationResponse response = service.simulate("stack", request);

        assertThat(response.finalState()).containsExactly(2, 5, 10);
        assertThat(response.steps()).hasSize(3);
        assertThat(response.steps().get(1).removedValue()).isEqualTo(8);
        assertThat(response.timeComplexity()).isEqualTo("O(1)");
    }

    @Test
    void createsOneStepPerArraySearchComparison() {
        VisualizationRequest request = new VisualizationRequest(
                List.of(4, 7, 9),
                List.of(new OperationRequest("SEARCH", 9, null)));

        VisualizationResponse response = service.simulate("array", request);

        assertThat(response.steps()).hasSize(3);
        assertThat(response.steps().get(2).found()).isTrue();
        assertThat(response.timeComplexity()).isEqualTo("O(n)");
    }

    @Test
    void rejectsPopFromEmptyStack() {
        VisualizationRequest request = new VisualizationRequest(
                List.of(), List.of(new OperationRequest("POP", null, null)));

        assertThatThrownBy(() -> service.simulate("stack", request))
                .isInstanceOf(InvalidOperationException.class)
                .hasMessageContaining("rỗng");
    }
}
