import { useRef, type CSSProperties, type ReactNode } from "react";
import { useStops } from "@/useStops";

export interface RouteStop {
  id: string;
  /** What identifies the stop in the list: a logo, a year. */
  marker: ReactNode;
  title: string;
  body: ReactNode;
}

interface RouteSectionProps {
  id: string;
  heading: string;
  lead: string;
  stops: readonly RouteStop[];
  /** Share of the section the camera spends travelling in before the first stop. */
  leadIn?: number;
}

/**
 * A tall, empty stretch of scroll with a panel fixed over the world. Scrolling
 * walks through the stops; only the current one is open. The panel is shown
 * only while the camera is at this section, so it never slides across the
 * screen between sections.
 */
export default function RouteSection({ id, heading, lead, stops, leadIn = 0 }: RouteSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { active, engaged, goTo } = useStops(sectionRef, stops.length, leadIn);
  const headingId = `${id}-heading`;

  return (
    <section
      ref={sectionRef}
      className="route"
      data-route={id}
      style={{ "--stops": stops.length, "--lead": leadIn } as CSSProperties}
      aria-labelledby={headingId}
    >
      {/* Links land where the first stop is, past the camera's flight in. */}
      <span id={id} className="route-anchor" />

      <div className="route-stage" data-engaged={engaged}>
        <div className="panel">
          <header className="panel-head">
            <h2 id={headingId}>{heading}</h2>
            <p>{lead}</p>
          </header>

          <ol className="stops">
            {stops.map((stop, index) => {
              const open = index === active;
              const bodyId = `${id}-${stop.id}`;

              return (
                <li key={stop.id} className="stop" data-open={open}>
                  <h3>
                    <button
                      type="button"
                      className="stop-head"
                      aria-expanded={open}
                      aria-controls={bodyId}
                      onClick={() => goTo(index)}
                      onFocus={() => {
                        // Reached by keyboard while the panel is away: bring its section in.
                        if (!engaged) goTo(index);
                      }}
                    >
                      <span className="stop-marker">{stop.marker}</span>
                      <span className="stop-title">{stop.title}</span>
                    </button>
                  </h3>
                  <div id={bodyId} className="stop-body" inert={!open}>
                    <div className="stop-body-inner">{stop.body}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
