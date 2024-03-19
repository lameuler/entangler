<script lang="ts">
    import { getToken } from '$lib/auth';
    import { request } from '$lib/api';
    import { crumbs } from './crumb';

    // async function call() {
    //     const t = await getToken()
    //     console.log(t)
    //     if (t) {
    //         const res = await request(fetch, '/secret', t,)
    //         console.log(await res.text())
    //     }
    // }

    $crumbs = []
</script>

<main class="">
    <!-- <button on:click={ call }>Call API</button> -->
</main>

<svelte:head>
    <title>Dashboard | Entangler</title>
</svelte:head>