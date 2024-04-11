<script lang="ts">
    import ActionLink from '$lib/ActionLink.svelte';
    import Card from '$lib/Card.svelte';
    import Spinner from '$lib/Spinner.svelte';
import { account } from '$lib/auth';
    import Favourites from '$lib/display/Favourites.svelte';
    import type { PageData } from './$types';
    import { crumbs } from './crumb';

    export let data: PageData

    $crumbs = []
</script>

<main class="">
    {#await data.user}
        <Spinner/>
    {:then user}
        {#if user}
            <div class="p-4 mt-8">
                <h2 class="text-2xl">Hi there, <span class="font-medium">{user?.name}</span></h2>
                <p class="py-4">Welcome to Entangler!</p>
            </div>
            <section class="z-10 relative grid lg:grid-cols-2 gap-2 items-stretch w-full">
                <Card glow="2xl">
                    <nav class="flex flex-col gap-1">
                        <h2 class="font-medium text-xl">Quick Actions</h2>
                        <ActionLink href="/dashboard/account">
                            Manage your account
                        </ActionLink>
                        <ActionLink href="/dashboard/requests?filter=pending">
                            Check pending requests
                        </ActionLink>
                        <ActionLink href="/dashboard/teams/create">
                            Create a new team
                        </ActionLink>
                        {#if user.is_member}
                            <ActionLink href="/dashboard/deployments">
                                View your deployments
                            </ActionLink>
                            {#if user.is_manager}
                                <ActionLink href="/dashboard/teams">
                                    Manage your existing teams
                                </ActionLink>
                                <ActionLink href="/dashboard/inbox">
                                    View incoming requests
                                </ActionLink>
                            {/if}
                        {/if}
                    </nav>
                </Card>
                <Favourites/>
            </section>
        {/if}
    {/await}
</main>

<svelte:head>
    <title>Dashboard | Entangler</title>
</svelte:head>