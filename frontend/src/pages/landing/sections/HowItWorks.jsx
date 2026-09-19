import Reveal from '../Reveal.jsx';

const steps = [
  {
    num: '01',
    title: 'Bring your life in',
    description:
      'Put your subjects, projects, career goals and notes where they belong. Each module keeps its own shape, so nothing fights for space.',
  },
  {
    num: '02',
    title: 'Shape your day',
    description:
      'LifeOS lifts what is due, urgent or next from every module into one short priority list — one glance tells you what today needs.',
  },
  {
    num: '03',
    title: 'Finish and review',
    description:
      'Work through the list, ask the assistant when you get stuck, then close the day with a two-minute review of what moved and what is next.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="lk-section lk-band" aria-labelledby="how-heading">
      <div className="lk-inner">
        <Reveal className="lk-section-head" as="div">
          <span className="eyebrow">How LifeOS works</span>
          <h2 id="how-heading">Three movements, repeated every day</h2>
          <p>
            Nothing to learn, nothing to configure. The rhythm is simple enough to keep for a
            lifetime.
          </p>
        </Reveal>

        <ol className="lk-steps">
          {steps.map(({ num, title, description }, index) => (
            <Reveal as="li" className="lk-step" key={num} delay={index * 110}>
              <span className="lk-step-num" aria-hidden="true">
                {num}
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}