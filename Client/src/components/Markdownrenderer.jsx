import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl dark:prose-invert max-w-none break-words">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold my-4 text-neutral-800 dark:text-neutral-100" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-semibold my-3 text-neutral-700 dark:text-neutral-200" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold my-2 text-neutral-700 dark:text-neutral-200" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-2 leading-relaxed text-neutral-600 dark:text-neutral-300" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside my-2 pl-4 text-neutral-600 dark:text-neutral-300" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside my-2 pl-4 text-neutral-600 dark:text-neutral-300" {...props} />
          ),
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-4 italic my-4 text-neutral-500 dark:text-neutral-400" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <pre className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-md overflow-x-auto my-2">
                <code className={`language-${match[1]}`} {...props}>
                  {String(children).replace(/\n$/, '')}
                </code>
              </pre>
            ) : (
              <code className="bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded text-sm text-pink-600 dark:text-pink-400" {...props}>
                {children}
              </code>
            );
          },
          table: ({ node, ...props }) => (
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 my-4 border border-neutral-300 dark:border-neutral-600" {...props} />
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-neutral-50 dark:bg-neutral-800" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider border-b border-neutral-300 dark:border-neutral-600" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 border-t border-neutral-200 dark:border-neutral-700" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;