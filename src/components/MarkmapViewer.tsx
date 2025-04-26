import React, { useEffect, useRef } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";

interface MarkmapViewerProps {
  markdown: string;
  className?: string;
}

const MarkmapViewer = ({
  markdown = "# Default Markdown\n## Add content here\n### To see the mind map",
  className = "",
}: MarkmapViewerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const mmRef = useRef<Markmap | null>(null);
  const transformer = useRef(new Transformer());

  useEffect(() => {
    if (!svgRef.current) return;

    // Initialize markmap if not already initialized
    if (!mmRef.current) {
      mmRef.current = Markmap.create(svgRef.current);
    }

    try {
      // Transform markdown to markmap data
      const { root } = transformer.current.transform(markdown);

      // Render the markmap
      mmRef.current.setData(root);
      mmRef.current.fit();
    } catch (error) {
      console.error("Error rendering markmap:", error);
    }
  }, [markdown]);

  return (
    <div
      className={`h-full w-full bg-white overflow-hidden flex flex-col ${className}`}
    >
      <div className="flex-1 overflow-hidden">
        <svg
          ref={svgRef}
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        />
      </div>
    </div>
  );
};

export default MarkmapViewer;
