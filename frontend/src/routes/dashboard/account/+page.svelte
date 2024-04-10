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
    let nameError: string | undefined = undefined
    let emailError: string | undefined = undefined
    let saving = false
    let error_closable = false

    function validateName(name: string) {
        // if (name === undefined) return ''
        if (name.replaceAll(/\s+/g, '').length === 0) nameError = 'Name cannot be blank'
        else nameError = undefined
    }
    function validateEmail(email: string) {
        // if (email === undefined) return undefined
        if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/) === null) emailError = 'Invalid email'
        else emailError = undefined
    }

    async function save() {
        if (name && email) {
            validateName(name)
            validateEmail(email)
            if (nameError || emailError) return

            saving = true
            let token = await tokenOrGoto('/dashboard/account')
            
            if (token) {
                try {
                    await updateUser(fetch, token, { name, email })

                    invalidate(invalidator('/user/me'))

                    if (data.redirect) {
                        goto(data.redirect)
                    }
                } catch (e) {
                    error = 'Something went wrong!'
                    error_closable = false
                    const err = e as Error
                    const status = ((err as Error).cause as { status: number })?.status
                    if (status < 500) {
                        if (status === 401) {
                            goto('/logout?redirect=/login', { replaceState: true })
                        }
                        error_closable = true
                    }
                    error = err.message
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
                <TextInput label="Name" placeholder="John Tan" bind:value={name} maxlength={64} validator={validateName} bind:error={nameError} disabled={saving}/>
                <TextInput type="email" label="Email" placeholder="john.tan@example.com" bind:value={email} maxlength={64} validator={validateEmail} bind:error={emailError} disabled={saving}/>
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