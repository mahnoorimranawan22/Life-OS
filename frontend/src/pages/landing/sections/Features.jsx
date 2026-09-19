import {
  CheckSquare2,
  GraduationCap,
  FolderKanban,
  Briefcase,
  NotebookPen,
  Sparkles,
} from 'lucide-react';
import Reveal from '../Reveal.jsx';

const features = [
  {
    title: 'Tasks & daily priorities',
    description: 'A calm checklist that adapts to your week — every item is something you actually intend to do.',
    icon: CheckSquare2,
  },
  {
    title: 'University planner',
    description: 'Subjects, assignments, exams and deadlines, with each semester organised in one place.',
    icon: GraduationCap,
  },
  {
    title: 'Projects',
    description: 'Move work from first idea to shipped, with a status you can read at a glance.',
    icon: FolderKanban,
  },
  {
    title: 'Internships & career goals',
    description: 'Applications, interviews and offers as one clear pipeline you stay on top of.',
    icon: Briefcase,
  },
  {
    title: 'Notes',
    description: 'Quick captures that stay connected to the right subject, project or decision.',
    icon: NotebookPen,
  },
  {
    title: 'Personal analytics',
    description: 'A gentle view of how your week actually went — built for planning, not judgement.',
    icon: Sparkles,
  },
];

export default function Features() {
  return (
    <section id="features" className="lk-section" aria-labelledby="features-heading">
      <div className="lk-inner">
        <Reveal className="lk-section-head">
          <span className="eyebrow">Core features</span>
          <h2 id="features-heading">Everything you manage, in one workspace</h2>
          <p>
            Six focused modules, one calm place to work — from the next thirty minutes to the
            career you're building toward.
          </p>
        </Reveal>

        <div className="lk-features">
          {features.map(({ title, description, icon: Icon }, index) => (
            <Reveal as="article" className="lk-feature" key={title} delay={(index % 3) * 80}>
              <span className="lk-feature-icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}