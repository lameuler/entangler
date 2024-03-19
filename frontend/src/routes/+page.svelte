<script>
    import ActionLink from '$lib/ActionLink.svelte';
    import Card from '$lib/Card.svelte';
    import Favourites from '$lib/Favourites.svelte';
    import Glow from '$lib/Glow.svelte';

</script>
<main class="flex flex-col sm:flex-row justify-center items-center p-4 sm:p-10 pt-20 gap-6 h-full">
    <section class="w-full p-4">
        <span class="text-lg text-gray-600 dark:text-gray-400">Hi there! Welcome to</span>
        <h1 class="text-5xl sm:text-5xl pb-3 -mx-0.5 font-semibold bg-clip-text text-transparent bg-gradient-to-tr from-violet-600 to-emerald-400">
            Entangler
        </h1>
        <p>
            Entangler is the all-in-one platform for managing requests and item loans.
            <ActionLink href="/about">Learn more</ActionLink>
        </p>
        <a href="/dashboard" class="mt-4 block w-fit bg-violet-600 text-slate-100 px-3 py-1.5 rounded-md font-medium">Go to dashboard</a>
    </section>
    <section class="md:min-w-96 sm:min-w-72 w-full flex flex-col gap-4">
        <Card>
            <h2 class="font-medium text-xl">
                What would you like to do today?
            </h2>
            <div class="flex flex-col gap-1">
                <ActionLink href="/search">
                    Make a request
                </ActionLink>
                <ActionLink href="/dashboard/requests?filter=pending">
                    Check pending requests
                </ActionLink>
                <h3 class="font-medium mt-2 text-slate-800 dark:text-slate-200">Want to manage your own requests?</h3>
                <ActionLink href="/dashboard/teams/create">
                    Create a new team
                </ActionLink>
                <ActionLink href="/dashboard/teams">
                    Manage your existing teams
                </ActionLink>
            </div>
        </Card>
        <Favourites />
    </section>
</main>

<svelte:head>
    <title>Entangler</title>
</svelte:head>