<script lang="ts">
    import { getToken } from '$lib/auth';
    import { request } from '$lib/api';

    async function call() {
        const t = await getToken()
        console.log(t, t?.accessToken, t?.idTokenClaims)
        if (t) {
            const res = await request('/secret', t?.accessToken)
            console.log(await res.text())
        }
    }
</script>

<main class="p-4 pt-20">
    <button on:click={ call }>Call API</button>
</main>

<svelte:head>
    <title>Dashboard | Entangler</title>
</svelte:head>