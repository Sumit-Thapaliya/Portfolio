import { Component } from 'react';

/**
 * Keeps a runtime error inside one section from unmounting the whole page.
 * The failing section renders nothing; the rest of the site keeps working.
 */
export default class SectionBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error(`[${this.props.name || 'section'}]`, error);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
