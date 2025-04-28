import React, { useState, useMemo } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

interface SplitPaneLayoutProps {
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
}

const SplitPaneLayout: React.FC<SplitPaneLayoutProps> = ({
  leftPanel = <div className="p-4 bg-background">Left Panel Content</div>,
  rightPanel = <div className="p-4 bg-background">Right Panel Content</div>,
}) => {
  return (
    <div className="h-full w-full bg-background">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[calc(100vh-4rem)] rounded-lg border"
      >
        <ResizablePanel minSize={10} maxSize={90} className="relative">
          <div className="h-full">{leftPanel}</div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel minSize={10} maxSize={90} className="relative">
          <div className="h-full">{rightPanel}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SplitPaneLayout;
