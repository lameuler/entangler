<svg viewBox="0 0 32 32" class="w-12 h-12 animate-[spin_2s_linear_infinite]">
    <circle class="stroke-slate-500/25 fill-none" cx="16" cy="16" r="12" stroke-width="3"/>
    <circle class="spinner stroke-slate-500/40 fill-none" cx="16" cy="16" r="12" stroke-width="3"/>
</svg>

<style>
    .spinner {
        stroke-dasharray: 75;
        stroke-linecap: round;
        animation: dash 3s linear infinite;
        transform-origin: 50% 50%;
    }

    @keyframes dash {
        0% {
            stroke-dashoffset: 75;
            rotate: 0deg;
        }
        50% {
            stroke-dashoffset: 0;
            rotate: 0deg;
        }
        100% {
            stroke-dashoffset: 75;
            rotate: 360deg;
        }
    }
</style>