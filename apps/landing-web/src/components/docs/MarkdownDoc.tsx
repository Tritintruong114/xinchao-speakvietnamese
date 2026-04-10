import ReactMarkdown from 'react-markdown';

type MarkdownDocProps = {
  source: string;
  className?: string;
};

export function MarkdownDoc({ source, className }: MarkdownDocProps) {
  return (
    <div
      className={
        className ??
        [
          'prose max-w-3xl',
          'prose-headings:font-bold prose-headings:text-text-main',
          'prose-p:text-text-main prose-li:text-text-main prose-strong:text-text-main',
          'prose-li:marker:text-text-main',
          'prose-a:text-brand-red prose-a:font-semibold prose-a:no-underline hover:prose-a:underline',
          'prose-hr:border-text-main/20',
        ].join(' ')
      }
    >
      <ReactMarkdown>{source}</ReactMarkdown>
    </div>
  );
}
