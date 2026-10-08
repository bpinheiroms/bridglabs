import { Component, Suspense, type ReactNode } from "react";

/**
 * Wraps purely decorative content. If it fails to load or throws, the page
 * simply goes without it instead of going blank.
 */
export default class Scenery extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return <Suspense fallback={null}>{this.props.children}</Suspense>;
  }
}
