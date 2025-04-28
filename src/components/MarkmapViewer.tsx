import React, { useEffect, useRef, useCallback } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";
import * as d3 from "d3";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut, RefreshCcw } from "lucide-react";

interface MarkmapViewerProps {
  markdown: string;
  className?: string;
}

const transformer = new Transformer();

const MarkmapViewer = ({
  markdown = "# Default Markdown\n## Add content here\n### To see the mind map",
  className = "",
}: MarkmapViewerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const mmRef = useRef<Markmap | null>(null);
  const zoomBehavior = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(
    null
  );

  const applyFit = useCallback(() => {
    const svgEl = svgRef.current;
    const gEl = gRef.current;
    const zoom = zoomBehavior.current;
    if (!svgEl || !gEl || !zoom) return;

    const bbox = gEl.getBBox();
    if (!bbox || bbox.width === 0 || bbox.height === 0) return;

    const svgRect = svgEl.getBoundingClientRect();
    if (svgRect.width === 0 || svgRect.height === 0) return;

    const scale =
      Math.min(svgRect.width / bbox.width, svgRect.height / bbox.height) * 0.9;
    const tx = svgRect.width / 2 - (bbox.x + bbox.width / 2) * scale;
    const ty = svgRect.height / 2 - (bbox.y + bbox.height / 2) * scale;

    d3.select(svgEl)
      .transition()
      .duration(300)
      .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }, []);

  const handleZoom = useCallback((scaleFactor: number) => {
    if (!svgRef.current || !zoomBehavior.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(200)
      .call(zoomBehavior.current.scaleBy, scaleFactor);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    if (!mmRef.current) {
      mmRef.current = Markmap.create(gRef.current);
    }
    if (!zoomBehavior.current) {
      zoomBehavior.current = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 10])
        .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
          d3.select(gRef.current).attr("transform", event.transform.toString());
        });
      d3.select(svgRef.current).call(zoomBehavior.current);
    }
  }, []);

  useEffect(() => {
    if (!mmRef.current || !gRef.current) return;

    try {
      const { root } = transformer.transform(markdown);
      mmRef.current.setData(root);

      const timerId = setTimeout(() => {
        mmRef.current?.renderData?.();
        requestAnimationFrame(() => {
          applyFit();
        });
      }, 500);

      return () => {
        clearTimeout(timerId);
      };
    } catch (error) {
      console.error("Error processing or rendering markmap:", error);
    }
  }, [markdown, applyFit]);

  return (
    <div
      className={`h-full w-full bg-white overflow-hidden flex flex-col ${className}`}
    >
      <div className="flex p-2 gap-2 border-b">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleZoom(1.5)}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleZoom(1 / 1.5)}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={applyFit}
          title="Fit to View"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <svg
          ref={svgRef}
          className="w-full h-full block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g ref={gRef} />
        </svg>
      </div>
    </div>
  );
};

export default MarkmapViewer;
