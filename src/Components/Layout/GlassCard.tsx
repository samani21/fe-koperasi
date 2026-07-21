import React, { ReactNode } from 'react'

type Props = {
    children: ReactNode;
    className?: string;
}

const GlassCard = ({ children, className = "" }: Props) => {
    return (
        <div className={`bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] ${className}`}>
            {children}
        </div>
    )
}

export default GlassCard