<script lang="ts">
    import { goto } from '$app/navigation';
    import Card from '$lib/Card.svelte';
    import { login, account } from '$lib/auth';
    import Button from '$lib/input/Button.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;

    // if ($account) {
    //     console.log('login:account', $account.name)
    //     goto(data.redirect, { replaceState: true })
    // }
</script>

<main class="p-4 pt-20 flex items-center justify-center h-full">
    <Card>
        <div class="flex flex-col max-w-72 grow">
            <h2 class="px-2 pt-1 text-xl font-semibold">Welcome to Entangler!</h2>
            <p class="px-2 my-3 ">Use your Microsoft account to login or register.</p>
            <Button on:click={ () => login(data.redirect) }>
                <svg class="h-5 w-5 me-2" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                Sign in with Microsoft
            </Button>
            <span class="text-sm px-2 mt-3 mb-1 text-gray-600 dark:text-gray-400">Using another Microsoft account?</span>
            <Button on:click={ () => login(data.redirect, true) } primary=false>
                Switch Account
            </Button>
        </div>
    </Card>
</main>

<svelte:head>
    <title>Login | Entangler</title>
</svelte:head>