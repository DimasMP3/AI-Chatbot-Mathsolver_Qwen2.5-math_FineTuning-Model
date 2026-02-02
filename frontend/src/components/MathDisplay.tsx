"use client";

import React from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

interface MathDisplayProps {
    content: string;
}

const MathDisplay: React.FC<MathDisplayProps> = ({ content }) => {
    // Normalize newlines to ensure consistent spacing
    // Replace single newlines with spaces if they are just soft wraps, 
    // but usually in chat outputs, newlines are intentional break points.
    // Let's treat double newlines as paragraph breaks and single newlines as line breaks.

    const paragraphs = content.split(/\n\s*\n/);

    return (
        <div className="math-display text-[15px] leading-relaxed text-gray-800 dark:text-gray-100">
            {paragraphs.map((paragraph, index) => {
                // Prepare paragraph content
                const cleanParagraph = paragraph.trim();
                if (!cleanParagraph) return null;

                return (
                    <div key={index} className="mb-4 last:mb-0">
                        <Latex
                            delimiters={[
                                { left: "$$", right: "$$", display: true },
                                { left: "$", right: "$", display: false },
                                { left: "\\(", right: "\\)", display: false },
                                { left: "\\[", right: "\\]", display: true },
                            ]}
                        >
                            {cleanParagraph}
                        </Latex>
                    </div>
                );
            })}
        </div>
    );
};

export default MathDisplay;
