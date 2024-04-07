<script lang="ts">
    import Card from '$lib/Card.svelte';
    import DateRange from './DateRange.svelte';

    export let deployment: any
</script>

<Card glow="false">
    <a href="/{deployment.t_id}" class="text-sm opacity-60 hover:underline hover:opacity-80">
        { deployment.team }
    </a>
    <div class="flex text-xl px-2 -mx-2 font-semibold">
        { deployment.request }
    </div>
    {#if deployment.note }
    <p class="text-slate-700 dark:text-slate-300 mt-1">
        { deployment.note }
    </p>
    {/if}
    <DateRange start={deployment.start} end={deployment.end}/>
    <div class="flex gap-2 mt-2">
        <span class="font-medium">Service:</span>
        <div class="px-3 bg-slate-300/50 dark:bg-slate-600/50 rounded-full">
            <span class="font-medium">{deployment.service}</span>
            {#if deployment.role}
                ({deployment.role})
            {/if}
        </div>
    </div>
</Card>