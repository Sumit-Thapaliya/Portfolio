import './ui.css';

/**
 * A thin light beam that orbits the parent's border.
 * Parent must be `position: relative` with a border-radius.
 * `always` keeps it running; otherwise the parent toggles --beam-opacity on hover.
 */
export default function BorderBeam({ duration = 6, always = false, colorA, colorB }) {
  const style = { '--beam-duration': `${duration}s` };
  if (colorA) style['--beam-color-a'] = colorA;
  if (colorB) style['--beam-color-b'] = colorB;
  return (
    <span
      className={`border-beam ${always ? 'border-beam--always' : ''}`}
      style={style}
      aria-hidden="true"
    />
  );
}
