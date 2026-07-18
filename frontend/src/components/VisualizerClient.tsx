"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  ArrowDownToLine,
  Brackets,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CirclePause,
  CirclePlay,
  Layers3,
  ListPlus,
  ListStart,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Operation, VisualizationResponse } from "@/lib/types";

type Structure = "array" | "stack" | "queue";

const structureOptions: { id: Structure; title: string; description: string; icon: typeof Brackets }[] = [
  { id: "array", title: "Array", description: "Index và dịch chuyển", icon: Brackets },
  { id: "stack", title: "Stack", description: "Last In, First Out", icon: Layers3 },
  { id: "queue", title: "Queue", description: "First In, First Out", icon: ListStart },
];

const operationOptions: Record<Structure, { value: string; label: string }[]> = {
  array: [
    { value: "INSERT", label: "Insert" },
    { value: "DELETE", label: "Delete" },
    { value: "UPDATE", label: "Update" },
    { value: "SEARCH", label: "Search" },
  ],
  stack: [
    { value: "PUSH", label: "Push" },
    { value: "POP", label: "Pop" },
    { value: "PEEK", label: "Peek" },
  ],
  queue: [
    { value: "ENQUEUE", label: "Enqueue" },
    { value: "DEQUEUE", label: "Dequeue" },
    { value: "PEEK", label: "Peek" },
  ],
};

export function VisualizerClient() {
  const searchParams = useSearchParams();
  const queryType = searchParams.get("type");
  const initialType: Structure = queryType === "stack" || queryType === "queue" ? queryType : "array";
  const [structure, setStructure] = useState<Structure>(initialType);
  const [initialInput, setInitialInput] = useState("10, 20, 30");
  const [operationType, setOperationType] = useState(operationOptions[initialType][0].value);
  const [valueInput, setValueInput] = useState("");
  const [indexInput, setIndexInput] = useState("");
  const [operations, setOperations] = useState<Operation[]>([]);
  const [prediction, setPrediction] = useState("");
  const [result, setResult] = useState<VisualizationResponse | null>(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialValues = useMemo(() => parseValues(initialInput), [initialInput]);
  const activeStep = result && stepIndex >= 0 ? result.steps[stepIndex] : null;
  const displayState = activeStep?.state ?? result?.initialState ?? initialValues;
  const predictionCorrect = result && prediction.trim()
    ? arraysEqual(parseValues(prediction), result.finalState)
    : null;

  useEffect(() => {
    if (!playing || !result) return;
    const atEnd = stepIndex >= result.steps.length - 1;
    const timer = window.setTimeout(() => {
      if (atEnd) {
        setPlaying(false);
      } else {
        setStepIndex((current) => current + 1);
      }
    }, atEnd ? 0 : 900);
    return () => window.clearTimeout(timer);
  }, [playing, result, stepIndex]);

  const changeStructure = (next: Structure) => {
    setStructure(next);
    setOperationType(operationOptions[next][0].value);
    setOperations([]);
    setResult(null);
    setStepIndex(-1);
    setPrediction("");
    setError("");
  };

  const needsValue = ["INSERT", "UPDATE", "SEARCH", "PUSH", "ENQUEUE"].includes(operationType);
  const needsIndex = ["INSERT", "DELETE", "UPDATE"].includes(operationType);

  const addOperation = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (operations.length >= 12) {
      setError("Mỗi lượt mô phỏng tối đa 12 thao tác.");
      return;
    }
    if (needsValue && valueInput.trim() === "") {
      setError("Thao tác này cần một giá trị.");
      return;
    }
    if (needsIndex && indexInput.trim() === "") {
      setError("Thao tác này cần một index.");
      return;
    }
    const operation: Operation = { type: operationType };
    if (needsValue) operation.value = Number(valueInput);
    if (needsIndex) operation.index = Number(indexInput);
    if ((needsValue && Number.isNaN(operation.value)) || (needsIndex && Number.isNaN(operation.index))) {
      setError("Giá trị và index phải là số.");
      return;
    }
    setOperations((current) => [...current, operation]);
    setValueInput("");
    setIndexInput("");
    setResult(null);
    setStepIndex(-1);
  };

  const runSimulation = async () => {
    setError("");
    if (initialValues.length > 12) {
      setError("Trạng thái ban đầu chỉ được có tối đa 12 phần tử.");
      return;
    }
    if (operations.length === 0) {
      setError("Hãy thêm ít nhất một thao tác trước khi chạy.");
      return;
    }
    setLoading(true);
    try {
      const response = await apiFetch<VisualizationResponse>(`/visualizations/${structure}`, {
        method: "POST",
        body: JSON.stringify({ initialValues, operations }),
      });
      setResult(response);
      setStepIndex(response.steps.length ? 0 : -1);
      setPlaying(response.steps.length > 1);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể chạy mô phỏng.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOperations([]);
    setResult(null);
    setStepIndex(-1);
    setPlaying(false);
    setPrediction("");
    setError("");
  };

  return (
    <div className="visualizer-page">
      <section className="tool-page-header">
        <div className="container tool-heading-row">
          <div>
            <span className="section-kicker"><Sparkles size={15} /> Interactive Lab</span>
            <h1>Data Structure Visualizer</h1>
            <p>Tạo chuỗi thao tác, dự đoán kết quả và quan sát backend tính từng trạng thái.</p>
          </div>
          <div className="api-status"><i /> REST API đang kết nối <code>localhost:8080</code></div>
        </div>
      </section>

      <div className="container visualizer-layout">
        <aside className="visualizer-controls">
          <section className="control-panel">
            <div className="panel-title"><span>1</span><div><strong>Chọn cấu trúc</strong><small>Structure type</small></div></div>
            <div className="structure-tabs">
              {structureOptions.map(({ id, title, description, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={structure === id ? "active" : ""}
                  onClick={() => changeStructure(id)}
                >
                  <Icon size={21} />
                  <span><strong>{title}</strong><small>{description}</small></span>
                </button>
              ))}
            </div>
          </section>

          <section className="control-panel">
            <div className="panel-title"><span>2</span><div><strong>Trạng thái ban đầu</strong><small>Phân cách bằng dấu phẩy</small></div></div>
            <label className="compact-label">
              Các phần tử
              <input value={initialInput} onChange={(event) => { setInitialInput(event.target.value); setResult(null); }} placeholder="10, 20, 30" />
            </label>
            <div className="value-chips">
              {initialValues.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}
              {initialValues.length === 0 && <small>Cấu trúc rỗng</small>}
            </div>
          </section>

          <section className="control-panel">
            <div className="panel-title"><span>3</span><div><strong>Thêm thao tác</strong><small>Tối đa 12 thao tác</small></div></div>
            <form onSubmit={addOperation} className="operation-form">
              <label className="compact-label">
                Operation
                <select value={operationType} onChange={(event) => setOperationType(event.target.value)}>
                  {operationOptions[structure].map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <div className="operation-fields">
                {needsValue && (
                  <label className="compact-label">Value<input type="number" value={valueInput} onChange={(event) => setValueInput(event.target.value)} placeholder="40" /></label>
                )}
                {needsIndex && (
                  <label className="compact-label">Index<input type="number" min="0" value={indexInput} onChange={(event) => setIndexInput(event.target.value)} placeholder="1" /></label>
                )}
              </div>
              <button className="button button-secondary full-width" type="submit"><Plus size={17} /> Thêm vào chuỗi</button>
            </form>

            <div className="operation-list">
              {operations.length === 0 ? (
                <div className="empty-operation"><ListPlus size={20} /><span>Chưa có thao tác</span></div>
              ) : operations.map((operation, index) => (
                <div className="operation-chip" key={`${operation.type}-${index}`}>
                  <span>{index + 1}</span>
                  <code>{operationLabel(operation)}</code>
                  <button type="button" aria-label="Xóa thao tác" onClick={() => setOperations((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          </section>

          <section className="prediction-panel">
            <div><Zap size={19} /><span><strong>Dự đoán kết quả</strong><small>Tùy chọn nhưng rất nên thử</small></span></div>
            <input value={prediction} onChange={(event) => setPrediction(event.target.value)} placeholder="Ví dụ: 10, 20, 40" />
          </section>

          {error && <div className="form-error" role="alert">{error}</div>}

          <div className="visualizer-action-row">
            <button className="button button-ghost" type="button" onClick={reset}><RotateCcw size={17} /> Reset</button>
            <button className="button button-primary grow" type="button" onClick={runSimulation} disabled={loading}>
              <CirclePlay size={18} /> {loading ? "Đang tính..." : "Chạy mô phỏng"}
            </button>
          </div>
        </aside>

        <section className="visualizer-stage-card">
          <div className="stage-toolbar">
            <div><span className="stage-dot" /> <strong>{structure.toUpperCase()}</strong><small>{displayState.length} phần tử</small></div>
            {result && <div className="complexity-badges"><span>Time <strong>{result.timeComplexity}</strong></span><span>Space <strong>{result.spaceComplexity}</strong></span></div>}
          </div>

          <div className={`structure-stage ${structure}`}>
            <div className="stage-axis-labels">
              {structure === "stack" && <span>TOP</span>}
              {structure === "queue" && <><span>FRONT</span><span>REAR</span></>}
            </div>
            <AnimatePresence mode="popLayout">
              {displayState.length === 0 ? (
                <motion.div className="empty-structure" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ArrowDownToLine size={34} />
                  <strong>Cấu trúc đang rỗng</strong>
                  <span>Thêm thao tác để bắt đầu mô phỏng</span>
                </motion.div>
              ) : (
                <motion.div className="structure-nodes" layout>
                  {displayState.map((value, index) => {
                    const highlighted = activeStep?.highlightedIndices.includes(index);
                    return (
                      <motion.div
                        layout
                        className={`data-node ${highlighted ? "highlighted" : ""}`}
                        key={`${index}-${value}`}
                        initial={{ opacity: 0, scale: 0.7, y: -18 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7, y: 18 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span>{value}</span>
                        <small>{structure === "array" ? `[${index}]` : index}</small>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="step-explanation">
            {activeStep ? (
              <>
                <div className="step-badge">{activeStep.stepNumber}</div>
                <div><span>{activeStep.operation}</span><h3>{activeStep.description}</h3></div>
              </>
            ) : (
              <><div className="step-badge muted">0</div><div><span>READY</span><h3>Thiết lập thao tác rồi nhấn “Chạy mô phỏng”.</h3></div></>
            )}
          </div>

          {result && (
            <div className="playback-controls">
              <button type="button" aria-label="Bước trước" onClick={() => { setPlaying(false); setStepIndex((value) => Math.max(-1, value - 1)); }}><ChevronLeft size={20} /></button>
              <button className="play-button" type="button" aria-label={playing ? "Tạm dừng" : "Phát"} onClick={() => setPlaying((value) => !value)}>
                {playing ? <CirclePause size={24} /> : <CirclePlay size={24} />}
              </button>
              <button type="button" aria-label="Bước tiếp theo" onClick={() => { setPlaying(false); setStepIndex((value) => Math.min(result.steps.length - 1, value + 1)); }}><ChevronRight size={20} /></button>
              <div className="step-track">
                {result.steps.map((step, index) => <button aria-label={`Đến bước ${step.stepNumber}`} type="button" className={index <= stepIndex ? "filled" : ""} key={step.stepNumber} onClick={() => { setPlaying(false); setStepIndex(index); }} />)}
              </div>
              <span>{Math.max(stepIndex + 1, 0)} / {result.steps.length}</span>
            </div>
          )}

          {predictionCorrect !== null && result && (
            <motion.div className={`prediction-result ${predictionCorrect ? "correct" : "incorrect"}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {predictionCorrect ? <CheckCircle2 size={23} /> : <XCircle size={23} />}
              <div>
                <strong>{predictionCorrect ? "Dự đoán chính xác!" : "Chưa chính xác, nhưng bạn vừa học được một điều."}</strong>
                <p>Kết quả đúng: [{result.finalState.join(", ")}]</p>
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}

function parseValues(input: string) {
  if (!input.trim()) return [];
  return input.split(",").map((part) => Number(part.trim())).filter((value) => !Number.isNaN(value));
}

function arraysEqual(first: number[], second: number[]) {
  return first.length === second.length && first.every((value, index) => value === second[index]);
}

function operationLabel(operation: Operation) {
  const parameters = [operation.index, operation.value].filter((value) => value !== undefined);
  return `${operation.type.toLowerCase()}(${parameters.join(", ")})`;
}
