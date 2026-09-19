import { Sparkles, Send } from 'lucide-react';
import Reveal from '../Reveal.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const capabilities = [
  'Summarise your notes',
  'Plan a study week',
  'Prepare project updates',
  'Spot upcoming deadlines',
  'Draft a brief or a plan',
];

const assistantItems = [
  { text: 'Essay outline', context: 'Planner · Wed' },
  { text: 'Project milestone', context: 'Projects · Thu' },
  { text: 'Internship follow-up', context: 'Career · Thu' },
];

export default function AIPreview() {
  return (
    <section id="ai" className="lk-section lk-band" aria-labelledby="ai-heading">
      <div className="lk-inner lk-split">
        <Reveal className="lk-split-copy" as="div">
          <span className="eyebrow">AI copilot</span>
          <h2 id="ai-heading">A helpful copilot for the week ahead</h2>
          <p className="lk-split-lead">
            The assistant reads across your modules, so you can ask plain-language questions and
            get organised answers — not walls of text.
          </p>
          <ul className="lk-chip-list">
            {capabilities.map((capability) => (
              <li key={capability} className="lk-chip">
                {capability}
              </li>
            ))}
          </ul>
          <p className="lk-split-note">
            <Badge variant="accent">Preview</Badge>
            <span>An upcoming capability — not connected yet.</span>
          </p>
        </Reveal>

        <Reveal className="lk-chat" delay={120} aria-hidden="true">
          <div className="lk-chat-window">
            <div className="lk-chat-head">
              <span className="lk-ai-avatar">
                <Sparkles size={16} aria-hidden="true" />
              </span>
              <span className="lk-chat-title">LifeOS Copilot</span>
              <Badge variant="accent">Preview</Badge>
            </div>

            <div className="lk-chat-body">
              <div className="lk-bubble lk-bubble--ai">
                <p className="lk-bubble-q">What's due before Friday?</p>
              </div>

              <div className="lk-bubble lk-bubble--ai lk-bubble--answer">
                <span className="lk-bubble-label">Across your workspace</span>
                <ul className="lk-bubble-list">
                  {assistantItems.map(({ text, context }) => (
                    <li key={text}>
                      <span className="lk-bubble-item">{text}</span>
                      <span className="lk-bubble-ctx">{context}</span>
                    </li>
                  ))}
                </ul>
                <span className="lk-bubble-note">Pushed to your Today list for you.</span>
              </div>
            </div>

            <div className="lk-chat-input" aria-hidden="true">
              <span className="lk-chat-placeholder">Ask about your week…</span>
              <span className="lk-chat-send">
                <Send size={14} />
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}