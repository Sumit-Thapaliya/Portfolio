import './Marquee.css';

const ITEMS = [
  'Available for Work',
  'Full Stack Developer',
  'React · Node.js · PostgreSQL',
  "Let's Build Something",
];

export default function Marquee() {
  const content = ITEMS.join('   ✦   ');

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <span className="marquee__text">{content}&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;</span>
        <span className="marquee__text">{content}&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;</span>
      </div>
    </div>
  );
}
