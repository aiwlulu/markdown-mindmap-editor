import React, { useState, useRef } from "react";
import SplitPaneLayout from "./SplitPaneLayout";
import MarkdownEditor from "./MarkdownEditor";
import MarkmapViewer from "./MarkmapViewer";
import { Button } from "./ui/button";
import {
  Save,
  FileText,
  Download,
  Settings,
  Upload,
  Eye,
  Split,
  FileCode,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const Home = () => {
  const [markdown, setMarkdown] = useState<string>(
    "# Markdown Mind Map\n\n## Features\n- Real-time visualization\n- Split-screen interface\n- Markdown editing\n\n## Benefits\n- Easy to use\n- Visual organization\n- Quick note-taking\n\n## Use Cases\n- Project planning\n- Knowledge management\n- Brainstorming sessions",
  );
  const [fileName, setFileName] = useState<string>("untitled.md");
  const [isEditingFileName, setIsEditingFileName] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>("split");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMarkdownChange = (value: string) => {
    setMarkdown(value);
  };

  const handleSave = () => {
    // Create a blob with the markdown content
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNew = () => {
    if (confirm("Create a new document? Unsaved changes will be lost.")) {
      setMarkdown("# New Mind Map");
      setFileName("untitled.md");
    }
  };

  const handleExport = () => {
    // For now, we'll just download the markdown file
    // In a future enhancement, we could export the mind map as an image
    handleSave();
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Update the filename
    setFileName(file.name);

    // Read the file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMarkdown(content);
    };
    reader.readAsText(file);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Markdown Mind Map</h1>
          {isEditingFileName ? (
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onBlur={() => setIsEditingFileName(false)}
              onKeyDown={(e) =>
                e.key === "Enter" && setIsEditingFileName(false)
              }
              autoFocus
              className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <span
              className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
              onDoubleClick={() => setIsEditingFileName(true)}
              title="Double-click to edit"
            >
              {fileName}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleNew}>
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFileUpload}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload Markdown File</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".md,.markdown,text/markdown"
            onChange={handleFileChange}
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save Document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export Mind Map</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="border-l mx-2 h-6"></div>

          <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
            <TabsList className="grid grid-cols-3 w-auto">
              <TabsTrigger value="markdown" className="px-2 py-1">
                <FileCode className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="mindmap" className="px-2 py-1">
                <Eye className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="split" className="px-2 py-1">
                <Split className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {viewMode === "split" && (
          <SplitPaneLayout
            leftPanel={
              <MarkdownEditor
                content={markdown}
                onChange={handleMarkdownChange}
              />
            }
            rightPanel={<MarkmapViewer markdown={markdown} />}
          />
        )}
        {viewMode === "markdown" && (
          <div className="h-full p-4">
            <MarkdownEditor
              content={markdown}
              onChange={handleMarkdownChange}
            />
          </div>
        )}
        {viewMode === "mindmap" && (
          <div className="h-full p-4">
            <MarkmapViewer markdown={markdown} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-2 border-t text-center text-xs text-muted-foreground bg-card">
        <p>
          Markdown Mind Map Editor - Create beautiful mind maps from markdown
        </p>
      </footer>
    </div>
  );
};

export default Home;
