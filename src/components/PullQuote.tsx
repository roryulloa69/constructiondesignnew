import React from "react";

interface PullQuoteProps {
  quote: string;
  author?: string;
  className?: string;
}

export const PullQuote: React.FC<PullQuoteProps> = ({ quote, author, className = "" }) => {
  return (
    <blockquote className={`relative py-8 px-6 lg:px-12 my-12 ${className}`}>
      {/* Decorative quote mark */}
      <span className="absolute top-0 left-0 text-8xl lg:text-9xl text-gold/10 font-playfair leading-none">
        "
      </span>
      
      <p className="font-playfair text-2xl lg:text-3xl text-foreground/90 italic leading-relaxed relative z-10">
        {quote}
      </p>
      
      {author && (
        <footer className="mt-6 text-right">
          <cite className="font-inter text-sm text-muted-foreground not-italic">
            — {author}
          </cite>
        </footer>
      )}
    </blockquote>
  );
};
