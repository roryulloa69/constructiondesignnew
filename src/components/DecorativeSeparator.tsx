import React from "react";

export const DecorativeSeparator: React.FC = () => {
    return (
        <div className="flex items-center gap-4 my-16 lg:my-24">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <span className="text-gold/50 text-xs">✦</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>
    );
};
