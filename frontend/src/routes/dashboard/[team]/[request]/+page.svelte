<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<main class="flex flex-col gap-6 h-full">
    <div class="flex flex-col lg:flex-row justify-between pt-4 gap-2 w-full">
        <div>
            <span class="text-slate-700 dark:text-slate-300">
                <a href="/dashboard/{data.team}">{data.team}</a> / <a href="/dashboard/{data.team}">Requests</a>
            </span>
            <h1 class="text-xl font-medium mt-1">
                { data.request }
            </h1>
        </div>
        <div class="flex flex-row flex-wrap lg:flex-col lg:items-end gap-1 text-slate-700/80 dark:text-slate-300/80">
            <span>Submitted by <b>Lam Eu Ler</b></span>
            <span>15 December 2023 01:02:03 AM</span>
        </div>
    </div>
    <div>

    </div>
</main>