<script lang="ts">
    export let start: string
    export let end: string

    $: startDate = new Date(Date.parse(start))
    $: endDate = new Date(Date.parse(end))

    console.log(startDate)
</script>

<span>
    { startDate.toDateString() }
    { startDate.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        
    }) }
    –
    {#if startDate.toDateString() !== endDate.toDateString() }
        { endDate.toDateString() }
    {/if}
    { endDate.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        
    }) }
</span>