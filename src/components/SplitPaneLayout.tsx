import React, { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface SplitPaneLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

const SplitPaneLayout = (
  { leftPanel, rightPanel }: SplitPaneLayoutProps = {
    leftPanel: <div className="p-4 bg-background">Left Panel Content</div>,
    rightPanel: <div className="p-4 bg-background">Right Panel Content</div>,
  },
) => {
  const [isLeftFullscreen, setIsLeftFullscreen] = useState(false);
  const [isRightFullscreen, setIsRightFullscreen] = useState(false);

  const toggleLeftFullscreen = () => {
    setIsLeftFullscreen(!isLeftFullscreen);
    setIsRightFullscreen(false);
  };

  const toggleRightFullscreen = () => {
    setIsRightFullscreen(!isRightFullscreen);
    setIsLeftFullscreen(false);
  };

  return (
    <div className="h-full w-full bg-background">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[calc(100vh-4rem)] rounded-lg border"
      >
        <ResizablePanel
          defaultSize={50}
          minSize={10}
          maxSize={isLeftFullscreen ? 100 : 90}
          className="relative"
          style={{
            flex: isLeftFullscreen
              ? "1 0 100%"
              : isRightFullscreen
                ? "0 0 0%"
                : undefined,
          }}
        >
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLeftFullscreen}
              title={isLeftFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isLeftFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="h-full">{leftPanel}</div>
        </ResizablePanel>

        {!isLeftFullscreen && !isRightFullscreen && (
          <ResizableHandle withHandle />
        )}

        <ResizablePanel
          defaultSize={50}
          minSize={10}
          maxSize={isRightFullscreen ? 100 : 90}
          className="relative"
          style={{
            flex: isRightFullscreen
              ? "1 0 100%"
              : isLeftFullscreen
                ? "0 0 0%"
                : undefined,
          }}
        >
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRightFullscreen}
              title={isRightFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isRightFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="h-full">{rightPanel}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SplitPaneLayout;
