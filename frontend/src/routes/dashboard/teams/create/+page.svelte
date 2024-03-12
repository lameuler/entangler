<script lang="ts">
    import OptionsInput from '$lib/input/OptionsInput.svelte';
    import TextInput from '$lib/input/TextInput.svelte';
    import type { PageData } from './$types';
    
    // export let data: PageData;

    let name = ''
    let pub = false
    let handle = ''
</script>

<main class="h-full pt-20">
    <h1 class="text-2xl font-semibold px-6">Create team</h1>
    <section class="p-4 w-96">
        <TextInput label="Team Name" placeholder="Name" maxlength={50}/>
        <TextInput label="Handle" placeholder="handle" maxlength={15} bind:value={handle} spellcheck="false"

            info={ handle.length >= 3 ? "Your team will be found at entang.ler.sg/"+handle.toLowerCase() : undefined }/>
        <!-- <span class="text-sm">Your team will be found at <span class="font-medium">entang.ler.sg/{handle}</span></span> -->
        <OptionsInput label="Visibility" name="visibility" options={['Private', 'Public']}/>
    </section>
</main>