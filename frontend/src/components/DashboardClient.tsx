"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Circle,
  Clock3,
  Flame,
  Medal,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorState, PageLoader } from "@/components/Feedback";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import type { Dashboard } from "@/lib/types";

export function DashboardClient() {
  const router = useRouter();
  const { token, user, loading: authLoading } = useAuth();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      router.replace("/login");
      return;
    }
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setLoading(true);
      apiFetch<Dashboard>("/progress/me", {}, token)
        .then((response) => {
          if (!cancelled) setDashboard(response);
        })
        .catch((reason: Error) => {
          if (!cancelled) setError(reason.message);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });
    return () => {
      cancelled = true;
    };
  }, [authLoading, router, token, user]);

  if (authLoading || loading || (!user && !error)) return <PageLoader label="Đang tổng hợp tiến độ..." />;
  if (error || !dashboard) return <ErrorState message={error || "Không có dữ liệu tiến độ."} />;

  const learningPercent = dashboard.totalLessons
    ? Math.round((dashboard.completedLessons / dashboard.totalLessons) * 100)
    : 0;

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-orb" />
        <div className="container dashboard-hero-content">
          <div>
            <span className="dark-eyebrow"><Sparkles size={15} /> Learning dashboard</span>
            <h1>Chào {dashboard.displayName}, tiếp tục giữ nhịp nhé.</h1>
            <p>Bạn đã hoàn thành {dashboard.completedLessons}/{dashboard.totalLessons} bài học trong lộ trình nền tảng.</p>
          </div>
          <div className="dashboard-hero-score">
            <Trophy size={31} />
            <div><span>Tổng điểm</span><strong>{dashboard.totalPoints}</strong></div>
            <i>XP</i>
          </div>
        </div>
      </section>

      <div className="container dashboard-content">
        <section className="dashboard-stat-grid">
          <article>
            <div className="stat-icon purple"><BookOpenCheck size={22} /></div>
            <div><span>Bài đã học</span><strong>{dashboard.completedLessons}<small> / {dashboard.totalLessons}</small></strong></div>
            <i>{learningPercent}%</i>
          </article>
          <article>
            <div className="stat-icon blue"><Target size={22} /></div>
            <div><span>Độ chính xác</span><strong>{Math.round(dashboard.accuracy)}<small>%</small></strong></div>
            <i>{dashboard.attempts} lượt</i>
          </article>
          <article>
            <div className="stat-icon orange"><Flame size={22} /></div>
            <div><span>Chuỗi đúng hiện tại</span><strong>{dashboard.correctStreak}<small> câu</small></strong></div>
            <i>Best effort</i>
          </article>
          <article>
            <div className="stat-icon green"><Award size={22} /></div>
            <div><span>Huy hiệu mở khóa</span><strong>{dashboard.achievements.filter((item) => item.unlocked).length}<small> / {dashboard.achievements.length}</small></strong></div>
            <i>Collection</i>
          </article>
        </section>

        <div className="dashboard-main-grid">
          <section className="dashboard-panel topic-progress-panel">
            <div className="dashboard-panel-heading">
              <div><span>Tiến độ học</span><h2>Theo từng cấu trúc</h2></div>
              <Link href="/#roadmap">Mở lộ trình <ArrowRight size={16} /></Link>
            </div>
            <div className="dashboard-topic-list">
              {dashboard.topics.map((topic) => (
                <article key={topic.slug} style={{ "--topic-color": topic.color } as React.CSSProperties}>
                  <div className="dashboard-topic-title"><i /><div><strong>{topic.title}</strong><span>{topic.completedLessons}/{topic.totalLessons} bài học</span></div><b>{Math.round(topic.lessonPercent)}%</b></div>
                  <div className="progress-track"><i style={{ width: `${topic.lessonPercent}%` }} /></div>
                  <div className="topic-accuracy"><span>Quiz accuracy</span><strong>{Math.round(topic.quizAccuracy)}%</strong></div>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-panel achievements-panel">
            <div className="dashboard-panel-heading">
              <div><span>Thành tựu</span><h2>Huy hiệu của bạn</h2></div>
              <Medal size={22} />
            </div>
            <div className="achievement-list">
              {dashboard.achievements.map((achievement) => (
                <article className={achievement.unlocked ? "unlocked" : "locked"} key={achievement.id}>
                  <div>{achievement.unlocked ? <Award size={22} /> : <Circle size={22} />}</div>
                  <span><strong>{achievement.title}</strong><small>{achievement.description}</small></span>
                  {achievement.unlocked && <CheckCircle2 size={18} />}
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="dashboard-panel recent-panel">
          <div className="dashboard-panel-heading">
            <div><span>Hoạt động gần đây</span><h2>Lịch sử trả lời</h2></div>
            <Link href="/practice">Luyện tập tiếp <ArrowRight size={16} /></Link>
          </div>
          {dashboard.recentAttempts.length === 0 ? (
            <div className="empty-recent">
              <BarChart3 size={29} />
              <strong>Chưa có lượt trả lời</strong>
              <p>Làm câu hỏi đầu tiên để dữ liệu xuất hiện tại đây.</p>
              <Link href="/practice" className="button button-secondary button-small">Bắt đầu luyện tập</Link>
            </div>
          ) : (
            <div className="recent-table">
              <div className="recent-table-head"><span>Kết quả</span><span>Câu hỏi</span><span>Chủ đề</span><span>Điểm</span><span>Thời gian</span></div>
              {dashboard.recentAttempts.map((attempt, index) => (
                <div className="recent-table-row" key={`${attempt.exerciseId}-${attempt.attemptedAt}-${index}`}>
                  <span className={attempt.correct ? "result-ok" : "result-no"}>{attempt.correct ? <CheckCircle2 size={18} /> : <Circle size={18} />}{attempt.correct ? "Đúng" : "Sai"}</span>
                  <strong>{attempt.prompt}</strong>
                  <span>{attempt.topicTitle}</span>
                  <b>+{attempt.pointsEarned}</b>
                  <span><Clock3 size={14} /> {formatTime(attempt.attemptedAt)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-next-card">
          <div><span>Bước tiếp theo được gợi ý</span><h2>Thử mô phỏng thao tác trước khi làm quiz.</h2><p>Dự đoán trạng thái giúp bạn phát hiện ngay phần kiến thức còn mơ hồ.</p></div>
          <Link href="/visualizer" className="button button-light">Mở Visualizer <ArrowRight size={18} /></Link>
        </section>
      </div>
    </div>
  );
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
