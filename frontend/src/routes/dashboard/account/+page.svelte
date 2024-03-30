<script lang="ts">
    import { goto, invalidate } from '$app/navigation';
    import { invalidator, request, updateUser, type User } from '$lib/api';
    import { account, getToken, logout, tokenOrGoto } from '$lib/auth';
    import { beforeUpdate, onMount } from 'svelte';
    import type { PageData } from './$types';
    import TextInput from '$lib/input/TextInput.svelte';
    import Button from '$lib/input/Button.svelte';
    import LinkButton from '$lib/input/LinkButton.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import { crumbs } from '../crumb';
    
    export let data: PageData;

    $crumbs = [{ name: 'Account', path: '/dashboard/account' }]

    onMount(() => {
        return account.subscribe(acc => {
            // console.log('account:sub',acc)
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
    let error_closable = false

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

                    invalidate(invalidator('/user/me'))

                    if (data.redirect) {
                        goto(data.redirect)
                    }
                } catch (err) {
                    console.log('account:error', err)
                    error = 'Something went wrong!'
                    error_closable = false
                    if (typeof err === 'object') {
                        if (err && 'status' in err && typeof err.status === 'number') {
                            if (err.status < 500) {
                                if (err.status === 401) {
                                    goto('/logout?redirect=/login', { replaceState: true })
                                }
                                error_closable = true
                            }
                        }
                        if (err && 'error' in err && typeof err.error === 'string') {
                            error = err.error
                        }
                    }
                }
                saving = false
            }
        }
    }
</script>

<main class="">
    <h1 class="text-2xl font-medium px-2 pb-4 pt-8">Your Account</h1>
    {#await data.user }
        <Spinner/>
    {:then u }
        {#if u}
            {#if error }
                {#if error_closable }
                <ErrorAlert bind:error type='warning'/>
                {:else}
                <ErrorAlert bind:error />
                {/if}
            {/if}
            <div class="flex flex-col gap-2">
                <TextInput label="Name" placeholder="John Tan" bind:value={name} maxlength={64} validator={validateName} disabled={saving}/>
                <TextInput type="email" label="Email" placeholder="john.tan@example.com" bind:value={email} maxlength={64} validator={validateEmail} disabled={saving}/>
            </div>

            <div class="py-4">
                <Button on:click={save} disabled={saving}>
                    Save
                </Button>
            </div>

            <div class="opacity-60 text-sm px-2 py-4">
                Acccount ID:<br/>
                { u.u_id }
            </div>
            <LinkButton href="/logout" primary=false>
                Log out
            </LinkButton>
        {:else}
            <ErrorAlert/>
        {/if}
    {:catch}
        <ErrorAlert/>
    {/await}
</main>

<svelte:head>
    <title>Account | Entangler</title>
</svelte:head>