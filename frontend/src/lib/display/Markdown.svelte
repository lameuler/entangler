<script lang="ts">
    import { micromark } from 'micromark'
    import { gfmAutolinkLiteral, gfmAutolinkLiteralHtml } from 'micromark-extension-gfm-autolink-literal'
    import { gfmStrikethrough, gfmStrikethroughHtml } from 'micromark-extension-gfm-strikethrough'

    export let markdown: string | null | undefined = undefined

    $: rendered = micromark(markdown ?? '', {
        extensions: [gfmAutolinkLiteral(), gfmStrikethrough()],
        htmlExtensions: [gfmAutolinkLiteralHtml(), gfmStrikethroughHtml()]
    })
</script>

<article>
    { @html rendered }
</article>

<style lang="postcss">
    article :global(a) {
        @apply text-violet-600 underline;
    }
    :global(.dark) article :global(a) {
        @apply text-violet-400;
    }
    article :global(p), article :global(ul), article :global(ol) {
        @apply mb-2;
    }
    article :global(ol) {
        @apply list-decimal list-inside;
    }
    article :global(ul) {
        @apply list-disc list-inside;
    }
    article :global(h1) {
        @apply text-2xl font-semibold my-2;
    }
    article :global(h2) {
        @apply text-xl font-semibold my-2;
    }
    article :global(h3) {
        @apply text-lg font-semibold my-1;
    }
    article :global(h4) {
        @apply font-bold my-1;
    }
</style>