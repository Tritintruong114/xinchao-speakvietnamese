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
        'prose prose-neutral max-w-3xl dark:prose-invert prose-headings:font-bold prose-a:text-brand-red'
      }
    >
      <ReactMarkdown>{source}</ReactMarkdown>
    </div>
  );
}
