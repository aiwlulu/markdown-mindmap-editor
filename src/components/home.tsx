import React, { useState, useRef, useCallback } from "react";
import SplitPaneLayout from "./SplitPaneLayout";
import MarkdownEditor from "./MarkdownEditor";
import MarkmapViewer from "./MarkmapViewer";
import { Button } from "./ui/button";
import {
  Save,
  FileText,
  Download,
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
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const DEFAULT_MARKDOWN = `# Markdown Mind Map

## Features
- Real-time visualization
- Split-screen interface
- Markdown editing

## Benefits
- Easy to use
- Visual organization
- Quick note-taking

## Use Cases
- Project planning
- Knowledge management
- Brainstorming sessions
`;

const Home: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [fileName, setFileName] = useState<string>("untitled.md");
  const [baseName, setBaseName] = useState<string>("untitled");
  const [isEditingFileName, setIsEditingFileName] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>("split");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdown(value);
  }, []);

  const handleSave = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [markdown, fileName]);

  const handleNew = useCallback(() => {
    if (confirm("Create a new document? Unsaved changes will be lost.")) {
      setMarkdown("# New Mind Map");
      setBaseName("untitled");
      setFileName("untitled.md");
    }
  }, []);

  const handleFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const nameWithoutExtension = file.name.replace(/\.(md|markdown)$/i, "");
      setBaseName(nameWithoutExtension);
      setFileName(`${nameWithoutExtension}.md`);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdown(content);
      };
      reader.readAsText(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    []
  );

  const handleFileNameEdit = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBaseName(e.target.value);
    },
    []
  );

  const handleFileNameSave = useCallback(() => {
    setIsEditingFileName(false);
    setFileName(`${baseName}.md`);
  }, [baseName]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Markdown Mind Map</h1>
          {isEditingFileName ? (
            <div className="flex items-center space-x-1">
              <input
                type="text"
                value={baseName}
                onChange={handleFileNameEdit}
                onBlur={handleFileNameSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFileNameSave();
                  }
                }}
                autoFocus
                className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">.md</span>
            </div>
          ) : (
            <span
              className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
              onDoubleClick={() => setIsEditingFileName(true)}
              title="Double-click to edit filename"
            >
              {fileName}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Toolbar Buttons */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleNew}>
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Document</TooltipContent>
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
              <TooltipContent>Upload Markdown File</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,text/markdown"
            onChange={handleFileChange}
            className="hidden"
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save Document</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleSave}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export Mind Map</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="border-l mx-2 h-6" />

          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="grid grid-cols-3 w-auto">
              <TabsTrigger value="markdown">
                <FileCode className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="mindmap">
                <Eye className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="split">
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
