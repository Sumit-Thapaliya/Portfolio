import useMagnetic from '../../hooks/useMagnetic.js';
import './ui.css';

/**
 * Magnetic + shimmering CTA. Renders <a> when `href` is given, else <button>.
 */
export default function ShimmerButton({
  href,
  children,
  className = '',
  ghost = false,
  strength = 0.3,
  ...rest
}) {
  const magnet = useMagnetic(strength);
  const cls = `shimmer-btn ${ghost ? 'shimmer-btn--ghost' : ''} ${className}`;
  const props = {
    ref: magnet.ref,
    onMouseMove: magnet.handleMouseMove,
    onMouseLeave: magnet.handleMouseLeave,
    className: cls,
    ...rest,
  };
  return href ? (
    <a href={href} {...props}>
      {children}
    </a>
  ) : (
    <button {...props}>{children}</button>
  );
}
