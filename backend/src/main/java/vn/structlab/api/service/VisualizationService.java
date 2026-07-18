package vn.structlab.api.service;

import org.springframework.stereotype.Service;
import vn.structlab.api.dto.VisualizationDtos.OperationRequest;
import vn.structlab.api.dto.VisualizationDtos.StepView;
import vn.structlab.api.dto.VisualizationDtos.VisualizationRequest;
import vn.structlab.api.dto.VisualizationDtos.VisualizationResponse;
import vn.structlab.api.exception.InvalidOperationException;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class VisualizationService {

    public VisualizationResponse simulate(String structureType, VisualizationRequest request) {
        String type = structureType.toLowerCase(Locale.ROOT);
        List<Integer> state = new ArrayList<>(request.initialValues());
        List<Integer> initial = List.copyOf(state);
        List<StepView> steps = new ArrayList<>();
        Complexity complexity = new Complexity("O(1)", "O(1)");

        for (OperationRequest operation : request.operations()) {
            complexity = switch (type) {
                case "array" -> merge(complexity, applyArray(state, operation, steps));
                case "stack" -> merge(complexity, applyStack(state, operation, steps));
                case "queue" -> merge(complexity, applyQueue(state, operation, steps));
                default -> throw new InvalidOperationException(
                        "Chỉ hỗ trợ các cấu trúc: array, stack và queue.");
            };
            if (state.size() > 12) {
                throw new InvalidOperationException("Cấu trúc chỉ được chứa tối đa 12 phần tử.");
            }
        }
        return new VisualizationResponse(type, initial, List.copyOf(state), List.copyOf(steps),
                complexity.time(), complexity.space());
    }

    private Complexity applyArray(List<Integer> state, OperationRequest operation,
                                  List<StepView> steps) {
        String op = normalizedOperation(operation);
        switch (op) {
            case "INSERT" -> {
                requireValue(operation);
                int index = operation.index() == null ? state.size() : operation.index();
                requireInsertIndex(index, state.size());
                state.add(index, operation.value());
                addStep(steps, op, "Chèn " + operation.value() + " vào vị trí " + index + ".",
                        state, List.of(index), null, null);
                return new Complexity("O(n)", "O(1)");
            }
            case "DELETE" -> {
                int index = requireExistingIndex(operation.index(), state.size());
                Integer removed = state.remove(index);
                addStep(steps, op, "Xóa phần tử " + removed + " tại vị trí " + index + ".",
                        state, List.of(), removed, null);
                return new Complexity("O(n)", "O(1)");
            }
            case "UPDATE" -> {
                requireValue(operation);
                int index = requireExistingIndex(operation.index(), state.size());
                state.set(index, operation.value());
                addStep(steps, op, "Cập nhật vị trí " + index + " thành " + operation.value() + ".",
                        state, List.of(index), null, null);
                return new Complexity("O(1)", "O(1)");
            }
            case "SEARCH" -> {
                requireValue(operation);
                boolean found = false;
                for (int index = 0; index < state.size(); index++) {
                    found = state.get(index).equals(operation.value());
                    addStep(steps, op,
                            found ? "Tìm thấy " + operation.value() + " tại vị trí " + index + "."
                                    : "Kiểm tra vị trí " + index + ", chưa tìm thấy.",
                            state, List.of(index), null, found);
                    if (found) {
                        break;
                    }
                }
                if (!found && state.isEmpty()) {
                    addStep(steps, op, "Mảng rỗng nên không tìm thấy phần tử.",
                            state, List.of(), null, false);
                }
                return new Complexity("O(n)", "O(1)");
            }
            default -> throw new InvalidOperationException(
                    "Array hỗ trợ INSERT, DELETE, UPDATE và SEARCH.");
        }
    }

    private Complexity applyStack(List<Integer> state, OperationRequest operation,
                                  List<StepView> steps) {
        String op = normalizedOperation(operation);
        switch (op) {
            case "PUSH" -> {
                requireValue(operation);
                state.add(operation.value());
                addStep(steps, op, "Đẩy " + operation.value() + " lên đỉnh Stack.",
                        state, List.of(state.size() - 1), null, null);
            }
            case "POP" -> {
                requireNotEmpty(state, "Không thể POP vì Stack đang rỗng.");
                Integer removed = state.remove(state.size() - 1);
                addStep(steps, op, "Lấy " + removed + " khỏi đỉnh Stack.",
                        state, List.of(), removed, null);
            }
            case "PEEK" -> {
                requireNotEmpty(state, "Không thể PEEK vì Stack đang rỗng.");
                int top = state.size() - 1;
                addStep(steps, op, "Phần tử ở đỉnh Stack là " + state.get(top) + ".",
                        state, List.of(top), null, null);
            }
            default -> throw new InvalidOperationException("Stack hỗ trợ PUSH, POP và PEEK.");
        }
        return new Complexity("O(1)", "O(1)");
    }

    private Complexity applyQueue(List<Integer> state, OperationRequest operation,
                                  List<StepView> steps) {
        String op = normalizedOperation(operation);
        switch (op) {
            case "ENQUEUE" -> {
                requireValue(operation);
                state.add(operation.value());
                addStep(steps, op, "Thêm " + operation.value() + " vào cuối Queue.",
                        state, List.of(state.size() - 1), null, null);
            }
            case "DEQUEUE" -> {
                requireNotEmpty(state, "Không thể DEQUEUE vì Queue đang rỗng.");
                Integer removed = state.remove(0);
                addStep(steps, op, "Lấy " + removed + " khỏi đầu Queue.",
                        state, state.isEmpty() ? List.of() : List.of(0), removed, null);
            }
            case "PEEK" -> {
                requireNotEmpty(state, "Không thể PEEK vì Queue đang rỗng.");
                addStep(steps, op, "Phần tử ở đầu Queue là " + state.get(0) + ".",
                        state, List.of(0), null, null);
            }
            default -> throw new InvalidOperationException("Queue hỗ trợ ENQUEUE, DEQUEUE và PEEK.");
        }
        return new Complexity("O(1)", "O(1)");
    }

    private void addStep(List<StepView> steps, String operation, String description,
                         List<Integer> state, List<Integer> highlighted, Integer removed,
                         Boolean found) {
        steps.add(new StepView(steps.size() + 1, operation, description, List.copyOf(state),
                List.copyOf(highlighted), removed, found));
    }

    private String normalizedOperation(OperationRequest operation) {
        return operation.type().trim().toUpperCase(Locale.ROOT);
    }

    private void requireValue(OperationRequest operation) {
        if (operation.value() == null) {
            throw new InvalidOperationException(operation.type() + " cần một giá trị.");
        }
    }

    private int requireExistingIndex(Integer index, int size) {
        if (index == null || index < 0 || index >= size) {
            throw new InvalidOperationException("Index phải nằm trong khoảng 0 đến " + (size - 1) + ".");
        }
        return index;
    }

    private void requireInsertIndex(int index, int size) {
        if (index < 0 || index > size) {
            throw new InvalidOperationException("Index chèn phải nằm trong khoảng 0 đến " + size + ".");
        }
    }

    private void requireNotEmpty(List<Integer> state, String message) {
        if (state.isEmpty()) {
            throw new InvalidOperationException(message);
        }
    }

    private Complexity merge(Complexity current, Complexity next) {
        if ("O(n)".equals(current.time()) || "O(n)".equals(next.time())) {
            return new Complexity("O(n)", "O(1)");
        }
        return next;
    }

    private record Complexity(String time, String space) {
    }
}
