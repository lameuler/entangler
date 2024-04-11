<script lang="ts">
    export let size: 'lg' | 'xl' | '2xl' |'3xl' = '3xl'
    // blur-lg blur-xl blur-2xl blur-3xl
</script>

<div class="absolute inset-4 -z-10 bg-gradient-to-t from-purple-500/80 to-emerald-400/80 dark:to-emerald-600/80 blur-{size}"/>