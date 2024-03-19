<script lang="ts">
    import { goto, invalidate } from '$app/navigation';
    import { request, updateUser, type User } from '$lib/api';
    import { account, getToken, logout, tokenOrGoto } from '$lib/auth';
    import { beforeUpdate, onMount } from 'svelte';
    import type { PageData } from './$types';
    import TextInput from '$lib/input/TextInput.svelte';
    import ActionButton from '$lib/input/ActionButton.svelte';
    import LinkButton from '$lib/input/LinkButton.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import ErrorAlert from '$lib/ErrorAlert.svelte';
    
    export let data: PageData;

    beforeUpdate(async () => {
        console.log('account:data', (await data.user), $account?.name, $account?.idTokenClaims?.email)
    })

    onMount(() => {
        return account.subscribe(acc => {
            console.log('account:sub',acc)
            if(acc === null) {
                goto('/login?redirect='+window.location.pathname, { replaceState: true })
            }
        })
    })

    $: loadUser(data.user)

    function loadUser(userPromise: Promise<User | null>) {
        userPromise.then(user => {
            name = user?.name
            email = user?.email
        })
    }

    let name: string | undefined = undefined
    let email: string | undefined = undefined
    let error: string | undefined = undefined
    let saving = false

    function validateName(name: string) {
        // if (name === undefined) return ''
        if (name.replaceAll(/\s+/g, '').length === 0) return { error: 'Name cannot be blank' }
        return {}
    }
    function validateEmail(email: string) {
        // if (email === undefined) return undefined
        if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/) === null) return { error: 'Invalid email' }
        return {}
    }

    async function save() {
        if (name && !validateName(name).error && email && !validateEmail(email).error) {
            saving = true
            let token = await tokenOrGoto('/dashboard/account')
            
            if (token && name && email) {
                try {
                    await updateUser(fetch, token, { name, email })

                    invalidate('http://localhost:6231/user/me')

                    if (data.redirect) {
                        goto(data.redirect)
                    }
                } catch (err) {
                    error = (err as any).error
                }
                saving = false
            }
        }
    }
</script>

<main class="">
    <h1 class="text-2xl font-medium px-2 pb-4 pt-8">Your Account</h1>
    {#await data.user }
        <div class="p-8 w-full flex justify-center">
            <Spinner/>
        </div>
    {:then u }
        {#if u}
            {#if error }
                <ErrorAlert close={() => error = undefined}>
                    {error}
                </ErrorAlert>
            {/if}
            <div class="flex flex-col gap-2">
                <TextInput label="Name" placeholder="John Tan" bind:value={name} maxlength={64} validator={validateName} disabled={saving}/>
                <TextInput type="email" label="Email" placeholder="john.tan@example.com" bind:value={email} maxlength={64} validator={validateEmail} disabled={saving}/>
            </div>

            <div class="py-4">
                <ActionButton onClick={save} disabled={saving}>
                    Save
                </ActionButton>
            </div>

            <div class="opacity-60 text-sm px-2 py-4">
                Acccount ID:<br/>
                { u.u_id }
            </div>
            <LinkButton href="/logout" primary=false>
                Log out
            </LinkButton>
        {:else}
            <ErrorAlert>
                Something went wrong!
            </ErrorAlert>
        {/if}
    {/await}
</main>

<svelte:head>
    <title>Account | Entangler</title>
</svelte:head>