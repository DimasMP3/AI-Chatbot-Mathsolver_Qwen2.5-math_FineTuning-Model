"use client";

import React from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

interface MathDisplayProps {
    content: string;
}

const MathDisplay: React.FC<MathDisplayProps> = ({ content }) => {
    // Parsing paragraf sesuai style Gemini
    const paragraphs = content.split(/\n\s*\n/);

    return (
        <div className="math-display text-[16px] leading-[1.8] text-[#e3e3e3] font-light">
            {paragraphs.map((paragraph, index) => {
                const cleanParagraph = paragraph.trim();
                if (!cleanParagraph) return null;

                return (
                    <div key={index} className="mb-6 last:mb-0">
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
