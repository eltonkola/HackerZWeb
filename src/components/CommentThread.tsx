import { memo, useMemo, useState } from "react";
import { type CommentNode, timeAgo } from "../lib/hn";
import { sanitizeCommentHtml } from "../lib/sanitize";
import { ChevronIcon } from "./icons";

const MAX_VISUAL_DEPTH = 6;

export function CommentThread({
  nodes,
  newSinceTime,
}: {
  nodes: CommentNode[];
  newSinceTime?: number | null;
}) {
  return (
    <div className="flex flex-col">
      {nodes.map((node) => (
        <CommentRow key={node.item.id} node={node} depth={0} newSinceTime={newSinceTime} />
      ))}
    </div>
  );
}

function countDescendants(node: CommentNode): number {
  return node.children.reduce((sum, child) => sum + 1 + countDescendants(child), 0);
}

const CommentRow = memo(function CommentRow({
  node,
  depth,
  newSinceTime,
}: {
  node: CommentNode;
  depth: number;
  newSinceTime?: number | null;
}) {
  const [expanded, setExpanded] = useState(true);
  const { item, children } = node;
  const hasChildren = children.length > 0;
  const indent = Math.min(depth, MAX_VISUAL_DEPTH);
  const isRemoved = item.dead || item.deleted;
  // `newSinceTime` is null on a story's first-ever visit — nothing to diff
  // against, so nothing is "new" yet (everything would trivially qualify).
  const isNew = !isRemoved && newSinceTime != null && item.time > newSinceTime;

  // `node` references are stable once fetched (never rebuilt on re-render),
  // so these are safe to memoize — otherwise an unrelated re-render (e.g.
  // clicking Read/Archive in ItemView) would re-walk every subtree for its
  // reply count and re-parse+re-sanitize every comment's HTML again.
  const replyCount = useMemo(() => (hasChildren ? countDescendants(node) : 0), [hasChildren, node]);
  const sanitizedText = useMemo(
    () => (item.text ? sanitizeCommentHtml(item.text) : null),
    [item.text],
  );

  return (
    <div className={indent > 0 ? "ml-2 border-l border-border pl-3 sm:ml-3 sm:pl-4" : ""}>
      <div className="py-3">
        {isRemoved ? (
          // The comment itself was killed/removed, but it can still have
          // live replies nested under it — keep the slot (and its children)
          // instead of dropping the whole subtree.
          <p className="text-xs italic text-muted">[deleted]</p>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-bold text-accent">
                {item.by?.[0]?.toUpperCase() ?? "?"}
              </span>
              <span className="font-semibold text-foreground">{item.by ?? "unknown"}</span>
              <span className="text-muted">{timeAgo(item.time)}</span>
              {isNew && (
                <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                  NEW
                </span>
              )}
            </div>

            {sanitizedText && (
              <div
                className="hn-comment mt-1.5 text-sm leading-relaxed text-foreground"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: sanitizedText }}
              />
            )}
          </>
        )}

        {hasChildren && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-accent"
          >
            <ChevronIcon open={expanded} />
            {expanded ? "Hide" : "Show"} {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="flex flex-col">
          {children.map((child) => (
            <CommentRow key={child.item.id} node={child} depth={depth + 1} newSinceTime={newSinceTime} />
          ))}
        </div>
      )}
    </div>
  );
});
