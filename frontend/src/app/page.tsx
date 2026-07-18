"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Eye,
  FlaskConical,
  Play,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { TopicIcon } from "@/components/TopicIcon";
import { apiFetch } from "@/lib/api";
import type { TopicSummary } from "@/lib/types";

const benefits = [
  {
    icon: BrainCircuit,
    title: "Dự đoán trước",
    text: "Tự chọn kết quả trước khi xem đáp án để biến việc học thụ động thành tư duy chủ động.",
  },
  {
    icon: Eye,
    title: "Thấy từng bước",
    text: "Quan sát phần tử được thêm, xóa và dịch chuyển thay vì chỉ ghi nhớ định nghĩa.",
  },
  {
    icon: Trophy,
    title: "Biết mình tiến bộ",
    text: "Điểm, độ chính xác và huy hiệu giúp bạn nhận ra chủ đề nào cần ôn lại.",
  },
];

export default function HomePage() {
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<TopicSummary[]>("/topics")
      .then(setTopics)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="container hero-grid">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="eyebrow">
              <Sparkles size={16} />
              Học bằng trực giác, hiểu bằng thực hành
            </div>
            <h1>
              Cấu trúc dữ liệu sẽ dễ hiểu khi bạn <span>nhìn thấy nó chuyển động.</span>
            </h1>
            <p className="hero-lead">
              Học Array, Stack và Queue qua bài học ngắn, mô phỏng trực quan và câu hỏi dự đoán
              được phản hồi ngay lập tức.
            </p>
            <div className="hero-actions">
              <Link href="#roadmap" className="button button-primary button-large">
                Bắt đầu học miễn phí
                <ArrowRight size={19} />
              </Link>
              <Link href="/visualizer" className="button button-secondary button-large">
                <Play size={18} fill="currentColor" />
                Thử mô phỏng
              </Link>
            </div>
            <div className="hero-proof">
              <span><CheckCircle2 size={17} /> Không cần cài code editor</span>
              <span><CheckCircle2 size={17} /> Có tài khoản demo</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-lab-card"
            initial={{ opacity: 0, scale: 0.96, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="lab-window-bar">
              <div><i /><i /><i /></div>
              <span>Stack Visualizer</span>
              <span className="live-pill">LIVE</span>
            </div>
            <div className="lab-card-body">
              <div className="lab-code-line">
                <span>Thao tác tiếp theo</span>
                <code>push(40)</code>
              </div>
              <div className="stack-preview" aria-label="Minh họa Stack">
                <motion.div
                  className="stack-item stack-new"
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.45 }}
                >
                  <span>40</span><small>top</small>
                </motion.div>
                <div className="stack-item"><span>30</span></div>
                <div className="stack-item"><span>20</span></div>
                <div className="stack-item"><span>10</span></div>
                <div className="stack-base" />
              </div>
              <div className="lab-explanation">
                <div className="step-number">1</div>
                <div>
                  <strong>Đẩy 40 lên đỉnh Stack</strong>
                  <p>push chỉ tác động tại top nên có độ phức tạp O(1).</p>
                </div>
              </div>
              <div className="complexity-row">
                <span>Time <strong>O(1)</strong></span>
                <span>Space <strong>O(1)</strong></span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-grid">
          <div><strong>3</strong><span>Cấu trúc cốt lõi</span></div>
          <div><strong>6</strong><span>Bài học có ví dụ Java</span></div>
          <div><strong>9</strong><span>Thử thách tương tác</span></div>
          <div><strong>100%</strong><span>Phản hồi tức thì</span></div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-kicker">Cách học khác biệt</span>
            <h2>Đừng chỉ đọc định nghĩa. Hãy tự kiểm tra trực giác.</h2>
            <p>Mỗi tính năng được thiết kế để bạn hiểu nguyên lý, không học thuộc lòng.</p>
          </div>
          <div className="benefit-grid">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <motion.article
                className="benefit-card"
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="benefit-icon"><Icon size={25} /></div>
                <span className="card-number">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted" id="roadmap">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <span className="section-kicker">Lộ trình nền tảng</span>
              <h2>Bắt đầu từ cấu trúc bạn muốn hiểu</h2>
            </div>
            <p>Đi theo thứ tự gợi ý hoặc chọn đúng phần bạn đang học trên lớp.</p>
          </div>

          {loading ? (
            <div className="topic-grid" aria-label="Đang tải chủ đề">
              {[1, 2, 3].map((item) => <div className="topic-card skeleton" key={item} />)}
            </div>
          ) : error ? (
            <div className="inline-notice">
              <FlaskConical size={20} />
              <div><strong>Backend chưa sẵn sàng</strong><p>{error}</p></div>
            </div>
          ) : (
            <div className="topic-grid">
              {topics.map((topic, index) => (
                <motion.article
                  className="topic-card"
                  key={topic.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  style={{ "--topic-color": topic.color } as React.CSSProperties}
                >
                  <div className="topic-card-top">
                    <div className="topic-icon"><TopicIcon name={topic.icon} size={27} /></div>
                    <span className="topic-order">0{topic.orderIndex}</span>
                  </div>
                  <h3>{topic.title}</h3>
                  <p>{topic.shortDescription}</p>
                  <div className="topic-meta">
                    <span><Clock3 size={15} /> {topic.estimatedMinutes} phút</span>
                    <span>{topic.lessonCount} bài học</span>
                    <span>{topic.difficulty}</span>
                  </div>
                  <Link href={`/learn/${topic.slug}`} className="topic-link">
                    Vào bài học <ArrowRight size={17} />
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section learning-flow-section">
        <div className="container learning-flow">
          <div className="flow-copy">
            <span className="section-kicker">Một vòng học hoàn chỉnh</span>
            <h2>Từ “mình nghĩ là hiểu” đến “mình giải thích được”.</h2>
            <p>
              StructLab nối liền kiến thức, trực giác và phản hồi để bạn không bỏ sót bước nào.
            </p>
            <Link href="/practice" className="button button-secondary">
              Xem khu luyện tập <ArrowRight size={18} />
            </Link>
          </div>
          <ol className="flow-steps">
            <li><span>01</span><div><strong>Học</strong><p>Đọc lý thuyết ngắn và ví dụ Java.</p></div></li>
            <li><span>02</span><div><strong>Dự đoán</strong><p>Chọn trạng thái trước khi chạy thao tác.</p></div></li>
            <li><span>03</span><div><strong>Quan sát</strong><p>Xem từng thay đổi và độ phức tạp.</p></div></li>
            <li><span>04</span><div><strong>Củng cố</strong><p>Làm quiz và theo dõi điểm yếu.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="container final-cta">
          <div>
            <span className="eyebrow dark-eyebrow"><Sparkles size={16} /> Sẵn sàng bắt đầu?</span>
            <h2>Hiểu cấu trúc dữ liệu bằng chính mắt bạn.</h2>
            <p>Tạo tài khoản để lưu bài đã học, điểm quiz và tiến độ theo từng chủ đề.</p>
          </div>
          <Link href="/register" className="button button-light button-large">
            Tạo tài khoản miễn phí <ArrowRight size={19} />
          </Link>
        </div>
      </section>
    </>
  );
}
