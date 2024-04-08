<script lang="ts">
    import { invalidate } from '$app/navigation';
    import Card from '$lib/Card.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import { invalidator, request } from '$lib/api';
    import Collapsible from '$lib/dashboard/Collapsible.svelte';
    import DateRange from '$lib/dashboard/DateRange.svelte';
    import RequestCard from '$lib/dashboard/RequestCard.svelte';
    import RequestDeployment from '$lib/dashboard/RequestDeployment.svelte';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import Button from '$lib/input/Button.svelte';
    import { roundDate } from '$lib/utils';
    import type { PageData } from './$types';
    
    export let data: PageData;

    let creating: any | undefined = undefined
    let creatorElement: HTMLDivElement

    function create(deployment?: any) {
        creating = typeof deployment === 'object' ? {...deployment} : {}
        creating.dep_id = undefined
        creating.req_id = data.req_id
        creating.t_id = data.t_id
        creating.start ??= roundDate()
        creating.end ??= roundDate(60)
        creatorElement.scrollIntoView(true)
    }
    function inval() {
        invalidate(invalidator('/team/'+data.t_id+'/deployments'))
    }
</script>

{#await data.requestPromise}
    <Spinner/>
{:then request}
    {#if request}
    <main class="flex flex-col gap-6 h-full pt-4">
        <RequestCard {request} showExtra={false} showDate={true} editing={true} on:edit={({detail})=>console.log(detail)}/>
        {#if Array.isArray(request.dates) && request.dates.length > 0}
        <Collapsible title="Dates" open={true} length={request.dates.length}>
            <section id="dates" class="flex flex-col gap-2 pt-2">
                {#each request.dates as date}
                    <Card glow=false>
                        <div class="flex flex-wrap justify-between items-center">
                            <div>
                                <DateRange start={date.start} end={date.end}/>
                                {#if date.description}
                                    <p class="font-medium">{date.description}</p>
                                {/if}
                            </div>
                            <Button on:click={()=>create({ start: date.start, end: date.end, note: date.description })}>Deploy</Button>
                        </div>
                    </Card>
                {/each}
            </section>
        </Collapsible>
        {/if}
        <section id="deployments" class="flex flex-col gap-2">
            <h2 class="text-xl font-semibold my-2">Deployments</h2>
            {#await data.deploymentsPromise}
                <Spinner/>
            {:then deployments}
                {#each deployments as deployment}
                <RequestDeployment {deployment} on:copy={()=>create(deployment)} on:delete={inval}/>
                {/each}
                <div bind:this={creatorElement}>
                    {#if creating}
                        <RequestDeployment deployment={creating} on:cancel={()=>creating=undefined}/>
                    {:else}
                        <Button on:click={ ()=>create() }>Create deployment</Button>
                    {/if}
                </div>
            {/await}
        </section>
    </main>
    {:else}
        <ErrorAlert error="Request not found"/>
    {/if}
{:catch err}
    <ErrorAlert error={err.message}/>
{/await}