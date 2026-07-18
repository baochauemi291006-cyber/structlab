"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  FlaskConical,
  LockKeyhole,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorState, PageLoader } from "@/components/Feedback";
import { TopicIcon } from "@/components/TopicIcon";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import type { TopicDetail } from "@/lib/types";

export function LearnPageClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { token, user, loading: authLoading } = useAuth();
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTopic = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiFetch<TopicDetail>(`/topics/${slug}`, {}, token);
      setTopic(response);
      const firstIncomplete = response.lessons.findIndex((lesson) => !lesson.completed);
      setActiveIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể tải bài học.");
    } finally {
      setLoading(false);
    }
  }, [slug, token]);

  useEffect(() => {
    if (!authLoading) {
      queueMicrotask(() => void loadTopic());
    }
  }, [authLoading, loadTopic]);

  const completedCount = useMemo(
    () => topic?.lessons.filter((lesson) => lesson.completed).length ?? 0,
    [topic],
  );
  const activeLesson = topic?.lessons[activeIndex];

  const markComplete = async () => {
    if (!activeLesson) return;
    if (!user || !token) {
      router.push("/login");
      return;
    }
    setSaving(true);
    try {
      await apiFetch(`/lessons/${activeLesson.id}/complete`, { method: "POST" }, token);
      setTopic((current) =>
        current
          ? {
              ...current,
              lessons: current.lessons.map((lesson) =>
                lesson.id === activeLesson.id ? { ...lesson, completed: true } : lesson,
              ),
            }
          : current,
      );
      if (topic && activeIndex < topic.lessons.length - 1) {
        setActiveIndex((value) => value + 1);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể lưu tiến độ.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) return <PageLoader label="Đang mở bài học..." />;
  if (error && !topic) return <ErrorState message={error} onRetry={() => void loadTopic()} />;
  if (!topic || !activeLesson) return <ErrorState message="Chủ đề này chưa có bài học." />;

  const progress = Math.round((completedCount / topic.lessons.length) * 100);

  return (
    <div className="learn-page" style={{ "--topic-color": topic.color } as React.CSSProperties}>
      <section className="learn-hero">
        <div className="container">
          <Link href="/#roadmap" className="back-link"><ArrowLeft size={17} /> Quay lại lộ trình</Link>
          <div className="learn-hero-row">
            <div className="learn-topic-heading">
              <div className="topic-icon large"><TopicIcon name={topic.icon} size={31} /></div>
              <div>
                <div className="learn-meta">
                  <span>{topic.difficulty}</span><span><Clock3 size={14} /> {topic.estimatedMinutes} phút</span>
                </div>
                <h1>{topic.title}</h1>
                <p>{topic.shortDescription}</p>
              </div>
            </div>
            <div className="learn-progress-card">
              <div><span>Tiến độ chủ đề</span><strong>{progress}%</strong></div>
              <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
              <small>{completedCount}/{topic.lessons.length} bài đã hoàn thành</small>
            </div>
          </div>
        </div>
      </section>

      <section className="container lesson-layout">
        <aside className="lesson-sidebar">
          <div className="sidebar-heading"><span>Nội dung</span><small>{topic.lessons.length} bài</small></div>
          <div className="lesson-nav">
            {topic.lessons.map((lesson, index) => (
              <button
                type="button"
                key={lesson.id}
                className={activeIndex === index ? "active" : ""}
                onClick={() => setActiveIndex(index)}
              >
                <span className={lesson.completed ? "lesson-status done" : "lesson-status"}>
                  {lesson.completed ? <Check size={15} /> : index + 1}
                </span>
                <span><strong>{lesson.title}</strong><small>{lesson.summary}</small></span>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
          <Link href={`/visualizer?type=${topic.slug}`} className="sidebar-lab-link">
            <FlaskConical size={20} />
            <span><strong>Mở phòng mô phỏng</strong><small>Thử thao tác trực tiếp</small></span>
            <ArrowRight size={17} />
          </Link>
        </aside>

        <article className="lesson-content-card">
          <div className="lesson-label">Bài {activeLesson.orderIndex} / {topic.lessons.length}</div>
          <h2>{activeLesson.title}</h2>
          <p className="lesson-summary">{activeLesson.summary}</p>

          <div className="lesson-prose">
            {activeLesson.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="code-example">
            <div className="code-heading"><span><Code2 size={17} /> Ví dụ Java</span><small>Java 17</small></div>
            <pre><code>{activeLesson.codeExample.trim()}</code></pre>
          </div>

          {error && <div className="form-error" role="alert">{error}</div>}

          <div className="lesson-actions">
            <button
              className="button button-ghost"
              type="button"
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex((value) => Math.max(0, value - 1))}
            >
              <ArrowLeft size={18} /> Bài trước
            </button>
            {activeLesson.completed ? (
              <button
                className="button button-success"
                type="button"
                onClick={() => setActiveIndex((value) => Math.min(topic.lessons.length - 1, value + 1))}
                disabled={activeIndex === topic.lessons.length - 1}
              >
                <CheckCircle2 size={18} /> Đã hoàn thành <ArrowRight size={18} />
              </button>
            ) : (
              <button className="button button-primary" type="button" onClick={markComplete} disabled={saving}>
                {!user ? <LockKeyhole size={17} /> : <CheckCircle2 size={18} />}
                {saving ? "Đang lưu..." : user ? "Hoàn thành bài" : "Đăng nhập để lưu"}
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
