<script lang="ts">
    import DatePicker from './DatePicker.svelte';
    import TimeInput from './TimeInput.svelte';

    export let start = new Date()
    export let end = new Date()
</script>

<div class="flex flex-wrap gap-x-8">
    <div class="flex gap-2 items-center">
        <span class="font-medium pb-1">From:</span>
        <DatePicker bind:date={start}/>
        <div class="w-24"><TimeInput bind:time={start}/></div>
    </div>
    <div class="flex gap-2 items-center">
        <span class="font-medium pb-1">To:</span>
        <DatePicker bind:date={end}/>
        <div class="w-24"><TimeInput bind:time={end}/></div>
    </div>
</div>