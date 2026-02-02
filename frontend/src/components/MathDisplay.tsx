"use client";

import React from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

interface MathDisplayProps {
    content: string;
}

const MathDisplay: React.FC<MathDisplayProps> = ({ content }) => {
    return (
        <div className="text-base leading-7">
            <Latex
                delimiters={[
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false },
                    { left: "\\(", right: "\\)", display: false },
                    { left: "\\[", right: "\\]", display: true },
                ]}
            >
                {content}
            </Latex>
        </div>
    );
};

export default MathDisplay;
