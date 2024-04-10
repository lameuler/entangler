<script lang="ts">
    export let status: number | null | undefined = 404
    export let message: string | null | undefined = undefined
</script>

<div class="fixed inset-0 w-full h-full flex flex-col items-center justify-center">
    <div class="text-5xl font-semibold text-red-500">{ typeof status === 'number' ? status : 500 }</div>
    <h1 class="text-lg font-medium">{ message || (status===404 ? 'Not found' : 'An error occured') }</h1>
    <slot/>
</div>