"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Check,
  CheckCircle2,
  CircleHelp,
  Flame,
  LockKeyhole,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ErrorState, PageLoader } from "@/components/Feedback";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import type { AttemptResult, Exercise, TopicSummary } from "@/lib/types";

export function PracticeClient() {
  const router = useRouter();
  const { token, user, loading: authLoading } = useAuth();
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [topicSlug, setTopicSlug] = useState("array");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<TopicSummary[]>("/topics")
      .then(setTopics)
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const loadExercises = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiFetch<Exercise[]>(`/exercises?topic=${topicSlug}`);
      setExercises(response);
      setCurrentIndex(0);
      setSelectedAnswer("");
      setResult(null);
      setCorrectCount(0);
      setEarnedPoints(0);
      setFinished(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể tải câu hỏi.");
    } finally {
      setLoading(false);
    }
  }, [topicSlug]);

  useEffect(() => {
    queueMicrotask(() => void loadExercises());
  }, [loadExercises]);

  const exercise = exercises[currentIndex];

  const submit = async () => {
    if (!user || !token) {
      router.push("/login");
      return;
    }
    if (!exercise || !selectedAnswer) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await apiFetch<AttemptResult>(
        `/exercises/${exercise.id}/submit`,
        { method: "POST", body: JSON.stringify({ answer: selectedAnswer }) },
        token,
      );
      setResult(response);
      setEarnedPoints((value) => value + response.pointsEarned);
      if (response.correct) setCorrectCount((value) => value + 1);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể nộp câu trả lời.");
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (currentIndex >= exercises.length - 1) {
      setFinished(true);
      return;
    }
    setCurrentIndex((value) => value + 1);
    setSelectedAnswer("");
    setResult(null);
  };

  if (loading || authLoading) return <PageLoader label="Đang chuẩn bị bộ câu hỏi..." />;
  if (error && !exercise) return <ErrorState message={error} onRetry={() => void loadExercises()} />;

  return (
    <div className="practice-page">
      <section className="tool-page-header practice-header">
        <div className="container tool-heading-row">
          <div>
            <span className="section-kicker"><Sparkles size={15} /> Prediction Challenge</span>
            <h1>Luyện tập chủ động</h1>
            <p>Đọc trạng thái, dự đoán kết quả và nhận lời giải ngay sau mỗi câu.</p>
          </div>
          <div className="practice-mini-stats">
            <span><Flame size={18} /> <strong>{correctCount}</strong> câu đúng</span>
            <span><Award size={18} /> <strong>{earnedPoints}</strong> điểm lượt này</span>
          </div>
        </div>
      </section>

      <div className="container practice-layout">
        <aside className="practice-sidebar">
          <div className="practice-sidebar-heading"><strong>Chọn chủ đề</strong><span>{topics.length} chủ đề</span></div>
          <div className="practice-topic-list">
            {topics.map((topic) => (
              <button
                type="button"
                key={topic.slug}
                className={topicSlug === topic.slug ? "active" : ""}
                onClick={() => setTopicSlug(topic.slug)}
                style={{ "--topic-color": topic.color } as React.CSSProperties}
              >
                <i />
                <span><strong>{topic.title}</strong><small>3 thử thách</small></span>
                <ArrowRight size={17} />
              </button>
            ))}
          </div>
          <div className="practice-tip">
            <CircleHelp size={21} />
            <div><strong>Mẹo học</strong><p>Giải thích lý do trước khi chọn đáp án giúp nhớ lâu hơn.</p></div>
          </div>
        </aside>

        <main className="quiz-area">
          {!user && (
            <div className="login-notice">
              <LockKeyhole size={19} />
              <span><strong>Bạn có thể xem câu hỏi.</strong> Đăng nhập để nộp đáp án và lưu điểm.</span>
              <Link href="/login">Đăng nhập</Link>
            </div>
          )}

          {finished ? (
            <motion.section className="quiz-finish-card" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="finish-icon"><Award size={38} /></div>
              <span>Hoàn thành chủ đề</span>
              <h2>{topics.find((topic) => topic.slug === topicSlug)?.title}</h2>
              <p>Bạn đã đi hết bộ câu hỏi của lượt luyện tập này.</p>
              <div className="finish-score-grid">
                <div><strong>{correctCount}/{exercises.length}</strong><span>Câu chính xác</span></div>
                <div><strong>{Math.round((correctCount / exercises.length) * 100)}%</strong><span>Độ chính xác</span></div>
                <div><strong>+{earnedPoints}</strong><span>Điểm nhận được</span></div>
              </div>
              <div className="finish-actions">
                <button className="button button-secondary" type="button" onClick={() => void loadExercises()}><RotateCcw size={18} /> Làm lại</button>
                <Link href="/dashboard" className="button button-primary">Xem dashboard <BarChart3 size={18} /></Link>
              </div>
            </motion.section>
          ) : exercise ? (
            <motion.section className="quiz-card" key={exercise.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}>
              <div className="quiz-progress-heading">
                <span>Câu {currentIndex + 1} / {exercises.length}</span>
                <div className="quiz-tags"><i>{typeLabel(exercise.type)}</i><i>{exercise.difficulty}</i><i>+{exercise.points} điểm</i></div>
              </div>
              <div className="quiz-progress-track"><i style={{ width: `${((currentIndex + (result ? 1 : 0)) / exercises.length) * 100}%` }} /></div>
              <div className="quiz-prompt">
                <span className="question-number">Q{String(currentIndex + 1).padStart(2, "0")}</span>
                <h2>{exercise.prompt}</h2>
                <p>Chọn một đáp án trước khi xem phần giải thích.</p>
              </div>

              <div className="answer-grid">
                {exercise.options.map((option, index) => {
                  const selected = selectedAnswer === option;
                  const correct = result && option === result.correctAnswer;
                  const incorrect = result && selected && !result.correct;
                  return (
                    <button
                      type="button"
                      key={option}
                      className={`${selected ? "selected" : ""} ${correct ? "correct" : ""} ${incorrect ? "incorrect" : ""}`}
                      onClick={() => !result && setSelectedAnswer(option)}
                      disabled={Boolean(result)}
                    >
                      <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                      <span>{option}</span>
                      {correct && <Check size={19} />}
                      {incorrect && <X size={19} />}
                    </button>
                  );
                })}
              </div>

              {result && (
                <motion.div className={`answer-feedback ${result.correct ? "correct" : "incorrect"}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {result.correct ? <CheckCircle2 size={25} /> : <CircleHelp size={25} />}
                  <div>
                    <strong>{result.correct ? "Chính xác!" : "Đáp án đúng là " + result.correctAnswer}</strong>
                    <p>{result.explanation}</p>
                  </div>
                  <span>+{result.pointsEarned}</span>
                </motion.div>
              )}

              {error && <div className="form-error" role="alert">{error}</div>}

              <div className="quiz-actions">
                <button className="button button-ghost" type="button" disabled={currentIndex === 0 || Boolean(result)} onClick={() => { setCurrentIndex((value) => value - 1); setSelectedAnswer(""); }}><ArrowLeft size={18} /> Câu trước</button>
                {!result ? (
                  <button className="button button-primary" type="button" disabled={!selectedAnswer || submitting} onClick={submit}>
                    {!user && <LockKeyhole size={17} />}{submitting ? "Đang chấm..." : user ? "Kiểm tra đáp án" : "Đăng nhập để nộp"}<ArrowRight size={18} />
                  </button>
                ) : (
                  <button className="button button-primary" type="button" onClick={next}>
                    {currentIndex === exercises.length - 1 ? "Xem kết quả" : "Câu tiếp theo"}<ArrowRight size={18} />
                  </button>
                )}
              </div>
            </motion.section>
          ) : (
            <ErrorState message="Chủ đề này chưa có câu hỏi." />
          )}
        </main>
      </div>
    </div>
  );
}

function typeLabel(type: Exercise["type"]) {
  if (type === "PREDICT_STATE") return "Dự đoán";
  if (type === "COMPLEXITY") return "Độ phức tạp";
  return "Trắc nghiệm";
}
