import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            components={{
                h1: ({ ...props }) => <h1 className="text-2xl font-bold text-blue-400 mb-4" {...props} />,
                h2: ({ ...props }) => <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-3" {...props} />,
                h3: ({ ...props }) => <h3 className="text-lg font-medium text-white mt-4 mb-2" {...props} />,
                p: ({ ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc list-outside ml-6 mb-4 text-gray-300 space-y-1" {...props} />,
                ol: ({ ...props }) => <ol className="list-decimal list-outside ml-6 mb-4 text-gray-300 space-y-1" {...props} />,
                li: ({ ...props }) => <li className="pl-1" {...props} />,
                code: ({ className, children, ...props }: any) => {
                    const isInline = !className?.includes('language-');
                    return isInline
                        ? <code className="bg-white/10 text-blue-300 px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code>
                        : <code className="block bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto border border-white/5 my-4" {...props}>{children}</code>;
                },
                pre: ({ ...props }) => <pre className="not-prose" {...props} />,
                blockquote: ({ ...props }) => <blockquote className="border-l-4 border-blue-500/50 pl-4 italic text-gray-400 my-4" {...props} />,
                a: ({ ...props }) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-4" {...props} />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
