import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Download } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  isPrint?: boolean;
}

// Custom plugin to group H2 sections into cards
const rehypeCardGroups = () => {
  return (tree: any) => {
    const newChildren = [];
    let currentCard: any = null;

    for (const child of tree.children) {
      if (child.type === "element" && child.tagName === "h2") {
        if (currentCard) {
          newChildren.push(currentCard);
        }
        currentCard = {
          type: "element",
          tagName: "div",
          properties: {
            className: [
              "bg-white/5 border border-white/10 rounded-xl p-6 mb-6 shadow-lg backdrop-blur-sm card-section hover:border-white/20 transition-colors print:bg-transparent print:border-none print:shadow-none print:p-0",
            ],
          },
          children: [child],
        };
      } else if (currentCard) {
        currentCard.children.push(child);
      } else {
        if (child.type === "text" && !child.value.trim()) {
          newChildren.push(child);
        } else {
          if (!currentCard) {
            currentCard = {
              type: "element",
              tagName: "div",
              properties: {
                className: [
                  "bg-white/5 border border-white/10 rounded-xl p-6 mb-6 shadow-lg backdrop-blur-sm card-section print:bg-transparent print:border-none print:shadow-none print:p-0",
                ],
              },
              children: [],
            };
          }
          currentCard.children.push(child);
        }
      }
    }

    if (currentCard) {
      newChildren.push(currentCard);
    }

    tree.children = newChildren;
  };
};

export function MarkdownRenderer({ content, isPrint = false }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeCardGroups]}
      components={{
        h1: ({ ...props }) => (
          <h1
            className={isPrint ? "text-2xl font-bold text-black mb-4 border-b border-gray-300 pb-2" : "text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400 mb-6 border-b border-white/10 pb-4"}
            {...props}
          />
        ),
        h2: ({ ...props }) => (
          <h2
            className={isPrint ? "text-xl font-bold text-black mb-2 flex items-center gap-2 border-b border-gray-200 pb-1" : "text-xl font-bold text-blue-300 mb-4 flex items-center gap-2 border-b border-white/5 pb-2"}
            {...props}
          />
        ),
        h3: ({ ...props }) => (
          <h3
            className={isPrint ? "text-lg font-semibold text-black mt-4 mb-2" : "text-lg font-semibold text-purple-300 mt-4 mb-2"}
            {...props}
          />
        ),
        p: ({ ...props }) => (
          <p
            className={isPrint ? "text-black leading-relaxed mb-4 text-sm" : "text-gray-300 leading-relaxed mb-4 text-sm"}
            {...props}
          />
        ),
        ul: ({ ...props }) => (
          <ul
            className={isPrint ? "list-disc list-outside ml-5 mb-4 text-black space-y-2 text-sm" : "list-disc list-outside ml-5 mb-4 text-gray-300 space-y-2 text-sm"}
            {...props}
          />
        ),
        ol: ({ ...props }) => (
          <ol
            className={isPrint ? "list-decimal list-outside ml-5 mb-4 text-black space-y-2 text-sm" : "list-decimal list-outside ml-5 mb-4 text-gray-300 space-y-2 text-sm"}
            {...props}
          />
        ),
        li: ({ ...props }) => <li className="pl-1" {...props} />,
        code: ({ className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || "");
          const contentStr = String(children);
          const isMultiLine = contentStr.includes("\n");
          const isBlock = match || className?.includes("hljs") || isMultiLine;

          if (!isBlock) {
            return (
              <code
                className={isPrint ? "bg-gray-100 text-black px-1.5 py-0.5 rounded text-xs font-mono border border-gray-300" : "bg-white/10 text-orange-200 px-1.5 py-0.5 rounded text-xs font-mono border border-white/5"}
                {...props}
              >
                {children}
              </code>
            );
          }

          if (isPrint) {
            return (
              <div className="my-4 rounded border border-gray-300 bg-gray-50 p-4">
                <code
                  className="block text-sm font-mono text-black whitespace-pre-wrap"
                  {...props}
                >
                  {children}
                </code>
              </div>
            );
          }

          const codeRef = React.useRef<HTMLDivElement>(null);

          const handleDownload = async () => {
            if (!codeRef.current) return;

            try {
              const { toPng } = await import("html-to-image");
              const url = await toPng(codeRef.current, {
                backgroundColor: "#0D0D0D",
                pixelRatio: 2, // High resolution
              });

              const link = document.createElement("a");
              link.download = `code-${match ? match[1] : "snippet"}.png`;
              link.href = url;
              link.click();
            } catch (error) {
              console.error("Error generating image:", error);
            }
          };

          return (
            <div className="relative group my-4 rounded-lg overflow-hidden border border-white/10">
              <div className="absolute top-0 left-0 right-0 h-8 bg-[#1A1A1A] flex items-center justify-between px-3 border-b border-white/10 z-10">
                <div className="flex gap-1.5 items-center">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <span className="ml-3 text-[10px] text-gray-500 font-mono uppercase">
                    {match ? match[1] : "text"}
                  </span>
                </div>
                <button
                  onClick={handleDownload}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
                  title="Download as PNG"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/10 to-purple-500/10 blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
              <div ref={codeRef}>
                <code
                  className={`${className} block bg-[#0D0D0D] p-4 pt-10 text-sm overflow-x-auto font-mono text-gray-300`}
                  {...props}
                >
                  {children}
                </code>
              </div>
            </div>
          );
        },
        pre: ({ ...props }) => (
          <pre className="not-prose bg-transparent! p-0! m-0!" {...props} />
        ),
        blockquote: ({ ...props }) => (
          <blockquote
            className={isPrint ? "border-l-4 border-gray-400 pl-4 italic text-black my-4 bg-gray-100 p-4" : "border-l-4 border-yellow-500/50 pl-4 italic text-gray-400 my-4 bg-yellow-500/5 p-4 rounded-r-lg"}
            {...props}
          />
        ),
        a: ({ ...props }) => (
          <a
            className={isPrint ? "text-blue-600 underline" : "text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 transition-colors"}
            {...props}
          />
        ),
        table: ({ ...props }) => (
          <div className={isPrint ? "my-6" : "overflow-x-auto my-6 rounded-lg border border-white/10"}>
            <table
              className={isPrint ? "w-full text-left text-sm text-black border-collapse" : "w-full text-left text-sm text-gray-400"}
              {...props}
            />
          </div>
        ),
        thead: ({ ...props }) => (
          <thead className={isPrint ? "bg-gray-100 text-black uppercase border-b border-gray-300" : "bg-white/5 text-gray-200 uppercase"} {...props} />
        ),
        th: ({ ...props }) => (
          <th
            className={isPrint ? "px-6 py-3 font-semibold border-b border-gray-300" : "px-6 py-3 font-medium border-b border-white/10"}
            {...props}
          />
        ),
        td: ({ ...props }) => (
          <td
            className={isPrint ? "px-6 py-4 border-b border-gray-200" : "px-6 py-4 border-b border-white/10 whitespace-nowrap"}
            {...props}
          />
        ),
        hr: ({ ...props }) => (
          <hr className={isPrint ? "my-6 border-gray-300" : "my-6 border-white/10"} {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
