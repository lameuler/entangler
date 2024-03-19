<script lang="ts">
    import { crumbs } from '../crumb';
    import type { PageData } from './$types';
    
    export let data: PageData;

    $crumbs = [{ name: 'Inbox', path: '/dashboard/inbox' }]
</script>